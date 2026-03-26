import { NextFunction, Request, Response } from 'express';
import ServerResponse from '../../helpers/responses/custom-response';

/**
 * A utility function to handle asynchronous route handlers and middleware.
 *
 * This function wraps asynchronous route handlers or middleware and catches any
 * errors that are thrown or returned as rejected promises. It forwards these errors
 * to the next middleware in the stack using `next()`, ensuring proper error handling
 * in Express applications.
 *
 * @param {Function} fn - The asynchronous route handler or middleware function to be wrapped.
 * @returns {Function} A new function that wraps the provided asynchronous handler or middleware.
 */
const catchAsync = (
  fn: (req: Request, res: Response, next?: NextFunction) => Promise<void | any>
): ((req: Request, res: Response, next: NextFunction) => void) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    // Wrap the handler function in a promise to catch any errors
    Promise.resolve(fn(req, res, next)).catch((err) => {
      // Log the error for debugging purposes (optional)
      console.error('Async error:', err);
      // Send a standardized error response
      ServerResponse(res, false, 500, 'An unexpected error occurred', null, null, err.message);
    });
  };
};

export default catchAsync;
