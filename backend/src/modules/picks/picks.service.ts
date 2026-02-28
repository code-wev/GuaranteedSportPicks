// Import the model
import mongoose from 'mongoose';
import { IdOrIdsInput, SearchQueryInput } from '../../handlers/common-zod-validator';
import { CreatePicksInput, UpdatePicksInput } from './picks.validation';
import Picks, { IPicks } from '../../../src/model/pick/picks.model';

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

export const picksServices = {
  createPicks,
  updatePicks,
  deletePicks,
  deleteManyPicks,
  getPicksById,
  getManyPicks,
};
