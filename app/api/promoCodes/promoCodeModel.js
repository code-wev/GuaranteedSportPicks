import { Schema, model, models } from "mongoose";

const PromoCodesSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    expiresAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

// Avoid overwrite error
const PromoCodes = models.PromoCodes || model("PromoCodes", PromoCodesSchema);

export default PromoCodes;
