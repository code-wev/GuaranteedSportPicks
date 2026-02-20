// Import the model
import mongoose from 'mongoose';
import { IdOrIdsInput, SearchQueryInput } from '../../handlers/common-zod-validator';
import {
  CreatePicksInput,
  CreateManyPicksInput,
  UpdatePicksInput,
  UpdateManyPicksInput,
} from './picks.validation';
import Picks, { IPicks } from '../../../src/model/pick/picks.model';

/**
 * Service function to create a new picks.
 *
 * @param {CreatePicksInput} data - The data to create a new picks.
 * @returns {Promise<Partial<IPicks>>} - The created picks.
 */
const createPicks = async (data: CreatePicksInput): Promise<Partial<IPicks>> => {
  const newPicks = new Picks(data);
  const savedPicks = await newPicks.save();
  return savedPicks;
};

/**
 * Service function to create multiple picks.
 *
 * @param {CreateManyPicksInput} data - An array of data to create multiple picks.
 * @returns {Promise<Partial<IPicks>[]>} - The created picks.
 */
const createManyPicks = async (data: CreateManyPicksInput): Promise<Partial<IPicks>[]> => {
  const createdPicks = await Picks.insertMany(data);
  return createdPicks;
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
  const existingPicks = await Picks.findOne({
    _id: { $ne: id }, // Exclude the current document
    $or: [
      {
        /* filedName: data.filedName, */
      },
    ],
  }).lean();
  // Prevent duplicate updates
  if (existingPicks) {
    throw new Error('Duplicate detected: Another picks with the same fieldName already exists.');
  }
  // Proceed to update the picks
  const updatedPicks = await Picks.findByIdAndUpdate(id, data, { new: true });
  return updatedPicks;
};

/**
 * Service function to update multiple picks.
 *
 * @param {UpdateManyPicksInput} data - An array of data to update multiple picks.
 * @returns {Promise<Partial<IPicks>[]>} - The updated picks.
 */
const updateManyPicks = async (data: UpdateManyPicksInput): Promise<Partial<IPicks>[]> => {
  // Early return if no data provided
  if (data.length === 0) {
    return [];
  }
  // Convert string ids to ObjectId (for safety)
  const objectIds = data.map((item) => new mongoose.Types.ObjectId(item.id));
  // Check for duplicates (filedName) excluding the documents being updated
  const existingPicks = await Picks.find({
    _id: { $nin: objectIds }, // Exclude documents being updated
    $or: data.flatMap((item) => [
      // { filedName: item.filedName },
    ]),
  }).lean();
  // If any duplicates found, throw error
  if (existingPicks.length > 0) {
    throw new Error('Duplicate detected: One or more picks with the same fieldName already exist.');
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
  const bulkResult = await Picks.bulkWrite(operations, {
    ordered: true, // keep order of operations
  });
  // check if all succeeded
  if (bulkResult.matchedCount !== data.length) {
    throw new Error('Some documents were not found or updated');
  }
  // Fetch the freshly updated documents
  const updatedDocs = await Picks.find({ _id: { $in: objectIds } })
    .lean()
    .exec();
  // Map back to original input order
  const resultMap = new Map<string, any>(updatedDocs.map((doc) => [doc._id.toString(), doc]));
  // Ensure the result array matches the input order
  const orderedResults = data.map((item) => {
    const updated = resultMap.get(item.id);
    return updated || { _id: item.id };
  });
  return orderedResults as Partial<IPicks>[];
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
): Promise<{ pickss: Partial<IPicks>[]; totalData: number; totalPages: number }> => {
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
  // Find the total count of matching picks
  const totalData = await Picks.countDocuments(searchFilter);
  // Calculate the total number of pages
  const totalPages = Math.ceil(totalData / showPerPage);
  // Find pickss based on the search filter with pagination
  const pickss = await Picks.find(searchFilter).skip(skipItems).limit(showPerPage).select(''); // Keep/Exclude any field if needed
  return { pickss, totalData, totalPages };
};

export const picksServices = {
  createPicks,
  createManyPicks,
  updatePicks,
  updateManyPicks,
  deletePicks,
  deleteManyPicks,
  getPicksById,
  getManyPicks,
};

