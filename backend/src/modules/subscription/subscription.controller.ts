import { Request, Response } from 'express';
import { AuthenticatedRequest } from '../../../src/middlewares/is-authorized';
import ServerResponse from '../../helpers/responses/custom-response';
import catchAsync from '../../utils/catch-async/catch-async';
import { subscriptionServices } from './subscription.service';

/**
 * Create a new subscription → returns Stripe paymentLink
 */
export const createSubscription = catchAsync(async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user!._id;
  req.body.userId = userId;
  const result = await subscriptionServices.createSubscription(req.body);
  ServerResponse(res, true, 201, 'Subscription created successfully', result);
});

/**
 * Get logged-in user's active subscription
 */
export const getUserActiveSubscription = catchAsync(async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user!._id.toString();
  const result = await subscriptionServices.getUserActiveSubscription(userId);
  ServerResponse(res, true, 200, 'Active subscription retrieved successfully', result);
});

/**
 * Get logged-in user's subscription history
 */
export const getUserSubscriptionHistory = catchAsync(async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user!._id.toString();
  const result = await subscriptionServices.getUserSubscriptionHistory(userId, req.query);
  ServerResponse(res, true, 200, 'Subscription history retrieved successfully', result);
});

/**
 * Cancel subscription
 */
export const cancelSubscription = catchAsync(async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user!._id.toString();
  const id = typeof req.params.id === 'string' ? req.params.id : req.params.id[0];
  const result = await subscriptionServices.cancelSubscription(id, userId);
  ServerResponse(res, true, 200, 'Subscription cancelled successfully', result);
});

/**
 * Update a subscription by ID
 */
export const updateSubscription = catchAsync(async (req: Request, res: Response) => {
  const id = typeof req.params.id === 'string' ? req.params.id : req.params.id[0];
  const result = await subscriptionServices.updateSubscription(id, req.body);
  if (!result) throw new Error('Failed to update subscription');
  ServerResponse(res, true, 200, 'Subscription updated successfully', result);
});

/**
 * Stripe webhook handler
 */
export const webhook = catchAsync(async (req: Request, res: Response) => {
  await subscriptionServices.webHook(req);
  res.status(200).json({ received: true });
});

/**
 * Delete a single subscription by ID
 */
export const deleteSubscription = catchAsync(async (req: Request, res: Response) => {
  const id = typeof req.params.id === 'string' ? req.params.id : req.params.id[0];
  const result = await subscriptionServices.deleteSubscription(id);
  if (!result) throw new Error('Failed to delete subscription');
  ServerResponse(res, true, 200, 'Subscription deleted successfully');
});

/**
 * Delete multiple subscriptions
 */
export const deleteManySubscription = catchAsync(async (req: Request, res: Response) => {
  const { ids } = req.body;
  const result = await subscriptionServices.deleteManySubscription(ids);
  ServerResponse(res, true, 200, 'Subscriptions deleted successfully');
});

/**
 * Get a subscription by ID
 */
export const getSubscriptionById = catchAsync(async (req: Request, res: Response) => {
  const id = typeof req.params.id === 'string' ? req.params.id : req.params.id[0];
  const result = await subscriptionServices.getSubscriptionById(id);
  if (!result) throw new Error('Subscription not found');
  ServerResponse(res, true, 200, 'Subscription retrieved successfully', result);
});

/**
 * Get many subscriptions (admin)
 */
export const getManySubscription = catchAsync(async (req: Request, res: Response) => {
  const result = await subscriptionServices.getManySubscription(req.query);
  ServerResponse(res, true, 200, 'Subscriptions retrieved successfully', result);
});