// Import Router from express
import { Router } from 'express';

// Import controller from corresponding module
import {
  createNewslatter,
  getNewsletterCampaigns,
  getManyNewslatter,
  getNewslatterById,
  sendNewsletterCampaign,
  updateNewslatter,
} from './newslatter.controller';

//Import validation from corresponding module
import isAuthorized from '../../../src/middlewares/is-authorized';
import authorizedRoles from '../../../src/middlewares/authorized-roles';
import { UserRole } from '../../../src/model/user/user.schema';
import {
  validateId,
  validateSearchQueries
} from '../../handlers/common-zod-validator';
import {
  validateSendNewsletter,
  validateUpdateNewslatter,
} from './newslatter.validation';

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
router.post(['/','/newslatter','/toggle','/newslatter/toggle'], isAuthorized, createNewslatter);

/**
 * @route GET /api/v1/newslatter/get-newslatter/:id
 * @description Get a newslatter by ID
 * @access Public
 * @param {IdOrIdsInput['id']} id - The ID of the newslatter to retrieve
 * @param {function} validation - ['validateId']
 * @param {function} controller - ['getNewslatterById']
 */
router.get(['/me', '/newslatter/me'], isAuthorized, getNewslatterById);

/**
 * @route PUT /api/v1/newslatter/update-newslatter/:id
 * @description Update newslatter information
 * @access Public
 * @param {IdOrIdsInput['id']} id - The ID of the newslatter to update
 * @param {function} validation - ['validateId', 'validateUpdateNewslatter']
 * @param {function} controller - ['updateNewslatter']
 */
router.put(['/:id', '/newslatter/:id'], validateId, validateUpdateNewslatter, updateNewslatter);

/**
 * @route GET /api/v1/newslatter/get-newslatter/many
 * @description Get multiple newslatters
 * @access Public
 * @param {function} validation - ['validateSearchQueries']
 * @param {function} controller - ['getManyNewslatter']
 */
router.get(
  ['/get-newslatter/many', '/newslatter/get-newslatter/many'],
  validateSearchQueries,
  isAuthorized,
  authorizedRoles([UserRole.ADMIN]),
  getManyNewslatter
);

router.get(
  ['/admin/campaigns', '/newslatter/admin/campaigns'],
  isAuthorized,
  authorizedRoles([UserRole.ADMIN]),
  getNewsletterCampaigns
);

router.post(
  ['/admin/send', '/newslatter/admin/send'],
  isAuthorized,
  authorizedRoles([UserRole.ADMIN]),
  validateSendNewsletter,
  sendNewsletterCampaign
);



// Export the router
module.exports = router;
