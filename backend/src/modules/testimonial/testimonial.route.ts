import { Router } from 'express';
import isAuthorized from '../../middlewares/is-authorized';
import authorizedRoles from '../../middlewares/authorized-roles';
import { UserRole } from '../../model/user/user.schema';
import { validateId } from '../../handlers/common-zod-validator';
import {
  createTestimonial,
  getApprovedTestimonials,
  getManyTestimonialsAdmin,
  getMyTestimonials,
  updateTestimonialStatus,
} from './testimonial.controller';
import {
  validateCreateTestimonial,
  validateUpdateTestimonialStatus,
} from './testimonial.validation';

const router = Router();

router.get('/', getApprovedTestimonials);

router.post(
  '/',
  isAuthorized,
  authorizedRoles([UserRole.USER]),
  validateCreateTestimonial,
  createTestimonial
);

router.get(
  '/my',
  isAuthorized,
  authorizedRoles([UserRole.USER]),
  getMyTestimonials
);

router.get(
  '/admin/all',
  isAuthorized,
  authorizedRoles([UserRole.ADMIN]),
  getManyTestimonialsAdmin
);

router.put(
  '/admin/:id/status',
  isAuthorized,
  authorizedRoles([UserRole.ADMIN]),
  validateId,
  validateUpdateTestimonialStatus,
  updateTestimonialStatus
);

module.exports = router;
