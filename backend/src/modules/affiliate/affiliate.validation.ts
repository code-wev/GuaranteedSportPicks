import { z } from 'zod';
import { validateBody } from '../../handlers/zod-error-handler';

/**
 * Affiliate Validation Schemas and Types
 *
 * This module defines Zod schemas for validating affiliate related
 * requests such as creation (single + bulk) and updates (single + bulk).
 * It also exports corresponding TypeScript types inferred from these schemas.
 * Each schema includes detailed validation rules and custom error messages
 * to ensure data integrity and provide clear feedback to API consumers.
 *
 * Named validator middleware functions are exported for direct use in Express routes.
 */

/**
 * Zod schema for validating data when **creating** a single affiliate.
 *
 * → Add all **required** fields here
 */
const zodCreateAffiliateSchema = z
  .object({
    // Example fields — replace / expand as needed:
    // name: z.string({ message: 'Affiliate name is required' }).min(2, 'Name must be at least 2 characters').max(100),
    // email: z.string().email({ message: 'Invalid email format' }),
    // age: z.number().int().positive().optional(),
    // status: z.enum(['active', 'inactive', 'pending']).default('pending'),

    affiliateCode: z.string().optional(),
    website: z.string().optional(),
    socialLinks: z.array(z.string()).optional(),
    notes: z.string().optional(),
  })
  .strict();

export type CreateAffiliateInput = z.infer<typeof zodCreateAffiliateSchema>;

/**
 * Zod schema for validating data when **updating** an existing affiliate.
 *
 * → All fields should usually be .optional()
 */
const zodUpdateAffiliateSchema = z
  .object({
    // Example fields — replace / expand as needed:
    // name: z.string().min(2, 'Name must be at least 2 characters').max(100).optional(),
    // email: z.string().email({ message: 'Invalid email format' }).optional(),
    // age: z.number().int().positive().optional(),
    // status: z.enum(['active', 'inactive', 'pending']).optional(),
    status: z.enum(['pending', 'approved', 'declined']).optional(),
    affiliateCode: z.string().optional(),
    website: z.string().optional(),
    socialLinks: z.array(z.string()).optional(),
    notes: z.string().optional(),
  })
  .strict();

export type UpdateAffiliateInput = z.infer<typeof zodUpdateAffiliateSchema>;

/**
 * Named validators — use these directly in your Express routes
 */
export const validateCreateAffiliate = validateBody(zodCreateAffiliateSchema);
export const validateUpdateAffiliate = validateBody(zodUpdateAffiliateSchema);

