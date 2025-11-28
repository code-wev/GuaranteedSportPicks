import { Schema, model, models } from "mongoose";

const subscriptionSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    priceId: { type: String, required: true }, // Stripe Price ID
    packageName: { type: String, required: true }, // Daily, Weekly, Monthly, Seasonal
    amount: { type: Number, required: true },
    currency: { type: String, default: "usd" },
    startDate: { type: Date, required: true },
    type:String,
    endDate: { type: Date, required: true },
    status: {
      type: String,
      enum: ["active", "pending", "canceled", "expired"],
      default: "active",
    },
    available: { type: Boolean, default: true }, // endDate > now ? true : false
    stripeSessionId: { type: String },
    stripeSubscriptionId: { type: String },
  },
  { timestamps: true }
);

export const Subscription =
  models.Subscription || model("Subscription", subscriptionSchema);
