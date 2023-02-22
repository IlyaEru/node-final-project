import mongoose from 'mongoose';
import Department from '../department/department.model';

const employeeSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 40,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 40,
    },
    startingWorkYear: {
      type: Number,
      required: true,
      min: 1900,
      max: 2100,
    },
    department: {
      type: mongoose.Types.ObjectId,
      ref: 'Department',
    },
  },
  {
    versionKey: false,
  },
);

employeeSchema.pre('save', async function (next) {
  const employee = this;

  try {
    if (employee.isNew && employee.department) {
      await Department.findByIdAndUpdate(
        employee.department,
        { $push: { employees: employee._id } },
        { new: true },
      );
      return next();
    }
    next();
  } catch (error: any) {
    next(error);
  }
});

employeeSchema.pre('deleteOne', async function (next) {
  const removedEmployeeId = this.getQuery();
  const employee = await Employee.findById(removedEmployeeId);
  if (!employee) {
    return next();
  }
  if (employee.department) {
    try {
      await Department.findByIdAndUpdate(
        employee.department,
        { $pull: { employees: employee._id } },
        { new: true },
      );
      return next();
    } catch (error: any) {
      next(error);
    }
  }

  next();
});

const Employee = mongoose.model('Employee', employeeSchema);

export default Employee;
