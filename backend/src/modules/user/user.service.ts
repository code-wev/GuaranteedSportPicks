// Import the model

import { IdOrIdsInput, SearchQueryInput } from '../../handlers/common-zod-validator';
import User, { IUser } from '../../model/user/user.schema';
import { CreateUserInput, UpdateUserInput } from './user.validation';

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
  // Find the total count of matching user
  const totalData = await User.countDocuments(searchFilter);
  // Calculate the total number of pages
  const totalPages = Math.ceil(totalData / showPerPage);
  // Find users based on the search filter with pagination
  const users = await User.find(searchFilter).skip(skipItems).limit(showPerPage).select(''); // Keep/Exclude any field if needed
  return { users, totalData, totalPages };
};

export const userServices = {
  createUser,
  updateUser,
  deleteUser,
  getUserById,
  getManyUser,
};
