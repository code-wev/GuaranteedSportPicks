import mongoose, { Document, Schema } from 'mongoose';

// Define and export an interface representing a affiliate document
export interface IAffiliate extends Document {
  // Define the schema fields with their types
  // Example fields (replace with actual fields)
  // fieldName: fieldType;
}

// Define the affiliate schema
const AffiliateSchema: Schema<IAffiliate> = new Schema({
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

// Create the affiliate model
const Affiliate = mongoose.model<IAffiliate>('Affiliate', AffiliateSchema);

// Export the affiliate model
export default Affiliate;