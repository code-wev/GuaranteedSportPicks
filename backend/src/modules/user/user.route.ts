// Import Router from express
import { Router } from 'express';

// Import controller from corresponding module
import {
  updateUser,
  deleteUser,
  getUserById,
  getManyUser,
  getUserByAutorization,
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
router.put('/', isAuthorized, validateUpdateUser, updateUser); // ! Must be recheck

/**
 * @route DELETE /api/v1/user/delete-user/:id
 * @description Delete a user
 * @access Public
 * @param {IdOrIdsInput['id']} id - The ID of the user to delete
 * @param {function} validation - ['validateId']
 * @param {function} controller - ['deleteUser']
 */
router.delete(
  '/delete-user/:id',
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
  '/many',
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
  '/get-user/:id',
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
router.get('/profile/me', isAuthorized, getUserByAutorization);

// Export the router
module.exports = router;
