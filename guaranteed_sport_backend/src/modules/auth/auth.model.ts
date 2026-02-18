import mongoose, { Document, Schema } from 'mongoose';

// Define and export an interface representing a auth document
export interface IAuth extends Document {
  // Define the schema fields with their types
  // Example fields (replace with actual fields)
  // fieldName: fieldType;
}

// Define the auth schema
const AuthSchema: Schema<IAuth> = new Schema({
  // Define schema fields here
  // Example fields (replace with actual schema)
  // fieldName: {
  //   type: Schema.Types.FieldType,
  //   required: true,
  //   trim: true,
  // },
},{
 timestamps: true,
 versionKey: false,
});

// Create the auth model
const Auth = mongoose.model<IAuth>('Auth', AuthSchema);

// Export the auth model
export default Auth;