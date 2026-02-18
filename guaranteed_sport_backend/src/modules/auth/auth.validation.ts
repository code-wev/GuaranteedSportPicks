import { isMongoId } from 'validator';
import { z } from 'zod';
import { validateBody } from '../../handlers/zod-error-handler';

/**
 * Auth Validation Schemas and Types
 *
 * This module defines Zod schemas for validating auth related
 * requests such as creation (single + bulk) and updates (single + bulk).
 * It also exports corresponding TypeScript types inferred from these schemas.
 * Each schema includes detailed validation rules and custom error messages
 * to ensure data integrity and provide clear feedback to API consumers.
 *
 * Named validator middleware functions are exported for direct use in Express routes.
 */

/**
 * Zod schema for validating data when **creating** a single auth.
 * 
 * → Add all **required** fields here
 */
const zodCreateAuthSchema = z
  .object({
    // Example fields — replace / expand as needed:
    // name: z.string({ message: 'Auth name is required' }).min(2, 'Name must be at least 2 characters').max(100),
    // email: z.string().email({ message: 'Invalid email format' }),
    // age: z.number().int().positive().optional(),
    // status: z.enum(['active', 'inactive', 'pending']).default('pending'),
  })
  .strict();

export type CreateAuthInput = z.infer<typeof zodCreateAuthSchema>;

/**
 * Zod schema for validating **bulk creation** (array of auth objects).
 */
const zodCreateManyAuthSchema = z
  .array(zodCreateAuthSchema)
  .min(1, { message: 'At least one auth must be provided for bulk creation' });

export type CreateManyAuthInput = z.infer<typeof zodCreateManyAuthSchema>;

/**
 * Zod schema for validating data when **updating** an existing auth.
 * 
 * → All fields should usually be .optional()
 */
const zodUpdateAuthSchema = z
  .object({
    // Example fields — replace / expand as needed:
    // name: z.string().min(2, 'Name must be at least 2 characters').max(100).optional(),
    // email: z.string().email({ message: 'Invalid email format' }).optional(),
    // age: z.number().int().positive().optional(),
    // status: z.enum(['active', 'inactive', 'pending']).optional(),
  })
  .strict();

export type UpdateAuthInput = z.infer<typeof zodUpdateAuthSchema>;

/**
 * Zod schema for validating bulk updates (array of partial auth objects).
 */
const zodUpdateManyAuthForBulkSchema = zodUpdateAuthSchema
  .extend({
    id: z.string().refine(isMongoId, { message: 'Please provide a valid MongoDB ObjectId' }),
  })
  .refine((data) => Object.keys(data).length > 1, {
    message: 'At least one field to update must be provided',
  });

/**
 * Zod schema for validating an array of multiple auth updates.
 */
const zodUpdateManyAuthSchema = z
  .array(zodUpdateManyAuthForBulkSchema)
  .min(1, { message: 'At least one auth update object must be provided' });

export type UpdateManyAuthInput = z.infer<typeof zodUpdateManyAuthSchema>;

/**
 * Named validators — use these directly in your Express routes
 */
export const validateCreateAuth = validateBody(zodCreateAuthSchema);
export const validateCreateManyAuth = validateBody(zodCreateManyAuthSchema);
export const validateUpdateAuth = validateBody(zodUpdateAuthSchema);
export const validateUpdateManyAuth = validateBody(zodUpdateManyAuthSchema);