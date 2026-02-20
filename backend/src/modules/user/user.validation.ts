import { isMongoId } from 'validator';
import { z } from 'zod';
import { validateBody } from '../../handlers/zod-error-handler';

/**
 * User Validation Schemas and Types
 *
 * This module defines Zod schemas for validating user related
 * requests such as creation (single + bulk) and updates (single + bulk).
 * It also exports corresponding TypeScript types inferred from these schemas.
 * Each schema includes detailed validation rules and custom error messages
 * to ensure data integrity and provide clear feedback to API consumers.
 *
 * Named validator middleware functions are exported for direct use in Express routes.
 */

/**
 * Zod schema for validating data when **creating** a single user.
 *
 * → Add all **required** fields here
 */
const zodCreateUserSchema = z
  .object({
    firstName: z
      .string({ message: 'First name is required' })
      .min(2, 'First name must be at least 2 characters')
      .max(50, 'First name cannot exceed 50 characters')
      .trim(),

    lastName: z
      .string({ message: 'Last name is required' })
      .min(2, 'Last name must be at least 2 characters')
      .max(50, 'Last name cannot exceed 50 characters')
      .trim(),

    email: z
      .string({ message: 'Email is required' })
      .email('Invalid email format')
      .toLowerCase()
      .trim(),

    phoneNumber: z
      .string({ message: 'Phone number is required' })
      .min(10, 'Phone number must be at least 10 digits')
      .max(15, 'Phone number cannot exceed 15 digits')
      .regex(/^[0-9+\-\s]+$/, 'Phone number can only contain digits, +, -, and spaces')
      .trim(),

    password: z
      .string({ message: 'Password is required' })
      .min(6, 'Password must be at least 6 characters')
      .max(100, 'Password cannot exceed 100 characters')
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        'Password must contain at least one uppercase letter, one lowercase letter, and one number'
      ),
  })
  .strict();

export type CreateUserInput = z.infer<typeof zodCreateUserSchema>;

/**
 * Zod schema for validating **bulk creation** (array of user objects).
 */
const zodCreateManyUserSchema = z
  .array(zodCreateUserSchema)
  .min(1, { message: 'At least one user must be provided for bulk creation' });

export type CreateManyUserInput = z.infer<typeof zodCreateManyUserSchema>;

/**
 * Zod schema for validating data when **updating** an existing user.
 *
 * → All fields should usually be .optional()
 */
const zodUpdateUserSchema = z
  .object({
    firstName: z
      .string()
      .min(2, 'First name must be at least 2 characters')
      .max(50, 'First name cannot exceed 50 characters')
      .trim()
      .optional(),

    lastName: z
      .string()
      .min(2, 'Last name must be at least 2 characters')
      .max(50, 'Last name cannot exceed 50 characters')
      .trim()
      .optional(),

    email: z.string().email('Invalid email format').toLowerCase().trim().optional(),

    phoneNumber: z
      .string()
      .min(10, 'Phone number must be at least 10 digits')
      .max(15, 'Phone number cannot exceed 15 digits')
      .regex(/^[0-9+\-\s]+$/, 'Phone number can only contain digits, +, -, and spaces')
      .trim()
      .optional(),

    password: z
      .string()
      .min(6, 'Password must be at least 6 characters')
      .max(100, 'Password cannot exceed 100 characters')
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        'Password must contain at least one uppercase letter, one lowercase letter, and one number'
      )
      .optional(),
  })
  .strict()
  .refine((data) => Object.keys(data).length > 0, {
    message: 'At least one field must be provided for update',
  });

export type UpdateUserInput = z.infer<typeof zodUpdateUserSchema>;

/**
 * Zod schema for validating bulk updates (array of partial user objects).
 */
const zodUpdateManyUserForBulkSchema = zodUpdateUserSchema
  .extend({
    id: z.string().refine(isMongoId, { message: 'Please provide a valid MongoDB ObjectId' }),
  })
  .refine((data) => Object.keys(data).length > 1, {
    message: 'At least one field to update must be provided along with the id',
  });

/**
 * Zod schema for validating an array of multiple user updates.
 */
const zodUpdateManyUserSchema = z
  .array(zodUpdateManyUserForBulkSchema)
  .min(1, { message: 'At least one user update object must be provided' });

export type UpdateManyUserInput = z.infer<typeof zodUpdateManyUserSchema>;

/**
 * Named validators — use these directly in your Express routes
 */
export const validateCreateUser = validateBody(zodCreateUserSchema);
export const validateCreateManyUser = validateBody(zodCreateManyUserSchema);
export const validateUpdateUser = validateBody(zodUpdateUserSchema);
export const validateUpdateManyUser = validateBody(zodUpdateManyUserSchema);
