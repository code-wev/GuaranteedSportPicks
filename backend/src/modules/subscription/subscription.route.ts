// Import Router from express
import { Router } from 'express';

// Import controller from corresponding module
import { 
  createSubscription,
  updateSubscription,
  deleteSubscription,
  getSubscriptionById,
  getManySubscription
} from './subscription.controller';

//Import validation from corresponding module
import { validateCreateSubscription, validateUpdateSubscription} from './subscription.validation';
import { validateId,  validateSearchQueries } from '../../handlers/common-zod-validator';
import isAuthorized from '../../../src/middlewares/is-authorized';
import authorizedRoles from '../../../src/middlewares/authorized-roles';
import { UserRole } from '../../../src/model/user/user.schema';

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
router.post("/", isAuthorized,authorizedRoles([UserRole.USER]), validateCreateSubscription, createSubscription);

/**
 * @route PUT /api/v1/subscription/update-subscription/:id
 * @description Update subscription information
 * @access Public
 * @param {IdOrIdsInput['id']} id - The ID of the subscription to update
 * @param {function} validation - ['validateId', 'validateUpdateSubscription']
 * @param {function} controller - ['updateSubscription']
 */
router.put("/:id", validateId, validateUpdateSubscription, updateSubscription);



/**
 * @route DELETE /api/v1/subscription/delete-subscription/:id
 * @description Delete a subscription
 * @access Public
 * @param {IdOrIdsInput['id']} id - The ID of the subscription to delete
 * @param {function} validation - ['validateId']
 * @param {function} controller - ['deleteSubscription']
 */
router.delete("/:id", validateId, deleteSubscription);

/**
 * @route GET /api/v1/subscription/get-subscription/many
 * @description Get multiple subscriptions
 * @access Public
 * @param {function} validation - ['validateSearchQueries']
 * @param {function} controller - ['getManySubscription']
 */
router.get("/many", validateSearchQueries, getManySubscription);

/**
 * @route GET /api/v1/subscription/get-subscription/:id
 * @description Get a subscription by ID
 * @access Public
 * @param {IdOrIdsInput['id']} id - The ID of the subscription to retrieve
 * @param {function} validation - ['validateId']
 * @param {function} controller - ['getSubscriptionById']
 */
router.get("/me", validateId, getSubscriptionById);


// TODO: Single Subscription data get er api lagba
// Export the router
module.exports = router;