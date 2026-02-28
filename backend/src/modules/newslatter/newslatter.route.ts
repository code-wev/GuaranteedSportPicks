// Import Router from express
import { Router } from 'express';

// Import controller from corresponding module
import {
  createNewslatter,
  updateNewslatter,
  getNewslatterById,
  getManyNewslatter,
} from './newslatter.controller';

//Import validation from corresponding module
import { validateCreateNewslatter, validateUpdateNewslatter } from './newslatter.validation';
import {
  validateId,
  validateIds,
  validateSearchQueries,
} from '../../handlers/common-zod-validator';

// Initialize router
const router = Router();

// Define route handlers
/**
 * @route POST /api/v1/newslatter/create-newslatter
 * @description Create a new newslatter
 * @access Public
 * @param {function} validation - ['validateCreateNewslatter']
 * @param {function} controller - ['createNewslatter']
 */
router.post('/', validateCreateNewslatter, createNewslatter);

/**
 * @route PUT /api/v1/newslatter/update-newslatter/:id
 * @description Update newslatter information
 * @access Public
 * @param {IdOrIdsInput['id']} id - The ID of the newslatter to update
 * @param {function} validation - ['validateId', 'validateUpdateNewslatter']
 * @param {function} controller - ['updateNewslatter']
 */
router.put('/:id', validateId, validateUpdateNewslatter, updateNewslatter);

/**
 * @route GET /api/v1/newslatter/get-newslatter/many
 * @description Get multiple newslatters
 * @access Public
 * @param {function} validation - ['validateSearchQueries']
 * @param {function} controller - ['getManyNewslatter']
 */
router.get('/get-newslatter/many', validateSearchQueries, getManyNewslatter);

/**
 * @route GET /api/v1/newslatter/get-newslatter/:id
 * @description Get a newslatter by ID
 * @access Public
 * @param {IdOrIdsInput['id']} id - The ID of the newslatter to retrieve
 * @param {function} validation - ['validateId']
 * @param {function} controller - ['getNewslatterById']
 */
router.get('/get-newslatter/:id', validateId, getNewslatterById);

// Export the router
module.exports = router;

