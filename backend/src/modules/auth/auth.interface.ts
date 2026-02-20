import { UserRole } from 'src/model/user/user.schema';

/**
 * Type definition for auth.
 *
 * This type defines the structure of a single auth object.
 * @interface TAuth
 */
export interface TAuth {
  // Add fields as needed
}
export interface IRegisterResponse {
  _id: string;
  fullName: string;
  email: string;
  role: UserRole;
}
export interface ResendVerificationEmailInput {
  _id: string;
  fullName: string;
  email: string;
  role: UserRole;
}

export interface IChangePassword {
  userId: string; // User ID
  currentPassword: string;
  newPassword: string;
}

