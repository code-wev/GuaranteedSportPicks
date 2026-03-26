import { Request, Response } from 'express';
import { AuthenticatedRequest } from 'src/middlewares/is-authorized';
import { SearchQueryInput } from '../../handlers/common-zod-validator';
import ServerResponse from '../../helpers/responses/custom-response';
import catchAsync from '../../utils/catch-async/catch-async';
import { affiliateServices } from './affiliate.service';

export const createAffiliate = catchAsync(async (req: AuthenticatedRequest, res: Response) => {
  req.body.userId = req.user!._id;

  const result = await affiliateServices.createAffiliate(req.body);
  ServerResponse(res, true, 201, 'Affiliate request submitted successfully', result);
});

export const updateAffiliate = catchAsync(async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const result = await affiliateServices.updateAffiliate(id as string, req.body, req.user!._id);

  if (!result) {
    throw new Error('Affiliate request not found');
  }

  ServerResponse(res, true, 200, 'Affiliate updated successfully', result);
});

export const approveAffiliate = catchAsync(async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const result = await affiliateServices.approveAffiliate(id as string, req.body);

  if (!result) {
    throw new Error('Affiliate request not found');
  }

  ServerResponse(res, true, 200, 'Affiliate request updated successfully', result);
});

export const deleteAffiliate = catchAsync(async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const result = await affiliateServices.deleteAffiliate(id as string);
  if (!result) throw new Error('Failed to delete affiliate');

  ServerResponse(res, true, 200, 'Affiliate deleted successfully');
});

export const deleteManyAffiliate = catchAsync(async (req: Request, res: Response) => {
  const { ids } = req.body;
  const result = await affiliateServices.deleteManyAffiliate(ids);
  if (!result) throw new Error('Failed to delete multiple affiliates');

  ServerResponse(res, true, 200, 'Affiliates deleted successfully');
});

export const getAffiliateById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await affiliateServices.getAffiliateById(id as string);
  if (!result) throw new Error('Affiliate not found');

  ServerResponse(res, true, 200, 'Affiliate retrieved successfully', result);
});

export const getMyAffiliate = catchAsync(async (req: AuthenticatedRequest, res: Response) => {
  const result = await affiliateServices.getMyAffiliate(req.user!._id);

  ServerResponse(res, true, 200, 'Affiliate summary retrieved successfully', result);
});

export const getManyAffiliate = catchAsync(async (req: Request, res: Response) => {
  const query = req.query as SearchQueryInput;
  const { affiliates, totalData, totalPages } = await affiliateServices.getManyAffiliate(query);

  ServerResponse(res, true, 200, 'Affiliates retrieved successfully', {
    affiliates,
    totalData,
    totalPages,
  });
});

export const getAffiliateAdminSummary = catchAsync(async (_req: Request, res: Response) => {
  const result = await affiliateServices.getAffiliateAdminSummary();

  ServerResponse(res, true, 200, 'Affiliate admin summary retrieved successfully', result);
});
