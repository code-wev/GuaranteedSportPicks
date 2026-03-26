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
import config from '../../config/config';

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

const getUserActiveSubscriptionForPick = async (userId: string, pick: IPicks) => {
  return Subscription.findOne({
    userId: new mongoose.Types.ObjectId(userId),
    status: SubscriptionStatus.PAID,
    isSubscribed: true,
    subscriptionEnd: { $gt: new Date().toISOString() },
    selectedSport: pick.sport_title,
  } as any).lean();
};

const settleAuthorizedPurchasesForPick = async (pick: IPicks) => {
  if (![ResultType.WIN, ResultType.LOSS, ResultType.VOID].includes(pick.result as ResultType)) {
    return;
  }

  const authorizedPurchases = await PickPurchase.find({
    pickId: pick._id,
    paymentModel: PaymentModel.PAY_AFTER_WIN,
    status: PickPurchaseStatus.AUTHORIZED,
  } as any);

  for (const purchase of authorizedPurchases) {
    if (!purchase.paymentIntentId) continue;

    if (pick.result === ResultType.WIN) {
      await stripe.paymentIntents.capture(purchase.paymentIntentId);
      purchase.status = PickPurchaseStatus.PAID;
      purchase.capturedAt = new Date();
      await purchase.save();
      continue;
    }

    await stripe.paymentIntents.cancel(purchase.paymentIntentId);
    purchase.status = PickPurchaseStatus.CANCELLED;
    purchase.cancelledAt = new Date();
    await purchase.save();
  }
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
  const updatedPicks = await Picks.findByIdAndUpdate(id, data, { new: true });
  if (updatedPicks && data.result) {
    await settleAuthorizedPurchasesForPick(updatedPicks);
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

  const activeSubscription = await getUserActiveSubscriptionForPick(userId, pick);
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
  const activeSubscriptions = await Subscription.find({
    userId: new mongoose.Types.ObjectId(userId),
    status: SubscriptionStatus.PAID,
    isSubscribed: true,
    subscriptionEnd: { $gt: new Date().toISOString() },
  } as any).lean();

  const subscribedSports = [...new Set(activeSubscriptions.flatMap((sub: any) => sub.selectedSport || []))];

  const purchases = await PickPurchase.find({
    userId: new mongoose.Types.ObjectId(userId),
    status: { $in: [PickPurchaseStatus.AUTHORIZED, PickPurchaseStatus.PAID] },
  } as any).lean();

  const purchasedPickIds = purchases.map((purchase) => purchase.pickId);

  const picks = await Picks.find({
    $or: [
      subscribedSports.length
        ? {
            premium: true,
            sport_title: { $in: subscribedSports },
          }
        : { _id: { $in: [] } },
      purchasedPickIds.length ? { _id: { $in: purchasedPickIds } } : { _id: { $in: [] } },
    ],
  } as any).sort({ commence_time: 1 });

  return picks;
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
  createPickPurchase,
  getMyPickPurchases,
  getMyAccessiblePicks,
};
