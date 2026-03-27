import { z } from 'zod';
import { validateBody } from '../../handlers/zod-error-handler';

const createTestimonialSchema = z.object({
  location: z.string().trim().max(100).optional(),
  title: z.string().trim().max(100).optional(),
  review: z.string().trim().min(20).max(1000),
  rating: z.coerce.number().min(1).max(5),
});

const updateTestimonialStatusSchema = z.object({
  status: z.enum(['APPROVED', 'REJECTED']),
});

export type CreateTestimonialInput = z.infer<typeof createTestimonialSchema>;
export type UpdateTestimonialStatusInput = z.infer<typeof updateTestimonialStatusSchema>;

export const validateCreateTestimonial = validateBody(createTestimonialSchema);
export const validateUpdateTestimonialStatus = validateBody(updateTestimonialStatusSchema);
