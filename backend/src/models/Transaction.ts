import { Schema, model, Document, Types } from 'mongoose';

export enum TransactionType {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
  BET = 'bet',
}

export interface ITransaction extends Document {
  userId: Types.ObjectId;
  type: TransactionType;
  amount: number;
  createdAt: Date;
  updatedAt: Date;
}

const TransactionSchema = new Schema<ITransaction>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    type: { type: String, enum: Object.values(TransactionType), required: true },
    amount: { type: Number, required: true },
  },
  { timestamps: true }
);

export const Transaction = model<ITransaction>('Transaction', TransactionSchema);