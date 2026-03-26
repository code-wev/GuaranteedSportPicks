import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IAffiliateCommission extends Document {
  affiliateId: mongoose.Schema.Types.ObjectId;
  referredUserId: mongoose.Schema.Types.ObjectId;
  subscriptionId: mongoose.Schema.Types.ObjectId;
  sourceRef: string;
  sourceType: 'INITIAL' | 'RENEWAL';
  subscriptionAmount: number;
  commissionRate: number;
  commissionAmount: number;
}

const AffiliateCommissionSchema = new Schema<IAffiliateCommission>(
  {
    affiliateId: { type: mongoose.Schema.Types.ObjectId, ref: 'Affiliate', required: true },
    referredUserId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    subscriptionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Subscription', required: true },
    sourceRef: { type: String, required: true, unique: true, trim: true },
    sourceType: {
      type: String,
      enum: ['INITIAL', 'RENEWAL'],
      required: true,
    },
    subscriptionAmount: { type: Number, required: true },
    commissionRate: { type: Number, required: true },
    commissionAmount: { type: Number, required: true },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

AffiliateCommissionSchema.index({ affiliateId: 1, createdAt: -1 });
AffiliateCommissionSchema.index({ referredUserId: 1 });

const AffiliateCommissionModel: Model<IAffiliateCommission> = mongoose.model<IAffiliateCommission>(
  'AffiliateCommission',
  AffiliateCommissionSchema
);

export default AffiliateCommissionModel;
