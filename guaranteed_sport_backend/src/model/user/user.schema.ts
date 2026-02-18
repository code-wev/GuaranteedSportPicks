import mongoose, { Document, Schema } from 'mongoose';

// Define and export an interface representing a user document
export interface IUser extends Document {
  firstName: string; // User's first name
  lastName: string; // User's last name
  email: string; // User's email address
  phoneNumber: string; // User's phone number
  password: string; // User's password (hashed)
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
