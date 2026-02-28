import { isMongoId } from 'validator';
import { email, z } from 'zod';
import { validateBody } from '../../handlers/zod-error-handler';

/**
 * Newslatter Validation Schemas and Types
 *
 * This module defines Zod schemas for validating newslatter related
 * requests such as creation (single + bulk) and updates (single + bulk).
 * It also exports corresponding TypeScript types inferred from these schemas.
 * Each schema includes detailed validation rules and custom error messages
 * to ensure data integrity and provide clear feedback to API consumers.
 *
 * Named validator middleware functions are exported for direct use in Express routes.
 */

/**
 * Zod schema for validating data when **creating** a single newslatter.
 *
 * → Add all **required** fields here
 */
const zodCreateNewslatterSchema = z
  .object({
    // Example fields — replace / expand as needed:
    // name: z.string({ message: 'Newslatter name is required' }).min(2, 'Name must be at least 2 characters').max(100),
    // email: z.string().email({ message: 'Invalid email format' }),
    // age: z.number().int().positive().optional(),
    // status: z.enum(['active', 'inactive', 'pending']).default('pending'),

    email: z.email({ message: 'Invalid email format' }),
    userId: z
      .string()
      .refine(isMongoId, { message: 'Please provide a valid MongoDB ObjectId for userId' }),
    isActive: z.boolean().optional(),
  })
  .strict();

export type CreateNewslatterInput = z.infer<typeof zodCreateNewslatterSchema>;

/**
 * Zod schema for validating data when **updating** an existing newslatter.
 *
 * → All fields should usually be .optional()
 */
const zodUpdateNewslatterSchema = z
  .object({
    // Example fields — replace / expand as needed:
    // name: z.string().min(2, 'Name must be at least 2 characters').max(100).optional(),
    // email: z.string().email({ message: 'Invalid email format' }).optional(),
    // age: z.number().int().positive().optional(),
    // status: z.enum(['active', 'inactive', 'pending']).optional(),

    email: z.string().email({ message: 'Invalid email format' }).optional(),
    userId: z
      .string()
      .refine(isMongoId, { message: 'Please provide a valid MongoDB ObjectId for userId' })
      .optional(),
    isActive: z.boolean().optional(),
  })
  .strict();

export type UpdateNewslatterInput = z.infer<typeof zodUpdateNewslatterSchema>;

/**
 * Zod schema for validating bulk updates (array of partial newslatter objects).
 */
const zodUpdateManyNewslatterForBulkSchema = zodUpdateNewslatterSchema
  .extend({
    id: z.string().refine(isMongoId, { message: 'Please provide a valid MongoDB ObjectId' }),
  })
  .refine((data) => Object.keys(data).length > 1, {
    message: 'At least one field to update must be provided',
  });

/**
 * Named validators — use these directly in your Express routes
 */
export const validateCreateNewslatter = validateBody(zodCreateNewslatterSchema);
export const validateUpdateNewslatter = validateBody(zodUpdateNewslatterSchema);

