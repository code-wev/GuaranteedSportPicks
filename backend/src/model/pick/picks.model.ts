import mongoose, { Document, Model, Schema } from 'mongoose';

// ========================
// Admin-provided enums
// ========================
export enum PicksStatus {
  PENDING = 'pending',
  ACTIVE = 'active',
  CLOSE = 'close',
}

export enum MarketType {
  MONEYLINE = 'moneyline',
  SPREAD = 'spread',
  TOTALS = 'totals',
}

export enum ConfidenceLevel {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
}

export enum ResultType {
  WIN = 'win',
  LOSS = 'loss',
  VOID = 'void',
}

// ========================
// Interface for Picks
// ========================
export interface IPicks extends Document {
  // API-provided
  sportId: string;
  sportKey: string;
  sport_title: string;
  home_team: string;
  away_team: string;
  commence_time: string;
  odds: {
    home_team: number;
    away_team: number;
    draw?: number;
  };
  bookmakers?: {
    key: string;
    title: string;
    last_update: string;
    markets: {
      Key: string;
      last_update: string;
      outComes: { name: string; price: number }[];
    }[];
  }[];

  // Admin-provided
  selected_team: string;
  market_type: MarketType;
  units: number;
  confidence: ConfidenceLevel;
  writeup: string;
  premium: boolean;
  release_time: string;
  result?: ResultType;
  status?: PicksStatus;
  pickBanner?: string;
}

// ========================
// Mongoose Schema
// ========================
const PicksSchema = new Schema<IPicks>(
  {
    // API-provided fields
    sportId: { type: String, required: true },
    sportKey: { type: String, required: true },
    sport_title: { type: String, required: true },
    commence_time: { type: String, required: true },
    home_team: { type: String, required: true },
    away_team: { type: String, required: true },
    odds: {
      home_team: { type: Number, required: true },
      away_team: { type: Number, required: true },
      draw: { type: Number },
    },
    bookmakers: [
      {
        key: { type: String, required: true },
        title: { type: String, required: true },
        last_update: { type: String, required: true },
        markets: [
          {
            Key: { type: String, required: true },
            last_update: { type: String, required: true },
            outComes: [
              { name: { type: String, required: true }, price: { type: Number, required: true } },
            ],
          },
        ],
      },
    ],

    // Admin fields
    selected_team: { type: String, required: true },
    market_type: { type: String, enum: Object.values(MarketType), required: true },
    units: { type: Number, required: true },
    confidence: { type: String, enum: Object.values(ConfidenceLevel), required: true },
    writeup: { type: String, required: true },
    premium: { type: Boolean, required: true },
    release_time: { type: String, required: true },
    result: { type: String, enum: Object.values(ResultType) },
    status: { type: String, enum: Object.values(PicksStatus), default: PicksStatus.PENDING },
    pickBanner: { type: String },
  },
  { timestamps: true }
);

// ========================
// Model Export
// ========================
const PicksModel: Model<IPicks> = mongoose.model<IPicks>('Picks', PicksSchema);
export default PicksModel;
