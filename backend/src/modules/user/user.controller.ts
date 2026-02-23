import { Request, Response } from 'express';
import { AuthenticatedRequest } from 'src/middlewares/is-authorized';
import { SearchQueryInput } from '../../handlers/common-zod-validator';
import ServerResponse from '../../helpers/responses/custom-response';
import catchAsync from '../../utils/catch-async/catch-async';
import { userServices } from './user.service';

/**
 * Controller function to handle the creation of a single user.
 *
 * @param {Request} req - The request object containing user data in the body.
 * @param {Response} res - The response object used to send the response.
 * @returns {Promise<Partial<IUser>>} - The created user.
 * @throws {Error} - Throws an error if the user creation fails.
 */
export const createUser = catchAsync(async (req: Request, res: Response) => {
  // Call the service method to create a new user and get the result

  const result = await userServices.createUser(req.body);
  if (!result) throw new Error('Failed to create user');
  // Send a success response with the created user data
  ServerResponse(res, true, 201, 'User created successfully', result);
});

/**
 * Controller function to handle the update operation for a single user.
 *
 * @param {Request} req - The request object containing the ID of the user to update in URL parameters and the updated data in the body.
 * @param {Response} res - The response object used to send the response.
 * @returns {Promise<Partial<IUser>>} - The updated user.
 * @throws {Error} - Throws an error if the user update fails.
 */
export const updateUser = catchAsync(async (req: AuthenticatedRequest, res: Response) => {
  // Call the service method to update the user by ID and get the result
  const id = req.user!._id;
  console.log(id, 'id get successfully');
  const result = await userServices.updateUser(id as string, req.body);
  if (!result) throw new Error('Failed to update user');
  // Send a success response with the updated user data
  ServerResponse(res, true, 200, 'User updated successfully', result);
});

/**
 * Controller function to handle the deletion of a single user.
 *
 * @param {Request} req - The request object containing the ID of the user to delete in URL parameters.
 * @param {Response} res - The response object used to send the response.
 * @returns {Promise<Partial<IUser>>} - The deleted user.
 * @throws {Error} - Throws an error if the user deletion fails.
 */
export const deleteUser = catchAsync(async (req: AuthenticatedRequest, res: Response) => {
  const id = req.user!._id;
  // Call the service method to delete the user by ID
  const result = await userServices.deleteUser(id as string);
  if (!result) throw new Error('Failed to delete user');
  // Send a success response confirming the deletion
  ServerResponse(res, true, 200, 'User deleted successfully');
});

/**
 * Controller function to handle the retrieval of a single user by ID.
 *
 * @param {Request} req - The request object containing the ID of the user to retrieve in URL parameters.
 * @param {Response} res - The response object used to send the response.
 * @returns {Promise<Partial<IUser>>} - The retrieved user.
 * @throws {Error} - Throws an error if the user retrieval fails.
 */
export const getUserById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  // Call the service method to get the user by ID and get the result
  const result = await userServices.getUserById(id as string);
  if (!result) throw new Error('User not found');
  // Send a success response with the retrieved resource data
  ServerResponse(res, true, 200, 'User retrieved successfully', result);
});
export const getUserByAutorization = catchAsync(
  async (req: AuthenticatedRequest, res: Response) => {
    const id = req.user!._id;
    console.log(id, 'id get sucessfully');
    // Call the service method to get the user by ID and get the result
    const result = await userServices.getUserById(id as string);
    if (!result) throw new Error('User not found');
    // Send a success response with the retrieved resource data
    ServerResponse(res, true, 200, 'User retrieved successfully', result);
  }
);

/**
 * Controller function to handle the retrieval of multiple users.
 *
 * @param {Request} req - The request object containing query parameters for filtering.
 * @param {Response} res - The response object used to send the response.
 * @returns {Promise<Partial<IUser>[]>} - The retrieved users.
 * @throws {Error} - Throws an error if the users retrieval fails.
 */
export const getManyUser = catchAsync(async (req: Request, res: Response) => {
  // Type assertion for query parameters
  const query = req.query as SearchQueryInput;
  // Call the service method to get multiple users based on query parameters and get the result
  const { users, totalData, totalPages } = await userServices.getManyUser(query);
  if (!users) throw new Error('Failed to retrieve users');
  // Send a success response with the retrieved users data
  ServerResponse(res, true, 200, 'Users retrieved successfully', { users, totalData, totalPages });
});
