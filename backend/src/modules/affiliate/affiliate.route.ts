// Import Router from express
import { Router } from 'express';

// Import controller from corresponding module
import {
  createAffiliate,
  deleteAffiliate,
  deleteManyAffiliate,
  getAffiliateById,
  getManyAffiliate,
  updateAffiliate,
} from './affiliate.controller';

//Import validation from corresponding module
import authorizedRoles from '../../../src/middlewares/authorized-roles';
import { UserRole } from '../../../src/model/user/user.schema';
import isAuthorized from '../../../src/middlewares/is-authorized';
import {
  validateId,
  validateIds,
  validateSearchQueries,
} from '../../handlers/common-zod-validator';
import { validateCreateAffiliate, validateUpdateAffiliate } from './affiliate.validation';

// Initialize router
const router = Router();

// Define route handlers
/**
 * @route POST /api/v1/affiliate/create-affiliate
 * @description Create a new affiliate
 * @access Public
 * @param {function} validation - ['validateCreateAffiliate']
 * @param {function} controller - ['createAffiliate']
 */
router.post(
  '/',
  isAuthorized,
  authorizedRoles([UserRole.USER]),
  validateCreateAffiliate,
  createAffiliate
);

/**
 * @route PUT /api/v1/affiliate/update-affiliate/:id
 * @description Update affiliate information
 * @access Public
 * @param {IdOrIdsInput['id']} id - The ID of the affiliate to update
 * @param {function} validation - ['validateId', 'validateUpdateAffiliate']
 * @param {function} controller - ['updateAffiliate']
 */
router.put('/:id', isAuthorized, validateId, validateUpdateAffiliate, updateAffiliate);

/**
 * @route DELETE /api/v1/affiliate/delete-affiliate/:id
 * @description Delete a affiliate
 * @access Public
 * @param {IdOrIdsInput['id']} id - The ID of the affiliate to delete
 * @param {function} validation - ['validateId']
 * @param {function} controller - ['deleteAffiliate']
 */
router.delete('/:id', isAuthorized, validateId, deleteAffiliate);

/**
 * @route GET /api/v1/affiliate/get-affiliate/many
 * @description Get multiple affiliates
 * @access Public
 * @param {function} validation - ['validateSearchQueries']
 * @param {function} controller - ['getManyAffiliate']
 */
router.get('/get-affiliate/many', validateSearchQueries, getManyAffiliate);

/**
 * @route GET /api/v1/affiliate/get-affiliate/:id
 * @description Get a affiliate by ID
 * @access Public
 * @param {IdOrIdsInput['id']} id - The ID of the affiliate to retrieve
 * @param {function} validation - ['validateId']
 * @param {function} controller - ['getAffiliateById']
 */
router.get('/get-affiliate/:id', validateId, getAffiliateById);

// Export the router
module.exports = router;

