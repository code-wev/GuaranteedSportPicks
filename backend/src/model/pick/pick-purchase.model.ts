import mongoose, { Document, Schema } from 'mongoose';

export enum PickPurchaseStatus {
  PENDING = 'PENDING',
  AUTHORIZED = 'AUTHORIZED', // Payment authorized but not captured
  PAID = 'PAID',
  CANCELLED = 'CANCELLED',
  REFUNDED = 'REFUNDED',
}

export enum PaymentModel {
  PREPAID = 'PREPAID',
  PAY_AFTER_WIN = 'PAY_AFTER_WIN',
}

export interface IPickPurchase extends Document {
  userId: mongoose.Schema.Types.ObjectId;
  pickId: mongoose.Schema.Types.ObjectId;
  paymentModel: PaymentModel;
  price: number;
  status: PickPurchaseStatus;
  paymentIntentId?: string;
  stripeSessionId?: string;
  paymentLink?: string;
  purchasedAt: Date;
  capturedAt?: Date;
  cancelledAt?: Date;
}

const PickPurchaseSchema = new Schema<IPickPurchase>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },

    pickId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'Picks',
    },

    paymentModel: {
      type: String,
      enum: Object.values(PaymentModel),
      default: PaymentModel.PREPAID,
    },

    price: {
      type: Number,
      required: true,
    },

    status: {
      type: String,
      enum: Object.values(PickPurchaseStatus),
      default: PickPurchaseStatus.PENDING,
    },

    paymentIntentId: {
      type: String,
    },

    stripeSessionId: {
      type: String,
    },

    paymentLink: {
      type: String,
    },

    purchasedAt: {
      type: Date,
      default: Date.now,
    },

    capturedAt: {
      type: Date,
    },

    cancelledAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IPickPurchase>('PickPurchase', PickPurchaseSchema);