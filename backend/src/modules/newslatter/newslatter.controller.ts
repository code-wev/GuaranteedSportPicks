import { Request, Response } from 'express';
import { AuthenticatedRequest } from 'src/middlewares/is-authorized';
import { SearchQueryInput } from '../../handlers/common-zod-validator';
import ServerResponse from '../../helpers/responses/custom-response';
import catchAsync from '../../utils/catch-async/catch-async';
import { newslatterServices } from './newslatter.service';

/**
 * Controller function to handle the creation of a single newslatter.
 *
 * @param {Request} req - The request object containing newslatter data in the body.
 * @param {Response} res - The response object used to send the response.
 * @returns {Promise<Partial<INewslatter>>} - The created newslatter.
 * @throws {Error} - Throws an error if the newslatter creation fails.
 */
export const createNewslatter = catchAsync(async (req: AuthenticatedRequest, res: Response) => {


  // Call the service method to create a new newslatter and get the result
const userId = req.user!._id;
  req.body.userId = userId;
  req.body.email = req.user!.email
  const result = await newslatterServices.createNewslatter(req.body);
  if (!result) throw new Error('Failed to create newslatter');
  // Send a success response with the created newslatter data
  ServerResponse(res, true, 201, 'Newslatter created successfully', result);
});

/**
 * Controller function to handle the update operation for a single newslatter.
 *
 * @param {Request} req - The request object containing the ID of the newslatter to update in URL parameters and the updated data in the body.
 * @param {Response} res - The response object used to send the response.
 * @returns {Promise<Partial<INewslatter>>} - The updated newslatter.
 * @throws {Error} - Throws an error if the newslatter update fails.
 */
export const updateNewslatter = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  // Call the service method to update the newslatter by ID and get the result
  const result = await newslatterServices.updateNewslatter(id as string, req.body);
  if (!result) throw new Error('Failed to update newslatter');
  // Send a success response with the updated newslatter data
  ServerResponse(res, true, 200, 'Newslatter updated successfully', result);
});

/**
 * Controller function to handle the retrieval of a single newslatter by ID.
 *
 * @param {Request} req - The request object containing the ID of the newslatter to retrieve in URL parameters.
 * @param {Response} res - The response object used to send the response.
 * @returns {Promise<Partial<INewslatter>>} - The retrieved newslatter.
 * @throws {Error} - Throws an error if the newslatter retrieval fails.
 */
export const getNewslatterById = catchAsync(async (req: AuthenticatedRequest, res: Response) => {

  console.log("Hit");
const id = req.user!._id;

  // Call the service method to get the newslatter by ID and get the result
  const result = await newslatterServices.getNewslatterById(id as string);
  if (!result) throw new Error('Newslatter not found');
  // Send a success response with the retrieved resource data
  ServerResponse(res, true, 200, 'Newslatter retrieved successfully', result);
});

/**
 * Controller function to handle the retrieval of multiple newslatters.
 *
 * @param {Request} req - The request object containing query parameters for filtering.
 * @param {Response} res - The response object used to send the response.
 * @returns {Promise<Partial<INewslatter>[]>} - The retrieved newslatters.
 * @throws {Error} - Throws an error if the newslatters retrieval fails.
 */
export const getManyNewslatter = catchAsync(async (req: Request, res: Response) => {
  // Type assertion for query parameters
  const query = req.query as SearchQueryInput;
  // Call the service method to get multiple newslatters based on query parameters and get the result
  const { newslatters, totalData, totalPages } = await newslatterServices.getManyNewslatter(query);
  if (!newslatters) throw new Error('Failed to retrieve newslatters');
  // Send a success response with the retrieved newslatters data
  ServerResponse(res, true, 200, 'Newslatters retrieved successfully', {
    newslatters,
    totalData,
    totalPages,
  });
});

