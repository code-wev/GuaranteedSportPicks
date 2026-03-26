import { Router } from 'express';
import authorizedRoles from '../../../src/middlewares/authorized-roles';
import isAuthorized from '../../../src/middlewares/is-authorized';
import { UserRole } from '../../../src/model/user/user.schema';
import { validateId, validateSearchQueries } from '../../handlers/common-zod-validator';

import { validateCreateSubscription, validateUpdateSubscription } from './subscription.validation';
import { cancelSubscription, createSubscription, deleteManySubscription, deleteSubscription, getManySubscription, getSubscriptionById, getUserActiveSubscription, getUserSubscriptionHistory, updateSubscription, webhook } from './subscription.controller';

const router = Router();

// Simple test route
router.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

/**
 * Webhook route (no auth required)
 */
router.post(['/webhook', '/subscription/webhook'], webhook);

/**
 * Authenticated user routes
 */
router.post(
  ['/', '/subscription'],
  isAuthorized,
  authorizedRoles([UserRole.USER]),
  validateCreateSubscription,
  createSubscription
);

router.get(
  ['/my-active', '/subscription/my-active'],
  isAuthorized,
  authorizedRoles([UserRole.USER]),
  getUserActiveSubscription
);

router.get(
  ['/my-history', '/subscription/my-history'],
  isAuthorized,
  authorizedRoles([UserRole.USER]),
  validateSearchQueries,
  getUserSubscriptionHistory
);

router.post(
  ['/:id/cancel', '/subscription/:id/cancel'],
  isAuthorized,
  authorizedRoles([UserRole.USER]),
  validateId,
  cancelSubscription
);

/**
 * Admin routes
 */
router.get(
  ['/admin/all', '/subscription/admin/all'],
  isAuthorized,
  authorizedRoles([UserRole.ADMIN]),
  validateSearchQueries,
  getManySubscription
);

router.get(
  ['/:id', '/subscription/:id'],
  isAuthorized,
  authorizedRoles([UserRole.ADMIN, UserRole.USER]),
  validateId,
  getSubscriptionById
);

router.put(
  ['/:id', '/subscription/:id'],
  isAuthorized,
  authorizedRoles([UserRole.ADMIN]),
  validateId,
  validateUpdateSubscription,
  updateSubscription
);

router.delete(
  ['/:id', '/subscription/:id'],
  isAuthorized,
  authorizedRoles([UserRole.ADMIN]),
  validateId,
  deleteSubscription
);

router.delete(
  ['/', '/subscription'],
  isAuthorized,
  authorizedRoles([UserRole.ADMIN]),
  deleteManySubscription
);

export default router;
