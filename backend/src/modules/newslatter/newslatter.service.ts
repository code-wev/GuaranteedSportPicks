// Import the model
import mongoose from 'mongoose';

import { IdOrIdsInput, SearchQueryInput } from '../../handlers/common-zod-validator';
import { CreateNewslatterInput, UpdateNewslatterInput } from './newslatter.validation';
import NewsLatter, { Inewslatter } from '../../../src/model/newslatter/newslatter.model';
import User from '../../../src/model/user/user.schema';

/**
 * Service function to create a new newslatter.
 *
 * @param {CreateNewslatterInput} data - The data to create a new newslatter.
 * @returns {Promise<Partial<IInewslatter>>} - The created newslatter.
 */
const createNewslatter = async (data: CreateNewslatterInput): Promise<Partial<Inewslatter>> => {
  const userObjectId = new mongoose.Types.ObjectId(data.userId);
  const userExists = await User.exists({ _id: userObjectId });
  if (!userExists) {
    throw new Error('User not found');
  }

  const existingNewslatter = await NewsLatter.findOne({ userId: userObjectId })
    .select('isActive')
    .lean();
  if (existingNewslatter && existingNewslatter.isActive) {
    throw new Error('User is already an active subscriber');
  }
  const requestedStatus = (data as { status?: boolean }).status;
  if (requestedStatus !== undefined && requestedStatus !== true) {
    throw new Error('Status must be true');
  }

  if (
    existingNewslatter &&
    requestedStatus !== undefined &&
    existingNewslatter.isActive === requestedStatus
  ) {
    throw new Error(
      existingNewslatter.isActive
        ? 'You or this user is already a subscriber'
        : 'You or this user is already an unsubscriber'
    );
  }

  if (
    existingNewslatter &&
    requestedStatus !== undefined &&
    existingNewslatter.isActive !== requestedStatus
  ) {
    const updatedNewslatter = await NewsLatter.findOneAndUpdate(
      { userId: userObjectId },
      { $set: { isActive: requestedStatus } },
      { new: true }
    );
    return updatedNewslatter as Partial<Inewslatter>;
  }

  if (!existingNewslatter) {
    const newNewslatter = new NewsLatter({ ...data, userId: userObjectId });
    const savedNewslatter = await newNewslatter.save();
    return savedNewslatter;
  }

  throw new Error('You or this user is already an unsubscriber');
};

/**
 * Service function to update a single newslatter by ID.
 *
 * @param {IdOrIdsInput['id']} id - The ID of the newslatter to update.
 * @param {UpdateNewslatterInput} data - The updated data for the newslatter.
 * @returns {Promise<Partial<INewslatter>>} - The updated newslatter.
 */
const updateNewslatter = async (
  id: IdOrIdsInput['id'],
  data: UpdateNewslatterInput
): Promise<Partial<Inewslatter | null>> => {
  // Check for duplicate (filed) combination

  if (data.userId) {
    const userObjectId = new mongoose.Types.ObjectId(data.userId);
    const userExists = await User.exists({ _id: userObjectId });
    if (!userExists) {
      throw new Error('User not found');
    }
  }

  const updatePayload = data.userId
    ? { ...data, userId: new mongoose.Types.ObjectId(data.userId) }
    : data;
  const requestedStatus = (data as { status?: boolean }).status;
  if (requestedStatus !== undefined) {
    const updatedStatus = await NewsLatter.findByIdAndUpdate(
      id,
      { $set: { isActive: requestedStatus } },
      { new: true }
    );
    return updatedStatus;
  }

  // Prevent duplicate updates

  // Proceed to update the newslatter
  const updatedNewslatter = await NewsLatter.findByIdAndUpdate(id, updatePayload, { new: true });
  return updatedNewslatter;
};

/**
 * Service function to delete a single newslatter by ID.
 *
 * @param {IdOrIdsInput['id']} id - The ID of the newslatter to delete.
 * @returns {Promise<Partial<INewslatter>>} - The deleted newslatter.
 */
const deleteNewslatter = async (id: IdOrIdsInput['id']): Promise<Partial<Inewslatter | null>> => {
  const deletedNewslatter = await NewsLatter.findByIdAndDelete(id);
  return deletedNewslatter;
};

/**
 * Service function to retrieve a single newslatter by ID.
 *
 * @param {IdOrIdsInput['id']} id - The ID of the newslatter to retrieve.
 * @returns {Promise<Partial<INewslatter>>} - The retrieved newslatter.
 */
const getNewslatterById = async (id: IdOrIdsInput['id']): Promise<Partial<Inewslatter | null>> => {
  const newslatter = await NewsLatter.findById(id);
  return newslatter;
};

/**
 * Service function to retrieve multiple newslatter based on query parameters.
 *
 * @param {SearchQueryInput} query - The query parameters for filtering newslatter.
 * @returns {Promise<Partial<INewslatter>[]>} - The retrieved newslatter
 */
const getManyNewslatter = async (
  query: SearchQueryInput
): Promise<{ newslatters: Partial<Inewslatter>[]; totalData: number; totalPages: number }> => {
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
  // Find the total count of matching newslatter
  const totalData = await NewsLatter.countDocuments(searchFilter);
  // Calculate the total number of pages
  const totalPages = Math.ceil(totalData / showPerPage);
  // Find newslatters based on the search filter with pagination
  const newslatters = await NewsLatter.find(searchFilter)
    .skip(skipItems)
    .limit(showPerPage)
    .select(''); // Keep/Exclude any field if needed
  return { newslatters, totalData, totalPages };
};

export const newslatterServices = {
  createNewslatter,
  updateNewslatter,
  deleteNewslatter,
  getNewslatterById,
  getManyNewslatter,
};
