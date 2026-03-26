import mongoose from 'mongoose';
import Stripe from 'stripe';
import config from '../../../src/config/config';
import Subscription, {
  ISubscription,
  SubscriptionStatus
} from '../../../src/model/subscription/subscription.model';
import { IdOrIdsInput, SearchQueryInput } from '../../handlers/common-zod-validator';
import { CreateSubscriptionInput, UpdateSubscriptionInput } from './subscription.validation';
import { affiliateServices } from '../affiliate/affiliate.service';
import { processPickPurchaseWebhookEvent } from '../picks/picks.service';
import { stripe } from '../../utils/stripe/stripe';

// Type augmentation for Stripe Invoice endpoint compatibility
// The subscription property might come as string from certain API versions

/**
 * Helper: Get subscription period end from Stripe subscription
 */
const getStripeSubscriptionPeriodEnd = (subscription: Stripe.Subscription): number | null => {
  const firstItem = subscription.items.data[0];
  return firstItem?.current_period_end ?? null;
};

/**
 * Helper: Get subscription ID from invoice
 */
const getInvoiceSubscriptionId = (invoice: Stripe.Invoice): string | null => {
  // Try different ways to get subscription ID from invoice - handle type compatibility
  const subscriptionId = (invoice as any).subscription as string | null;
  
  if (subscriptionId && typeof subscriptionId === 'string') {
    return subscriptionId;
  }
  
  if (invoice.lines?.data[0]?.subscription) {
    const sub = invoice.lines.data[0].subscription;
    return typeof sub === 'string' ? sub : sub.id;
  }
  
  return null;
};

/**
 * Helper: Calculate end date for seasonal-based plans
 */
const calculateSeasonalEndDate = (startDate: Date, days: number): Date => {
  const endDate = new Date(startDate);
  endDate.setDate(startDate.getDate() + days);
  return endDate;
};

/**
 * CREATE SUBSCRIPTION
 */
const createSubscription = async (
  data: CreateSubscriptionInput & { userId: mongoose.Types.ObjectId | string }
): Promise<Partial<ISubscription>> => {

  // Normalize userId
  const rawUserId = data.userId;
  const normalizedUserId =
    rawUserId instanceof mongoose.Types.ObjectId
      ? rawUserId
      : typeof rawUserId === "string" && mongoose.isValidObjectId(rawUserId)
      ? new mongoose.Types.ObjectId(rawUserId)
      : null;

  if (!normalizedUserId) {
    throw new Error("Invalid userId");
  }

  // Check for active subscription (only for recurring packages)
  // Seasonal packages can be purchased even if user has active subscription
  if (!data.isSeasonal) {
    const activeSubscription = await Subscription.findOne({
      userId: normalizedUserId,
      status: SubscriptionStatus.PAID,
      isSubscribed: true,
      subscriptionEnd: { $gt: new Date().toISOString() }
    } as any).lean();

    if (activeSubscription) {
      throw new Error("User already has an active recurring subscription");
    }
  }

  // Create DB record first
  const newSubscription = new Subscription({
    ...data,
    userId: normalizedUserId,
    status: SubscriptionStatus.PENDING,
    price: data.isSeasonal ? (Number(data.seasonalPrice) ?? data.price) : data.price,
  });

  const savedSubscription = await newSubscription.save();

  /**
   * SEASONAL (One-time Payment with custom price from frontend)
   */
  if (data.isSeasonal) {
    if (!data.seasonalPrice || !data.seasonalDays) {
      throw new Error("Seasonal price and days are required");
    }

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: `Seasonal Plan - ${data.seasonalDays} Days`,
              description: `Seasonal plan for ${data.seasonalDays} days`,
            },
            unit_amount: Math.round(data.seasonalPrice * 100),
          },
          quantity: 1,
        },
      ],
      metadata: {
        subscriptionId: savedSubscription._id.toString(),
        type: 'seasonal',
        seasonalDays: data.seasonalDays.toString(),
        seasonalPrice: data.seasonalPrice.toString(),
      },
      success_url: `${config.FRONTEND_URL}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${config.FRONTEND_URL}/payment-cancel`,
    });

    // Update subscription with session ID
    await Subscription.findByIdAndUpdate(savedSubscription._id, {
      stripeSessionId: session.id,
      paymentLink: session.url,
    });

    return {
      ...savedSubscription.toObject(),
      paymentLink: session.url ?? undefined,
      stripeSessionId: session.id,
    };
  }

  /**
   * RECURRING (DAILY / WEEKLY / MONTHLY)
   */
  let priceId: string | undefined;

  switch (data.packageName) {
    case "DAILY":
      priceId = config.DAILY_PRICE_ID;
      break;
    case "WEEKLY":
      priceId = config.WEEKLY_PRICE_ID;
      break;
    case "MONTHLY":
      priceId = config.MONTHLY_PRICE_ID;
      break;
    default:
      throw new Error("Invalid package for recurring subscription");
  }

  if (!priceId) {
    throw new Error("Invalid package price configuration");
  }

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    payment_method_types: ["card"],
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    metadata: {
      subscriptionId: savedSubscription._id.toString(),
      type: 'recurring',
      packageName: data.packageName,
    },
    subscription_data: {
      metadata: {
        subscriptionId: savedSubscription._id.toString(),
      },
    },
    success_url: `${config.FRONTEND_URL}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${config.FRONTEND_URL}/payment-cancel`,
  });

  // Update subscription with session ID
  await Subscription.findByIdAndUpdate(savedSubscription._id, {
    stripeSessionId: session.id,
    paymentLink: session.url,
  });

  return {
    ...savedSubscription.toObject(),
    paymentLink: session.url ?? undefined,
    stripeSessionId: session.id,
  };
};

/**
 * WEBHOOK HANDLER
 */
const webHook = async (req: any) => {
  let event: Stripe.Event;

  try {
    const signature = req.headers["stripe-signature"] as string;
    event = stripe.webhooks.constructEvent(
      req.body,
      signature,
      config.WEBHOOK_KEY
    );
  } catch (err: any) {
    console.log("❌ Webhook signature verification failed.", err.message);
    throw new Error("Webhook signature verification failed");
  }

  console.log(`✅ Webhook received: ${event.type}`);

  const pickPurchaseHandled = await processPickPurchaseWebhookEvent(event);
  if (pickPurchaseHandled) {
    return true;
  }

  switch (event.type) {

    /**
     * CHECKOUT SESSION COMPLETED
     */
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      const subscriptionId = session.metadata?.subscriptionId;
      const sessionType = session.metadata?.type;

      if (!subscriptionId) {
        console.log("❌ No subscriptionId in metadata");
        break;
      }

      const subscription = await Subscription.findById(subscriptionId);
      if (!subscription) {
        console.log(`❌ Subscription not found: ${subscriptionId}`);
        break;
      }

      const startDate = new Date();
      let endDate = new Date();

      // Handle SEASONAL (one-time payment)
      if (sessionType === 'seasonal' || session.mode === "payment") {
        if (subscription.seasonalDays) {
          endDate = calculateSeasonalEndDate(startDate, subscription.seasonalDays);
        } else if (session.metadata?.seasonalDays) {
          const days = parseInt(session.metadata.seasonalDays);
          endDate = calculateSeasonalEndDate(startDate, days);
        }

        const activatedSeasonalSubscription = await Subscription.findByIdAndUpdate(subscriptionId, {
          status: SubscriptionStatus.PAID,
          isSubscribed: true,
          subscriptionStart: startDate.toISOString(),
          subscriptionEnd: endDate.toISOString(),
          nextBilling: endDate.toISOString(),
          paymentIntentId: session.payment_intent as string,
          stripeSessionId: session.id,
        }, { new: true });

        if (activatedSeasonalSubscription) {
          await affiliateServices.recordAffiliateCommissionForSubscription(
            activatedSeasonalSubscription,
            session.id,
            'INITIAL'
          );
        }

        console.log(`✅ Seasonal Plan Activated: ${subscriptionId}, Ends: ${endDate.toISOString()}`);
      }

      // Handle RECURRING subscription
      if (sessionType === 'recurring' || session.mode === "subscription") {
        const stripeSubscriptionId = session.subscription as string;
        
        if (!stripeSubscriptionId) {
          console.log("❌ No subscription ID in session");
          break;
        }

        const stripeSubscription = await stripe.subscriptions.retrieve(stripeSubscriptionId);
        const periodEndUnix = getStripeSubscriptionPeriodEnd(stripeSubscription);
        
        if (periodEndUnix) {
          endDate = new Date(periodEndUnix * 1000);
        }

        await Subscription.findByIdAndUpdate(subscriptionId, {
          status: SubscriptionStatus.PAID,
          isSubscribed: true,
          subscriptionStart: startDate.toISOString(),
          subscriptionEnd: endDate.toISOString(),
          nextBilling: endDate.toISOString(),
          stripeSubscriptionId: stripeSubscriptionId,
          stripeSessionId: session.id,
        });

        console.log(`✅ Recurring Subscription Activated: ${subscriptionId}, Next Billing: ${endDate.toISOString()}`);
      }
      break;
    }

    /**
     * INVOICE PAID (Auto-renewal success)
     */
    case "invoice.paid": {
      const invoice = event.data.object as Stripe.Invoice;
      const stripeSubId = getInvoiceSubscriptionId(invoice);
      
      if (!stripeSubId) {
        console.log("❌ No stripe subscription ID in invoice");
        break;
      }

      try {
        const stripeSubscription = await stripe.subscriptions.retrieve(stripeSubId);
        const periodEndUnix = getStripeSubscriptionPeriodEnd(stripeSubscription);
        
        if (!periodEndUnix) {
          console.log("❌ No period end in subscription");
          break;
        }

        const endDate = new Date(periodEndUnix * 1000);

        const updatedSubscription = await Subscription.findOneAndUpdate(
          { stripeSubscriptionId: stripeSubId },
          {
            status: SubscriptionStatus.PAID,
            isSubscribed: true,
            subscriptionEnd: endDate.toISOString(),
            nextBilling: endDate.toISOString(),
          },
          { new: true }
        );

        if (updatedSubscription) {
          await affiliateServices.recordAffiliateCommissionForSubscription(
            updatedSubscription,
            invoice.id,
            'RENEWAL'
          );
          console.log(`🔄 Subscription Renewed: ${stripeSubId}, New End Date: ${endDate.toISOString()}`);
        } else {
          console.log(`⚠️ Subscription not found in DB: ${stripeSubId}`);
        }
      } catch (error) {
        console.log(`❌ Error processing invoice.paid: ${error}`);
      }
      break;
    }

    /**
     * INVOICE PAYMENT FAILED
     */
    case "invoice.payment_failed": {
      const invoice = event.data.object as Stripe.Invoice;
      const stripeSubId = getInvoiceSubscriptionId(invoice);
      
      if (!stripeSubId) break;

      await Subscription.findOneAndUpdate(
        { stripeSubscriptionId: stripeSubId },
        {
          status: SubscriptionStatus.FAILED,
          isSubscribed: false,
        }
      );

      console.log(`⚠️ Subscription Payment Failed: ${stripeSubId}`);
      break;
    }

    /**
     * CUSTOMER SUBSCRIPTION DELETED (Cancelled)
     */
    case "customer.subscription.deleted": {
      const stripeSubscription = event.data.object as Stripe.Subscription;
      const stripeSubId = stripeSubscription.id;

      await Subscription.findOneAndUpdate(
        { stripeSubscriptionId: stripeSubId },
        {
          status: SubscriptionStatus.CANCELLED,
          isSubscribed: false,
          cancelledAt: new Date().toISOString(),
        }
      );

      console.log(`❌ Subscription Cancelled: ${stripeSubId}`);
      break;
    }

    default:
      console.log(`ℹ️ Unhandled event type: ${event.type}`);
  }

  return true;
};

/**
 * Get user's active subscription
 */
const getUserActiveSubscription = async (
  userId: string
): Promise<Partial<ISubscription | null>> => {
  const subscription = await Subscription.findOne({
    userId: new mongoose.Types.ObjectId(userId),
    status: SubscriptionStatus.PAID,
    isSubscribed: true,
    subscriptionEnd: { $gt: new Date().toISOString() },
  } as any).sort({ createdAt: -1 });

  return subscription;
};

/**
 * Get user's subscription history
 */
const getUserSubscriptionHistory = async (
  userId: string,
  query: SearchQueryInput
): Promise<{ subscriptions: Partial<ISubscription>[]; totalData: number; totalPages: number }> => {
  const { showPerPage = 10, pageNo = 1 } = query;
  const skipItems = (pageNo - 1) * showPerPage;

  const totalData = await Subscription.countDocuments({
    userId: new mongoose.Types.ObjectId(userId),
  } as any);
  const totalPages = Math.ceil(totalData / showPerPage);

  const subscriptions = await Subscription.find({
    userId: new mongoose.Types.ObjectId(userId),
  } as any)
    .sort({ createdAt: -1 })
    .skip(skipItems)
    .limit(showPerPage);

  return { subscriptions, totalData, totalPages };
};

/**
 * Cancel subscription
 */
const cancelSubscription = async (
  subscriptionId: string,
  userId: string
): Promise<Partial<ISubscription | null>> => {
  const subscription = await Subscription.findOne({
    _id: new mongoose.Types.ObjectId(subscriptionId),
    userId: new mongoose.Types.ObjectId(userId),
    status: SubscriptionStatus.PAID,
  } as any);

  if (!subscription) {
    throw new Error("Active subscription not found");
  }

  // If it's a recurring subscription, cancel in Stripe
  if (subscription.stripeSubscriptionId) {
    try {
      await stripe.subscriptions.update(subscription.stripeSubscriptionId, {
        cancel_at_period_end: true,
      });
    } catch (error) {
      console.log("Error cancelling in Stripe:", error);
    }
  }

  // Update in DB
  subscription.status = SubscriptionStatus.CANCELLED;
  subscription.isSubscribed = false;
  subscription.cancelledAt = new Date().toISOString();
  await subscription.save();

  return subscription;
};

/**
 * UPDATE SUBSCRIPTION
 */
const updateSubscription = async (
  id: IdOrIdsInput['id'],
  data: UpdateSubscriptionInput
): Promise<Partial<ISubscription | null>> => {
  const updatedSubscription = await Subscription.findByIdAndUpdate(id, data, { new: true });
  return updatedSubscription;
};

/**
 * DELETE SUBSCRIPTION
 */
const deleteSubscription = async (
  id: IdOrIdsInput['id']
): Promise<Partial<ISubscription | null>> => {
  const deletedSubscription = await Subscription.findByIdAndDelete(id);
  return deletedSubscription;
};

/**
 * DELETE MANY SUBSCRIPTIONS
 */
const deleteManySubscription = async (
  ids: IdOrIdsInput['ids']
): Promise<Partial<ISubscription>[]> => {
  const subscriptionsToDelete = await Subscription.find({ _id: { $in: ids } });
  if (!subscriptionsToDelete.length) throw new Error('No subscriptions found to delete');
  await Subscription.deleteMany({ _id: { $in: ids } });
  return subscriptionsToDelete;
};

/**
 * GET SUBSCRIPTION BY ID
 */
const getSubscriptionById = async (
  id: IdOrIdsInput['id']
): Promise<Partial<ISubscription | null>> => {
  const subscription = await Subscription.findById(id).populate('userId', 'name email');
  return subscription;
};

/**
 * GET MANY SUBSCRIPTIONS
 */
const getManySubscription = async (
  query: SearchQueryInput
): Promise<{ subscriptions: Partial<ISubscription>[]; totalData: number; totalPages: number }> => {
  const { searchKey = '', showPerPage = 10, pageNo = 1 } = query;
  
  // Build search filter
  const searchFilter: any = {};
  
  if (searchKey) {
    searchFilter.$or = [
      // Add searchable fields here
    ];
  }
  
  const skipItems = (pageNo - 1) * showPerPage;
  const totalData = await Subscription.countDocuments(searchFilter);
  const totalPages = Math.ceil(totalData / showPerPage);
  
  const subscriptions = await Subscription.find(searchFilter)
    .populate('userId', 'name email')
    .sort({ createdAt: -1 })
    .skip(skipItems)
    .limit(showPerPage);

  return { subscriptions, totalData, totalPages };
};

export const subscriptionServices = {
  createSubscription,
  updateSubscription,
  deleteSubscription,
  deleteManySubscription,
  getSubscriptionById,
  getManySubscription,
  webHook,
  getUserActiveSubscription,
  getUserSubscriptionHistory,
  cancelSubscription,
};

























