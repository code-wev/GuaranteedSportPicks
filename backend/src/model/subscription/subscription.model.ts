import mongoose, { Document, Schema } from 'mongoose';
import { string } from 'node_modules/zod/index.cjs';

export enum SelectedSport {
  NFL = 'NFL',
  NBA = 'NBA',
  MLB = 'MLB',
  NHL = 'NHL',
}

export enum PackageName {
  DAILY = 'DAILY',
  WEEKLY = 'WEEKLY',
  MONTHLY = 'MONTHLY',
  SESSION = 'SESSION',
}
export enum subscriptionStatus {
  PENDING = 'PENDING',
  PAID = 'PAID',
  FAILED = 'FAILED',
  CANCELLED = 'CANCELLED',
  EXPIRED = 'EXPIRED',
  TRIAL = 'TRIAL',
  REFUNDED = 'REFUNDED',
  SUSPENDED = 'SUSPENDED',
}
export interface ISubscription extends Document {
  userId: mongoose.Schema.Types.ObjectId;
  subscriptionStart: string;
  subscriptionEnd: string;
  nextBilling: string;
  packageName: PackageName;
  paymentIntent: {};

  //  UPDATED → Array of enum
  selectedSport: SelectedSport[];

  price: number;
  isSession: boolean;
  customPrice?: number;
  customDays?: number;
  isSubscribed: boolean;
  status: subscriptionStatus;
}

const SubscriptionSchema = new Schema<ISubscription>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },

    subscriptionStart: {
      type: String,
    },
    status: {
      type: String,
      enum: Object.values(subscriptionStatus),
      default: subscriptionStatus.PENDING,
    },

    subscriptionEnd: {
      type: String,
    },

    nextBilling: {
      type: String,
    },

    packageName: {
      type: String,
      enum: Object.values(PackageName),
      required: true,
    },

    //  ARRAY ENUM IMPLEMENTATION
    selectedSport: {
      type: [
        {
          type: String,
          enum: Object.values(SelectedSport),
        },
      ],
      required: true,
      validate: {
        validator: function (value: SelectedSport[]) {
          return value.length > 0;
        },
        message: 'At least one sport must be selected',
      },
    },

    price: {
      type: Number,
      required: true,
    },

    isSession: {
      type: Boolean,
      required: true,
    },

    customPrice: {
      type: Number,
      required: function (this: ISubscription) {
        return this.packageName === PackageName.SESSION;
      },
    },

    customDays: {
      type: Number,
      required: function (this: ISubscription) {
        return this.packageName === PackageName.SESSION;
      },
    },

    isSubscribed: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Subscription = mongoose.model<ISubscription>('Subscription', SubscriptionSchema);

export default Subscription;
