// Import the model
import mongoose from 'mongoose';

import { IdOrIdsInput, SearchQueryInput } from '../../handlers/common-zod-validator';
import {
  CreateAffiliateInput,
  CreateManyAffiliateInput,
  UpdateAffiliateInput,
  UpdateManyAffiliateInput,
} from './affiliate.validation';
import AffiliateModel, { IAffiliate } from '../../../src/model/affiliates/affiliate.model';

/**
 * Service function to create a new affiliate.
 *
 * @param {CreateAffiliateInput} data - The data to create a new affiliate.
 * @returns {Promise<Partial<IAffiliate>>} - The created affiliate.
 */
const createAffiliate = async (data: CreateAffiliateInput): Promise<Partial<IAffiliate>> => {
  console.log(data, 'hi affliate data');
  const newAffiliate = new AffiliateModel(data);
  const savedAffiliate = await newAffiliate.save();
  return savedAffiliate;
};

/**
 * Service function to create multiple affiliate.
 *
 * @param {CreateManyAffiliateInput} data - An array of data to create multiple affiliate.
 * @returns {Promise<Partial<IAffiliate>[]>} - The created affiliate. // Note: insertMany returns the created documents, but they may not have all the Mongoose document methods. Depending on your needs, you might want to fetch them again after insertion to get full document instances.
 */
const createManyAffiliate = async (
  data: CreateManyAffiliateInput
): Promise<Partial<IAffiliate>[]> => {
  const createdAffiliate = await AffiliateModel.insertMany(data);
  return createdAffiliate;
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
  // Check for duplicate (filed) combination
  const existingAffiliate = await AffiliateModel.findOne({
    _id: { $ne: id }, // Exclude the current document
    $or: [
      {
        /* filedName: data.filedName, */
      },
    ],
  }).lean();
  // Prevent duplicate updates
  if (existingAffiliate) {
    throw new Error(
      'Duplicate detected: Another affiliate with the same fieldName already exists.'
    );
  }
  // Proceed to update the affiliate
  const updatedAffiliate = await AffiliateModel.findByIdAndUpdate(id, data, { new: true });
  return updatedAffiliate;
};

/**
 * Service function to update multiple affiliate.
 *
 * @param {UpdateManyAffiliateInput} data - An array of data to update multiple affiliate.
 * @returns {Promise<Partial<IAffiliate>[]>} - The updated affiliate.
 */
const updateManyAffiliate = async (
  data: UpdateManyAffiliateInput
): Promise<Partial<IAffiliate>[]> => {
  // Early return if no data provided
  if (data.length === 0) {
    return [];
  }
  // Convert string ids to ObjectId (for safety)
  const objectIds = data.map((item) => new mongoose.Types.ObjectId(item.id));
  // Check for duplicates (filedName) excluding the documents being updated
  const existingAffiliate = await AffiliateModel.find({
    _id: { $nin: objectIds }, // Exclude documents being updated
    $or: data.flatMap((item) => [
      // { filedName: item.filedName },
    ]),
  }).lean();
  // If any duplicates found, throw error
  if (existingAffiliate.length > 0) {
    throw new Error(
      'Duplicate detected: One or more affiliate with the same fieldName already exist.'
    );
  }
  // Prepare bulk operations
  const operations = data.map((item) => ({
    updateOne: {
      filter: { _id: new mongoose.Types.ObjectId(item.id) },
      update: { $set: item },
      upsert: false,
    },
  }));
  // Execute bulk update
  const bulkResult = await AffiliateModel.bulkWrite(operations, {
    ordered: true, // keep order of operations
  });
  // check if all succeeded
  if (bulkResult.matchedCount !== data.length) {
    throw new Error('Some documents were not found or updated');
  }
  // Fetch the freshly updated documents
  const updatedDocs = await AffiliateModel.find({ _id: { $in: objectIds } })
    .lean()
    .exec();
  // Map back to original input order
  const resultMap = new Map<string, any>(updatedDocs.map((doc) => [doc._id.toString(), doc]));
  // Ensure the result array matches the input order
  const orderedResults = data.map((item) => {
    const updated = resultMap.get(item.id);
    return updated || { _id: item.id };
  });
  return orderedResults as Partial<IAffiliate>[];
};

/**
 * Service function to delete a single affiliate by ID.
 *
 * @param {IdOrIdsInput['id']} id - The ID of the affiliate to delete.
 * @returns {Promise<Partial<IAffiliate>>} - The deleted affiliate.
 */
const deleteAffiliate = async (id: IdOrIdsInput['id']): Promise<Partial<IAffiliate | null>> => {
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
  createManyAffiliate,
  updateAffiliate,
  updateManyAffiliate,
  deleteAffiliate,
  deleteManyAffiliate,
  getAffiliateById,
  getManyAffiliate,
};

