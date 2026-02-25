import { Request, Response } from 'express';
import { picksServices } from './picks.service';
import { SearchQueryInput } from '../../handlers/common-zod-validator';
import ServerResponse from '../../helpers/responses/custom-response';
import catchAsync from '../../utils/catch-async/catch-async';

/**
 * Controller function to handle the creation of a single picks.
 *
 * @param {Request} req - The request object containing picks data in the body.
 * @param {Response} res - The response object used to send the response.
 * @returns {Promise<Partial<IPicks>>} - The created picks.
 * @throws {Error} - Throws an error if the picks creation fails.
 */
export const createPicks = catchAsync(async (req: Request, res: Response) => {
  // Call the service method to create a new picks and get the result

  /**
   * Note: The service method is expected to return the created picks data. If the creation fails, it should return null or undefined, which will trigger the error handling in this controller.
   * The controller then sends a success response with the created picks data if the creation is successful.
   * This pattern of error handling and response sending is consistent across all controller functions in this module, ensuring a standardized API response structure.
   *
   */

  // Call the service method to create a new picks and get the result

  // if

  const result = await picksServices.createPicks(req.body);
  if (!result) throw new Error('Failed to create picks');
  // Send a success response with the created picks data
  ServerResponse(res, true, 201, 'Picks created successfully', result);
});

/**
 * Controller function to handle the creation of multiple pickss.
 *
 * @param {Request} req - The request object containing an array of picks data in the body.
 * @param {Response} res - The response object used to send the response.
 * @returns {Promise<Partial<IPicks>[]>} - The created pickss.
 * @throws {Error} - Throws an error if the pickss creation fails.
 */
// export const createManyPicks = catchAsync(async (req: Request, res: Response) => {
//   // Call the service method to create multiple pickss and get the result
//   const result = await picksServices.createManyPicks(req.body);
//   if (!result) throw new Error('Failed to create multiple pickss');
//   // Send a success response with the created pickss data
//   ServerResponse(res, true, 201, 'Pickss created successfully', result);
// });

/**
 * Controller function to handle the update operation for a single picks.
 *
 * @param {Request} req - The request object containing the ID of the picks to update in URL parameters and the updated data in the body.
 * @param {Response} res - The response object used to send the response.
 * @returns {Promise<Partial<IPicks>>} - The updated picks.
 * @throws {Error} - Throws an error if the picks update fails.
 */
export const updatePicks = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  // Call the service method to update the picks by ID and get the result
  const result = await picksServices.updatePicks(id as string, req.body);
  if (!result) throw new Error('Failed to update picks');
  // Send a success response with the updated picks data
  ServerResponse(res, true, 200, 'Picks updated successfully', result);
});

/**
 * Controller function to handle the deletion of a single picks.
 *
 * @param {Request} req - The request object containing the ID of the picks to delete in URL parameters.
 * @param {Response} res - The response object used to send the response.
 * @returns {Promise<Partial<IPicks>>} - The deleted picks.
 * @throws {Error} - Throws an error if the picks deletion fails.
 */
export const deletePicks = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  // Call the service method to delete the picks by ID
  const result = await picksServices.deletePicks(id as string);
  if (!result) throw new Error('Failed to delete picks');
  // Send a success response confirming the deletion
  ServerResponse(res, true, 200, 'Picks deleted successfully');
});

/**
 * Controller function to handle the deletion of multiple pickss.
 *
 * @param {Request} req - The request object containing an array of IDs of picks to delete in the body.
 * @param {Response} res - The response object used to send the response.
 * @returns {Promise<Partial<IPicks>[]>} - The deleted pickss.
 * @throws {Error} - Throws an error if the picks deletion fails.
 */
export const deleteManyPicks = catchAsync(async (req: Request, res: Response) => {
  // Extract ids from request body
  const { ids } = req.body;
  // Call the service method to delete multiple pickss and get the result
  const result = await picksServices.deleteManyPicks(ids);
  if (!result) throw new Error('Failed to delete multiple pickss');
  // Send a success response confirming the deletions
  ServerResponse(res, true, 200, 'Pickss deleted successfully');
});

/**
 * Controller function to handle the retrieval of a single picks by ID.
 *
 * @param {Request} req - The request object containing the ID of the picks to retrieve in URL parameters.
 * @param {Response} res - The response object used to send the response.
 * @returns {Promise<Partial<IPicks>>} - The retrieved picks.
 * @throws {Error} - Throws an error if the picks retrieval fails.
 */
export const getPicksById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  // Call the service method to get the picks by ID and get the result
  const result = await picksServices.getPicksById(id as string);
  if (!result) throw new Error('Picks not found');
  // Send a success response with the retrieved resource data
  ServerResponse(res, true, 200, 'Picks retrieved successfully', result);
});

/**
 * Controller function to handle the retrieval of multiple pickss.
 *
 * @param {Request} req - The request object containing query parameters for filtering.
 * @param {Response} res - The response object used to send the response.
 * @returns {Promise<Partial<IPicks>[]>} - The retrieved pickss.
 * @throws {Error} - Throws an error if the pickss retrieval fails.
 */
export const getManyPicks = catchAsync(async (req: Request, res: Response) => {
  // Type assertion for query parameters
  const query = req.query as SearchQueryInput;
  // Call the service method to get multiple pickss based on query parameters and get the result
  const { pickss, totalData, totalPages } = await picksServices.getManyPicks(query);
  if (!pickss) throw new Error('Failed to retrieve pickss');
  // Send a success response with the retrieved pickss data
  ServerResponse(res, true, 200, 'Pickss retrieved successfully', {
    pickss,
    totalData,
    totalPages,
  });
});
