import httpStatus from 'http-status';
import { ApiError } from '../../../modules/error';
import Department from './department.model';
import Employee from '../employee/employee.model';

const moveEmployeesToNewDepartment = async (
  employees: string[],
  departmentId: string,
) => {
  for (const employeeId of employees) {
    try {
      const employee = await Employee.findById(employeeId);

      if (!employee) {
        return;
      }

      if (employee.department === departmentId) {
        continue;
      }

      const employeeDepartments = await Department.find({
        employees: { $in: [employeeId] },
        _id: { $ne: departmentId },
      });

      if (employeeDepartments.length > 0) {
        for (const employeeDepartment of employeeDepartments) {
          await Department.findByIdAndUpdate(employeeDepartment, {
            $pull: { employees: employeeId },
          });
        }
      }

      await Employee.findByIdAndUpdate(employeeId, {
        department: departmentId,
      });
    } catch (error: any) {
      console.log(error);
    }
  }
};

export default {
  moveEmployeesToNewDepartment,
};
