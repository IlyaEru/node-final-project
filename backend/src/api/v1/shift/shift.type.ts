import mongoose from 'mongoose';

export interface IShift {
  _id: mongoose.Types.ObjectId;
  date: Date;
  startTime: Date;
  endTime: Date;
}
