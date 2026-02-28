import { Request, Response } from 'express';
import { subscriptionServices } from './subscription.service';
import { SearchQueryInput } from '../../handlers/common-zod-validator';
import ServerResponse from '../../helpers/responses/custom-response';
import catchAsync from '../../utils/catch-async/catch-async';

/**
 * Controller function to handle the creation of a single subscription.
 *
 * @param {Request} req - The request object containing subscription data in the body.
 * @param {Response} res - The response object used to send the response.
 * @returns {Promise<Partial<ISubscription>>} - The created subscription.
 * @throws {Error} - Throws an error if the subscription creation fails.
 */
export const createSubscription = catchAsync(async (req: Request, res: Response) => {
  // Call the service method to create a new subscription and get the result
  const result = await subscriptionServices.createSubscription(req.body);
  if (!result) throw new Error('Failed to create subscription');
  // Send a success response with the created subscription data
  ServerResponse(res, true, 201, 'Subscription created successfully', result);
});

/**
 * Controller function to handle the creation of multiple subscriptions.
 *
 * @param {Request} req - The request object containing an array of subscription data in the body.
 * @param {Response} res - The response object used to send the response.
 * @returns {Promise<Partial<ISubscription>[]>} - The created subscriptions.
 * @throws {Error} - Throws an error if the subscriptions creation fails.
 */
export const createManySubscription = catchAsync(async (req: Request, res: Response) => {
  // Call the service method to create multiple subscriptions and get the result
  const result = await subscriptionServices.createManySubscription(req.body);
  if (!result) throw new Error('Failed to create multiple subscriptions');
  // Send a success response with the created subscriptions data
  ServerResponse(res, true, 201, 'Subscriptions created successfully', result);
});

/**
 * Controller function to handle the update operation for a single subscription.
 *
 * @param {Request} req - The request object containing the ID of the subscription to update in URL parameters and the updated data in the body.
 * @param {Response} res - The response object used to send the response.
 * @returns {Promise<Partial<ISubscription>>} - The updated subscription.
 * @throws {Error} - Throws an error if the subscription update fails.
 */
export const updateSubscription = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  // Call the service method to update the subscription by ID and get the result
  const result = await subscriptionServices.updateSubscription(id as string, req.body);
  if (!result) throw new Error('Failed to update subscription');
  // Send a success response with the updated subscription data
  ServerResponse(res, true, 200, 'Subscription updated successfully', result);
});

/**
 * Controller function to handle the update operation for multiple subscriptions.
 *
 * @param {Request} req - The request object containing an array of subscription data in the body.
 * @param {Response} res - The response object used to send the response.
 * @returns {Promise<Partial<ISubscription>[]>} - The updated subscriptions.
 * @throws {Error} - Throws an error if the subscriptions update fails.
 */
export const updateManySubscription = catchAsync(async (req: Request, res: Response) => {
  // Call the service method to update multiple subscriptions and get the result
  const result = await subscriptionServices.updateManySubscription(req.body);
  if (!result.length) throw new Error('Failed to update multiple subscriptions');
  // Send a success response with the updated subscriptions data
  ServerResponse(res, true, 200, 'Subscriptions updated successfully', result);
});

/**
 * Controller function to handle the deletion of a single subscription.
 *
 * @param {Request} req - The request object containing the ID of the subscription to delete in URL parameters.
 * @param {Response} res - The response object used to send the response.
 * @returns {Promise<Partial<ISubscription>>} - The deleted subscription.
 * @throws {Error} - Throws an error if the subscription deletion fails.
 */
export const deleteSubscription = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  // Call the service method to delete the subscription by ID
  const result = await subscriptionServices.deleteSubscription(id as string);
  if (!result) throw new Error('Failed to delete subscription');
  // Send a success response confirming the deletion
  ServerResponse(res, true, 200, 'Subscription deleted successfully');
});

/**
 * Controller function to handle the deletion of multiple subscriptions.
 *
 * @param {Request} req - The request object containing an array of IDs of subscription to delete in the body.
 * @param {Response} res - The response object used to send the response.
 * @returns {Promise<Partial<ISubscription>[]>} - The deleted subscriptions.
 * @throws {Error} - Throws an error if the subscription deletion fails.
 */
export const deleteManySubscription = catchAsync(async (req: Request, res: Response) => {
  // Extract ids from request body
  const { ids } = req.body;
  // Call the service method to delete multiple subscriptions and get the result
  const result = await subscriptionServices.deleteManySubscription(ids);
  if (!result) throw new Error('Failed to delete multiple subscriptions');
  // Send a success response confirming the deletions
  ServerResponse(res, true, 200, 'Subscriptions deleted successfully');
});

/**
 * Controller function to handle the retrieval of a single subscription by ID.
 *
 * @param {Request} req - The request object containing the ID of the subscription to retrieve in URL parameters.
 * @param {Response} res - The response object used to send the response.
 * @returns {Promise<Partial<ISubscription>>} - The retrieved subscription.
 * @throws {Error} - Throws an error if the subscription retrieval fails.
 */
export const getSubscriptionById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  // Call the service method to get the subscription by ID and get the result
  const result = await subscriptionServices.getSubscriptionById(id as string);
  if (!result) throw new Error('Subscription not found');
  // Send a success response with the retrieved resource data
  ServerResponse(res, true, 200, 'Subscription retrieved successfully', result);
});

/**
 * Controller function to handle the retrieval of multiple subscriptions.
 *
 * @param {Request} req - The request object containing query parameters for filtering.
 * @param {Response} res - The response object used to send the response.
 * @returns {Promise<Partial<ISubscription>[]>} - The retrieved subscriptions.
 * @throws {Error} - Throws an error if the subscriptions retrieval fails.
 */
export const getManySubscription = catchAsync(async (req: Request, res: Response) => {
  // Type assertion for query parameters 
  const query = req.query as SearchQueryInput;
  // Call the service method to get multiple subscriptions based on query parameters and get the result
  const { subscriptions, totalData, totalPages } = await subscriptionServices.getManySubscription(query);
  if (!subscriptions) throw new Error('Failed to retrieve subscriptions');
  // Send a success response with the retrieved subscriptions data
  ServerResponse(res, true, 200, 'Subscriptions retrieved successfully', { subscriptions, totalData, totalPages });
});