// Import Router from express
import { Router } from 'express';

// Import controller from corresponding module
import {
  updateUser,
  updateUserById,
  deleteUser,
  getUserById,
  getManyUser,
  getUserByAutorization,
  getUserDashboardSummary,
  getAdminDashboardSummary,
  getAdminOrdersSummary,
} from './user.controller';

//Import validation from corresponding module
import { validateUpdateUser } from './user.validation';
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

/**
 * @route PUT /api/v1/user/update-user/:id
 * @description Update user information
 * @access Public
 * @param {IdOrIdsInput['id']} id - The ID of the user to update
 * @param {function} validation - ['validateId', 'validateUpdateUser']
 * @param {function} controller - ['updateUser']
 */
router.put(['/', '/user'], isAuthorized, validateUpdateUser, updateUser); // ! Must be recheck

router.put(
  ['/update-user/:id', '/user/update-user/:id'],
  validateId,
  isAuthorized,
  authorizedRoles([UserRole.ADMIN]),
  validateUpdateUser,
  updateUserById
);

/**
 * @route DELETE /api/v1/user/delete-user/:id
 * @description Delete a user
 * @access Public
 * @param {IdOrIdsInput['id']} id - The ID of the user to delete
 * @param {function} validation - ['validateId']
 * @param {function} controller - ['deleteUser']
 */
router.delete(
  ['/delete-user/:id', '/user/delete-user/:id'],
  validateId,
  isAuthorized,
  authorizedRoles([UserRole.ADMIN]),
  deleteUser
); // todo: teasting done

/**
 * @route GET /api/v1/user/get-user/many
 * @description Get multiple users
 * @access Public
 * @param {function} validation - ['validateSearchQueries']
 * @param {function} controller - ['getManyUser']
 */
router.get(
  ['/many', '/user/many'],
  validateSearchQueries,
  isAuthorized,
  authorizedRoles([UserRole.ADMIN]),
  getManyUser
); // todo: teasting done

/**
 * @route GET /api/v1/user/get-user/:id
 * @description Get a user by ID
 * @access Public
 * @param {IdOrIdsInput['id']} id - The ID of the user to retrieve
 * @param {function} validation - ['validateId']
 * @param {function} controller - ['getUserById']
 */
router.get(
  ['/get-user/:id', '/user/get-user/:id'],
  validateId,
  isAuthorized,
  authorizedRoles([UserRole.ADMIN]),
  getUserById
);
/**
 * @route GET /api/v1/user/get-user/:id
 * @description Get a user by ID
 * @access Public
 * @param {IdOrIdsInput['id']} id - The ID of the user to retrieve
 * @param {function} validation - ['validateId']
 * @param {function} controller - ['getUserById']
 */
router.get(['/profile/me', '/user/profile/me'], isAuthorized, getUserByAutorization);
router.get(['/dashboard-summary', '/user/dashboard-summary'], isAuthorized, getUserDashboardSummary);
router.get(
  ['/admin/dashboard-summary', '/user/admin/dashboard-summary'],
  isAuthorized,
  authorizedRoles([UserRole.ADMIN]),
  getAdminDashboardSummary
);
router.get(
  ['/admin/orders-summary', '/user/admin/orders-summary'],
  isAuthorized,
  authorizedRoles([UserRole.ADMIN]),
  getAdminOrdersSummary
);

// Export the router
module.exports = router;
