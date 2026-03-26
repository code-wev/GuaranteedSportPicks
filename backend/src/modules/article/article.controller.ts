import { Request, Response } from 'express';
import ServerResponse from '../../helpers/responses/custom-response';
import catchAsync from '../../utils/catch-async/catch-async';
import * as ArticleService from './article.service';
import { AuthenticatedRequest } from '../../middlewares/is-authorized';
import { uploadToImgBB } from '../../utils/image-upload/imgbb';

export const createArticle = catchAsync(async (req: AuthenticatedRequest, res: Response) => {
  console.log('--- START CREATE ARTICLE ---');
  console.log('Request Body:', req.body);
  console.log('Request Files:', req.files ? Object.keys(req.files) : 'No files');

  let imageUrl = req.body.image;

  // Handle file upload if present
  if (req.files && req.files.image) {
    console.log('Image file detected. Attempting upload...');
    const file = req.files.image;
    try {
      imageUrl = await uploadToImgBB(file);
      console.log('Image uploaded successfully. URL:', imageUrl);
    } catch (err) {
      console.error('CRITICAL: Image upload failed inside controller:', err);
      throw err;
    }
  } else {
    console.log('No image file provided in request. Using body image URL if present.');
  }

  const articleData = {
    ...req.body,
    image: imageUrl,
    author: req.user?._id,
  };
  const result = await ArticleService.createArticleService(articleData);
  return ServerResponse(res, true, 201, 'Article created successfully', result);
});

export const getAllArticles = catchAsync(async (req: Request, res: Response) => {
  const result = await ArticleService.getAllArticlesService(req.query);
  // ServerResponse(res, success, status, message, data, errors, error, meta)
  return ServerResponse(res, true, 200, 'Articles fetched successfully', result.articles, null, null, result.meta);
});

export const getArticleBySlug = catchAsync(async (req: Request, res: Response) => {
  const result = await ArticleService.getArticleBySlugService(req.params.slug as string);
  if (!result) {
    return ServerResponse(res, false, 404, 'Article not found');
  }
  return ServerResponse(res, true, 200, 'Article fetched successfully', result);
});

export const getArticleById = catchAsync(async (req: Request, res: Response) => {
  const result = await ArticleService.getArticleByIdService(req.params.id as string);
  if (!result) {
    return ServerResponse(res, false, 404, 'Article not found');
  }
  return ServerResponse(res, true, 200, 'Article fetched successfully', result);
});

export const updateArticle = catchAsync(async (req: Request, res: Response) => {
  let imageUrl = req.body.image;

  if (req.files && req.files.image) {
    const file = req.files.image;
    imageUrl = await uploadToImgBB(file);
  }

  const updateData = {
    ...req.body,
  };

  if (imageUrl) {
    updateData.image = imageUrl;
  }

  const result = await ArticleService.updateArticleService(req.params.id as string, updateData);
  if (!result) {
    return ServerResponse(res, false, 404, 'Article not found');
  }
  return ServerResponse(res, true, 200, 'Article updated successfully', result);
});

export const deleteArticle = catchAsync(async (req: Request, res: Response) => {
  const result = await ArticleService.deleteArticleService(req.params.id as string);
  if (!result) {
    return ServerResponse(res, false, 404, 'Article not found');
  }
  return ServerResponse(res, true, 200, 'Article deleted successfully', result);
});
