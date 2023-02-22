import mongoose from 'mongoose';

export interface IEmployee {
  firstName: string;
  lastName: string;
  startingWorkYear: number;
  department?: mongoose.Types.ObjectId;
  _oldDepartment?: mongoose.Types.ObjectId;
}

export interface IEmployeeDocument extends IEmployee, mongoose.Document {
  _id: mongoose.Types.ObjectId;
}

export interface IEmployeeModel extends mongoose.Model<IEmployeeDocument> {}
