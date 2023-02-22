import mongoose from 'mongoose';
import Employee from '../employee/employee.model';
import { IDepartmentDocument, IDepartmentModel } from './department.type';

const departmentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      index: true,
      minlength: 3,
      maxlength: 40,
      lowercase: true,
    },
    manager: {
      type: mongoose.Types.ObjectId,
      ref: 'Employee',
      required: true,
    },
    employees: [
      {
        type: mongoose.Types.ObjectId,
        ref: 'Employee',
      },
    ],
  },
  {
    versionKey: false,
  },
);

// set the default value of the employees array to an empty array
departmentSchema.pre('save', function (next) {
  if (!this.employees || this.employees.length === 0) {
    this.employees = [];
  }
  next();
});

departmentSchema.pre('deleteOne', async function (next) {
  const removedDepartmentId = this.getQuery();

  try {
    await Employee.deleteMany({ department: removedDepartmentId });
    next();
  } catch (error: any) {
    next(error);
  }
});

departmentSchema.static(
  'isNameTaken',
  async function (name: string, id?: string) {
    const department = await this.findOne({
      name: name.toLowerCase(),
      _id: { $ne: id },
    });
    return !!department;
  },
);

const Department = mongoose.model<IDepartmentDocument, IDepartmentModel>(
  'Department',
  departmentSchema,
);

export default Department;
