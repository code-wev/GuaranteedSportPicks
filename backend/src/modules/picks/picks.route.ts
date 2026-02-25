// Import Router from express
import { Router } from 'express';

// Import controller from corresponding module
import {
  createPicks,
  updatePicks,
  deletePicks,
  deleteManyPicks,
  getPicksById,
  getManyPicks,
} from './picks.controller';

//Import validation from corresponding module
import { validateCreatePicks, validateUpdatePicks } from './picks.validation';
import {
  validateId,
  validateIds,
  validateSearchQueries,
} from '../../handlers/common-zod-validator';
import isAuthorized from '../../../src/middlewares/is-authorized';
import authorizedRoles from '../../../src/middlewares/authorized-roles';
import { UserRole } from '../../../src/model/user/user.schema';

// Initialize router
const router = Router();

// Define route handlers
/**
 * @route POST /api/v1/picks/create-picks
 * @description Create a new picks
 * @access Public
 * @param {function} validation - ['validateCreatePicks']
 * @param {function} controller - ['createPicks']
 */
router.post('/', isAuthorized, authorizedRoles([UserRole.ADMIN]), validateCreatePicks, createPicks);

/**
 * @route PUT /api/v1/picks/update-picks/:id
 * @description Update picks information
 * @access Public
 * @param {IdOrIdsInput['id']} id - The ID of the picks to update
 * @param {function} validation - ['validateId', 'validateUpdatePicks']
 * @param {function} controller - ['updatePicks']
 */
router.put('/update-picks/:id', validateId, validateUpdatePicks, updatePicks);

/**
 * @route DELETE /api/v1/picks/delete-picks/many
 * @description Delete multiple pickss
 * @access Public
 * @param {function} validation - ['validateIds']
 * @param {function} controller - ['deleteManyPicks']
 */
router.delete('/delete-picks/many', validateIds, deleteManyPicks);

/**
 * @route DELETE /api/v1/picks/delete-picks/:id
 * @description Delete a picks
 * @access Public
 * @param {IdOrIdsInput['id']} id - The ID of the picks to delete
 * @param {function} validation - ['validateId']
 * @param {function} controller - ['deletePicks']
 */
router.delete('/delete-picks/:id', validateId, deletePicks);

/**
 * @route GET /api/v1/picks/get-picks/many
 * @description Get multiple pickss
 * @access Public
 * @param {function} validation - ['validateSearchQueries']
 * @param {function} controller - ['getManyPicks']
 */
router.get('/get-picks/many', validateSearchQueries, getManyPicks);

/**
 * @route GET /api/v1/picks/get-picks/:id
 * @description Get a picks by ID
 * @access Public
 * @param {IdOrIdsInput['id']} id - The ID of the picks to retrieve
 * @param {function} validation - ['validateId']
 * @param {function} controller - ['getPicksById']
 */
router.get('/get-picks/:id', validateId, getPicksById);

// Export the router
module.exports = router;
