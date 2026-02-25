// Import Router from express
import { Router } from 'express';

// Import controller from corresponding module
import {
  createPicks,
  deleteManyPicks,
  deletePicks,
  getManyPicks,
  getPicksById,
  updatePicks,
} from './picks.controller';

//Import validation from corresponding module
import authorizedRoles from '../../../src/middlewares/authorized-roles';
import isAuthorized from '../../../src/middlewares/is-authorized';
import { UserRole } from '../../../src/model/user/user.schema';
import {
  validateId,
  validateIds,
  validateSearchQueries,
} from '../../handlers/common-zod-validator';
import { validateCreatePicks, validateUpdatePicks } from './picks.validation';

// Initialize router
const router = Router();

// Define route handlers
/**
 * @route POST /api/v1/picks/create-picks
 * @description Create a new picks
 * @access Private (Admin only)
 * @param {function} validation - ['validateCreatePicks']
 * @param {function} controller - ['createPicks']
 */
router.post('/', isAuthorized, authorizedRoles([UserRole.ADMIN]), validateCreatePicks, createPicks);

/**
 * @route PUT /api/v1/picks/update-picks/:id
 * @description Update picks information
 * @access Private (Admin only)
 * @param {IdOrIdsInput['id']} id - The ID of the picks to update
 * @param {function} validation - ['validateId', 'validateUpdatePicks']
 * @param {function} controller - ['updatePicks']
 */
router.put(
  '/:id',
  isAuthorized,
  authorizedRoles([UserRole.ADMIN]),
  validateId,
  validateUpdatePicks,
  updatePicks
);

/**
 * @route DELETE /api/v1/picks/delete-picks/many
 * @description Delete multiple pickss
 * @access Private ( Admin Only)
 * @param {function} validation - ['validateIds']
 * @param {function} controller - ['deleteManyPicks']
 */
router.delete(
  '/delete-picks/many',
  isAuthorized,
  authorizedRoles([UserRole.ADMIN]),
  validateIds,
  deleteManyPicks
);

/**
 * @route DELETE /api/v1/picks/delete-picks/:id
 * @description Delete a picks
 * @access Private ( Admin Only)
 * @param {IdOrIdsInput['id']} id - The ID of the picks to delete
 * @param {function} validation - ['validateId']
 * @param {function} controller - ['deletePicks']
 */
router.delete('/:id', isAuthorized, authorizedRoles([UserRole.ADMIN]), validateId, deletePicks);

/**
 * @route GET /api/v1/picks/get-picks/many
 * @description Get multiple pickss
 * @access Public
 * @param {function} validation - ['validateSearchQueries']
 * @param {function} controller - ['getManyPicks']
 */


// TODO: Another api create for free picks 
// TODO: All pick see only the admin
// TODO: User see only active picks if she susbcriber or free user er der jnno only free picks
//TODO: Free pick { active pick } - alada api
//TODO: All picl - Only Admin
//TODO: All pick - premium user  -  active picks  — active pick by defualt
//TODO:  Filter = Pick status ways only admin
//TODO: Market Type : admin and user all, user only se active status ata sob jaigai implement  korte hobe
//TODO: Filter by confidenceLavel , 
//TODO: Filter by Result type
//TODO: Filter by sport Id 
//TODO: Filter by sport title
//TODO: Filte rby sporkey
//TODO: Filter by home_team
//TODO: Filter by away team

router.get('/get-picks/many', validateSearchQueries, getManyPicks);

/**
 * @route GET /api/v1/picks/get-picks/:id
 * @description Get a picks by ID
 * @access Public
 * @param {IdOrIdsInput['id']} id - The ID of the picks to retrieve
 * @param {function} validation - ['validateId']
 * @param {function} controller - ['getPicksById']
 */
router.get('/:id', validateId, getPicksById);

// Export the router
module.exports = router;
