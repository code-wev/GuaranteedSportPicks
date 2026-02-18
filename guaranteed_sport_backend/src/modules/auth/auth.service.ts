// Import the model
import mongoose from 'mongoose';
import AuthModel, { IAuth } from './auth.model';
import { IdOrIdsInput, SearchQueryInput } from '../../handlers/common-zod-validator';
import {
  CreateAuthInput,
  CreateManyAuthInput,
  UpdateAuthInput,
  UpdateManyAuthInput,
} from './auth.validation';

/**
 * Service function to create a new auth.
 *
 * @param {CreateAuthInput} data - The data to create a new auth.
 * @returns {Promise<Partial<IAuth>>} - The created auth.
 */
const createAuth = async (data: CreateAuthInput): Promise<Partial<IAuth>> => {
  const newAuth = new AuthModel(data);
  const savedAuth = await newAuth.save();
  return savedAuth;
};

/**
 * Service function to create multiple auth.
 *
 * @param {CreateManyAuthInput} data - An array of data to create multiple auth.
 * @returns {Promise<Partial<IAuth>[]>} - The created auth.
 */
const createManyAuth = async (data: CreateManyAuthInput): Promise<Partial<IAuth>[]> => {
  const createdAuth = await AuthModel.insertMany(data);
  return createdAuth;
};

/**
 * Service function to update a single auth by ID.
 *
 * @param {IdOrIdsInput['id']} id - The ID of the auth to update.
 * @param {UpdateAuthInput} data - The updated data for the auth.
 * @returns {Promise<Partial<IAuth>>} - The updated auth.
 */
const updateAuth = async (id: IdOrIdsInput['id'], data: UpdateAuthInput): Promise<Partial<IAuth | null>> => {
  // Check for duplicate (filed) combination
  const existingAuth = await AuthModel.findOne({
    _id: { $ne: id }, // Exclude the current document
    $or: [{ /* filedName: data.filedName, */ }],
  }).lean();
  // Prevent duplicate updates
  if (existingAuth) {
    throw new Error('Duplicate detected: Another auth with the same fieldName already exists.');
  }
  // Proceed to update the auth
  const updatedAuth = await AuthModel.findByIdAndUpdate(id, data, { new: true });
  return updatedAuth;
};

/**
 * Service function to update multiple auth.
 *
 * @param {UpdateManyAuthInput} data - An array of data to update multiple auth.
 * @returns {Promise<Partial<IAuth>[]>} - The updated auth.
 */
const updateManyAuth = async (data: UpdateManyAuthInput): Promise<Partial<IAuth>[]> => {
// Early return if no data provided
  if (data.length === 0) {
    return [];
  }
  // Convert string ids to ObjectId (for safety)
  const objectIds = data.map((item) => new mongoose.Types.ObjectId(item.id));
  // Check for duplicates (filedName) excluding the documents being updated
  const existingAuth = await AuthModel.find({
    _id: { $nin: objectIds }, // Exclude documents being updated
    $or: data.flatMap((item) => [
      // { filedName: item.filedName },
    ]),
  }).lean();
  // If any duplicates found, throw error
  if (existingAuth.length > 0) {
    throw new Error(
      'Duplicate detected: One or more auth with the same fieldName already exist.'
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
  const bulkResult = await AuthModel.bulkWrite(operations, {
    ordered: true, // keep order of operations
  });
  // check if all succeeded
  if (bulkResult.matchedCount !== data.length) {
    throw new Error('Some documents were not found or updated');
  }
  // Fetch the freshly updated documents
  const updatedDocs = await AuthModel.find({ _id: { $in: objectIds } })
    .lean()
    .exec();
  // Map back to original input order
  const resultMap = new Map<string, any>(updatedDocs.map((doc) => [doc._id.toString(), doc]));
  // Ensure the result array matches the input order
  const orderedResults = data.map((item) => {
    const updated = resultMap.get(item.id);
    return updated || { _id: item.id };
  });
  return orderedResults as Partial<IAuth>[];
};

/**
 * Service function to delete a single auth by ID.
 *
 * @param {IdOrIdsInput['id']} id - The ID of the auth to delete.
 * @returns {Promise<Partial<IAuth>>} - The deleted auth.
 */
const deleteAuth = async (id: IdOrIdsInput['id']): Promise<Partial<IAuth | null>> => {
  const deletedAuth = await AuthModel.findByIdAndDelete(id);
  return deletedAuth;
};

/**
 * Service function to delete multiple auth.
 *
 * @param {IdOrIdsInput['ids']} ids - An array of IDs of auth to delete.
 * @returns {Promise<Partial<IAuth>[]>} - The deleted auth.
 */
const deleteManyAuth = async (ids: IdOrIdsInput['ids']): Promise<Partial<IAuth>[]> => {
  const authToDelete = await AuthModel.find({ _id: { $in: ids } });
  if (!authToDelete.length) throw new Error('No auth found to delete');
  await AuthModel.deleteMany({ _id: { $in: ids } });
  return authToDelete; 
};

/**
 * Service function to retrieve a single auth by ID.
 *
 * @param {IdOrIdsInput['id']} id - The ID of the auth to retrieve.
 * @returns {Promise<Partial<IAuth>>} - The retrieved auth.
 */
const getAuthById = async (id: IdOrIdsInput['id']): Promise<Partial<IAuth | null>> => {
  const auth = await AuthModel.findById(id);
  return auth;
};

/**
 * Service function to retrieve multiple auth based on query parameters.
 *
 * @param {SearchQueryInput} query - The query parameters for filtering auth.
 * @returns {Promise<Partial<IAuth>[]>} - The retrieved auth
 */
const getManyAuth = async (query: SearchQueryInput): Promise<{ auths: Partial<IAuth>[]; totalData: number; totalPages: number }> => {
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
  // Find the total count of matching auth
  const totalData = await AuthModel.countDocuments(searchFilter);
  // Calculate the total number of pages
  const totalPages = Math.ceil(totalData / showPerPage);
  // Find auths based on the search filter with pagination
  const auths = await AuthModel.find(searchFilter)
    .skip(skipItems)
    .limit(showPerPage)
    .select(''); // Keep/Exclude any field if needed
  return { auths, totalData, totalPages };
};

export const authServices = {
  createAuth,
  createManyAuth,
  updateAuth,
  updateManyAuth,
  deleteAuth,
  deleteManyAuth,
  getAuthById,
  getManyAuth,
};