import { Schema, model, Document } from 'mongoose';

export enum RouletteColor {
  GREEN = 'green',
  RED = 'red',
  BLACK = 'black',
}

export interface IRouletteWinner extends Document {
  number: number;
  color: RouletteColor;
  createdAt: Date;
  updatedAt: Date;
}

const RouletteWinnerSchema = new Schema<IRouletteWinner>(
  {
    number: {
      type: Number,
      required: true,
      min: 0,
      max: 36,
      index: true
    },
    color: {
      type: String,
      enum: Object.values(RouletteColor),
      required: true
    }
  },
  { timestamps: true }
);

export const RouletteWinner = model<IRouletteWinner>('RouletteWinner', RouletteWinnerSchema);