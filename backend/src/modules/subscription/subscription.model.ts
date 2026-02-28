import mongoose, { Document, Schema } from 'mongoose';

// Define and export an interface representing a subscription document
export interface ISubscription extends Document {
  // Define the schema fields with their types
  // Example fields (replace with actual fields)
  // fieldName: fieldType;
}

// Define the subscription schema
const SubscriptionSchema: Schema<ISubscription> = new Schema({
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

// Create the subscription model
const Subscription = mongoose.model<ISubscription>('Subscription', SubscriptionSchema);

// Export the subscription model
export default Subscription;