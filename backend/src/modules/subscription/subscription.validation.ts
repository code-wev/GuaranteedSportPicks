import { isMongoId } from 'validator';
import { z } from 'zod';
import { validateBody } from '../../handlers/zod-error-handler';

/**
 * Subscription Validation Schemas and Types
 *
 * This module defines Zod schemas for validating subscription related
 * requests such as creation (single + bulk) and updates (single + bulk).
 * It also exports corresponding TypeScript types inferred from these schemas.
 * Each schema includes detailed validation rules and custom error messages
 * to ensure data integrity and provide clear feedback to API consumers.
 *
 * Named validator middleware functions are exported for direct use in Express routes.
 */

/**
 * Zod schema for validating data when **creating** a single subscription.
 * 
 * → Add all **required** fields here
 */
const zodCreateSubscriptionSchema = z
  .object({
    // Example fields — replace / expand as needed:
    // name: z.string({ message: 'Subscription name is required' }).min(2, 'Name must be at least 2 characters').max(100),
    // email: z.string().email({ message: 'Invalid email format' }),
    // age: z.number().int().positive().optional(),
    // status: z.enum(['active', 'inactive', 'pending']).default('pending'),
  })
  .strict();

export type CreateSubscriptionInput = z.infer<typeof zodCreateSubscriptionSchema>;

/**
 * Zod schema for validating **bulk creation** (array of subscription objects).
 */
const zodCreateManySubscriptionSchema = z
  .array(zodCreateSubscriptionSchema)
  .min(1, { message: 'At least one subscription must be provided for bulk creation' });

export type CreateManySubscriptionInput = z.infer<typeof zodCreateManySubscriptionSchema>;

/**
 * Zod schema for validating data when **updating** an existing subscription.
 * 
 * → All fields should usually be .optional()
 */
const zodUpdateSubscriptionSchema = z
  .object({
    // Example fields — replace / expand as needed:
    // name: z.string().min(2, 'Name must be at least 2 characters').max(100).optional(),
    // email: z.string().email({ message: 'Invalid email format' }).optional(),
    // age: z.number().int().positive().optional(),
    // status: z.enum(['active', 'inactive', 'pending']).optional(),
  })
  .strict();

export type UpdateSubscriptionInput = z.infer<typeof zodUpdateSubscriptionSchema>;

/**
 * Zod schema for validating bulk updates (array of partial subscription objects).
 */
const zodUpdateManySubscriptionForBulkSchema = zodUpdateSubscriptionSchema
  .extend({
    id: z.string().refine(isMongoId, { message: 'Please provide a valid MongoDB ObjectId' }),
  })
  .refine((data) => Object.keys(data).length > 1, {
    message: 'At least one field to update must be provided',
  });

/**
 * Zod schema for validating an array of multiple subscription updates.
 */
const zodUpdateManySubscriptionSchema = z
  .array(zodUpdateManySubscriptionForBulkSchema)
  .min(1, { message: 'At least one subscription update object must be provided' });

export type UpdateManySubscriptionInput = z.infer<typeof zodUpdateManySubscriptionSchema>;

/**
 * Named validators — use these directly in your Express routes
 */
export const validateCreateSubscription = validateBody(zodCreateSubscriptionSchema);
export const validateCreateManySubscription = validateBody(zodCreateManySubscriptionSchema);
export const validateUpdateSubscription = validateBody(zodUpdateSubscriptionSchema);
export const validateUpdateManySubscription = validateBody(zodUpdateManySubscriptionSchema);