import mongoose, { Schema, model, models } from "mongoose";

const myPickSchema = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",

    },

    pickId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Pick",

    },

    // One-time purchase amount
    amount: {
      type: Number,

    },

    currency: {
      type: String,
      default: "usd",
    },

    // Stripe payment session
    stripeSessionId: {
      type: String,
      required: false,
    },

    // Payment status: pending → paid
    status: {
      type: String,
      enum: ["pending", "paid", "failed"],
      default: "pending",
    },
      category :String,

    // User access
    available: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export const MyPick = models.MyPick || model("MyPick", myPickSchema);
