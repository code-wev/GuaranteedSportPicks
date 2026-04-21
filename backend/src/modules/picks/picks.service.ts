// Import the model
import mongoose from 'mongoose';
import { IdOrIdsInput, SearchQueryInput } from '../../handlers/common-zod-validator';
import Stripe from 'stripe';
import { stripe } from '../../utils/stripe/stripe';
import { CreatePickPurchaseInput, CreatePicksInput, UpdatePicksInput } from './picks.validation';
import Picks, { IPicks, PicksStatus, ResultType } from '../../../src/model/pick/picks.model';
import PickPurchase, {
  IPickPurchase,
  PaymentModel,
  PickPurchaseStatus,
} from '../../../src/model/pick/pick-purchase.model';
import Subscription, { SubscriptionStatus } from '../../../src/model/subscription/subscription.model';
import User from '../../model/user/user.schema';
import config from '../../config/config';
import SendEmail from '../../utils/email/send-email';

const buildPickCheckoutSession = async (
  purchase: IPickPurchase,
  pick: IPicks,
  paymentModel: PaymentModel
) => {
  const isPayAfterWin = paymentModel === PaymentModel.PAY_AFTER_WIN;

  return stripe.checkout.sessions.create({
    mode: 'payment',
    payment_method_types: ['card'],
    line_items: [
      {
        price_data: {
          currency: 'usd',
          product_data: {
            name: `${pick.away_team} @ ${pick.home_team}`,
            description: isPayAfterWin
              ? `Pay After Win authorization for ${pick.sport_title}`
              : `Prepaid purchase for ${pick.sport_title}`,
          },
          unit_amount: Math.round(Number(pick.price) * 100),
        },
        quantity: 1,
      },
    ],
    payment_intent_data: isPayAfterWin
      ? {
          capture_method: 'manual',
        }
      : undefined,
    metadata: {
      type: 'pick_purchase',
      purchaseId: purchase._id.toString(),
      pickId: pick._id.toString(),
      paymentModel,
    },
    success_url: `${config.FRONTEND_URL}/payment-success?source=pick&paymentModel=${paymentModel}&session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${config.FRONTEND_URL}/payment-cancel?source=pick&paymentModel=${paymentModel}`,
  });
};

const getUserActiveSubscription = async (userId: string) => {
  return Subscription.findOne({
    userId: new mongoose.Types.ObjectId(userId),
    status: SubscriptionStatus.PAID,
    isSubscribed: true,
    subscriptionEnd: { $gt: new Date().toISOString() },
  } as any).lean();
};

const getPurchasedPickIdSet = async (userId?: string) => {
  if (!userId) {
    return new Set<string>();
  }

  const purchases = await PickPurchase.find({
    userId: new mongoose.Types.ObjectId(userId),
    status: { $in: [PickPurchaseStatus.AUTHORIZED, PickPurchaseStatus.PAID] },
  } as any)
    .select('pickId')
    .lean();

  return new Set(purchases.map((purchase: any) => purchase.pickId.toString()));
};

const sanitizePickForAccess = (pick: any, unlocked: boolean) => {
  const basePick = pick.toObject?.() ?? pick;

  if (!basePick.premium || unlocked) {
    return {
      ...basePick,
      accessLocked: false,
    };
  }

  return {
    ...basePick,
    selected_team: undefined,
    units: undefined,
    writeup: undefined,
    accessLocked: true,
  };
};

const settleAuthorizedPurchase = async (purchase: IPickPurchase, pick: IPicks) => {
  if (!purchase.paymentIntentId) {
    console.log(`Purchase ${purchase._id} missing paymentIntentId, skipping.`);
    return;
  }

  if (pick.result === ResultType.WIN) {
    await stripe.paymentIntents.capture(purchase.paymentIntentId);
    purchase.status = PickPurchaseStatus.PAID;
    purchase.capturedAt = new Date();
    await purchase.save();
    console.log(`Successfully captured payment for purchase ${purchase._id}`);
    return;
  }

  await stripe.paymentIntents.cancel(purchase.paymentIntentId);
  purchase.status = PickPurchaseStatus.CANCELLED;
  purchase.cancelledAt = new Date();
  await purchase.save();
  console.log(`Successfully cancelled authorization for purchase ${purchase._id} due to ${pick.result}`);
};

const settleAuthorizedPurchasesForPick = async (pick: IPicks) => {
  // We only settle if the pick has a definitive result
  if (![ResultType.WIN, ResultType.LOSS, ResultType.VOID].includes(pick.result as ResultType)) {
    return;
  }

  const authorizedPurchases = await PickPurchase.find({
    pickId: pick._id,
    paymentModel: PaymentModel.PAY_AFTER_WIN,
    status: PickPurchaseStatus.AUTHORIZED,
  } as any);

  console.log(`Settling ${authorizedPurchases.length} authorized purchases for pick ${pick._id} (Result: ${pick.result})`);

  for (const purchase of authorizedPurchases) {
    try {
      await settleAuthorizedPurchase(purchase, pick);
    } catch (error) {
      console.error(`Error settling purchase ${purchase._id}:`, error);
      // We don't throw here to allow other purchases to be processed
    }
  }
};

const sendPickPurchaseConfirmationEmail = async (
  purchase: IPickPurchase,
  pick: IPicks
): Promise<void> => {
  const user = await User.findById(purchase.userId).select('email firstName lastName').lean();
  if (!user?.email) {
    return;
  }

  const customerName = [user.firstName, user.lastName].filter(Boolean).join(' ').trim() || 'there';
  const loginLink = `${config.FRONTEND_URL}/login`;
  const purchaseType = purchase.paymentModel === PaymentModel.PAY_AFTER_WIN ? 'Pay After Win' : 'Prepaid';

  await SendEmail({
    to: user.email,
    subject: 'Pick purchase confirmation',
    text: `Hi ${customerName}, your ${purchaseType} purchase for ${pick.away_team} @ ${pick.home_team} is confirmed. Login here: ${loginLink}`,
    html: `
      <div style="font-family:Arial,sans-serif;padding:24px;color:#111827;">
        <h2 style="margin:0 0 12px;">Pick purchase confirmed</h2>
        <p style="margin:0 0 8px;">Hi ${customerName},</p>
        <p style="margin:0 0 8px;">Your <strong>${purchaseType}</strong> purchase has been recorded successfully.</p>
        <p style="margin:0 0 16px;">Pick: <strong>${pick.away_team} @ ${pick.home_team}</strong></p>
        <a href="${loginLink}" style="display:inline-block;background:#b91c1c;color:#fff;padding:10px 16px;border-radius:8px;text-decoration:none;font-weight:600;">Login to your customer portal</a>
      </div>
    `,
  });
};

const notifyUsersForPublishedPremiumPick = async (pick: IPicks): Promise<void> => {
  const activeSubscribers = await Subscription.find({
    status: SubscriptionStatus.PAID,
    isSubscribed: true,
    subscriptionEnd: { $gt: new Date().toISOString() },
    selectedSport: pick.sport_title,
  } as any)
    .select('userId')
    .lean();

  const paidPickPurchases = await PickPurchase.find({
    pickId: pick._id,
    status: { $in: [PickPurchaseStatus.AUTHORIZED, PickPurchaseStatus.PAID] },
  } as any)
    .select('userId')
    .lean();

  const userIds = new Set<string>();
  activeSubscribers.forEach((sub: any) => userIds.add(sub.userId.toString()));
  paidPickPurchases.forEach((purchase: any) => userIds.add(purchase.userId.toString()));

  if (!userIds.size) {
    return;
  }

  const users = await User.find({
    _id: { $in: Array.from(userIds).map((id) => new mongoose.Types.ObjectId(id)) },
    isActive: true,
  } as any)
    .select('email firstName lastName')
    .lean();

  const loginLink = `${config.FRONTEND_URL}/login`;

  await Promise.all(
    users
      .filter((user: any) => user.email)
      .map((user: any) => {
        const customerName =
          [user.firstName, user.lastName].filter(Boolean).join(' ').trim() || 'there';

        return SendEmail({
          to: user.email,
          subject: 'A new pick is now available in your portal',
          text: `Hi ${customerName}, a new premium pick has been published. Login to your customer portal: ${loginLink}`,
          html: `
            <div style="font-family:Arial,sans-serif;padding:24px;color:#111827;">
              <h2 style="margin:0 0 12px;">New pick available</h2>
              <p style="margin:0 0 8px;">Hi ${customerName},</p>
              <p style="margin:0 0 16px;">
                A new premium pick has been published and is now available in your customer portal.
              </p>
              <a href="${loginLink}" style="display:inline-block;background:#b91c1c;color:#fff;padding:10px 16px;border-radius:8px;text-decoration:none;font-weight:600;">Login to view your picks</a>
            </div>
          `,
        });
      })
  );
};

/**
 * Service function to create a new picks.
 *
 * @param {CreatePicksInput} data - The data to create a new picks.
 * @returns {Promise<Partial<IPicks>>} - The created picks.
 */
const createPicks = async (data: CreatePicksInput): Promise<Partial<IPicks>> => {
  /**
   * Business Rule Validation:
   * Ensure that the selected_team is one of the two participating teams.
   * The user is only allowed to pick either the home_team or the away_team.
   * If selected_team does not match any of them, the request is invalid.
   */
  if (data.selected_team !== data.home_team && data.selected_team !== data.away_team) {
    throw new Error('selected_team must be either home_team or away_team');
  }

  /**
   * Data Integrity Validation:
   * Ensure that betting odds are provided for both teams.
   * Odds must be valid finite numbers (not undefined, null, NaN, Infinity, or non-numeric values).
   * If either team's odds is missing or invalid, reject the request.
   */
  if (!Number.isFinite(data.odds.home_team) || !Number.isFinite(data.odds.away_team)) {
    throw new Error('odds for both home_team and away_team are required');
  }

  const newPicks = new Picks(data);
  const savedPicks = await newPicks.save();

  if (savedPicks.premium && savedPicks.status === PicksStatus.ACTIVE) {
    await notifyUsersForPublishedPremiumPick(savedPicks);
  }

  return savedPicks;
};

/**
 * Service function to update a single picks by ID.
 *
 * @param {IdOrIdsInput['id']} id - The ID of the picks to update.
 * @param {UpdatePicksInput} data - The updated data for the picks.
 * @returns {Promise<Partial<IPicks>>} - The updated picks.
 */
const updatePicks = async (
  id: IdOrIdsInput['id'],
  data: UpdatePicksInput
): Promise<Partial<IPicks | null>> => {
  // Check for duplicate (filed) combination
  // const existingPicks = await Picks.findOne({
  //   _id: { $ne: id }, // Exclude the current document
  //   $or: [
  //     {
  //       /* filedName: data.filedName, */
  //     },
  //   ],
  // }).lean();
  // // Prevent duplicate updates
  // if (existingPicks) {
  //   throw new Error('Duplicate detected: Another picks with the same fieldName already exists.');
  // }
  // Proceed to update the picks
  const previousPick = await Picks.findById(id);
  const updatedPicks = await Picks.findByIdAndUpdate(id, data, { new: true });
  if (updatedPicks && data.result) {
    await settleAuthorizedPurchasesForPick(updatedPicks);
  }

  if (
    updatedPicks &&
    updatedPicks.premium &&
    updatedPicks.status === PicksStatus.ACTIVE &&
    previousPick?.status !== PicksStatus.ACTIVE
  ) {
    await notifyUsersForPublishedPremiumPick(updatedPicks);
  }

  return updatedPicks;
};

/**
 * Service function to delete a single picks by ID.
 *
 * @param {IdOrIdsInput['id']} id - The ID of the picks to delete.
 * @returns {Promise<Partial<IPicks>>} - The deleted picks.
 */
const deletePicks = async (id: IdOrIdsInput['id']): Promise<Partial<IPicks | null>> => {
  const deletedPicks = await Picks.findByIdAndDelete(id);
  return deletedPicks;
};

/**
 * Service function to delete multiple picks.
 *
 * @param {IdOrIdsInput['ids']} ids - An array of IDs of picks to delete.
 * @returns {Promise<Partial<IPicks>[]>} - The deleted picks.
 */
const deleteManyPicks = async (ids: IdOrIdsInput['ids']): Promise<Partial<IPicks>[]> => {
  const picksToDelete = await Picks.find({ _id: { $in: ids } });
  if (!picksToDelete.length) throw new Error('No picks found to delete');
  await Picks.deleteMany({ _id: { $in: ids } });
  return picksToDelete;
};

/**
 * Service function to retrieve a single picks by ID.
 *
 * @param {IdOrIdsInput['id']} id - The ID of the picks to retrieve.
 * @returns {Promise<Partial<IPicks>>} - The retrieved picks.
 */
const getPicksById = async (id: IdOrIdsInput['id']): Promise<Partial<IPicks | null>> => {
  const picks = await Picks.findById(id);
  return picks;
};

/**
 * Service function to retrieve multiple picks based on query parameters.
 *
 * @param {SearchQueryInput} query - The query parameters for filtering picks.
 * @returns {Promise<Partial<IPicks>[]>} - The retrieved picks
 */
const getManyPicks = async (
  query: SearchQueryInput
): Promise<{
  pickss: Partial<IPicks>[];
  totalData: number;
  totalPages: number;
  totalActivePicks: number;
}> => {
  const { searchKey = '', showPerPage = 10, pageNo = 1 } = query;
  // Build the search filter based on the search key

  const searchFilter = searchKey
    ? {
        $or: [
          { sport_title: { $regex: searchKey, $options: 'i' } },
          { home_team: { $regex: searchKey, $options: 'i' } },
          { away_team: { $regex: searchKey, $options: 'i' } },
          { selected_team: { $regex: searchKey, $options: 'i' } },
        ],
      }
    : {};

  // Calculate the number of items to skip based on the page number
  const skipItems = (pageNo - 1) * showPerPage;
  // Find the total count of matching picks
  const totalData = await Picks.countDocuments(searchFilter);
  // Calculate the total number of pages
  const totalPages = Math.ceil(totalData / showPerPage);
  // Find pickss based on the search filter with pagination
  const pickss = await Picks.find(searchFilter)
    .sort({ createdAt: -1 })
    .skip(skipItems)
    .limit(showPerPage);

  const activePicksAggregation = await Picks.aggregate<{ _id: null; total: number }>([
    {
      $match: { status: 'active' },
    },
    {
      $group: {
        _id: null,
        total: { $sum: 1 },
      },
    },
  ]);
  const totalActivePicks = activePicksAggregation[0]?.total ?? 0;
  return { pickss, totalData, totalPages, totalActivePicks };
};

const getPickBoard = async (
  query: SearchQueryInput,
  userId?: string
): Promise<{
  pickss: Partial<IPicks>[];
  totalData: number;
  totalPages: number;
  totalActivePicks: number;
}> => {
  const result = await getManyPicks(query);
  const hasActiveSubscription = userId ? Boolean(await getUserActiveSubscription(userId)) : false;
  const purchasedPickIds = hasActiveSubscription ? new Set<string>() : await getPurchasedPickIdSet(userId);

  return {
    ...result,
    pickss: result.pickss.map((pick: any) =>
      sanitizePickForAccess(
        pick,
        hasActiveSubscription || purchasedPickIds.has((pick._id || '').toString())
      )
    ),
  };
};

const createPickPurchase = async (
  userId: string,
  data: CreatePickPurchaseInput
): Promise<Partial<IPickPurchase>> => {
  const pick = await Picks.findById(data.pickId);

  if (!pick) {
    throw new Error('Pick not found');
  }

  if (!pick.premium) {
    throw new Error('This pick does not require payment');
  }

  if (pick.status !== PicksStatus.ACTIVE) {
    throw new Error('Only active picks can be purchased');
  }

  const activeSubscription = await getUserActiveSubscription(userId);
  if (activeSubscription) {
    throw new Error('Your active subscription already includes this pick');
  }

  const existingPurchase = await PickPurchase.findOne({
    userId: new mongoose.Types.ObjectId(userId),
    pickId: pick._id,
    status: {
      $in: [PickPurchaseStatus.PENDING, PickPurchaseStatus.AUTHORIZED, PickPurchaseStatus.PAID],
    },
  } as any);

  if (existingPurchase?.paymentLink && existingPurchase.status === PickPurchaseStatus.PENDING) {
    return existingPurchase;
  }

  if (existingPurchase) {
    throw new Error('You already have access to this pick');
  }

  const purchase = (await PickPurchase.create({
    userId: new mongoose.Types.ObjectId(userId),
    pickId: pick._id,
    pickSnapshot: {
      sportTitle: pick.sport_title,
      awayTeam: pick.away_team,
      homeTeam: pick.home_team,
      commenceTime: pick.commence_time,
    },
    paymentModel: data.paymentModel,
    price: pick.price,
    status: PickPurchaseStatus.PENDING,
  } as any)) as IPickPurchase;

  const session = await buildPickCheckoutSession(purchase, pick, data.paymentModel as PaymentModel);

  purchase.stripeSessionId = session.id;
  purchase.paymentLink = session.url ?? undefined;
  await purchase.save();

  return purchase;
};

const getMyPickPurchases = async (userId: string): Promise<Partial<IPickPurchase>[]> => {
  return PickPurchase.find({
    userId: new mongoose.Types.ObjectId(userId),
    status: { $in: [PickPurchaseStatus.AUTHORIZED, PickPurchaseStatus.PAID, PickPurchaseStatus.CANCELLED] },
  } as any)
    .populate('pickId')
    .sort({ createdAt: -1 });
};

const getMyAccessiblePicks = async (userId: string): Promise<Partial<IPicks>[]> => {
  const activeSubscription = await getUserActiveSubscription(userId);

  const purchases = await PickPurchase.find({
    userId: new mongoose.Types.ObjectId(userId),
    status: { $in: [PickPurchaseStatus.AUTHORIZED, PickPurchaseStatus.PAID, PickPurchaseStatus.CANCELLED] },
  } as any).lean();

  const purchasedPickIds = purchases.map((purchase) => purchase.pickId);

  const picks = await Picks.find({
    $or: [
      {
        premium: false,
      },
      activeSubscription
        ? {
            premium: true,
          }
        : { _id: { $in: [] } },
      purchasedPickIds.length ? { _id: { $in: purchasedPickIds } } : { _id: { $in: [] } },
    ],
  } as any).sort({ commence_time: 1 });

  return picks;
};

const notifyPickPublished = async (pickId: string): Promise<void> => {
  const pick = await Picks.findById(pickId);
  if (!pick) {
    throw new Error('Pick not found');
  }

  if (!pick.premium) {
    throw new Error('Only premium picks can trigger publish notifications');
  }

  await notifyUsersForPublishedPremiumPick(pick);
};

export const processPickPurchaseWebhookEvent = async (event: Stripe.Event): Promise<boolean> => {
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;

    if (session.metadata?.type !== 'pick_purchase') {
      return false;
    }

    const purchaseId = session.metadata.purchaseId;
    if (!purchaseId) {
      return true;
    }

    const purchase = await PickPurchase.findById(purchaseId);
    if (!purchase) {
      return true;
    }

    purchase.stripeSessionId = session.id;
    purchase.paymentIntentId =
      typeof session.payment_intent === 'string' ? session.payment_intent : session.payment_intent?.id;
    purchase.status =
      purchase.paymentModel === PaymentModel.PAY_AFTER_WIN
        ? PickPurchaseStatus.AUTHORIZED
        : PickPurchaseStatus.PAID;

    if (purchase.status === PickPurchaseStatus.PAID) {
      purchase.capturedAt = new Date();
    }

    await purchase.save();

    if (
      purchase.status === PickPurchaseStatus.AUTHORIZED ||
      purchase.status === PickPurchaseStatus.PAID
    ) {
      const pick = await Picks.findById(session.metadata.pickId);
      if (pick) {
        await sendPickPurchaseConfirmationEmail(purchase, pick);
      }
    }

    if (purchase.paymentModel === PaymentModel.PAY_AFTER_WIN) {
      const pick = await Picks.findById(session.metadata.pickId);
      if (pick && [ResultType.WIN, ResultType.LOSS, ResultType.VOID].includes(pick.result as ResultType)) {
        await settleAuthorizedPurchase(purchase, pick);
      }
    }

    return true;
  }

  if (event.type === 'checkout.session.expired') {
    const session = event.data.object as Stripe.Checkout.Session;

    if (session.metadata?.type !== 'pick_purchase') {
      return false;
    }

    const purchaseId = session.metadata.purchaseId;
    if (purchaseId) {
      await PickPurchase.findByIdAndUpdate(purchaseId, {
        status: PickPurchaseStatus.CANCELLED,
        cancelledAt: new Date(),
      });
    }

    return true;
  }

  return false;
};

export const picksServices = {
  createPicks,
  updatePicks,
  deletePicks,
  deleteManyPicks,
  getPicksById,
  getManyPicks,
  getPickBoard,
  createPickPurchase,
  getMyPickPurchases,
  getMyAccessiblePicks,
  notifyPickPublished,
};
