import mongoose, { Document } from 'mongoose';

export interface IUser {
  _id: mongoose.Types.ObjectId;
  username: string;
  email: string;
  fullName: string;
  maxActions: number;
}

export interface IUserDocument extends IUser, Document {
  _id: mongoose.Types.ObjectId;
}

export interface IUserModel extends mongoose.Model<IUserDocument> {
  isUsernameTaken(username: string, id?: string): Promise<boolean>;
  isEmailTaken(email: string, id?: string): Promise<boolean>;
}

export interface CreateUserPayload {
  username: string;
  email: string;
  fullName: string;
  maxActions?: number;
}
