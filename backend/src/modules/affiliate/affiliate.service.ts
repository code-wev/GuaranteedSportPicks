import mongoose from 'mongoose';
import config from '../../../src/config/config';
import AffiliateCommissionModel, {
  IAffiliateCommission,
} from '../../../src/model/affiliates/affiliate-commission.model';
import AffiliateModel, {
  AffiliateStatus,
  IAffiliate,
} from '../../../src/model/affiliates/affiliate.model';
import User, { IUser } from '../../../src/model/user/user.schema';
import { IdOrIdsInput, SearchQueryInput } from '../../handlers/common-zod-validator';
import { TAffiliateSummary, TCreateAffiliate } from './affiliate.interface';
import { AffiliateApprovalInput, UpdateAffiliateInput } from './affiliate.validation';

const generateAffiliateCode = async (seed: string): Promise<string> => {
  const normalizedSeed = seed.replace(/[^a-zA-Z0-9]/g, '').toUpperCase().slice(0, 6) || 'AFF';

  for (let attempt = 0; attempt < 10; attempt += 1) {
    const suffix = Math.random().toString(36).slice(2, 6).toUpperCase();
    const code = `${normalizedSeed}${suffix}`;
    const exists = await AffiliateModel.exists({ affiliateCode: code });

    if (!exists) {
      return code;
    }
  }

  throw new Error('Failed to generate affiliate code');
};

const roundCurrency = (value: number): number => Math.round(value * 100) / 100;

const getCommissionRate = (): number => {
  return Number.isFinite(config.AFFILIATE_COMMISSION_RATE)
    ? config.AFFILIATE_COMMISSION_RATE
    : 2;
};

const buildAffiliateSummary = async (
  affiliateDoc: IAffiliate | (Partial<IAffiliate> & { _id?: unknown }) | null
): Promise<TAffiliateSummary> => {
  if (!affiliateDoc?._id) {
    return {
      affiliate: null,
      referralCount: 0,
      totalCommission: 0,
      commissionRate: getCommissionRate(),
      commissions: [],
    };
  }

  const affiliateId = new mongoose.Types.ObjectId(String(affiliateDoc._id));

  const [referralCount, commissionAggregate, commissions] = await Promise.all([
    User.countDocuments({ referredByAffiliateId: affiliateId } as any),
    AffiliateCommissionModel.aggregate([
      { $match: { affiliateId } },
      {
        $group: {
          _id: '$affiliateId',
          totalCommission: { $sum: '$commissionAmount' },
        },
      },
    ]),
    AffiliateCommissionModel.find({ affiliateId } as any)
      .sort({ createdAt: -1 })
      .limit(10)
      .populate('referredUserId', 'firstName lastName email')
      .populate('subscriptionId', 'packageName price selectedSport')
      .lean(),
  ]);

  return {
    affiliate: affiliateDoc,
    referralCount,
    totalCommission: roundCurrency(commissionAggregate[0]?.totalCommission ?? 0),
    commissionRate: getCommissionRate(),
    commissions,
  };
};

const createAffiliate = async (data: TCreateAffiliate): Promise<Partial<IAffiliate>> => {
  const user = await User.findById(data.userId).select('email role');
  if (!user) {
    throw new Error('User not found');
  }

  const affiliateExists = await AffiliateModel.findOne({
    userId: user._id,
  } as any).lean();

  if (affiliateExists) {
    throw new Error('Affiliate request already exists for this user');
  }

  const newAffiliate = await AffiliateModel.create({
    userId: user._id as any,
    website: data.website?.trim() || undefined,
    socialLinks: data.socialLinks?.filter(Boolean) || [],
    notes: data.notes?.trim() || undefined,
    status: AffiliateStatus.PENDING,
  });

  return (newAffiliate as any).toObject();
};

const updateAffiliate = async (
  id: IdOrIdsInput['id'],
  data: UpdateAffiliateInput,
  userId: string
): Promise<Partial<IAffiliate | null>> => {
  const updatedAffiliate = await AffiliateModel.findOneAndUpdate(
    { _id: id, userId: new mongoose.Types.ObjectId(userId) } as any,
    {
      website: data.website?.trim() || undefined,
      socialLinks: data.socialLinks?.filter(Boolean) || [],
      notes: data.notes?.trim() || undefined,
    },
    { new: true }
  );

  return updatedAffiliate as any;
};

const approveAffiliate = async (
  id: IdOrIdsInput['id'],
  data: AffiliateApprovalInput
): Promise<Partial<IAffiliate | null>> => {
  const affiliate = await AffiliateModel.findById(id);
  if (!affiliate) {
    throw new Error('Affiliate request not found');
  }

  if (data.status === AffiliateStatus.APPROVED && !affiliate.affiliateCode) {
    const user = await User.findById(affiliate.userId).select('email firstName lastName');
    if (!user) {
      throw new Error('Affiliate user not found');
    }

    const generatedCode = await generateAffiliateCode(
      `${user.firstName}${user.lastName || ''}${String(user._id).slice(-4)}`
    );

    affiliate.affiliateCode = generatedCode;
    affiliate.approvedAt = new Date();

    await User.findByIdAndUpdate(affiliate.userId, {
      affiliateCode: generatedCode,
    });
  }

  if (data.status === AffiliateStatus.DECLINED) {
    affiliate.approvedAt = undefined;
  }

  affiliate.status = data.status as AffiliateStatus;
  affiliate.notes = data.notes?.trim() || affiliate.notes;
  await affiliate.save();

  return (affiliate as any).toObject();
};

const getAffiliateById = async (id: IdOrIdsInput['id']): Promise<Partial<IAffiliate | null>> => {
  const affiliate = await AffiliateModel.findById(id)
    .populate('userId', 'firstName lastName email')
    .lean();
  return affiliate;
};

const getMyAffiliate = async (userId: string): Promise<TAffiliateSummary> => {
  const affiliate = await AffiliateModel.findOne({ userId: new mongoose.Types.ObjectId(userId) } as any)
    .populate('userId', 'firstName lastName email affiliateCode')
    .lean();

  return buildAffiliateSummary(affiliate);
};

const getManyAffiliate = async (
  query: SearchQueryInput
): Promise<{ affiliates: Record<string, unknown>[]; totalData: number; totalPages: number }> => {
  const { searchKey = '', showPerPage = 10, pageNo = 1 } = query;
  const skipItems = (pageNo - 1) * showPerPage;

  const userMatches = searchKey
    ? await User.find({
        $or: [
          { firstName: { $regex: searchKey, $options: 'i' } },
          { lastName: { $regex: searchKey, $options: 'i' } },
          { email: { $regex: searchKey, $options: 'i' } },
        ],
      })
        .select('_id')
        .lean()
    : [];

  const searchFilter: Record<string, unknown> = searchKey
    ? {
        $or: [
          { affiliateCode: { $regex: searchKey, $options: 'i' } },
          { website: { $regex: searchKey, $options: 'i' } },
          { userId: { $in: userMatches.map((user) => user._id) } },
        ],
      }
    : {};

  const [totalData, affiliates] = await Promise.all([
    AffiliateModel.countDocuments(searchFilter as any),
    AffiliateModel.find(searchFilter as any)
      .populate('userId', 'firstName lastName email')
      .sort({ createdAt: -1 })
      .skip(skipItems)
      .limit(showPerPage)
      .lean(),
  ]);

  const totalPages = Math.ceil(totalData / showPerPage);

  const affiliateIds = affiliates.map((affiliate) => affiliate._id);
  const [commissionRows, referralRows] = await Promise.all([
    AffiliateCommissionModel.aggregate([
      { $match: { affiliateId: { $in: affiliateIds } } },
      {
        $group: {
          _id: '$affiliateId',
          totalCommission: { $sum: '$commissionAmount' },
          commissionEvents: { $sum: 1 },
        },
      },
    ]),
    User.aggregate([
      { $match: { referredByAffiliateId: { $in: affiliateIds } } },
      {
        $group: {
          _id: '$referredByAffiliateId',
          referralCount: { $sum: 1 },
        },
      },
    ]),
  ]);

  const commissionMap = new Map(
    commissionRows.map((row) => [
      String(row._id),
      {
        totalCommission: roundCurrency(row.totalCommission ?? 0),
        commissionEvents: row.commissionEvents ?? 0,
      },
    ])
  );
  const referralMap = new Map(
    referralRows.map((row) => [String(row._id), row.referralCount ?? 0])
  );

  const mappedAffiliates = affiliates.map((affiliate) => ({
    ...affiliate,
    referralCount: referralMap.get(String(affiliate._id)) ?? 0,
    totalCommission: commissionMap.get(String(affiliate._id))?.totalCommission ?? 0,
    commissionEvents: commissionMap.get(String(affiliate._id))?.commissionEvents ?? 0,
    commissionRate: getCommissionRate(),
  }));

  return { affiliates: mappedAffiliates, totalData, totalPages };
};

const getAffiliateAdminSummary = async () => {
  const [totalRequests, approvedAffiliates, pendingAffiliates, commissionAggregate] =
    await Promise.all([
      AffiliateModel.countDocuments(),
      AffiliateModel.countDocuments({ status: AffiliateStatus.APPROVED }),
      AffiliateModel.countDocuments({ status: AffiliateStatus.PENDING }),
      AffiliateCommissionModel.aggregate([
        {
          $group: {
            _id: null,
            totalCommission: { $sum: '$commissionAmount' },
          },
        },
      ]),
    ]);

  return {
    totalRequests,
    approvedAffiliates,
    pendingAffiliates,
    totalCommission: roundCurrency(commissionAggregate[0]?.totalCommission ?? 0),
    commissionRate: getCommissionRate(),
  };
};

const recordAffiliateCommissionForSubscription = async (
  subscription: {
    _id: any;
    userId: any;
    price: number;
  },
  sourceRef: string,
  sourceType: 'INITIAL' | 'RENEWAL'
): Promise<Partial<IAffiliateCommission> | null> => {
  if (!sourceRef) {
    return null;
  }

  const existingCommission = await AffiliateCommissionModel.findOne({ sourceRef }).lean();
  if (existingCommission) {
    return existingCommission;
  }

  const subscriber = await User.findById(subscription.userId)
    .select('referredByAffiliateId')
    .lean();

  if (!subscriber?.referredByAffiliateId) {
    return null;
  }

  const affiliate = await AffiliateModel.findOne({
    _id: subscriber.referredByAffiliateId,
    status: AffiliateStatus.APPROVED,
  } as any).lean();

  if (!affiliate?._id) {
    return null;
  }

  const rate = getCommissionRate();
  const subscriptionAmount = Number(subscription.price || 0);
  if (subscriptionAmount <= 0 || rate <= 0) {
    return null;
  }

  const commissionAmount = roundCurrency((subscriptionAmount * rate) / 100);

  const commission = await AffiliateCommissionModel.create({
    affiliateId: affiliate._id as any,
    referredUserId: subscription.userId as any,
    subscriptionId: subscription._id as any,
    sourceRef,
    sourceType,
    subscriptionAmount,
    commissionRate: rate,
    commissionAmount,
  });

  return (commission as any).toObject();
};

const resolveAffiliateReferral = async (
  referralCode?: string
): Promise<Pick<IUser, '_id'> & { affiliateCode?: string } | null> => {
  if (!referralCode?.trim()) {
    return null;
  }

  const normalizedCode = referralCode.trim().toUpperCase();
  const affiliate = await AffiliateModel.findOne({
    affiliateCode: normalizedCode,
    status: AffiliateStatus.APPROVED,
  })
    .select('_id affiliateCode')
    .lean();

  if (!affiliate) {
    throw new Error('Invalid affiliate code');
  }

  return {
    _id: affiliate._id as mongoose.Types.ObjectId,
    affiliateCode: affiliate.affiliateCode,
  };
};

const deleteAffiliate = async (id: IdOrIdsInput['id']): Promise<Partial<IAffiliate | null>> => {
  const deletedAffiliate = await AffiliateModel.findByIdAndDelete(id);
  return deletedAffiliate;
};

const deleteManyAffiliate = async (ids: IdOrIdsInput['ids']): Promise<Partial<IAffiliate>[]> => {
  const affiliatesToDelete = await AffiliateModel.find({ _id: { $in: ids } });
  if (!affiliatesToDelete.length) {
    throw new Error('No affiliate found to delete');
  }
  await AffiliateModel.deleteMany({ _id: { $in: ids } });
  return affiliatesToDelete;
};

export const affiliateServices = {
  createAffiliate,
  updateAffiliate,
  approveAffiliate,
  deleteAffiliate,
  deleteManyAffiliate,
  getAffiliateById,
  getMyAffiliate,
  getManyAffiliate,
  getAffiliateAdminSummary,
  recordAffiliateCommissionForSubscription,
  resolveAffiliateReferral,
};
