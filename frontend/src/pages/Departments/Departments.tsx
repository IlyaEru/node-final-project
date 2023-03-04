import { DataGrid } from '@mui/x-data-grid';
import { Link } from 'react-router-dom';
import LoadingSpinner from '../../components/LoadingSpinner';
import { useGetDepartmentsQuery } from '../../redux/api/departmentApiSlice';
import { useGetEmployeesQuery } from '../../redux/api/employeeApiSlice';
import { Department } from '../../types/department.type';
import { Employee } from '../../types/employee.type';
import {
  StyledDepartmentsContainer,
  StyledDepartmentsNewDepartmentButton,
  StyledDepartmentsTableContainer,
  StyledDepartmentsTitle,
} from './Departments.style';

export default function Departments() {
  const { data: employeesData, isLoading: isLoadingEmployees } =
    useGetEmployeesQuery();
  const { data: departmentsData, isLoading: isLoadingDepartments } =
    useGetDepartmentsQuery();

  if (isLoadingEmployees || isLoadingDepartments) {
    return <LoadingSpinner />;
  }

  const getEmployeeFullName = (employeeId: string) => {
    const employee = employeesData?.employees.find(
      (employee: Employee) => employee._id === employeeId,
    );
    return `${employee?.firstName} ${employee?.lastName}`;
  };

  const columns = [
    { field: 'id', headerName: 'ID', width: 70 },
    {
      field: 'name',
      headerName: 'Name',
      width: 200,
      renderCell: (params: any) => (
        <Link to={`/departments/${params.row.id}`}>{params.value}</Link>
      ),
    },
    {
      field: 'manager',
      headerName: 'Manager',
      width: 130,
      renderCell: (params: any) => {
        if (!params.value) {
          return 'No manager';
        } else {
          return (
            <Link to={`/employees/${params.value}`}>
              {getEmployeeFullName(params.value)}
            </Link>
          );
        }
      },
    },

    {
      field: 'employees',
      headerName: 'Employees',
      width: 200,
      renderCell: (params: any) => {
        if (params.value.length === 0) {
          return 'No employees';
        } else {
          return (
            <ul>
              {params.value.map((employeeId: string) => (
                <li key={employeeId}>
                  <Link to={`/employees/${employeeId}`}>
                    {getEmployeeFullName(employeeId)}
                  </Link>
                </li>
              ))}
            </ul>
          );
        }
      },
    },
  ];

  const rows =
    departmentsData?.departments.map((department: Department) => ({
      id: department._id,
      name: department.name,
      manager: department.manager,
      employees: department.employees,
    })) || [];

  return (
    <StyledDepartmentsContainer>
      <StyledDepartmentsTitle>Departments</StyledDepartmentsTitle>
      <StyledDepartmentsTableContainer style={{ height: 400, width: '100%' }}>
        <DataGrid
          rows={rows}
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[5]}
        />
      </StyledDepartmentsTableContainer>
      <Link to="/departments/new">
        <StyledDepartmentsNewDepartmentButton>
          New department
        </StyledDepartmentsNewDepartmentButton>
      </Link>
    </StyledDepartmentsContainer>
  );
}
