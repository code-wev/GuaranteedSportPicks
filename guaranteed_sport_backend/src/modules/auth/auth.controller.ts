import { Request, Response } from 'express';
import { authServices } from './auth.service';
import { SearchQueryInput } from '../../handlers/common-zod-validator';
import ServerResponse from '../../helpers/responses/custom-response';
import catchAsync from '../../utils/catch-async/catch-async';

/**
 * Controller function to handle the creation of a single auth.
 *
 * @param {Request} req - The request object containing auth data in the body.
 * @param {Response} res - The response object used to send the response.
 * @returns {Promise<Partial<IAuth>>} - The created auth.
 * @throws {Error} - Throws an error if the auth creation fails.
 */
export const createAuth = catchAsync(async (req: Request, res: Response) => {
  // Call the service method to create a new auth and get the result
  const result = await authServices.createAuth(req.body);
  if (!result) throw new Error('Failed to create auth');
  // Send a success response with the created auth data
  ServerResponse(res, true, 201, 'Auth created successfully', result);
});

/**
 * Controller function to handle the creation of multiple auths.
 *
 * @param {Request} req - The request object containing an array of auth data in the body.
 * @param {Response} res - The response object used to send the response.
 * @returns {Promise<Partial<IAuth>[]>} - The created auths.
 * @throws {Error} - Throws an error if the auths creation fails.
 */
export const createManyAuth = catchAsync(async (req: Request, res: Response) => {
  // Call the service method to create multiple auths and get the result
  const result = await authServices.createManyAuth(req.body);
  if (!result) throw new Error('Failed to create multiple auths');
  // Send a success response with the created auths data
  ServerResponse(res, true, 201, 'Auths created successfully', result);
});

/**
 * Controller function to handle the update operation for a single auth.
 *
 * @param {Request} req - The request object containing the ID of the auth to update in URL parameters and the updated data in the body.
 * @param {Response} res - The response object used to send the response.
 * @returns {Promise<Partial<IAuth>>} - The updated auth.
 * @throws {Error} - Throws an error if the auth update fails.
 */
export const updateAuth = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  // Call the service method to update the auth by ID and get the result
  const result = await authServices.updateAuth(id as string, req.body);
  if (!result) throw new Error('Failed to update auth');
  // Send a success response with the updated auth data
  ServerResponse(res, true, 200, 'Auth updated successfully', result);
});

/**
 * Controller function to handle the update operation for multiple auths.
 *
 * @param {Request} req - The request object containing an array of auth data in the body.
 * @param {Response} res - The response object used to send the response.
 * @returns {Promise<Partial<IAuth>[]>} - The updated auths.
 * @throws {Error} - Throws an error if the auths update fails.
 */
export const updateManyAuth = catchAsync(async (req: Request, res: Response) => {
  // Call the service method to update multiple auths and get the result
  const result = await authServices.updateManyAuth(req.body);
  if (!result.length) throw new Error('Failed to update multiple auths');
  // Send a success response with the updated auths data
  ServerResponse(res, true, 200, 'Auths updated successfully', result);
});

/**
 * Controller function to handle the deletion of a single auth.
 *
 * @param {Request} req - The request object containing the ID of the auth to delete in URL parameters.
 * @param {Response} res - The response object used to send the response.
 * @returns {Promise<Partial<IAuth>>} - The deleted auth.
 * @throws {Error} - Throws an error if the auth deletion fails.
 */
export const deleteAuth = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  // Call the service method to delete the auth by ID
  const result = await authServices.deleteAuth(id as string);
  if (!result) throw new Error('Failed to delete auth');
  // Send a success response confirming the deletion
  ServerResponse(res, true, 200, 'Auth deleted successfully');
});

/**
 * Controller function to handle the deletion of multiple auths.
 *
 * @param {Request} req - The request object containing an array of IDs of auth to delete in the body.
 * @param {Response} res - The response object used to send the response.
 * @returns {Promise<Partial<IAuth>[]>} - The deleted auths.
 * @throws {Error} - Throws an error if the auth deletion fails.
 */
export const deleteManyAuth = catchAsync(async (req: Request, res: Response) => {
  // Extract ids from request body
  const { ids } = req.body;
  // Call the service method to delete multiple auths and get the result
  const result = await authServices.deleteManyAuth(ids);
  if (!result) throw new Error('Failed to delete multiple auths');
  // Send a success response confirming the deletions
  ServerResponse(res, true, 200, 'Auths deleted successfully');
});

/**
 * Controller function to handle the retrieval of a single auth by ID.
 *
 * @param {Request} req - The request object containing the ID of the auth to retrieve in URL parameters.
 * @param {Response} res - The response object used to send the response.
 * @returns {Promise<Partial<IAuth>>} - The retrieved auth.
 * @throws {Error} - Throws an error if the auth retrieval fails.
 */
export const getAuthById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  // Call the service method to get the auth by ID and get the result
  const result = await authServices.getAuthById(id as string);
  if (!result) throw new Error('Auth not found');
  // Send a success response with the retrieved resource data
  ServerResponse(res, true, 200, 'Auth retrieved successfully', result);
});

/**
 * Controller function to handle the retrieval of multiple auths.
 *
 * @param {Request} req - The request object containing query parameters for filtering.
 * @param {Response} res - The response object used to send the response.
 * @returns {Promise<Partial<IAuth>[]>} - The retrieved auths.
 * @throws {Error} - Throws an error if the auths retrieval fails.
 */
export const getManyAuth = catchAsync(async (req: Request, res: Response) => {
  // Type assertion for query parameters 
  const query = req.query as SearchQueryInput;
  // Call the service method to get multiple auths based on query parameters and get the result
  const { auths, totalData, totalPages } = await authServices.getManyAuth(query);
  if (!auths) throw new Error('Failed to retrieve auths');
  // Send a success response with the retrieved auths data
  ServerResponse(res, true, 200, 'Auths retrieved successfully', { auths, totalData, totalPages });
});