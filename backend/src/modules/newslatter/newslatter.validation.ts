import { isMongoId } from 'validator';
import { z } from 'zod';
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
  })
  .strict();

export type CreateNewslatterInput = z.infer<typeof zodCreateNewslatterSchema>;

/**
 * Zod schema for validating **bulk creation** (array of newslatter objects).
 */
const zodCreateManyNewslatterSchema = z
  .array(zodCreateNewslatterSchema)
  .min(1, { message: 'At least one newslatter must be provided for bulk creation' });

export type CreateManyNewslatterInput = z.infer<typeof zodCreateManyNewslatterSchema>;

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
 * Zod schema for validating an array of multiple newslatter updates.
 */
const zodUpdateManyNewslatterSchema = z
  .array(zodUpdateManyNewslatterForBulkSchema)
  .min(1, { message: 'At least one newslatter update object must be provided' });

export type UpdateManyNewslatterInput = z.infer<typeof zodUpdateManyNewslatterSchema>;

/**
 * Named validators — use these directly in your Express routes
 */
export const validateCreateNewslatter = validateBody(zodCreateNewslatterSchema);
export const validateCreateManyNewslatter = validateBody(zodCreateManyNewslatterSchema);
export const validateUpdateNewslatter = validateBody(zodUpdateNewslatterSchema);
export const validateUpdateManyNewslatter = validateBody(zodUpdateManyNewslatterSchema);