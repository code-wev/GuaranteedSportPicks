import mongoose, { Document, Schema } from 'mongoose';

interface IOutcome {
  name: string;
  price: number;
}
interface IMarket {
  Key: string;
  last_update: string;
  outComes: IOutcome[];
}
interface IBookmaker {
  key: string;
  title: string;
  last_update: string;
  markets: IMarket[];
}
interface IOdds {
  home_team: number;
  away_team: number;
  draw?: number;
}

// Define and export an interface representing a picks document
export interface IPicks extends Document {
  // Define the schema fields with their types
  // Example fields (replace with actual fields)
  // fieldName: fieldType;
  sportId: string;
  sportKey: string;
  commence_time: string;
  home_team: string;
  away_team: string;
  odds: IOdds;
  bookmakers?: IBookmaker[];
}

// Define the picks schema
const PicksSchema: Schema<IPicks> = new Schema(
  {
    // Define schema fields here
    // Example fields (replace with actual schema)
    // fieldName: {
    //   type: Schema.Types.FieldType,
    //   required: true,
    //   trim: true,
    // },

    sportId: { type: String, required: true },
    sportKey: { type: String, required: true },
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
              {
                name: { type: String, required: true },
                price: { type: Number, required: true },
              },
            ],
          },
        ],
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Create the picks model
const Picks = mongoose.model<IPicks>('Picks', PicksSchema);

// Export the picks model
export default Picks;

