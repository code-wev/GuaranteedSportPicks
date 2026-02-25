import mongoose, { Document, Model, Schema } from 'mongoose';

// ========================
// Admin-provided enums
// ========================
export enum AffiliateStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  DECLINED = 'declined',
}

// ========================
// Interface for Affiliate
// ========================
export interface IAffiliate extends Document {
  userId: mongoose.Schema.Types.ObjectId; // Linked user
  status: AffiliateStatus; // pending / approved / declined
  affiliateCode?: string; // unique tracking code
  website?: string; // optional affiliate website
  socialLinks?: string[]; // optional social media links
  notes?: string; // admin notes
  createdAt?: Date;
  updatedAt?: Date;
}

// ========================
// Mongoose Schema
// ========================
const AffiliateSchema = new Schema<IAffiliate>(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    status: {
      type: String,
      enum: Object.values(AffiliateStatus),
      default: AffiliateStatus.PENDING,
    },
    affiliateCode: { type: String, unique: true },
    website: { type: String },
    socialLinks: [{ type: String }],
    notes: { type: String },
  },
  { timestamps: true }
);

// ========================
// Model Export
// ========================
const AffiliateModel: Model<IAffiliate> = mongoose.model<IAffiliate>('Affiliate', AffiliateSchema);

export default AffiliateModel;
