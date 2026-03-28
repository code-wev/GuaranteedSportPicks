import mongoose, { Document, Model, Schema } from 'mongoose';

export enum AffiliateWithdrawalStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  PAID = 'PAID',
  REJECTED = 'REJECTED',
  RETRY_REQUESTED = 'RETRY_REQUESTED',
}

export interface IAffiliateWithdrawal extends Document {
  affiliateId: mongoose.Schema.Types.ObjectId;
  userId: mongoose.Schema.Types.ObjectId;
  amount: number;
  payoutMethod: string;
  payoutDetails: string;
  note?: string;
  adminNote?: string;
  transferReference?: string;
  status: AffiliateWithdrawalStatus;
  paidAt?: Date;
}

const AffiliateWithdrawalSchema = new Schema<IAffiliateWithdrawal>(
  {
    affiliateId: { type: mongoose.Schema.Types.ObjectId, ref: 'Affiliate', required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    amount: { type: Number, required: true },
    payoutMethod: { type: String, required: true, trim: true },
    payoutDetails: { type: String, required: true, trim: true },
    note: { type: String, trim: true },
    adminNote: { type: String, trim: true },
    transferReference: { type: String, trim: true },
    status: {
      type: String,
      enum: Object.values(AffiliateWithdrawalStatus),
      default: AffiliateWithdrawalStatus.PENDING,
    },
    paidAt: { type: Date },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

AffiliateWithdrawalSchema.index({ affiliateId: 1, createdAt: -1 });
AffiliateWithdrawalSchema.index({ status: 1, createdAt: -1 });

const AffiliateWithdrawalModel: Model<IAffiliateWithdrawal> = mongoose.model<IAffiliateWithdrawal>(
  'AffiliateWithdrawal',
  AffiliateWithdrawalSchema
);

export default AffiliateWithdrawalModel;
