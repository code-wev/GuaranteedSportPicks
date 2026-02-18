// Import Router from express
import { Router } from 'express';

// Import controller from corresponding module
import { 
  createAuth,
  createManyAuth,
  updateAuth,
  updateManyAuth,
  deleteAuth,
  deleteManyAuth,
  getAuthById,
  getManyAuth
} from './auth.controller';

//Import validation from corresponding module
import { validateCreateAuth, validateCreateManyAuth, validateUpdateAuth, validateUpdateManyAuth} from './auth.validation';
import { validateId, validateIds, validateSearchQueries } from '../../handlers/common-zod-validator';

// Initialize router
const router = Router();

// Define route handlers
/**
 * @route POST /api/v1/auth/create-auth
 * @description Create a new auth
 * @access Public
 * @param {function} validation - ['validateCreateAuth']
 * @param {function} controller - ['createAuth']
 */
router.post("/create-auth", validateCreateAuth, createAuth);

/**
 * @route POST /api/v1/auth/create-auth/many
 * @description Create multiple auths
 * @access Public
 * @param {function} validation - ['validateCreateManyAuth']
 * @param {function} controller - ['createManyAuth']
 */
router.post("/create-auth/many", validateCreateManyAuth, createManyAuth);

/**
 * @route PUT /api/v1/auth/update-auth/many
 * @description Update multiple auths information
 * @access Public
 * @param {function} validation - ['validateIds', 'validateUpdateManyAuth']
 * @param {function} controller - ['updateManyAuth']
 */
router.put("/update-auth/many", validateIds, validateUpdateManyAuth, updateManyAuth);

/**
 * @route PUT /api/v1/auth/update-auth/:id
 * @description Update auth information
 * @access Public
 * @param {IdOrIdsInput['id']} id - The ID of the auth to update
 * @param {function} validation - ['validateId', 'validateUpdateAuth']
 * @param {function} controller - ['updateAuth']
 */
router.put("/update-auth/:id", validateId, validateUpdateAuth, updateAuth);

/**
 * @route DELETE /api/v1/auth/delete-auth/many
 * @description Delete multiple auths
 * @access Public
 * @param {function} validation - ['validateIds']
 * @param {function} controller - ['deleteManyAuth']
 */
router.delete("/delete-auth/many", validateIds, deleteManyAuth);

/**
 * @route DELETE /api/v1/auth/delete-auth/:id
 * @description Delete a auth
 * @access Public
 * @param {IdOrIdsInput['id']} id - The ID of the auth to delete
 * @param {function} validation - ['validateId']
 * @param {function} controller - ['deleteAuth']
 */
router.delete("/delete-auth/:id", validateId, deleteAuth);

/**
 * @route GET /api/v1/auth/get-auth/many
 * @description Get multiple auths
 * @access Public
 * @param {function} validation - ['validateSearchQueries']
 * @param {function} controller - ['getManyAuth']
 */
router.get("/get-auth/many", validateSearchQueries, getManyAuth);

/**
 * @route GET /api/v1/auth/get-auth/:id
 * @description Get a auth by ID
 * @access Public
 * @param {IdOrIdsInput['id']} id - The ID of the auth to retrieve
 * @param {function} validation - ['validateId']
 * @param {function} controller - ['getAuthById']
 */
router.get("/get-auth/:id", validateId, getAuthById);

// Export the router
module.exports = router;