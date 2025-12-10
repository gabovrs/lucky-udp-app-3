import { Schema, model, Document } from 'mongoose';

export interface IUser extends Document {
  username: string;
  password: string;
  balance: number;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    username: { type: String, required: true, unique: true, index: true },
    password: { type: String, required: true },
    balance: { type: Number, required: true, default: 0 },
  },
  { timestamps: true }
);

export const User = model<IUser>('User', UserSchema);