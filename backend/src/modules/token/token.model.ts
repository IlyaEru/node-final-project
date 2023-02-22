import mongoose from 'mongoose';
import { ITokenDocument, ITokenModel } from './token.type';

const tokenSchema = new mongoose.Schema(
  {
    token: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      index: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    type: {
      type: String,
      required: true,
      enum: ['access', 'refresh'],
    },
    expires: {
      type: Date,
      required: true,
    },
    blacklisted: {
      type: Boolean,
      default: false,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  },
);

const Token = mongoose.model<ITokenDocument, ITokenModel>('Token', tokenSchema);

export default Token;
