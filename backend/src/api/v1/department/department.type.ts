import mongoose from 'mongoose';

export interface IDepartment {
  _id: mongoose.Types.ObjectId;
  name: string;
  manager: mongoose.Types.ObjectId;
  employees: mongoose.Types.ObjectId[];
}

export interface IDepartmentDocument extends IDepartment, mongoose.Document {
  _id: mongoose.Types.ObjectId;
}

export interface IDepartmentModel extends mongoose.Model<IDepartmentDocument> {
  isNameTaken(name: string, id?: string): Promise<boolean>;
}

export interface CreateDepartmentPayload {
  name: string;
  manager: mongoose.Types.ObjectId;
}
