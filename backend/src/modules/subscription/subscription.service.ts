// Import the model
import mongoose from 'mongoose';
import SubscriptionModel, { ISubscription } from './subscription.model';
import { IdOrIdsInput, SearchQueryInput } from '../../handlers/common-zod-validator';
import {
  CreateSubscriptionInput,
  CreateManySubscriptionInput,
  UpdateSubscriptionInput,
  UpdateManySubscriptionInput,
} from './subscription.validation';

/**
 * Service function to create a new subscription.
 *
 * @param {CreateSubscriptionInput} data - The data to create a new subscription.
 * @returns {Promise<Partial<ISubscription>>} - The created subscription.
 */
const createSubscription = async (data: CreateSubscriptionInput): Promise<Partial<ISubscription>> => {
  const newSubscription = new SubscriptionModel(data);
  const savedSubscription = await newSubscription.save();
  return savedSubscription;
};

/**
 * Service function to create multiple subscription.
 *
 * @param {CreateManySubscriptionInput} data - An array of data to create multiple subscription.
 * @returns {Promise<Partial<ISubscription>[]>} - The created subscription.
 */
const createManySubscription = async (data: CreateManySubscriptionInput): Promise<Partial<ISubscription>[]> => {
  const createdSubscription = await SubscriptionModel.insertMany(data);
  return createdSubscription;
};

/**
 * Service function to update a single subscription by ID.
 *
 * @param {IdOrIdsInput['id']} id - The ID of the subscription to update.
 * @param {UpdateSubscriptionInput} data - The updated data for the subscription.
 * @returns {Promise<Partial<ISubscription>>} - The updated subscription.
 */
const updateSubscription = async (id: IdOrIdsInput['id'], data: UpdateSubscriptionInput): Promise<Partial<ISubscription | null>> => {
  // Check for duplicate (filed) combination
  const existingSubscription = await SubscriptionModel.findOne({
    _id: { $ne: id }, // Exclude the current document
    $or: [{ /* filedName: data.filedName, */ }],
  }).lean();
  // Prevent duplicate updates
  if (existingSubscription) {
    throw new Error('Duplicate detected: Another subscription with the same fieldName already exists.');
  }
  // Proceed to update the subscription
  const updatedSubscription = await SubscriptionModel.findByIdAndUpdate(id, data, { new: true });
  return updatedSubscription;
};

/**
 * Service function to update multiple subscription.
 *
 * @param {UpdateManySubscriptionInput} data - An array of data to update multiple subscription.
 * @returns {Promise<Partial<ISubscription>[]>} - The updated subscription.
 */
const updateManySubscription = async (data: UpdateManySubscriptionInput): Promise<Partial<ISubscription>[]> => {
// Early return if no data provided
  if (data.length === 0) {
    return [];
  }
  // Convert string ids to ObjectId (for safety)
  const objectIds = data.map((item) => new mongoose.Types.ObjectId(item.id));
  // Check for duplicates (filedName) excluding the documents being updated
  const existingSubscription = await SubscriptionModel.find({
    _id: { $nin: objectIds }, // Exclude documents being updated
    $or: data.flatMap((item) => [
      // { filedName: item.filedName },
    ]),
  }).lean();
  // If any duplicates found, throw error
  if (existingSubscription.length > 0) {
    throw new Error(
      'Duplicate detected: One or more subscription with the same fieldName already exist.'
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
  const bulkResult = await SubscriptionModel.bulkWrite(operations, {
    ordered: true, // keep order of operations
  });
  // check if all succeeded
  if (bulkResult.matchedCount !== data.length) {
    throw new Error('Some documents were not found or updated');
  }
  // Fetch the freshly updated documents
  const updatedDocs = await SubscriptionModel.find({ _id: { $in: objectIds } })
    .lean()
    .exec();
  // Map back to original input order
  const resultMap = new Map<string, any>(updatedDocs.map((doc) => [doc._id.toString(), doc]));
  // Ensure the result array matches the input order
  const orderedResults = data.map((item) => {
    const updated = resultMap.get(item.id);
    return updated || { _id: item.id };
  });
  return orderedResults as Partial<ISubscription>[];
};

/**
 * Service function to delete a single subscription by ID.
 *
 * @param {IdOrIdsInput['id']} id - The ID of the subscription to delete.
 * @returns {Promise<Partial<ISubscription>>} - The deleted subscription.
 */
const deleteSubscription = async (id: IdOrIdsInput['id']): Promise<Partial<ISubscription | null>> => {
  const deletedSubscription = await SubscriptionModel.findByIdAndDelete(id);
  return deletedSubscription;
};

/**
 * Service function to delete multiple subscription.
 *
 * @param {IdOrIdsInput['ids']} ids - An array of IDs of subscription to delete.
 * @returns {Promise<Partial<ISubscription>[]>} - The deleted subscription.
 */
const deleteManySubscription = async (ids: IdOrIdsInput['ids']): Promise<Partial<ISubscription>[]> => {
  const subscriptionToDelete = await SubscriptionModel.find({ _id: { $in: ids } });
  if (!subscriptionToDelete.length) throw new Error('No subscription found to delete');
  await SubscriptionModel.deleteMany({ _id: { $in: ids } });
  return subscriptionToDelete; 
};

/**
 * Service function to retrieve a single subscription by ID.
 *
 * @param {IdOrIdsInput['id']} id - The ID of the subscription to retrieve.
 * @returns {Promise<Partial<ISubscription>>} - The retrieved subscription.
 */
const getSubscriptionById = async (id: IdOrIdsInput['id']): Promise<Partial<ISubscription | null>> => {
  const subscription = await SubscriptionModel.findById(id);
  return subscription;
};

/**
 * Service function to retrieve multiple subscription based on query parameters.
 *
 * @param {SearchQueryInput} query - The query parameters for filtering subscription.
 * @returns {Promise<Partial<ISubscription>[]>} - The retrieved subscription
 */
const getManySubscription = async (query: SearchQueryInput): Promise<{ subscriptions: Partial<ISubscription>[]; totalData: number; totalPages: number }> => {
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
  // Find the total count of matching subscription
  const totalData = await SubscriptionModel.countDocuments(searchFilter);
  // Calculate the total number of pages
  const totalPages = Math.ceil(totalData / showPerPage);
  // Find subscriptions based on the search filter with pagination
  const subscriptions = await SubscriptionModel.find(searchFilter)
    .skip(skipItems)
    .limit(showPerPage)
    .select(''); // Keep/Exclude any field if needed
  return { subscriptions, totalData, totalPages };
};

export const subscriptionServices = {
  createSubscription,
  createManySubscription,
  updateSubscription,
  updateManySubscription,
  deleteSubscription,
  deleteManySubscription,
  getSubscriptionById,
  getManySubscription,
};