import mongoose, { Document, Schema } from "mongoose";

export enum SelectedSport  {
  NFL="NFL",
  NBA="NBA",
  MLB="MLB",
  NHL="NHL"
}

export enum PackageName {
  DAILY="DAILY",
  WEEKLY="WEEKLY",
  MONTHLY="MONTHLY",
  SESSION="SESSION"
}


export interface ISubscription extends Document {
  userId: mongoose.Schema.Types.ObjectId;
  subscriptionStart: string;
  subscriptionEnd: string;
  nextBilling: string;
  packageName: PackageName;
  selectedSport: SelectedSport;
  price: number;
  isSession: boolean;
  customPrice?: number;
  customDays?: number;
  isSubscribed: boolean;
}

const SubscriptionSchema = new Schema<ISubscription>({
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "User"
  },

  subscriptionStart: {
    type: String,
    required: true
  },

  subscriptionEnd: {
    type: String,
    required: true
  },

  nextBilling: {
    type: String,
    required: true
  },

  packageName: {
    type: String,
    enum: Object.values(PackageName),
    required: true
  },

  selectedSport: {
    type: String,
    enum: Object.values(SelectedSport),
    required: true
  },

  price: {
    type: Number,
    required: true
  },

  isSession: {
    type: Boolean,
    default: false
  },

  customPrice: {
    type: Number,
    required: function (this: ISubscription) {
      return this.packageName === PackageName.SESSION;
    }
  },

  customDays: {
    type: Number,
    required: function (this: ISubscription) {
      return this.packageName === PackageName.SESSION;
    }
  },

  isSubscribed: {
    type: Boolean,
    default: true
  }
},
{
  timestamps: true
});

const Subscription = mongoose.model<ISubscription>("Subscription", SubscriptionSchema);
export default Subscription;