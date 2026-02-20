import { Schema, model, models } from "mongoose";

const userSchema = new Schema(
  {
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    phoneNumber: String,
    img: String,

    role: {
      type: String,
      enum: ["user", "admin", "handicapper"],
      required: true,
      default: "user",
    },

    status: {
      type: String,
      enum: ["active", "banned", "pending"],
      default: "active",
      required: true,
    },

    credits: {
      type: Number,
      default: 0,
    },

    promoUsed: [String],
    stripeCustomerId: String,

    payAfterWinHolds: [
      {
        pickId: String,
        amount: Number,
        status: String,
        createdAt: Date,
      },
    ],

    purchaseHistory: [
      {
        pickId: String,
        purchaseDate: Date,
        amount: Number,
      },
    ],

    activePicks: [
      {
        pickId: String,
        expiresAt: Date,
      },
    ],

    isHandicapper: {
      type: Boolean,
      default: false,
    },

    bio: String,

    records: {
      wins: { type: Number, default: 0 },
      losses: { type: Number, default: 0 },
      pushes: { type: Number, default: 0 },
    },

    testimonials: [
      {
        name: String,
        message: String,
        date: Date,
      },
    ],

    affiliateCode: String,
    landingPageSlug: String,

    newsletterSubscribed: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true, strict: false }
);

// FIXED
const User = models.User || model("User", userSchema);

export default User;
