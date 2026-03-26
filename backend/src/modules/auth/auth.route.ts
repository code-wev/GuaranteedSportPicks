// Import Router from express
import { Router } from 'express';

// Import controller from corresponding module
import {
  changePassword,
  forgetPassword,
  login,
  registerUser,
  resendVerificationEmail,
  resetPassword,
  updateAuth,
  verifyEmail,
} from './auth.controller';

//Import validation from corresponding module

import isAuthorized from '../.../../../../src/middlewares/is-authorized';

import {
  validateChangePassword,
  validateCreateUser,
  validateForgotPassword,
  validateLogin,
  validateResendVerificationEmail,
  validateResetPassword,
  validateUpdateUser,
  validateVerifyEmail,
} from './auth.validation';

// Initialize router
const router = Router();

// Define route handlers
/**
 * @route POST /api/v1/auth/register
 * @description Create a new auth
 * @access Public
 * @param {function} validation - ['validateCreateUser']
 * @param {function} controller - ['registerUser']
 */
router.post('/register', validateCreateUser, registerUser);

/**
 * @route POST /api/v1/auth/login
 * @description Create a new auth
 * @access Public
 * @param {function} validation - ['validateCreateAuth']
 * @param {function} controller - ['createAuth']
 */
router.post('/login', validateLogin, login);

/**
 * @route PATCH /api/v1/auth/verify-email
 * @description Verify user email using email verification token
 * @access Public
 * @param {function} validation - ['verifyEmailTokenAuth']
 * @param {function} controller - ['verifyEmail']
 */
router.patch('/verify-email', validateVerifyEmail, verifyEmail);

/**
 * @route POST /api/v1/auth/resend-verification-email
 * @description Resend email verification token to user's email
 * @access Public
 * @param {middleware} resendEmailVerificationRateLimiter - ['resendEmailVerificationRateLimiter']
 * @param {function} validation - ['resendVerificationEmailAuth']
 * @param {function} controller - ['resendVerificationEmail']
 */
router.post(
  '/resend-verification-email',

  validateResendVerificationEmail,
  resendVerificationEmail
);

/**
 * @route POST /api/v1/auth/forget-password
 * @description Send password reset link to user's email
 * @access Public
 * @param {middleware} forgetPasswordRateLimiter - ['forgetPasswordRateLimiter']
 * @param {function} validation - ['forgetPasswordAuth']
 * @param {function} controller - ['forgetPassword']
 */
router.post('/forget-password', validateForgotPassword, forgetPassword);

/**
 * @route POST /api/v1/auth/reset-password
 * @description Reset user password using reset password token and user mail
 * @access Public
 * @param {function} validation - ['resetPasswordAuth']
 * @param {function} controller - ['resetPassword']
 */
router.post('/reset-password', validateResetPassword, resetPassword);

/**
 * @route PATCH /api/v1/auth/change-password
 * @description Change user password
 * @access Private
 * @param {middleware} isAuthorized - ['isAuthorized']
 * @param {function} validation - ['changePasswordAuth']
 * @param {function} controller - ['changePassword']
 */

router.patch('/change-password', isAuthorized, validateChangePassword, changePassword);

// Export the router

module.exports = router;
