import { Link } from 'react-router-dom';
import { Employee } from '../../types/employee.type';
import {
  StyledRemoveEmployeeButton,
  StyledShiftEmployeesList,
  StyledShiftEmployeesListItem,
  StyledShiftEmployeesNumber,
} from './ShiftEmployeesList.style';
import { MdPersonRemove } from 'react-icons/md';
import { Tooltip } from '@mui/material';

interface ShiftEmployeesListProps {
  employees: string[];
  handleRemoveEmployee: (employeeId: string) => void;
  employeesData: Employee[];
}

export default function ShiftEmployeesList({
  employees,
  handleRemoveEmployee,
  employeesData,
}: ShiftEmployeesListProps) {
  const getEmployeeName = (employeeId: string) => {
    const employee = employeesData.find(
      (employee) => employee._id === employeeId,
    );
    return employee?.firstName + ' ' + employee?.lastName;
  };

  return (
    <StyledShiftEmployeesList>
      <StyledShiftEmployeesNumber>
        {employees.length} employees
      </StyledShiftEmployeesNumber>
      {employees.map((employeeId) => (
        <StyledShiftEmployeesListItem key={employeeId}>
          <Link key={employeeId} to={`/employees/${employeeId}`}>
            {getEmployeeName(employeeId)}
          </Link>
          <Tooltip title="Remove employee">
            <StyledRemoveEmployeeButton>
              <MdPersonRemove
                onClick={() => handleRemoveEmployee(employeeId)}
              />
            </StyledRemoveEmployeeButton>
          </Tooltip>
        </StyledShiftEmployeesListItem>
      ))}
    </StyledShiftEmployeesList>
  );
}
