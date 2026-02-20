import mongoose, { Document, Schema } from 'mongoose';

export enum UserRole {
  ADMIN = 'ADMIN',
  USER = 'USER',
}

// Define and export an interface representing a user document
export interface IUser extends Document {
  firstName: string; // User's first name
  lastName: string; // User's last name
  email: string; // User's email address
  phoneNumber: string; // User's phone number
  password: string; // User's password (hashed)
  isEmailVerified: boolean; // Indicates if the user's email has been verified
  emailVerificationToken?: string; // Token used for email verification (optional)
  emailVerificationTokenExpiry?: Date; // Expiry date for the email verification token (optional)
  isActive: boolean; // Indicates if the user's account is active (enabled/disabled)
  role: UserRole; // User's role (e.g./ Admin/ User)
  resetToken?: string; // Token used for password reset (optional)
  resetTokenExpiry?: Date; // Expiry date for the password reset token (optional)
}

// Define the user schema
const UserSchema: Schema<IUser> = new Schema(
  {
    firstName: {
      type: String,
      required: true, // First name is required
      trim: true, // Removes whitespace from both ends
    },
    lastName: {
      type: String,
      required: true, // Last name is required
      trim: true, // Removes whitespace from both ends
    },
    email: {
      type: String,
      required: true, // Email is required
      unique: true, // Email must be unique
      lowercase: true, // Converts email to lowercase
      trim: true, // Removes whitespace from both ends
    },
    phoneNumber: {
      type: String,
      required: true, // Phone number is required
      unique: true, // Phone number must be unique
      trim: true, // Removes whitespace from both ends
    },
    password: {
      type: String,
      required: true, // Password is required
      minlength: 6, // Minimum length of 6 characters
    },
    resetToken: {
      type: String,
    } /* Password reset token */,
    resetTokenExpiry: {
      type: Date,
    } /* Password reset token expiry */,
    isEmailVerified: {
      type: Boolean,
      required: true,
      default: false,
    } /* Email verification status */,

    role: {
      type: String,
      enum: Object.values(UserRole),
      default: UserRole.USER,
    },
    emailVerificationToken: {
      type: String,
    } /* Email verification token */,
    emailVerificationTokenExpiry: {
      type: Date,
    } /* Email verification token expiry */,
    isActive: {
      type: Boolean,
      required: true,
      default: false,
    } /* Account enabled/disabled */,
  },
  {
    timestamps: true, // Adds createdAt and updatedAt automatically
    versionKey: false, // Removes the __v field
  }
);

// Create the user model
const User = mongoose.model<IUser>('User', UserSchema);

// Export the user model
export default User;
