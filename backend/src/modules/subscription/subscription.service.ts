// Import the model
import mongoose from 'mongoose';
import { IdOrIdsInput, SearchQueryInput } from '../../handlers/common-zod-validator';
import {
  CreateSubscriptionInput,
  CreateManySubscriptionInput,
  UpdateSubscriptionInput,
  UpdateManySubscriptionInput,
} from './subscription.validation';
import Subscription, { ISubscription } from 'src/model/subscription/subscription.model';

/**
 * Service function to create a new subscription.
 *
 * @param {CreateSubscriptionInput} data - The data to create a new subscription.
 * @returns {Promise<Partial<ISubscription>>} - The created subscription.
 */
const createSubscription = async (data: CreateSubscriptionInput): Promise<Partial<ISubscription>> => {
  const newSubscription = new Subscription(data);
  const savedSubscription = await newSubscription.save();
  return savedSubscription;
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
  const existingSubscription = await Subscription.findOne({
    _id: { $ne: id }, // Exclude the current document
    $or: [{ /* filedName: data.filedName, */ }],
  }).lean();
  // Prevent duplicate updates
  if (existingSubscription) {
    throw new Error('Duplicate detected: Another subscription with the same fieldName already exists.');
  }
  // Proceed to update the subscription
  const updatedSubscription = await Subscription.findByIdAndUpdate(id, data, { new: true });
  return updatedSubscription;
};



/**
 * Service function to delete a single subscription by ID.
 *
 * @param {IdOrIdsInput['id']} id - The ID of the subscription to delete.
 * @returns {Promise<Partial<ISubscription>>} - The deleted subscription.
 */
const deleteSubscription = async (id: IdOrIdsInput['id']): Promise<Partial<ISubscription | null>> => {
  const deletedSubscription = await Subscription.findByIdAndDelete(id);
  return deletedSubscription;
};

/**
 * Service function to delete multiple subscription.
 *
 * @param {IdOrIdsInput['ids']} ids - An array of IDs of subscription to delete.
 * @returns {Promise<Partial<ISubscription>[]>} - The deleted subscription.
 */
const deleteManySubscription = async (ids: IdOrIdsInput['ids']): Promise<Partial<ISubscription>[]> => {
  const subscriptionToDelete = await Subscription.find({ _id: { $in: ids } });
  if (!subscriptionToDelete.length) throw new Error('No subscription found to delete');
  await Subscription.deleteMany({ _id: { $in: ids } });
  return subscriptionToDelete; 
};

/**
 * Service function to retrieve a single subscription by ID.
 *
 * @param {IdOrIdsInput['id']} id - The ID of the subscription to retrieve.
 * @returns {Promise<Partial<ISubscription>>} - The retrieved subscription.
 */
const getSubscriptionById = async (id: IdOrIdsInput['id']): Promise<Partial<ISubscription | null>> => {
  const subscription = await Subscription.findById(id);
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
  const totalData = await Subscription.countDocuments(searchFilter);
  // Calculate the total number of pages
  const totalPages = Math.ceil(totalData / showPerPage);
  // Find subscriptions based on the search filter with pagination
  const subscriptions = await Subscription.find(searchFilter)
    .skip(skipItems)
    .limit(showPerPage)
    .select(''); // Keep/Exclude any field if needed
  return { subscriptions, totalData, totalPages };
};

export const subscriptionServices = {
  createSubscription,
  updateSubscription,
  deleteSubscription,
  deleteManySubscription,
  getSubscriptionById,
  getManySubscription,
};