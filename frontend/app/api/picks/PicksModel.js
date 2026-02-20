import mongoose, { Schema, model, models } from "mongoose";

const pickSchema = new Schema(
  {
    // Admin will select sport from /sports API
    sport: {
      type: String,
      required: [true, "Sport is required"],
      trim: true,
    },

    // Optional league name
    league: {
      type: String,
      trim: true,
      default: null,
    },

    // Match/Event unique ID from /sports/{sport}/odds API
    eventId: {
      type: String,
      required: [true, "Event ID is required"],
      trim: true,
    },

    // Teams array from OddsAPI: ["Home Team", "Away Team"]
    teams: {
      type: [String],
      required: true,
    },

    // Match start time from OddsAPI
    commenceTime: {
      type: Date,
      required: true,
    },

    // Pick type / Market: Moneyline, Spread, Over-Under
    pickType: {
      type: String,
      enum: ["moneyline", "spread", "totals"],
      required: true,
    },

    // Selected outcome / team from OddsAPI market
    selectedTeam: {
      type: String,
      required: true,
    },

    // Odds snapshot from OddsAPI for the selected outcome
    // Example: -110, +125, etc.
    odds: {
      type: Number,
      required: true,
    },

    // Units / pick strength (optional)
    units: {
      type: Number,
      default: 1,
    },

    teamsLogo:[],

    // Admin write-up / notes
    writeUp: {
      type: String,
      required: true,
      trim: true,
    },

    // Pick status: draft, active, unpublished, expired
    status: {
      type: String,
      enum: ["draft", "active", "unpublished", "expired"],
      default: "draft",
    },

    // Featured pick toggle
    isFeatured: {
      type: Boolean,
      default: false,
    },

    // Optional scheduled publish time
    publishTime: {
      type: Date,
      default: null,
    },
    result: {
  type: String,
  enum: ["win", "lose", "push", "pending"], // pending = match not finished yet
  default: "pending",
},

    // Bookmaker info snapshot from OddsAPI
    bookmakers: {
      type: [
        {
          key: String, // Bookmaker key from OddsAPI
          markets: [
            {
              key: String, // Market key: spreads, h2h, totals
              outcomes: [
                {
                  name: String, // Outcome name (team)
                  point: Number, // Spread / Over-Under point
                  price: Number, // Odds price
                },
              ],
            },
          ],
        },
      ],
      default: [],
    },
  },
  {
    timestamps: true, // createdAt, updatedAt
  }
);

// Prevent model overwrite error in Next.js hot reload
export const Pick = models.Pick || model("Pick", pickSchema);
