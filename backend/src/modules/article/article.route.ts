import { Router } from 'express';
import * as ArticleController from './article.controller';
import authorizedRoles from '../../middlewares/authorized-roles';
import isAuthorized from '../../middlewares/is-authorized';
import { UserRole } from '../../model/user/user.schema';
import { validateId } from '../../handlers/common-zod-validator';
import { validateCreateArticle, validateUpdateArticle } from './article.validation';

const router = Router();

/**
 * @route POST /api/v1/article
 * @description Create a new article
 * @access Private (Admin only)
 */
router.post(
  '/',
  isAuthorized,
  authorizedRoles([UserRole.ADMIN]),
  validateCreateArticle,
  ArticleController.createArticle
);

/**
 * @route GET /api/v1/article
 * @description Get all articles with pagination and filters
 * @access Public
 */
router.get('/', ArticleController.getAllArticles);

/**
 * @route GET /api/v1/article/:slug
 * @description Get a single article by slug
 * @access Public
 */
router.get('/:slug', ArticleController.getArticleBySlug);

/**
 * @route GET /api/v1/article/get-article-by-id/:id
 * @description Get a single article by ID
 * @access Public
 */
router.get('/get-article-by-id/:id', ArticleController.getArticleById);

/**
 * @route PUT /api/v1/article/:id
 * @description Update an article
 * @access Private (Admin only)
 */
router.put(
  '/:id',
  isAuthorized,
  authorizedRoles([UserRole.ADMIN]),
  validateId,
  validateUpdateArticle,
  ArticleController.updateArticle
);

/**
 * @route DELETE /api/v1/article/:id
 * @description Delete an article
 * @access Private (Admin only)
 */
router.delete(
  '/:id',
  isAuthorized,
  authorizedRoles([UserRole.ADMIN]),
  validateId,
  ArticleController.deleteArticle
);

module.exports = router;
