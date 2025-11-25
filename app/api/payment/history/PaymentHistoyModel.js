import mongoose, { Schema, model, models } from "mongoose";

const paymentHistorySchema = new Schema(
  {
    userId: { type: String, required: true },
    type: { type: String, enum: ["subscription", "pick"], required: true },
    pickId: { type: String, default: null }, // pick purchase হলে
    packageName: { type: String, default: null }, // subscription হলে
    amount: { type: Number, required: true },
    currency: { type: String, default: "usd" },
    status: { type: String, enum: ["paid", "pending", "failed"], default: "pending" },
    stripeSessionId: { type: String, required: true },
  },
  { timestamps: true }
);

export const PaymentHistory =
  models.PaymentHistory || model("PaymentHistory", paymentHistorySchema);
