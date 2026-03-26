import { Request, Response } from 'express';
import { authServices } from './auth.service';
import { SearchQueryInput } from '../../handlers/common-zod-validator';
import ServerResponse from '../../helpers/responses/custom-response';
import catchAsync from '../../utils/catch-async/catch-async';
import {
  ForgotPasswordInput,
  ResendVerificationEmailInput,
  VerifyEmailInput,
} from './auth.validation';
import { IChangePassword, ILogin } from './auth.interface';
import { AuthenticatedRequest } from 'src/middlewares/is-authorized';

/**
 * Controller function to handle the creation of a single auth.
 *
 * @param {Request} req - The request object containing auth data in the body.
 * @param {Response} res - The response object used to send the response.
 * @returns {Promise<Partial<IAuth>>} - The created auth.
 * @throws {Error} - Throws an error if the auth creation fails.
 */
export const registerUser = catchAsync(async (req: Request, res: Response) => {
  // Call the service method to create a new auth and get the result
  const result = await authServices.registerUser(req.body);
  if (!result) throw new Error('Failed to create auth');
  // Send a success response with the created auth data
  ServerResponse(res, true, 201, 'Auth created successfully', result);
});

export const login = catchAsync(async (req: Request, res: Response) => {
  // Build the login payload including meta added by `requestMeta` middleware

  // Call the service method to perform login and get the result
  const result = await authServices.login(req.body as ILogin);

  // Send a success response with the created auth data
  ServerResponse(res, true, 201, 'Login successful', result);
});

/**
 * Controller function to handle the update operation for a single auth.
 *
 * @param {Request} req - The request object containing the ID of the auth to update in URL parameters and the updated data in the body.
 * @param {Response} res - The response object used to send the response.
 * @returns {Promise<Partial<IAuth>>} - The updated auth.
 * @throws {Error} - Throws an error if the auth update fails.
 */
export const updateAuth = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  // Call the service method to update the auth by ID and get the result
  const result = await authServices.updateAuth(id as string, req.body);
  if (!result) throw new Error('Failed to update auth');
  // Send a success response with the updated auth data
  ServerResponse(res, true, 200, 'Auth updated successfully', result);
});

/**
 * Controller function to handle the deletion of a single auth.
 *
 * @param {Request} req - The request object containing the ID of the auth to delete in URL parameters.
 * @param {Response} res - The response object used to send the response.
 * @returns {Promise<Partial<IAuth>>} - The deleted auth.
 * @throws {Error} - Throws an error if the auth deletion fails.
 */
export const deleteAuth = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  // Call the service method to delete the auth by ID
  const result = await authServices.deleteAuth(id as string);
  if (!result) throw new Error('Failed to delete auth');
  // Send a success response confirming the deletion
  ServerResponse(res, true, 200, 'Auth deleted successfully');
});

/**
 * Controller function to handle the deletion of multiple auths.
 *
 * @param {Request} req - The request object containing an array of IDs of auth to delete in the body.
 * @param {Response} res - The response object used to send the response.
 * @returns {Promise<Partial<IAuth>[]>} - The deleted auths.
 * @throws {Error} - Throws an error if the auth deletion fails.
 */
export const deleteManyAuth = catchAsync(async (req: Request, res: Response) => {
  // Extract ids from request body
  const { ids } = req.body;
  // Call the service method to delete multiple auths and get the result
  const result = await authServices.deleteManyAuth(ids);
  if (!result) throw new Error('Failed to delete multiple auths');
  // Send a success response confirming the deletions
  ServerResponse(res, true, 200, 'Auths deleted successfully');
});

/**
 * Controller function to handle the retrieval of a single auth by ID.
 *
 * @param {Request} req - The request object containing the ID of the auth to retrieve in URL parameters.
 * @param {Response} res - The response object used to send the response.
 * @returns {Promise<Partial<IAuth>>} - The retrieved auth.
 * @throws {Error} - Throws an error if the auth retrieval fails.
 */
export const getAuthById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  // Call the service method to get the auth by ID and get the result
  const result = await authServices.getAuthById(id as string);
  if (!result) throw new Error('Auth not found');
  // Send a success response with the retrieved resource data
  ServerResponse(res, true, 200, 'Auth retrieved successfully', result);
});

/**
 * Controller function to handle the retrieval of multiple auths.
 *
 * @param {Request} req - The request object containing query parameters for filtering.
 * @param {Response} res - The response object used to send the response.
 * @returns {Promise<Partial<IAuth>[]>} - The retrieved auths.
 * @throws {Error} - Throws an error if the auths retrieval fails.
 */
export const getManyAuth = catchAsync(async (req: Request, res: Response) => {
  // Type assertion for query parameters
  const query = req.query as SearchQueryInput;
  // Call the service method to get multiple auths based on query parameters and get the result
  const { auths, totalData, totalPages } = await authServices.getManyAuth(query);
  if (!auths) throw new Error('Failed to retrieve auths');
  // Send a success response with the retrieved auths data
  ServerResponse(res, true, 200, 'Auths retrieved successfully', { auths, totalData, totalPages });
});

/**
 * Controller function to handle the email verification.
 *
 * @param {Request} req - The request object containing verification data in the body.
 * @param {Response} res - The response object used to send the response.
 * @returns {Promise<void>} - A promise that resolves when the email is verified.
 * @throws {Error} - Throws an error if the email verification fails.
 */
export const verifyEmail = catchAsync(async (req: Request, res: Response) => {
  // Call the service method to verify email
  await authServices.verifyEmail(req.body as VerifyEmailInput);
  // Send a success response indicating email verification
  ServerResponse(res, true, 200, 'Email verified successfully');
});

/** Controller function to handle resending the verification email.
 *
 * @param {Request} req - The request object containing email data in the body.
 * @param {Response} res - The response object used to send the response.
 * @returns {Promise<void>} - A promise that resolves when the verification email is resent.
 * @throws {Error} - Throws an error if the resend verification email process fails.
 */
export const resendVerificationEmail = catchAsync(async (req: Request, res: Response) => {
  // Call the service method to resend verification email
  await authServices.resendVerificationEmail(req.body as ResendVerificationEmailInput);
  // Send a success response indicating email verification
  ServerResponse(res, true, 200, 'Verification email resent successfully');
});

/**
 * Controller function to handle the forget password.
 *
 * @param {Request} req - The request object containing forget password data in the body.
 * @param {Response} res - The response object used to send the response.
 * @returns {Promise<void>} - A promise that resolves when the forget password process is initiated.
 * @throws {Error} - Throws an error if the forget password process fails.
 */
export const forgetPassword = catchAsync(async (req: Request, res: Response) => {
  // Call the service method to initiate forget password process
  await authServices.forgetPassword(req.body as ForgotPasswordInput);
  // Send a success response indicating forget password initiation
  ServerResponse(res, true, 200, 'Password reset link sent successfully');
});

/**
 * Controller function to handle the reset password.
 *
 * @param {Request} req - The request object containing reset password data in the body.
 * @param {Response} res - The response object used to send the response.
 * @returns {Promise<void>} - A promise that resolves when the password is reset.
 * @throws {Error} - Throws an error if the password reset process fails.
 */
export const resetPassword = catchAsync(async (req: Request, res: Response) => {
  // Call the service method to reset the password
  await authServices.resetPassword(req.body);
  // Send a success response indicating password reset
  ServerResponse(res, true, 200, 'Password reset successfully');
});

/**
 * Controller function to handle the change password.
 *
 * @param {Request} req - The request object containing change password data in the body.
 * @param {Response} res - The response object used to send the response.
 * @returns {Promise<void>} - A promise that resolves when the password is changed.
 * @throws {Error} - Throws an error if the password change process fails.
 */

// todo: Implement change password controller and service function
// ! after authanticaiotn done then
export const changePassword = catchAsync(async (req: AuthenticatedRequest, res: Response) => {
  // Call the service method to change the password
  const userId = req.user!._id;
  await authServices.changePassword({ userId, ...req.body } as IChangePassword);
  // Send a success response indicating password change
  ServerResponse(res, true, 200, 'Password changed successfully');
});
