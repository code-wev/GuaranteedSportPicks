import { Router } from 'express';
import authorizedRoles from '../../../src/middlewares/authorized-roles';
import isAuthorized from '../../../src/middlewares/is-authorized';
import { UserRole } from '../../../src/model/user/user.schema';
import {
  validateId,
  validateIds,
  validateSearchQueries,
} from '../../handlers/common-zod-validator';
import {
  approveAffiliate,
  createAffiliate,
  deleteAffiliate,
  deleteManyAffiliate,
  getAffiliateAdminSummary,
  getAffiliateById,
  getManyAffiliate,
  getMyAffiliate,
  updateAffiliate,
} from './affiliate.controller';
import {
  validateAffiliateApproval,
  validateCreateAffiliate,
  validateUpdateAffiliate,
} from './affiliate.validation';

const router = Router();

router.post(
  ['/', '/request'],
  isAuthorized,
  authorizedRoles([UserRole.USER]),
  validateCreateAffiliate,
  createAffiliate
);

router.get(['/me'], isAuthorized, getMyAffiliate);

router.get(
  ['/summary/admin'],
  isAuthorized,
  authorizedRoles([UserRole.ADMIN]),
  getAffiliateAdminSummary
);

router.get(
  ['/get-affiliate/many', '/many'],
  validateSearchQueries,
  isAuthorized,
  authorizedRoles([UserRole.ADMIN]),
  getManyAffiliate
);

router.get(
  ['/get-affiliate/:id', '/:id'],
  validateId,
  isAuthorized,
  authorizedRoles([UserRole.ADMIN]),
  getAffiliateById
);

router.put(
  ['/request/:id'],
  validateId,
  isAuthorized,
  authorizedRoles([UserRole.USER]),
  validateUpdateAffiliate,
  updateAffiliate
);

router.put(
  ['/approve/:id'],
  validateId,
  isAuthorized,
  authorizedRoles([UserRole.ADMIN]),
  validateAffiliateApproval,
  approveAffiliate
);

router.delete(
  ['/:id'],
  validateId,
  isAuthorized,
  authorizedRoles([UserRole.ADMIN]),
  deleteAffiliate
);

router.delete(
  ['/delete-many'],
  validateIds,
  isAuthorized,
  authorizedRoles([UserRole.ADMIN]),
  deleteManyAffiliate
);

module.exports = router;
