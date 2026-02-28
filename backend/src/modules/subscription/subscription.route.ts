// Import Router from express
import { Router } from 'express';

// Import controller from corresponding module
import { 
  createSubscription,
  createManySubscription,
  updateSubscription,
  updateManySubscription,
  deleteSubscription,
  deleteManySubscription,
  getSubscriptionById,
  getManySubscription
} from './subscription.controller';

//Import validation from corresponding module
import { validateCreateSubscription, validateCreateManySubscription, validateUpdateSubscription, validateUpdateManySubscription} from './subscription.validation';
import { validateId, validateIds, validateSearchQueries } from '../../handlers/common-zod-validator';

// Initialize router
const router = Router();

// Define route handlers
/**
 * @route POST /api/v1/subscription/create-subscription
 * @description Create a new subscription
 * @access Public
 * @param {function} validation - ['validateCreateSubscription']
 * @param {function} controller - ['createSubscription']
 */
router.post("/create-subscription", validateCreateSubscription, createSubscription);

/**
 * @route POST /api/v1/subscription/create-subscription/many
 * @description Create multiple subscriptions
 * @access Public
 * @param {function} validation - ['validateCreateManySubscription']
 * @param {function} controller - ['createManySubscription']
 */
router.post("/create-subscription/many", validateCreateManySubscription, createManySubscription);

/**
 * @route PUT /api/v1/subscription/update-subscription/many
 * @description Update multiple subscriptions information
 * @access Public
 * @param {function} validation - ['validateIds', 'validateUpdateManySubscription']
 * @param {function} controller - ['updateManySubscription']
 */
router.put("/update-subscription/many", validateIds, validateUpdateManySubscription, updateManySubscription);

/**
 * @route PUT /api/v1/subscription/update-subscription/:id
 * @description Update subscription information
 * @access Public
 * @param {IdOrIdsInput['id']} id - The ID of the subscription to update
 * @param {function} validation - ['validateId', 'validateUpdateSubscription']
 * @param {function} controller - ['updateSubscription']
 */
router.put("/update-subscription/:id", validateId, validateUpdateSubscription, updateSubscription);

/**
 * @route DELETE /api/v1/subscription/delete-subscription/many
 * @description Delete multiple subscriptions
 * @access Public
 * @param {function} validation - ['validateIds']
 * @param {function} controller - ['deleteManySubscription']
 */
router.delete("/delete-subscription/many", validateIds, deleteManySubscription);

/**
 * @route DELETE /api/v1/subscription/delete-subscription/:id
 * @description Delete a subscription
 * @access Public
 * @param {IdOrIdsInput['id']} id - The ID of the subscription to delete
 * @param {function} validation - ['validateId']
 * @param {function} controller - ['deleteSubscription']
 */
router.delete("/delete-subscription/:id", validateId, deleteSubscription);

/**
 * @route GET /api/v1/subscription/get-subscription/many
 * @description Get multiple subscriptions
 * @access Public
 * @param {function} validation - ['validateSearchQueries']
 * @param {function} controller - ['getManySubscription']
 */
router.get("/get-subscription/many", validateSearchQueries, getManySubscription);

/**
 * @route GET /api/v1/subscription/get-subscription/:id
 * @description Get a subscription by ID
 * @access Public
 * @param {IdOrIdsInput['id']} id - The ID of the subscription to retrieve
 * @param {function} validation - ['validateId']
 * @param {function} controller - ['getSubscriptionById']
 */
router.get("/get-subscription/:id", validateId, getSubscriptionById);

// Export the router
module.exports = router;