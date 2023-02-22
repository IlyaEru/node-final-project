import mongoose from 'mongoose';

import dotenv from 'dotenv';

dotenv.config();

mongoose.set('strictQuery', false);

const mongoURI = process.env.MONGO_URI;

if (!mongoURI) {
  throw new Error('MONGO_URI must be defined');
}

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(mongoURI);

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

export default connectDB;
