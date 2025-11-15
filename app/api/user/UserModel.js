import { Schema, model } from "mongoose";

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
    fullName: {
      type: String,
      required: true,
    },
    phoneNumber: String,
    img: String,

    // Roles
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
    },

    // Payments & Credits
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

    // Picks & Purchases
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

    // Extra for Handicapper future
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
  { timestamps: true }
);

module.exports = model("User", userSchema);
