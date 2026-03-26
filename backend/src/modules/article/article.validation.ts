import { z } from 'zod';
import { validateBody } from '../../handlers/zod-error-handler';

const booleanFromForm = z.preprocess((value) => {
  if (value === 'true') return true;
  if (value === 'false') return false;
  return value;
}, z.boolean());

const zodCreateArticleSchema = z.object({
  title: z
    .string({ message: 'Title is required' })
    .min(5, 'Title must be at least 5 characters')
    .max(200, 'Title cannot exceed 200 characters')
    .trim(),
  content: z
    .string({ message: 'Content is required' })
    .min(20, 'Content must be at least 20 characters'),
  category: z
    .string({ message: 'Category is required' })
    .min(2, 'Category is required')
    .trim(),
  image: z.string().url('Invalid image URL').optional().or(z.literal('')).or(z.any()),
  isActive: booleanFromForm.optional(),
}).strict();

export type CreateArticleInput = z.infer<typeof zodCreateArticleSchema>;

const zodUpdateArticleSchema = z.object({
  title: z
    .string()
    .min(5, 'Title must be at least 5 characters')
    .max(200, 'Title cannot exceed 200 characters')
    .trim()
    .optional(),
  content: z
    .string()
    .min(20, 'Content must be at least 20 characters')
    .optional(),
  category: z
    .string()
    .min(2, 'Category is required')
    .trim()
    .optional(),
  image: z.string().url('Invalid image URL').optional().or(z.literal('')).or(z.any()),
  isActive: booleanFromForm.optional(),
}).strict().refine((data) => Object.keys(data).length > 0, {
  message: 'At least one field must be provided for update',
});

export type UpdateArticleInput = z.infer<typeof zodUpdateArticleSchema>;

export const validateCreateArticle = validateBody(zodCreateArticleSchema);
export const validateUpdateArticle = validateBody(zodUpdateArticleSchema);
