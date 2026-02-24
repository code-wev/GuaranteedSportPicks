import mongoose, { Document, Schema } from 'mongoose';

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
  market_type: 'moneyline' | 'spread' | 'totals';
  units: number;
  confidence: 'low' | 'medium' | 'high';
  writeup: string;
  premium: boolean;
  release_time: string;
  result?: 'win' | 'loss' | 'void';
}

const PicksSchema = new Schema<IPicks>(
  {
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
    market_type: { type: String, enum: ['moneyline', 'spread', 'totals'], required: true },
    units: { type: Number, required: true },
    confidence: { type: String, enum: ['low', 'medium', 'high'], required: true },
    writeup: { type: String, required: true },
    premium: { type: Boolean, required: true },
    release_time: { type: String, required: true },
    result: { type: String, enum: ['win', 'loss', 'void'] },
  },
  { timestamps: true }
);

export default mongoose.model<IPicks>('Picks', PicksSchema);
