import { isMongoId } from 'validator';
import { z } from 'zod';
import { validateBody } from '../../handlers/zod-error-handler';

/**
 * Outcome Schema
 */
const zodOutcomeSchema = z.object({
  name: z.string({ message: 'Outcome name is required' }),
  price: z.number({ message: 'Outcome price must be a number' }),
});

/**
 * Market Schema
 */
const zodMarketSchema = z.object({
  Key: z.string({ message: 'Market Key is required' }),
  last_update: z.string({ message: 'Market last_update is required' }),
  outComes: z.array(zodOutcomeSchema, {
    message: 'outComes must be an array of outcomes',
  }),
});

/**
 * Bookmaker Schema
 */
const zodBookmakerSchema = z.object({
  key: z.string({ message: 'Bookmaker key is required' }),
  title: z.string({ message: 'Bookmaker title is required' }),
  last_update: z.string({ message: 'Bookmaker last_update is required' }),
  markets: z.array(zodMarketSchema, {
    message: 'Bookmaker markets must be an array of markets',
  }),
});

/**
 * Odds Schema
 */
const zodOddsSchema = z.object({
  home_team: z.number({ message: 'home_team odds is required' }),
  away_team: z.number({ message: 'away_team odds is required' }),
  draw: z.number().optional(),
});

/**
 * ------------------------------------------------------
 * Create Single Picks Schema
 * ------------------------------------------------------
 */
const zodCreatePicksSchema = z
  .object({
    sportId: z.string({ message: 'sportId is required' }),
    sportKey: z.string({ message: 'sportKey is required' }),
    commence_time: z.string({ message: 'commence_time is required' }),
    home_team: z.string({ message: 'home_team is required' }),
    away_team: z.string({ message: 'away_team is required' }),
    odds: zodOddsSchema,
    bookmakers: z.array(zodBookmakerSchema).optional(),
  })
  .strict();

export type CreatePicksInput = z.infer<typeof zodCreatePicksSchema>;

/**
 * ------------------------------------------------------
 * Bulk Create Picks Schema
 * ------------------------------------------------------
 */
const zodCreateManyPicksSchema = z
  .array(zodCreatePicksSchema)
  .min(1, { message: 'At least one picks must be provided for bulk creation' });

export type CreateManyPicksInput = z.infer<typeof zodCreateManyPicksSchema>;

/**
 * ------------------------------------------------------
 * Update Single Picks Schema
 * ------------------------------------------------------
 */
const zodUpdatePicksSchema = z
  .object({
    sportId: z.string().optional(),
    sportKey: z.string().optional(),
    commence_time: z.string().optional(),
    home_team: z.string().optional(),
    away_team: z.string().optional(),
    odds: zodOddsSchema.optional(),
    bookmakers: z.array(zodBookmakerSchema).optional(),
  })
  .strict();

export type UpdatePicksInput = z.infer<typeof zodUpdatePicksSchema>;

/**
 * ------------------------------------------------------
 * Bulk Update (with Mongo ID)
 * ------------------------------------------------------
 */
const zodUpdateManyPicksForBulkSchema = zodUpdatePicksSchema
  .extend({
    id: z.string().refine(isMongoId, {
      message: 'Please provide a valid MongoDB ObjectId',
    }),
  })
  .refine((data) => Object.keys(data).length > 1, {
    message: 'At least one field to update must be provided',
  });

const zodUpdateManyPicksSchema = z
  .array(zodUpdateManyPicksForBulkSchema)
  .min(1, { message: 'At least one picks update object must be provided' });

export type UpdateManyPicksInput = z.infer<typeof zodUpdateManyPicksSchema>;

/**
 * Validator Middlewares
 */
export const validateCreatePicks = validateBody(zodCreatePicksSchema);
export const validateCreateManyPicks = validateBody(zodCreateManyPicksSchema);
export const validateUpdatePicks = validateBody(zodUpdatePicksSchema);
export const validateUpdateManyPicks = validateBody(zodUpdateManyPicksSchema);

