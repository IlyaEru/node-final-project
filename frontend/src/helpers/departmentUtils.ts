import { Employee } from '../types/employee.type';

const getEmployeeFullName = (employeeId: string, employees: Employee[]) => {
  const employee = employees.find((employee) => employee._id === employeeId);
  return `${employee?.firstName} ${employee?.lastName}`;
};

export { getEmployeeFullName };
