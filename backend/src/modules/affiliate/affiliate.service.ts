// Import the model
import mongoose from 'mongoose';

import { IdOrIdsInput, SearchQueryInput } from '../../handlers/common-zod-validator';
import { CreateAffiliateInput, UpdateAffiliateInput } from './affiliate.validation';
import AffiliateModel, { IAffiliate } from '../../../src/model/affiliates/affiliate.model';
import User, { UserRole } from '../../../src/model/user/user.schema';
import { TCreateAffiliate } from './affiliate.interface';

/**
 * Service function to create a new affiliate.
 *
 * @param {CreateAffiliateInput} data - The data to create a new affiliate.
 * @returns {Promise<Partial<IAffiliate>>} - The created affiliate.
 */
const createAffiliate = async (data: TCreateAffiliate): Promise<Partial<IAffiliate>> => {
  // Validate that the user exists
  const userId = data.userId;
  console.log(userId, 'recevie user id');
  const userExists = await User.exists({ _id: userId });
  if (!userExists) {
    throw new Error('User not found');
  }

  // Validate that the user is not already an affiliate
  const affiliateExists = await AffiliateModel.exists({
    userId: userId as unknown as mongoose.Schema.Types.ObjectId,
  });
  if (affiliateExists) {
    throw new Error('User is already an affiliate');
  }

  //
  const newAffiliate = new AffiliateModel(data);
  const savedAffiliate = await newAffiliate.save();
  return savedAffiliate;
};

/**
 * Service function to update a single affiliate by ID.
 *
 * @param {IdOrIdsInput['id']} id - The ID of the affiliate to update.
 * @param {UpdateAffiliateInput} data - The updated data for the affiliate.
 * @returns {Promise<Partial<IAffiliate>>} - The updated affiliate.
 */
const updateAffiliate = async (
  id: IdOrIdsInput['id'],
  data: UpdateAffiliateInput
): Promise<Partial<IAffiliate | null>> => {
  const payload = data as UpdateAffiliateInput & { userRole?: string; UserRole?: string };
  const actorRole = payload.userRole;
  if (actorRole !== UserRole.ADMIN && payload.status !== undefined) {
    throw new Error('Unauthorized: only admin can change status');
  }

  // Proceed to update the affiliate
  const { userRole, UserRole: _userRole, ...updateData } = payload;
  void userRole;
  void _userRole;
  const updatedAffiliate = await AffiliateModel.findByIdAndUpdate(id, updateData, { new: true });
  return updatedAffiliate;
};

/**
 * Service function to delete a single affiliate by ID.
 *
 * @param {IdOrIdsInput['id']} id - The ID of the affiliate to delete.
 * @returns {Promise<Partial<IAffiliate>>} - The deleted affiliate.
 */
const deleteAffiliate = async (id: IdOrIdsInput['id']): Promise<Partial<IAffiliate | null>> => {
  // TODO: Admin can delete any affliate
  // TODO: User only delete there own affiliate

  const deletedAffiliate = await AffiliateModel.findByIdAndDelete(id);
  return deletedAffiliate;
};

/**
 * Service function to delete multiple affiliate.
 *
 * @param {IdOrIdsInput['ids']} ids - An array of IDs of affiliate to delete.
 * @returns {Promise<Partial<IAffiliate>[]>} - The deleted affiliate.
 */
const deleteManyAffiliate = async (ids: IdOrIdsInput['ids']): Promise<Partial<IAffiliate>[]> => {
  const affiliateToDelete = await AffiliateModel.find({ _id: { $in: ids } });
  if (!affiliateToDelete.length) throw new Error('No affiliate found to delete');
  await AffiliateModel.deleteMany({ _id: { $in: ids } });
  return affiliateToDelete;
};

/**
 * Service function to retrieve a single affiliate by ID.
 *
 * @param {IdOrIdsInput['id']} id - The ID of the affiliate to retrieve.
 * @returns {Promise<Partial<IAffiliate>>} - The retrieved affiliate.
 */
const getAffiliateById = async (id: IdOrIdsInput['id']): Promise<Partial<IAffiliate | null>> => {
  const affiliate = await AffiliateModel.findById(id);
  return affiliate;
};

/**
 * Service function to retrieve multiple affiliate based on query parameters.
 *
 * @param {SearchQueryInput} query - The query parameters for filtering affiliate.
 * @returns {Promise<Partial<IAffiliate>[]>} - The retrieved affiliate
 */
const getManyAffiliate = async (
  query: SearchQueryInput
): Promise<{ affiliates: Partial<IAffiliate>[]; totalData: number; totalPages: number }> => {
  const { searchKey = '', showPerPage = 10, pageNo = 1 } = query;
  // Build the search filter based on the search key
  const searchFilter = {
    $or: [
      // { fieldName: { $regex: searchKey, $options: 'i' } },
      // Add more fields as needed
    ],
  };
  // Calculate the number of items to skip based on the page number
  const skipItems = (pageNo - 1) * showPerPage;
  // Find the total count of matching affiliate
  const totalData = await AffiliateModel.countDocuments(searchFilter);
  // Calculate the total number of pages
  const totalPages = Math.ceil(totalData / showPerPage);
  // Find affiliates based on the search filter with pagination
  const affiliates = await AffiliateModel.find(searchFilter)
    .skip(skipItems)
    .limit(showPerPage)
    .select(''); // Keep/Exclude any field if needed
  return { affiliates, totalData, totalPages };
};

export const affiliateServices = {
  createAffiliate,
  updateAffiliate,
  deleteAffiliate,
  deleteManyAffiliate,
  getAffiliateById,
  getManyAffiliate,
};

