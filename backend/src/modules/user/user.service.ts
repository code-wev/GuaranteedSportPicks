// Import the model

import mongoose from 'mongoose';
import { IdOrIdsInput, SearchQueryInput } from '../../handlers/common-zod-validator';
import User, { IUser } from '../../model/user/user.schema';
import PickPurchase, { PickPurchaseStatus } from '../../model/pick/pick-purchase.model';
import Picks, { PicksStatus, ResultType } from '../../model/pick/picks.model';
import Subscription, { SubscriptionStatus } from '../../model/subscription/subscription.model';
import NewsLatter from '../../model/newslatter/newslatter.model';
import { CreateUserInput, UpdateUserInput } from './user.validation';

type DashboardMonthlyPoint = {
  label: string;
  wins: number;
  losses: number;
  spend: number;
};

type UserDashboardSummary = {
  activePicks: number;
  totalWins: number;
  totalLosses: number;
  totalVoids: number;
  gradedPicks: number;
  winRate: number;
  walletBalance: number;
  totalSpent: number;
  totalPickSpend: number;
  totalSubscriptionSpend: number;
  paidPickPurchases: number;
  activeSubscription: boolean;
  monthlyPerformance: DashboardMonthlyPoint[];
  winLossRatio: {
    wins: number;
    losses: number;
  };
};

type AdminDailySalesPoint = {
  day: string;
  sales: number;
};

type AdminTopSport = {
  name: string;
  purchases: number;
};

type AdminActivity = {
  id: string;
  title: string;
  time: string;
  type: 'pick' | 'user' | 'payment';
  amount?: number;
};

type AdminDashboardSummary = {
  stats: {
    totalUsers: number;
    activeUsers: number;
    activePicks: number;
    totalOrders: number;
    totalRevenue: number;
    newsletterSubscribers: number;
  };
  winLossRatio: {
    wins: number;
    losses: number;
  };
  dailySales: AdminDailySalesPoint[];
  topSports: AdminTopSport[];
  recentActivity: AdminActivity[];
};

type AdminOrderRecord = {
  id: string;
  orderId: string;
  title: string;
  userName: string;
  email: string;
  status: string;
  method: string;
  amount: number;
  date: string;
  category: 'subscription' | 'pick';
};

type AdminOrdersSummary = {
  stats: {
    totalRevenue: number;
    heldAmount: number;
    refundedAmount: number;
    totalOrders: number;
  };
  orders: AdminOrderRecord[];
};

const formatMonthLabel = (date: Date) =>
  date.toLocaleString('en-US', {
    month: 'short',
    year: '2-digit',
  });

const formatDayLabel = (date: Date) =>
  date.toLocaleString('en-US', {
    weekday: 'short',
  });

const timeAgo = (dateInput: Date | string) => {
  const date = new Date(dateInput);
  const diffMs = Date.now() - date.getTime();
  const diffMinutes = Math.max(1, Math.floor(diffMs / (1000 * 60)));

  if (diffMinutes < 60) {
    return `${diffMinutes} minute${diffMinutes === 1 ? '' : 's'} ago`;
  }

  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) {
    return `${diffHours} hour${diffHours === 1 ? '' : 's'} ago`;
  }

  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays} day${diffDays === 1 ? '' : 's'} ago`;
};

/**
 * Service function to create a new user.
 *
 * @param {CreateUserInput} data - The data to create a new user.
 * @returns {Promise<Partial<IUser>>} - The created user.
 */
const createUser = async (data: CreateUserInput): Promise<Partial<IUser>> => {
  const newUser = new User(data);
  const savedUser = await newUser.save();
  return savedUser;
};

/**
 * Service function to update a single user by ID.
 *
 * @param {IdOrIdsInput['id']} id - The ID of the user to update.
 * @param {UpdateUserInput} data - The updated data for the user.
 * @returns {Promise<Partial<IUser>>} - The updated user.
 */
const updateUser = async (
  id: IdOrIdsInput['id'],
  data: UpdateUserInput
): Promise<Partial<IUser | null>> => {
  // Check for duplicate (filed) combination
  const existingUser = await User.findOne({ _id: id });
  // Prevent duplicate updates
  if (!existingUser) {
    throw new Error('User Not Found!');
  }
  // Proceed to update the user
  const updatedUser = await User.findByIdAndUpdate(id, data, { new: true });
  return updatedUser;
};

/**
 * Service function to delete a single user by ID.
 *
 * @param {IdOrIdsInput['id']} id - The ID of the user to delete.
 * @returns {Promise<Partial<IUser>>} - The deleted user.
 */
const deleteUser = async (id: IdOrIdsInput['id']): Promise<Partial<IUser | null>> => {
  const deletedUser = await User.findByIdAndDelete(id);
  return deletedUser;
};

/**
 * Service function to retrieve a single user by ID.
 *
 * @param {IdOrIdsInput['id']} id - The ID of the user to retrieve.
 * @returns {Promise<Partial<IUser>>} - The retrieved user.
 */
const getUserById = async (id: IdOrIdsInput['id']): Promise<Partial<IUser | null>> => {
  const user = await User.findById(id);
  return user;
};

/**
 * Service function to retrieve multiple user based on query parameters.
 *
 * @param {SearchQueryInput} query - The query parameters for filtering user.
 * @returns {Promise<Partial<IUser>[]>} - The retrieved user
 */
const getManyUser = async (
  query: SearchQueryInput
): Promise<{ users: Partial<IUser>[]; totalData: number; totalPages: number }> => {
  const { searchKey = '', showPerPage = 10, pageNo = 1, isActive } = query as SearchQueryInput & {
    isActive?: 'true' | 'false';
  };

  const searchFilter: Record<string, unknown> = {};

  if (searchKey.trim()) {
    searchFilter.$or = [
      { firstName: { $regex: searchKey, $options: 'i' } },
      { lastName: { $regex: searchKey, $options: 'i' } },
      { email: { $regex: searchKey, $options: 'i' } },
      { phoneNumber: { $regex: searchKey, $options: 'i' } },
    ];
  }

  if (isActive !== undefined) {
    searchFilter.isActive = isActive === 'true';
  }

  // Calculate the number of items to skip based on the page number
  const skipItems = (pageNo - 1) * showPerPage;
  // Find the total count of matching user
  const totalData = await User.countDocuments(searchFilter);
  // Calculate the total number of pages
  const totalPages = Math.ceil(totalData / showPerPage);
  // Find users based on the search filter with pagination
  const users = await User.find(searchFilter)
    .sort({ createdAt: -1 })
    .skip(skipItems)
    .limit(showPerPage)
    .select('-password -resetToken -resetTokenExpiry -emailVerificationToken -emailVerificationTokenExpiry');
  return { users, totalData, totalPages };
};

const getUserDashboardSummary = async (userId: string): Promise<UserDashboardSummary> => {
  const normalizedUserId = new mongoose.Types.ObjectId(userId);
  const nowIso = new Date().toISOString();

  const activeSubscription = await Subscription.findOne({
    userId: normalizedUserId,
    status: SubscriptionStatus.PAID,
    isSubscribed: true,
    subscriptionEnd: { $gt: nowIso },
  } as any).lean();

  const paidPurchases = await PickPurchase.find({
    userId: normalizedUserId,
    status: { $in: [PickPurchaseStatus.AUTHORIZED, PickPurchaseStatus.PAID] },
  } as any)
    .select('pickId status price createdAt capturedAt')
    .lean();

  const paidPickIds = paidPurchases.map((purchase: any) => purchase.pickId);
  const accessiblePickFilter = {
    $or: [
      {
        premium: false,
      },
      activeSubscription ? { premium: true } : { _id: { $in: [] } },
      paidPickIds.length ? { _id: { $in: paidPickIds } } : { _id: { $in: [] } },
    ],
  };

  const accessiblePicks = await Picks.find(accessiblePickFilter as any)
    .select('result status updatedAt')
    .lean();

  const activePicks = accessiblePicks.filter(
    (pick: any) => pick.status === PicksStatus.ACTIVE && !pick.result
  ).length;
  const totalWins = accessiblePicks.filter((pick: any) => pick.result === ResultType.WIN).length;
  const totalLosses = accessiblePicks.filter((pick: any) => pick.result === ResultType.LOSS).length;
  const totalVoids = accessiblePicks.filter((pick: any) => pick.result === ResultType.VOID).length;
  const gradedPicks = totalWins + totalLosses;
  const winRate = gradedPicks > 0 ? Number(((totalWins / gradedPicks) * 100).toFixed(1)) : 0;

  const paidSubscriptions = await Subscription.find({
    userId: normalizedUserId,
    status: SubscriptionStatus.PAID,
  } as any)
    .select('price createdAt')
    .lean();

  const totalPickSpend = paidPurchases.reduce(
    (sum: number, purchase: any) =>
      purchase.status === PickPurchaseStatus.PAID ? sum + Number(purchase.price || 0) : sum,
    0
  );
  const totalSubscriptionSpend = paidSubscriptions.reduce(
    (sum: number, subscription: any) => sum + Number(subscription.price || 0),
    0
  );
  const totalSpent = Number((totalPickSpend + totalSubscriptionSpend).toFixed(2));

  const monthMap = new Map<string, DashboardMonthlyPoint>();
  for (let index = 5; index >= 0; index -= 1) {
    const monthDate = new Date();
    monthDate.setDate(1);
    monthDate.setHours(0, 0, 0, 0);
    monthDate.setMonth(monthDate.getMonth() - index);

    const label = formatMonthLabel(monthDate);
    monthMap.set(label, { label, wins: 0, losses: 0, spend: 0 });
  }

  for (const pick of accessiblePicks as any[]) {
    if (![ResultType.WIN, ResultType.LOSS].includes(pick.result)) {
      continue;
    }

    const label = formatMonthLabel(new Date(pick.updatedAt));
    const bucket = monthMap.get(label);
    if (!bucket) {
      continue;
    }

    if (pick.result === ResultType.WIN) {
      bucket.wins += 1;
    } else if (pick.result === ResultType.LOSS) {
      bucket.losses += 1;
    }
  }

  for (const purchase of paidPurchases as any[]) {
    if (purchase.status !== PickPurchaseStatus.PAID) {
      continue;
    }

    const spendDate = purchase.capturedAt || purchase.createdAt;
    const label = formatMonthLabel(new Date(spendDate));
    const bucket = monthMap.get(label);
    if (bucket) {
      bucket.spend += Number(purchase.price || 0);
    }
  }

  for (const subscription of paidSubscriptions as any[]) {
    const label = formatMonthLabel(new Date(subscription.createdAt));
    const bucket = monthMap.get(label);
    if (bucket) {
      bucket.spend += Number(subscription.price || 0);
    }
  }

  const monthlyPerformance = Array.from(monthMap.values()).map((item) => ({
    ...item,
    spend: Number(item.spend.toFixed(2)),
  }));

  return {
    activePicks,
    totalWins,
    totalLosses,
    totalVoids,
    gradedPicks,
    winRate,
    walletBalance: totalSpent,
    totalSpent,
    totalPickSpend: Number(totalPickSpend.toFixed(2)),
    totalSubscriptionSpend: Number(totalSubscriptionSpend.toFixed(2)),
    paidPickPurchases: paidPurchases.filter((purchase: any) => purchase.status === PickPurchaseStatus.PAID)
      .length,
    activeSubscription: Boolean(activeSubscription),
    monthlyPerformance,
    winLossRatio: {
      wins: totalWins,
      losses: totalLosses,
    },
  };
};

const getAdminDashboardSummary = async (): Promise<AdminDashboardSummary> => {
  const [totalUsers, activeUsers, newsletterSubscribers, allPicks, paidSubscriptions, allPickPurchases] =
    await Promise.all([
      User.countDocuments(),
      User.countDocuments({ isActive: true }),
      NewsLatter.countDocuments({ isActive: true }),
      Picks.find().select('result status sport_title createdAt').lean(),
      Subscription.find({ status: SubscriptionStatus.PAID })
        .select('price createdAt')
        .lean(),
      PickPurchase.find()
        .populate('pickId', 'sport_title away_team home_team')
        .select('price status createdAt capturedAt paymentModel pickId')
        .lean(),
    ]);

  const activePicks = allPicks.filter((pick: any) => pick.status === PicksStatus.ACTIVE).length;
  const wins = allPicks.filter((pick: any) => pick.result === ResultType.WIN).length;
  const losses = allPicks.filter((pick: any) => pick.result === ResultType.LOSS).length;

  const totalRevenue =
    paidSubscriptions.reduce((sum: number, item: any) => sum + Number(item.price || 0), 0) +
    allPickPurchases.reduce(
      (sum: number, item: any) =>
        item.status === PickPurchaseStatus.PAID ? sum + Number(item.price || 0) : sum,
      0
    );

  const totalOrders =
    paidSubscriptions.length +
    allPickPurchases.filter((item: any) =>
      [
        PickPurchaseStatus.PENDING,
        PickPurchaseStatus.AUTHORIZED,
        PickPurchaseStatus.PAID,
        PickPurchaseStatus.CANCELLED,
      ].includes(item.status)
    ).length;

  const dayMap = new Map<string, AdminDailySalesPoint>();
  for (let index = 6; index >= 0; index -= 1) {
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    date.setDate(date.getDate() - index);
    dayMap.set(date.toISOString().slice(0, 10), {
      day: formatDayLabel(date),
      sales: 0,
    });
  }

  for (const subscription of paidSubscriptions as any[]) {
    const key = new Date(subscription.createdAt).toISOString().slice(0, 10);
    const bucket = dayMap.get(key);
    if (bucket) {
      bucket.sales += Number(subscription.price || 0);
    }
  }

  for (const purchase of allPickPurchases as any[]) {
    if (purchase.status !== PickPurchaseStatus.PAID) {
      continue;
    }
    const sourceDate = purchase.capturedAt || purchase.createdAt;
    const key = new Date(sourceDate).toISOString().slice(0, 10);
    const bucket = dayMap.get(key);
    if (bucket) {
      bucket.sales += Number(purchase.price || 0);
    }
  }

  const sportMap = new Map<string, number>();
  for (const purchase of allPickPurchases as any[]) {
    const sportName = purchase.pickId?.sport_title;
    if (!sportName) {
      continue;
    }
    sportMap.set(sportName, (sportMap.get(sportName) || 0) + 1);
  }
  const topSports = Array.from(sportMap.entries())
    .map(([name, purchases]) => ({ name, purchases }))
    .sort((a, b) => b.purchases - a.purchases)
    .slice(0, 4);

  const [recentPicks, recentUsers, recentSubscriptionPayments, recentPickPayments] = await Promise.all([
    Picks.find().sort({ createdAt: -1 }).limit(3).select('away_team home_team createdAt').lean(),
    User.find().sort({ createdAt: -1 }).limit(3).select('email createdAt').lean(),
    Subscription.find({ status: SubscriptionStatus.PAID })
      .sort({ createdAt: -1 })
      .limit(3)
      .select('price createdAt packageName')
      .lean(),
    PickPurchase.find({ status: PickPurchaseStatus.PAID })
      .populate('pickId', 'away_team home_team')
      .sort({ capturedAt: -1, createdAt: -1 })
      .limit(3)
      .select('price createdAt capturedAt pickId')
      .lean(),
  ]);

  const recentActivity: AdminActivity[] = [
    ...recentPicks.map((pick: any) => ({
      id: `pick-${pick._id}`,
      title: `New pick published: ${pick.away_team} vs ${pick.home_team}`,
      time: timeAgo(pick.createdAt),
      type: 'pick' as const,
      createdAt: new Date(pick.createdAt).getTime(),
    })),
    ...recentUsers.map((user: any) => ({
      id: `user-${user._id}`,
      title: `New user registered: ${user.email}`,
      time: timeAgo(user.createdAt),
      type: 'user' as const,
      createdAt: new Date(user.createdAt).getTime(),
    })),
    ...recentSubscriptionPayments.map((payment: any) => ({
      id: `sub-${payment._id}`,
      title: `Subscription payment received: $${Number(payment.price || 0).toFixed(2)} ${payment.packageName}`,
      time: timeAgo(payment.createdAt),
      type: 'payment' as const,
      amount: Number(payment.price || 0),
      createdAt: new Date(payment.createdAt).getTime(),
    })),
    ...recentPickPayments.map((payment: any) => ({
      id: `pick-payment-${payment._id}`,
      title: `Pick payment received: ${payment.pickId?.away_team || 'Team'} vs ${payment.pickId?.home_team || 'Team'}`,
      time: timeAgo(payment.capturedAt || payment.createdAt),
      type: 'payment' as const,
      amount: Number(payment.price || 0),
      createdAt: new Date(payment.capturedAt || payment.createdAt).getTime(),
    })),
  ]
    .sort((a: any, b: any) => b.createdAt - a.createdAt)
    .slice(0, 6)
    .map(({ createdAt, ...activity }) => activity);

  return {
    stats: {
      totalUsers,
      activeUsers,
      activePicks,
      totalOrders,
      totalRevenue: Number(totalRevenue.toFixed(2)),
      newsletterSubscribers,
    },
    winLossRatio: {
      wins,
      losses,
    },
    dailySales: Array.from(dayMap.values()).map((item) => ({
      ...item,
      sales: Number(item.sales.toFixed(2)),
    })),
    topSports,
    recentActivity,
  };
};

const getAdminOrdersSummary = async (): Promise<AdminOrdersSummary> => {
  const [subscriptions, pickPurchases] = await Promise.all([
    Subscription.find()
      .populate('userId', 'firstName lastName email')
      .sort({ createdAt: -1 })
      .lean(),
    PickPurchase.find()
      .populate('userId', 'firstName lastName email')
      .populate('pickId', 'away_team home_team sport_title')
      .sort({ capturedAt: -1, createdAt: -1 })
      .lean(),
  ]);

  const subscriptionOrders: AdminOrderRecord[] = (subscriptions as any[]).map((subscription) => {
    const user = subscription.userId || {};
    const userName = [user.firstName, user.lastName].filter(Boolean).join(' ').trim() || 'Unknown User';
    const titleParts = [
      subscription.packageName
        ? `${subscription.packageName.charAt(0)}${subscription.packageName.slice(1).toLowerCase()} Plan`
        : 'Subscription',
      Array.isArray(subscription.selectedSport) && subscription.selectedSport.length
        ? `(${subscription.selectedSport.join(', ')})`
        : '',
    ].filter(Boolean);

    return {
      id: `subscription-${subscription._id}`,
      orderId: `SUB-${String(subscription._id).slice(-6).toUpperCase()}`,
      title: titleParts.join(' '),
      userName,
      email: user.email || 'No email',
      status: subscription.status,
      method: subscription.isSeasonal ? 'ONE_TIME' : 'RECURRING',
      amount: Number(subscription.price || 0),
      date: subscription.createdAt ? new Date(subscription.createdAt).toISOString() : new Date().toISOString(),
      category: 'subscription',
    };
  });

  const pickOrders: AdminOrderRecord[] = (pickPurchases as any[]).map((purchase) => {
    const user = purchase.userId || {};
    const pick = purchase.pickId || {};
    const userName = [user.firstName, user.lastName].filter(Boolean).join(' ').trim() || 'Unknown User';

    return {
      id: `pick-${purchase._id}`,
      orderId: `PICK-${String(purchase._id).slice(-6).toUpperCase()}`,
      title:
        pick.away_team && pick.home_team
          ? `${pick.away_team} @ ${pick.home_team}`
          : pick.sport_title || 'Pick Purchase',
      userName,
      email: user.email || 'No email',
      status: purchase.status,
      method: purchase.paymentModel,
      amount: Number(purchase.price || 0),
      date: purchase.capturedAt || purchase.createdAt || new Date().toISOString(),
      category: 'pick',
    };
  });

  const orders = [...subscriptionOrders, ...pickOrders].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const totalRevenue = orders
    .filter((order) => order.status === 'PAID')
    .reduce((sum, order) => sum + order.amount, 0);
  const heldAmount = orders
    .filter((order) => order.status === 'AUTHORIZED')
    .reduce((sum, order) => sum + order.amount, 0);
  const refundedAmount = orders
    .filter((order) => order.status === 'CANCELLED' || order.status === 'REFUNDED')
    .reduce((sum, order) => sum + order.amount, 0);

  return {
    stats: {
      totalRevenue: Number(totalRevenue.toFixed(2)),
      heldAmount: Number(heldAmount.toFixed(2)),
      refundedAmount: Number(refundedAmount.toFixed(2)),
      totalOrders: orders.length,
    },
    orders,
  };
};

export const userServices = {
  createUser,
  updateUser,
  deleteUser,
  getUserById,
  getManyUser,
  getUserDashboardSummary,
  getAdminDashboardSummary,
  getAdminOrdersSummary,
};
