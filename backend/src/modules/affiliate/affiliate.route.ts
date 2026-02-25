// Import Router from express
import { Router } from 'express';

// Import controller from corresponding module
import { 
  createAffiliate,
  createManyAffiliate,
  updateAffiliate,
  updateManyAffiliate,
  deleteAffiliate,
  deleteManyAffiliate,
  getAffiliateById,
  getManyAffiliate
} from './affiliate.controller';

//Import validation from corresponding module
import { validateCreateAffiliate, validateCreateManyAffiliate, validateUpdateAffiliate, validateUpdateManyAffiliate} from './affiliate.validation';
import { validateId, validateIds, validateSearchQueries } from '../../handlers/common-zod-validator';

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
router.post("/create-affiliate", validateCreateAffiliate, createAffiliate);

/**
 * @route POST /api/v1/affiliate/create-affiliate/many
 * @description Create multiple affiliates
 * @access Public
 * @param {function} validation - ['validateCreateManyAffiliate']
 * @param {function} controller - ['createManyAffiliate']
 */
router.post("/create-affiliate/many", validateCreateManyAffiliate, createManyAffiliate);

/**
 * @route PUT /api/v1/affiliate/update-affiliate/many
 * @description Update multiple affiliates information
 * @access Public
 * @param {function} validation - ['validateIds', 'validateUpdateManyAffiliate']
 * @param {function} controller - ['updateManyAffiliate']
 */
router.put("/update-affiliate/many", validateIds, validateUpdateManyAffiliate, updateManyAffiliate);

/**
 * @route PUT /api/v1/affiliate/update-affiliate/:id
 * @description Update affiliate information
 * @access Public
 * @param {IdOrIdsInput['id']} id - The ID of the affiliate to update
 * @param {function} validation - ['validateId', 'validateUpdateAffiliate']
 * @param {function} controller - ['updateAffiliate']
 */
router.put("/update-affiliate/:id", validateId, validateUpdateAffiliate, updateAffiliate);

/**
 * @route DELETE /api/v1/affiliate/delete-affiliate/many
 * @description Delete multiple affiliates
 * @access Public
 * @param {function} validation - ['validateIds']
 * @param {function} controller - ['deleteManyAffiliate']
 */
router.delete("/delete-affiliate/many", validateIds, deleteManyAffiliate);

/**
 * @route DELETE /api/v1/affiliate/delete-affiliate/:id
 * @description Delete a affiliate
 * @access Public
 * @param {IdOrIdsInput['id']} id - The ID of the affiliate to delete
 * @param {function} validation - ['validateId']
 * @param {function} controller - ['deleteAffiliate']
 */
router.delete("/delete-affiliate/:id", validateId, deleteAffiliate);

/**
 * @route GET /api/v1/affiliate/get-affiliate/many
 * @description Get multiple affiliates
 * @access Public
 * @param {function} validation - ['validateSearchQueries']
 * @param {function} controller - ['getManyAffiliate']
 */
router.get("/get-affiliate/many", validateSearchQueries, getManyAffiliate);

/**
 * @route GET /api/v1/affiliate/get-affiliate/:id
 * @description Get a affiliate by ID
 * @access Public
 * @param {IdOrIdsInput['id']} id - The ID of the affiliate to retrieve
 * @param {function} validation - ['validateId']
 * @param {function} controller - ['getAffiliateById']
 */
router.get("/get-affiliate/:id", validateId, getAffiliateById);

// Export the router
module.exports = router;