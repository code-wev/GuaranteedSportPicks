import { isMongoId } from 'validator';
import { z } from 'zod';
import { validateBody } from '../../handlers/zod-error-handler';

export const PackageNameEnum = ['DAILY', 'WEEKLY', 'MONTHLY', 'SEASONAL'] as const;

/**
 * Base Selected Sport Schema (Array of String)
 */
const selectedSportSchema = z
  .array(z.string())
  .min(1, { message: 'At least one sport must be selected' });

/**
 * -----------------------------------------
 * CREATE SUBSCRIPTION VALIDATION
 * -----------------------------------------
 */
const zodCreateSubscriptionSchema = z
  .object({
    packageName: z.enum(PackageNameEnum, {
      message: 'Package name must be DAILY, WEEKLY, MONTHLY or SEASONAL',
    }),
    selectedSport: z.array(z.string()).min(1, { message: 'At least one sport must be selected' }),
    price: z.number().optional(),
    isSeasonal: z.boolean({ message: 'isSeasonal is required and must be boolean' }).optional(),
    isSession: z.boolean().optional(), // Backwards compatibility
    seasonalDays: z.number().int().positive().optional(),
    seasonalPrice: z.number().positive().optional(),
    customDays: z.number().int().positive().optional(), // Backwards compatibility
    customPrice: z.number().positive().optional(), // Backwards compatibility
  })
  .superRefine((data, ctx) => {
    // Map old field names to new ones for backwards compatibility
    if (data.isSession !== undefined && data.isSeasonal === undefined) {
      (data as any).isSeasonal = data.isSession;
    }
    if (data.customDays !== undefined && data.seasonalDays === undefined) {
      (data as any).seasonalDays = data.customDays;
    }
    if (data.customPrice !== undefined && data.seasonalPrice === undefined) {
      (data as any).seasonalPrice = data.customPrice;
    }

    /**
     * SEASONAL VALIDATION RULES
     */
    if (data.packageName === 'SEASONAL') {
      const seasonalDays = (data as any).seasonalDays;
      const seasonalPrice = (data as any).seasonalPrice;

      if (!seasonalDays) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'seasonalDays is required for SEASONAL package',
          path: ['seasonalDays'],
        });
      }

      if (seasonalDays && seasonalDays < 1) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'seasonalDays must be at least 1',
          path: ['seasonalDays'],
        });
      }

      if (!seasonalPrice) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'seasonalPrice is required for SEASONAL package',
          path: ['seasonalPrice'],
        });
      }

      if (seasonalPrice && seasonalPrice < 1) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'seasonalPrice must be at least 1',
          path: ['seasonalPrice'],
        });
      }
    }

    /**
     * FIXED PACKAGE RULES (DAILY, WEEKLY, MONTHLY)
     */
    if (data.packageName !== 'SEASONAL') {
      const seasonalDays = (data as any).seasonalDays;
      const seasonalPrice = (data as any).seasonalPrice;

      if (seasonalDays !== undefined) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'seasonalDays is allowed only for SEASONAL package',
          path: ['seasonalDays'],
        });
      }

      if (seasonalPrice !== undefined) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'seasonalPrice is allowed only for SEASONAL package',
          path: ['seasonalPrice'],
        });
      }

      if (data.price === undefined) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Price is required for this package',
          path: ['price'],
        });
      }
    }
  });

export type CreateSubscriptionInput = z.infer<typeof zodCreateSubscriptionSchema>;

/**
 * -----------------------------------------
 * BULK CREATE VALIDATION
 * -----------------------------------------
 */
const zodCreateManySubscriptionSchema = z
  .array(zodCreateSubscriptionSchema)
  .min(1, { message: 'At least one subscription object is required' });

export type CreateManySubscriptionInput = z.infer<typeof zodCreateManySubscriptionSchema>;

/**
 * -----------------------------------------
 * UPDATE SUBSCRIPTION VALIDATION
 * → All fields optional
 * -----------------------------------------
 */
const zodUpdateSubscriptionSchema = z
  .object({
    packageName: z.enum(PackageNameEnum).optional(),
    selectedSport: selectedSportSchema.optional(),
    seasonalDays: z.number().int().positive().optional(),
    seasonalPrice: z.number().positive().optional(),
    customDays: z.number().int().positive().optional(), // Backwards compatibility
    customPrice: z.number().positive().optional(), // Backwards compatibility
    isSubscribed: z.boolean().optional(),
  })
  .superRefine((data, ctx) => {
    // Map old field names to new ones for backwards compatibility
    if (data.customDays !== undefined && data.seasonalDays === undefined) {
      (data as any).seasonalDays = data.customDays;
    }
    if (data.customPrice !== undefined && data.seasonalPrice === undefined) {
      (data as any).seasonalPrice = data.customPrice;
    }
  });

export type UpdateSubscriptionInput = z.infer<typeof zodUpdateSubscriptionSchema>;

/**
 * -----------------------------------------
 * BULK UPDATE (Single Item Schema)
 * -----------------------------------------
 */
const zodUpdateManySubscriptionForBulkSchema =
  zodUpdateSubscriptionSchema
    .extend({
      id: z.string().refine(isMongoId, {
        message: 'Please provide a valid MongoDB ObjectId',
      }),
    })
    .refine((data) => Object.keys(data).length > 1, {
      message: 'At least one field to update must be provided',
    });

/**
 * -----------------------------------------
 * BULK UPDATE VALIDATION (Array)
 * -----------------------------------------
 */
const zodUpdateManySubscriptionSchema = z
  .array(zodUpdateManySubscriptionForBulkSchema)
  .min(1, {
    message: 'At least one subscription update object is required',
  });

export type UpdateManySubscriptionInput = z.infer<typeof zodUpdateManySubscriptionSchema>;

/**
 * -----------------------------------------
 * EXPRESS VALIDATORS
 * -----------------------------------------
 */
export const validateCreateSubscription =
  validateBody(zodCreateSubscriptionSchema);

export const validateCreateManySubscription =
  validateBody(zodCreateManySubscriptionSchema);

export const validateUpdateSubscription =
  validateBody(zodUpdateSubscriptionSchema);

export const validateUpdateManySubscription =
  validateBody(zodUpdateManySubscriptionSchema);
