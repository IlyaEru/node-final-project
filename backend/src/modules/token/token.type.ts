/* eslint-disable @typescript-eslint/no-empty-interface */
import mongoose, { Document, Model } from 'mongoose';
import { JwtPayload } from 'jsonwebtoken';

export interface IToken {
  token: string;
  user: mongoose.Types.ObjectId;
  type: 'access' | 'refresh';
  expires: Date;
  blacklisted: boolean;
}

export interface ITokenPayload extends JwtPayload {
  sub: string;
  iat: number;
  exp: number;
  type: string;
}

export type NewToken = Omit<IToken, 'blacklisted'>;

export interface ITokenDocument extends IToken, Document {}

export interface ITokenModel extends Model<ITokenDocument> {}
