import mongoose, { Schema, models } from "mongoose";

const otpSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
    },
    otp: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      expires: 240, 
    },
  },
  { timestamps: true }
);

export default models.Otp || mongoose.model("Otp", otpSchema);
