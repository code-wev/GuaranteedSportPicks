// Import the model
import mongoose from 'mongoose';
import { v4 } from '../../../node_modules/uuid/dist';
import config from '../../../src/config/config';
import compareInfo from '../../../src/utils/bcrypt/compare-info';
import HashInfo from '../../../src/utils/bcrypt/hash-info';
import SendEmail from '../../../src/utils/email/send-email';
import { IdOrIdsInput, SearchQueryInput } from '../../handlers/common-zod-validator';
import User, { IUser } from '../../model/user/user.schema';
import { IChangePassword, IRegisterResponse } from './auth.interface';
import {
  CreateUserInput,
  ForgotPasswordInput,
  ResendVerificationEmailInput,
  ResetPasswordInput,
  UpdateUserInput,
  VerifyEmailInput,
} from './auth.validation';

/**
 * Service function to create a new auth.
 *
 * @param {CreateAuthInput} data - The data to create a new auth.
 * @returns {Promise<Partial<IUser>>} - The created auth.
 */
const registerUser = async (data: CreateUserInput): Promise<IRegisterResponse> => {
  // todo: chcek if user exiswt then throw an error
  // todo: hash password for save on the mo ngodb
  // todo: generate token for the user and send it in response
  // Check if user already exists in Database
  const existingUser = await User.findOne({ email: data.email });

  // If user exists, throw an error
  if (existingUser) throw new Error('User with this email already exists');
  // Hash password for MongoDB (even if Keycloak also stores it)
  const hashedPassword = await HashInfo(data.password);
  // Genaretae email verificaiton token
  const emailVerificationToken = v4();
  const emailVerificationExpiry = new Date(Date.now() + 12 * 60 * 60 * 1000); // 12 hours

  // Create new auth document with hashed password and email verification details

  const savedUser = await new User({
    ...data,
    password: hashedPassword,
    isEmailVerified: false,
    emailVerificationToken,
    emailVerificationTokenExpiry: emailVerificationExpiry,
    isActive: true, // Set to true by default, can be updated later
  }).save();

  // Send verification email
  const verificationLink = `${config.EMAIL_VERIFICATION_REDIRECT_URI}?email=${encodeURIComponent(
    data.email
  )}&token=${emailVerificationToken}`;
  // sent email for verificaiton
  await SendEmail({
    to: data.email,
    subject: 'Verify your email address',
    text: `Click the link to verify your email: ${verificationLink}`,
    html: `
      <p>Hello ${data.firstName + ' ' + data.lastName || 'there'},</p>
      <p>Please verify your email by clicking the link below:</p>
      <a href="${verificationLink}">Verify Email</a>
      <p>This link expires in 12 hours.</p>
    `,
  });

  return {
    _id: savedUser._id.toString(),
    fullName: savedUser.firstName + ' ' + savedUser.lastName,
    email: savedUser.email,
    role: savedUser.role,
  };
};

/**
 * Service function to update a single auth by ID.
 *
 * @param {IdOrIdsInput['id']} id - The ID of the auth to update.
 * @param {UpdateAuthInput} data - The updated data for the auth.
 * @returns {Promise<Partial<IUser>>} - The updated auth.
 */
const updateAuth = async (
  id: IdOrIdsInput['id'],
  data: UpdateUserInput
): Promise<Partial<IUser | null>> => {
  // Check for duplicate (filed) combination
  const existingAuth = await User.findOne({
    _id: { $ne: id }, // Exclude the current document
    $or: [
      {
        /* filedName: data.filedName, */
      },
    ],
  }).lean();
  // Prevent duplicate updates
  if (existingAuth) {
    throw new Error('Duplicate detected: Another auth with the same fieldName already exists.');
  }
  // Proceed to update the auth
  const updatedAuth = await User.findByIdAndUpdate(id, data, { new: true });
  return updatedAuth;
};

/**
 * Service function to delete a single auth by ID.
 *
 * @param {IdOrIdsInput['id']} id - The ID of the auth to delete.
 * @returns {Promise<Partial<IUser>>} - The deleted auth.
 */
const deleteAuth = async (id: IdOrIdsInput['id']): Promise<Partial<IUser | null>> => {
  const deletedAuth = await User.findByIdAndDelete(id);
  return deletedAuth;
};

/**
 * Service function to delete multiple auth.
 *
 * @param {IdOrIdsInput['ids']} ids - An array of IDs of auth to delete.
 * @returns {Promise<Partial<IUser>[]>} - The deleted auth.
 */
const deleteManyAuth = async (ids: IdOrIdsInput['ids']): Promise<Partial<IUser>[]> => {
  const authToDelete = await User.find({ _id: { $in: ids } });
  if (!authToDelete.length) throw new Error('No auth found to delete');
  await User.deleteMany({ _id: { $in: ids } });
  return authToDelete;
};

/**
 * Service function to retrieve a single auth by ID.
 *
 * @param {IdOrIdsInput['id']} id - The ID of the auth to retrieve.
 * @returns {Promise<Partial<IUser>>} - The retrieved auth.
 */
const getAuthById = async (id: IdOrIdsInput['id']): Promise<Partial<IUser | null>> => {
  const auth = await User.findById(id);
  return auth;
};

/**
 * Service function to retrieve multiple auth based on query parameters.
 *
 * @param {SearchQueryInput} query - The query parameters for filtering auth.
 * @returns {Promise<Partial<IUser>[]>} - The retrieved auth
 */
const getManyAuth = async (
  query: SearchQueryInput
): Promise<{ auths: Partial<IUser>[]; totalData: number; totalPages: number }> => {
  const { searchKey = '', showPerPage = 10, pageNo = 1 } = query;
  // Build the search filter based on the search key
  const searchFilter = {
    $or: [
      // { fieldName: { $regex: searchKey, $options: 'i' } },
      // Add more fields as needed
    ],
  };
  // Calculate the number of items to skip based on the page number
  const skipItems = (pageNo - 1) * showPerPage;
  // Find the total count of matching auth
  const totalData = await User.countDocuments(searchFilter);
  // Calculate the total number of pages
  const totalPages = Math.ceil(totalData / showPerPage);
  // Find auths based on the search filter with pagination
  const auths = await User.find(searchFilter).skip(skipItems).limit(showPerPage).select(''); // Keep/Exclude any field if needed
  return { auths, totalData, totalPages };
};

/**
 * Service function to verify email.
 *
 * @param {VerifyEmailInput} data - The data to verify email.
 * @returns {Promise<void>} - The verify email result.
 */
const verifyEmail = async (data: VerifyEmailInput): Promise<void> => {
  const { email, token } = data;

  // Step 1: Find user first
  const user = await User.findOne({ email });

  if (!user) {
    throw new Error('User not found');
  }

  // Step 2: Check if already verified
  if (user.isEmailVerified) {
    throw new Error('Email is already verified');
  }

  // Step 3: Validate token
  if (
    user.emailVerificationToken !== token ||
    !user.emailVerificationTokenExpiry ||
    user.emailVerificationTokenExpiry < new Date()
  ) {
    throw new Error('Invalid or expired verification token');
  }

  // Step 4: Update user
  user.isEmailVerified = true;
  user.emailVerificationToken = '';
  user.emailVerificationTokenExpiry = undefined;

  await user.save();

  
};

/**
 * Resend verification email service function.
 *
 * @param {ResendVerificationEmailInput} data - The data to resend verification.
 * @returns {Promise<void>} - The resend verification email result.
 */
const resendVerificationEmail = async (data: ResendVerificationEmailInput): Promise<void> => {
  // Check if user already exists in Database
  const user = await User.findOne({ email: data.email });

  // If user not found
  if (!user) {
    throw new Error('User not found');
  }

  // If email is already verified
  if (user.isEmailVerified) {
    throw new Error('Email is already verified');
  }

  // Generate new email verification token
  const emailVerificationToken = v4();
  const emailVerificationExpiry = new Date(Date.now() + 12 * 60 * 60 * 1000); // 12 hours

  // Update user with new token and expiry
  await User.updateOne(
    { email: data.email },
    {
      emailVerificationToken,
      emailVerificationTokenExpiry: emailVerificationExpiry,
    }
  );

  // Send verification email
  const verificationLink = `${config.EMAIL_VERIFICATION_REDIRECT_URI}?email=${encodeURIComponent(
    data.email
  )}&token=${emailVerificationToken}`;

  // Send verification email
  await SendEmail({
    to: data.email,
    subject: 'Verify your email address',
    text: `Click the link to verify your email: ${verificationLink}`,
    html: `
      <p>Hello ${user.firstName + ' ' + user.lastName || 'there'},</p>
      <p>Please verify your email by clicking the link below:</p>
      <a href="${verificationLink}">Verify Email</a>
      <p>This link expires in 12 hours.</p>
    `,
  });

  return;
};

/**
 * Service function to handle forget password.
 *
 * @param {ForgotPasswordInput} data - The data to forget password.
 * @returns {Promise<void>} - The forget password result.
 */
const forgetPassword = async (data: ForgotPasswordInput): Promise<void> => {
  // Check if user exists
  const user = await User.findOne({ email: data.email });

  // If user not found
  if (!user) {
    throw new Error('User not found');
  }

  // Generate reset password token
  const resetPasswordToken = v4();
  const resetPasswordExpiry = new Date(Date.now() + 1 * 60 * 60 * 1000); // 1 hour

  // Set the user's password reset token and expiry
  await User.updateOne(
    { email: data.email },
    { resetToken: resetPasswordToken, resetTokenExpiry: resetPasswordExpiry }
  );

  // Send reset password email
  const resetLink = `${config.PASSWORD_RESET_REDIRECT_URI}?email=${encodeURIComponent(
    data.email
  )}&token=${resetPasswordToken}`;

  await SendEmail({
    to: data.email,
    subject: 'Reset your password',
    text: `Click the link to reset your password: ${resetLink}`,
    html: `
      <p>Hello ${user.firstName + ' ' + user.lastName || 'there'},</p>
      <p>You can reset your password by clicking the link below:</p>
      <a href="${resetLink}">Reset Password</a>
      <p>This link expires in 1 hour.</p>
    `,
  });

  return;
};

/**
 *  Service function to reset password.
 *
 * @param {ResetPasswordInput} data - The data to reset password.
 * @returns {Promise<void>} - The reset password result.
 */
const resetPassword = async (data: ResetPasswordInput): Promise<void> => {
  // Find user by email and reset token
  const user = await User.findOne({
    email: data.email,
  });

  // If user not found
  if (!user) {
    throw new Error('User not found');
  }

  // Check if reset token is valid and not expired
  if (
    user.resetToken !== data.token ||
    !user.resetTokenExpiry ||
    user.resetTokenExpiry < new Date()
  ) {
    throw new Error('Invalid or expired reset token');
  }

  // Old password should not be the same as new password
  const isSamePassword = await compareInfo(data.password, user.password);

  if (isSamePassword) {
    throw new Error('New password must be different from the old password');
  }

  // Hash the new password
  const hashedPassword = await HashInfo(data.password);

  // Update user's password and clear reset token fields
  await User.updateOne(
    { email: data.email },
    { password: hashedPassword, resetToken: null, resetTokenExpiry: null }
  );

  return;
};

/**
 * Service function to change password.
 *
 * @param {IChangePassword} data - The data to change password.
 * @returns {Promise<void>} - The change password result.
 */
const changePassword = async (data: IChangePassword): Promise<void> => {
  const { userId, currentPassword, newPassword } = data;

  // Find user by ID
  const user = await User.findById(new mongoose.Types.ObjectId(userId));

  // If user not found
  if (!user) {
    throw new Error('User not found');
  }

  // Match old password
  const isOldPasswordValid = await compareInfo(currentPassword, user.password);

  // If old password is invalid
  if (!isOldPasswordValid) {
    throw new Error('Invalid old password');
  }

  // Old password should not be the same as new password
  const isSamePassword = await compareInfo(newPassword, user.password);

  if (isSamePassword) {
    throw new Error('New password must be different from the old password');
  }

  // Hash the new password
  const hashedNewPassword = await HashInfo(newPassword);

  // Update user's password
  await User.updateOne({ _id: user._id }, { password: hashedNewPassword });

  return;
};
export const authServices = {
  registerUser,
  updateAuth,
  deleteAuth,
  deleteManyAuth,
  getAuthById,
  getManyAuth,
  verifyEmail,
  resendVerificationEmail,
  forgetPassword,
  resetPassword,
  changePassword,
};

