// Import Router from express
import { Router } from 'express';

// Import controller from corresponding module
import {
  createPicks,
  createManyPicks,
  updatePicks,
  updateManyPicks,
  deletePicks,
  deleteManyPicks,
  getPicksById,
  getManyPicks,
} from './picks.controller';

//Import validation from corresponding module
import {
  validateCreatePicks,
  validateCreateManyPicks,
  validateUpdatePicks,
  validateUpdateManyPicks,
} from './picks.validation';
import {
  validateId,
  validateIds,
  validateSearchQueries,
} from '../../handlers/common-zod-validator';

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
router.post('/', validateCreatePicks, createPicks);

/**
 * @route POST /api/v1/picks/create-picks/many
 * @description Create multiple pickss
 * @access Public
 * @param {function} validation - ['validateCreateManyPicks']
 * @param {function} controller - ['createManyPicks']
 */
router.post('/create-picks/many', validateCreateManyPicks, createManyPicks);

/**
 * @route PUT /api/v1/picks/update-picks/many
 * @description Update multiple pickss information
 * @access Public
 * @param {function} validation - ['validateIds', 'validateUpdateManyPicks']
 * @param {function} controller - ['updateManyPicks']
 */
router.put('/update-picks/many', validateIds, validateUpdateManyPicks, updateManyPicks);

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
