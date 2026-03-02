import { isMongoId } from 'validator';
import { z } from 'zod';
import { validateBody } from '../../handlers/zod-error-handler';

export const SelectedSportEnum = ['NFL', 'NBA', 'MLB', 'NHL'] as const;
export const PackageNameEnum = ['DAILY', 'WEEKLY', 'MONTHLY', 'SESSION'] as const;

/**
 * Create Subscription Validation
 */
const zodCreateSubscriptionSchema = z
  .object({
    userId: z
      .string()
      .refine(isMongoId, { message: 'Invalid userId, must be a valid MongoDB ObjectId' }),

    packageName: z.enum(PackageNameEnum, {
      message: 'Package name must be DAILY, WEEKLY, MONTHLY or SESSION',
    }),

    selectedSport: z.enum(SelectedSportEnum, {
      message: 'Selected sport must be NFL, NBA, MLB, or NHL',
    }),

    customDays: z.number().int().positive().optional(),
    customPrice: z.number().positive().optional(),
  })
  .superRefine((data, ctx) => {
    /**
     * SESSION VALIDATION RULES
     */
    if (data.packageName === 'SESSION') {
      if (!data.customDays) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'customDays is required for SESSION package',
          path: ['customDays'],
        });
      }
      if (data.customDays && data.customDays < 1) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'customDays must be at least 1',
          path: ['customDays'],
        });
      }
    }

    /**
     * FIXED PACKAGE RULES
     */
    if (data.packageName !== 'SESSION') {
      if (data.customDays !== undefined) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'customDays is allowed only for SESSION package',
          path: ['customDays'],
        });
      }
      if (data.customPrice !== undefined) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'customPrice is allowed only for SESSION package',
          path: ['customPrice'],
        });
      }
    }
  })
  .strict();

export type CreateSubscriptionInput = z.infer<typeof zodCreateSubscriptionSchema>;

/**
 * Bulk Create Validation
 */
const zodCreateManySubscriptionSchema = z
  .array(zodCreateSubscriptionSchema)
  .min(1, { message: 'At least one subscription object is required' });

export type CreateManySubscriptionInput = z.infer<typeof zodCreateManySubscriptionSchema>;

/**
 * Update Subscription Validation
 * → All fields optional
 */
const zodUpdateSubscriptionSchema = z
  .object({
    packageName: z.enum(PackageNameEnum).optional(),
    selectedSport: z.enum(SelectedSportEnum).optional(),
    customDays: z.number().int().positive().optional(),
    customPrice: z.number().positive().optional(),
    isSubscribed: z.boolean().optional(),
  })
  .strict();

export type UpdateSubscriptionInput = z.infer<typeof zodUpdateSubscriptionSchema>;

/**
 * Bulk Update Single Item
 */
const zodUpdateManySubscriptionForBulkSchema = zodUpdateSubscriptionSchema
  .extend({
    id: z.string().refine(isMongoId, { message: 'Please provide a valid MongoDB ObjectId' }),
  })
  .refine((data) => Object.keys(data).length > 1, {
    message: 'At least one field to update must be provided',
  });

/**
 * Bulk Update Validation (Array)
 */
const zodUpdateManySubscriptionSchema = z
  .array(zodUpdateManySubscriptionForBulkSchema)
  .min(1, { message: 'At least one subscription update object is required' });

export type UpdateManySubscriptionInput = z.infer<typeof zodUpdateManySubscriptionSchema>;

/**
 * Express Validators
 */
export const validateCreateSubscription = validateBody(zodCreateSubscriptionSchema);
export const validateCreateManySubscription = validateBody(zodCreateManySubscriptionSchema);
export const validateUpdateSubscription = validateBody(zodUpdateSubscriptionSchema);
export const validateUpdateManySubscription = validateBody(zodUpdateManySubscriptionSchema);