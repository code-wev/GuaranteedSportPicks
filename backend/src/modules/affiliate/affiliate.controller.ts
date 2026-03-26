import { Request, Response } from 'express';
import { AuthenticatedRequest } from 'src/middlewares/is-authorized';
import { SearchQueryInput } from '../../handlers/common-zod-validator';
import ServerResponse from '../../helpers/responses/custom-response';
import catchAsync from '../../utils/catch-async/catch-async';
import { affiliateServices } from './affiliate.service';

/**
 * Controller function to handle the creation of a single affiliate.
 *
 * @param {Request} req - The request object containing affiliate data in the body.
 * @param {Response} res - The response object used to send the response.
 * @returns {Promise<Partial<IAffiliate>>} - The created affiliate.
 * @throws {Error} - Throws an error if the affiliate creation fails.
 */
export const createAffiliate = catchAsync(async (req: AuthenticatedRequest, res: Response) => {
  // get the User Id from Requiest body (assuming it's sent in the request body, adjust if it's in headers or elsewhere)

  const userId = req.user!._id;
  console.log(userId, 'yes id reciave');
  req.body.userId = userId; // Ensure userId is included in the body for service layer processing

  // Call the service method to create a new affiliate and get the result
  const result = await affiliateServices.createAffiliate(req.body);
  if (!result) throw new Error('Failed to create affiliate');
  // Send a success response with the created affiliate data
  ServerResponse(res, true, 201, 'Affiliate created successfully', result);
});

/**
 * Controller function to handle the update operation for a single affiliate.
 *
 * @param {Request} req - The request object containing the ID of the affiliate to update in URL parameters and the updated data in the body.
 * @param {Response} res - The response object used to send the response.
 * @returns {Promise<Partial<IAffiliate>>} - The updated affiliate.
 * @throws {Error} - Throws an error if the affiliate update fails.
 */
export const updateAffiliate = catchAsync(async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  // Call the service method to update the affiliate by ID and get the result
  const userRole = req.user!.role;
  req.body.userRole = userRole;
  const result = await affiliateServices.updateAffiliate(id as string, req.body);
  if (!result) throw new Error('Failed to update affiliate');
  // Send a success response with the updated affiliate data
  ServerResponse(res, true, 200, 'Affiliate updated successfully', result);
});

/**
 * Controller function to handle the deletion of a single affiliate.
 *
 * @param {Request} req - The request object containing the ID of the affiliate to delete in URL parameters.
 * @param {Response} res - The response object used to send the response.
 * @returns {Promise<Partial<IAffiliate>>} - The deleted affiliate.
 * @throws {Error} - Throws an error if the affiliate deletion fails.
 */
export const deleteAffiliate = catchAsync(async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const userRole = req.user!.role;
  req.body.userRole = userRole;
  // Call the service method to delete the affiliate by ID
  const result = await affiliateServices.deleteAffiliate(id as string);
  if (!result) throw new Error('Failed to delete affiliate');
  // Send a success response confirming the deletion
  ServerResponse(res, true, 200, 'Affiliate deleted successfully');
});

/**
 * Controller function to handle the deletion of multiple affiliates.
 *
 * @param {Request} req - The request object containing an array of IDs of affiliate to delete in the body.
 * @param {Response} res - The response object used to send the response.
 * @returns {Promise<Partial<IAffiliate>[]>} - The deleted affiliates.
 * @throws {Error} - Throws an error if the affiliate deletion fails.
 */
export const deleteManyAffiliate = catchAsync(async (req: Request, res: Response) => {
  // Extract ids from request body
  const { ids } = req.body;
  // Call the service method to delete multiple affiliates and get the result
  const result = await affiliateServices.deleteManyAffiliate(ids);
  if (!result) throw new Error('Failed to delete multiple affiliates');
  // Send a success response confirming the deletions
  ServerResponse(res, true, 200, 'Affiliates deleted successfully');
});

/**
 * Controller function to handle the retrieval of a single affiliate by ID.
 *
 * @param {Request} req - The request object containing the ID of the affiliate to retrieve in URL parameters.
 * @param {Response} res - The response object used to send the response.
 * @returns {Promise<Partial<IAffiliate>>} - The retrieved affiliate.
 * @throws {Error} - Throws an error if the affiliate retrieval fails.
 */
export const getAffiliateById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  // Call the service method to get the affiliate by ID and get the result
  const result = await affiliateServices.getAffiliateById(id as string);
  if (!result) throw new Error('Affiliate not found');
  // Send a success response with the retrieved resource data
  ServerResponse(res, true, 200, 'Affiliate retrieved successfully', result);
});

/**
 * Controller function to handle the retrieval of multiple affiliates.
 *
 * @param {Request} req - The request object containing query parameters for filtering.
 * @param {Response} res - The response object used to send the response.
 * @returns {Promise<Partial<IAffiliate>[]>} - The retrieved affiliates.
 * @throws {Error} - Throws an error if the affiliates retrieval fails.
 */
export const getManyAffiliate = catchAsync(async (req: Request, res: Response) => {
  // Type assertion for query parameters
  const query = req.query as SearchQueryInput;
  // Call the service method to get multiple affiliates based on query parameters and get the result
  const { affiliates, totalData, totalPages } = await affiliateServices.getManyAffiliate(query);
  if (!affiliates) throw new Error('Failed to retrieve affiliates');
  // Send a success response with the retrieved affiliates data
  ServerResponse(res, true, 200, 'Affiliates retrieved successfully', {
    affiliates,
    totalData,
    totalPages,
  });
});

