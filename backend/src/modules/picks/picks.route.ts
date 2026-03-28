// Import Router from express
import { Router } from 'express';

// Import controller from corresponding module
import {
  createPickPurchase,
  createPicks,
  deleteManyPicks,
  deletePicks,
  getManyPicksAdmin,
  getManyPicks,
  getMyAccessiblePicks,
  getMyPickPurchases,
  getPicksById,
  updatePicks,
} from './picks.controller';

//Import validation from corresponding module
import authorizedRoles from '../../../src/middlewares/authorized-roles';
import isAuthorized from '../../../src/middlewares/is-authorized';
import optionalUser from '../../middlewares/optional-user';
import { UserRole } from '../../../src/model/user/user.schema';
import {
  validateId,
  validateIds,
  validateSearchQueries,
} from '../../handlers/common-zod-validator';
import { validateCreatePickPurchase, validateCreatePicks, validateUpdatePicks } from './picks.validation';

// Import pick purchase routes


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
router.post(['/','/picks'], isAuthorized, authorizedRoles([UserRole.ADMIN]), validateCreatePicks, createPicks);

/**
 * @route PUT /api/v1/picks/update-picks/:id
 * @description Update picks information
 * @access Private (Admin only)
 * @param {IdOrIdsInput['id']} id - The ID of the picks to update
 * @param {function} validation - ['validateId', 'validateUpdatePicks']
 * @param {function} controller - ['updatePicks']
 */
router.put(
  ['/:id', '/picks/:id'],
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
  ['/delete-picks/many', '/picks/delete-picks/many'],
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
router.delete(['/:id', '/picks/:id'], isAuthorized, authorizedRoles([UserRole.ADMIN]), validateId, deletePicks);

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

router.get(['/get-picks/many', '/picks/get-picks/many'], optionalUser, validateSearchQueries, getManyPicks);

router.get(
  ['/admin/all'],
  isAuthorized,
  authorizedRoles([UserRole.ADMIN]),
  validateSearchQueries,
  getManyPicksAdmin
);

router.post(
  ['/purchase', '/picks/purchase'],
  isAuthorized,
  authorizedRoles([UserRole.USER]),
  validateCreatePickPurchase,
  createPickPurchase
);

router.get(
  ['/my-purchases', '/picks/my-purchases'],
  isAuthorized,
  authorizedRoles([UserRole.USER]),
  getMyPickPurchases
);

router.get(
  ['/my-access', '/picks/my-access'],
  isAuthorized,
  authorizedRoles([UserRole.USER]),
  getMyAccessiblePicks
);

/**
 * @route GET /api/v1/picks/get-picks/:id
 * @description Get a picks by ID
 * @access Public
 * @param {IdOrIdsInput['id']} id - The ID of the picks to retrieve
 * @param {function} validation - ['validateId']
 * @param {function} controller - ['getPicksById']
 */
router.get(['/:id', '/picks/:id'], validateId, getPicksById);

// // Use pick purchase routes
// router.use('/', pickPurchaseRoutes);

// Export the router
module.exports = router;
