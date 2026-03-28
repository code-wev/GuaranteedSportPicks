import { Request, Response } from 'express';
import { AuthenticatedRequest } from '../../middlewares/is-authorized';
import ServerResponse from '../../helpers/responses/custom-response';
import catchAsync from '../../utils/catch-async/catch-async';
import { testimonialServices } from './testimonial.service';

export const createTestimonial = catchAsync(async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user!._id.toString();
  const result = await testimonialServices.createTestimonial(userId, req.body);
  ServerResponse(res, true, 201, 'Testimonial submitted successfully', result);
});

export const getMyTestimonials = catchAsync(async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user!._id.toString();
  const result = await testimonialServices.getMyTestimonials(userId);
  ServerResponse(res, true, 200, 'My testimonials retrieved successfully', result);
});

export const getApprovedTestimonials = catchAsync(async (req: Request, res: Response) => {
  const result = await testimonialServices.getApprovedTestimonials();
  ServerResponse(res, true, 200, 'Approved testimonials retrieved successfully', result);
});

export const getManyTestimonialsAdmin = catchAsync(async (req: Request, res: Response) => {
  const result = await testimonialServices.getManyTestimonialsAdmin(req.query);
  ServerResponse(res, true, 200, 'Testimonials retrieved successfully', result);
});

export const updateTestimonialStatus = catchAsync(async (req: Request, res: Response) => {
  const result = await testimonialServices.updateTestimonialStatus(req.params.id as string, req.body);
  if (!result) {
    throw new Error('Testimonial not found');
  }
  ServerResponse(res, true, 200, 'Testimonial status updated successfully', result);
});
