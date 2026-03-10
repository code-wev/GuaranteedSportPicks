import mongoose, { Document, Schema } from 'mongoose';

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
  SEASONAL = 'SEASONAL',
}

export enum SubscriptionStatus {
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
  paymentLink?: string;
  paymentIntentId?: string;
  stripeSubscriptionId?: string;
  stripeSessionId?: string;
  selectedSport: SelectedSport[];
  price: number;
  isSeasonal: boolean;
  seasonalDays?: number;
  seasonalPrice?: number;
  isSubscribed: boolean;
  status: SubscriptionStatus;
  cancelledAt?: string;
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
      enum: Object.values(SubscriptionStatus),
      default: SubscriptionStatus.PENDING,
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

    paymentLink: {
      type: String,
    },

    paymentIntentId: {
      type: String,
    },

    stripeSubscriptionId: {
      type: String,
    },

    stripeSessionId: {
      type: String,
    },

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

    isSeasonal: {
      type: Boolean,
      required: true,
      default: false,
    },

    seasonalPrice: {
      type: Number,
      required: function (this: ISubscription) {
        return this.packageName === PackageName.SEASONAL;
      },
    },

    seasonalDays: {
      type: Number,
      required: function (this: ISubscription) {
        return this.packageName === PackageName.SEASONAL;
      },
    },

    isSubscribed: {
      type: Boolean,
      default: false,
    },

    cancelledAt: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
SubscriptionSchema.index({ userId: 1, status: 1 });
SubscriptionSchema.index({ stripeSubscriptionId: 1 });
SubscriptionSchema.index({ stripeSessionId: 1 });

const Subscription = mongoose.model<ISubscription>('Subscription', SubscriptionSchema);

export default Subscription;