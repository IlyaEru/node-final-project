import mongoose from 'mongoose';
import Department from '../department/department.model';
import Shift from '../shift/shift.model';

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
    shifts: [
      {
        type: mongoose.Types.ObjectId,
        ref: 'Shift',
      },
    ],
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
  const employeeShifts = await Shift.find({
    employees: { $in: [employee._id] },
  });

  if (employeeShifts.length > 0) {
    for (const employeeShift of employeeShifts) {
      await Shift.findByIdAndUpdate(employeeShift, {
        $pull: { employees: employee._id },
      });
    }
  }

  const employeeDepartmentsManager = await Department.find({
    manager: employee._id,
  });

  if (employeeDepartmentsManager.length > 0) {
    for (const employeeDepartmentManager of employeeDepartmentsManager) {
      await Department.findByIdAndUpdate(employeeDepartmentManager, {
        manager: null,
      });
    }
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
