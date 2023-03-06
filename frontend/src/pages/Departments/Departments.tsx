import { DataGrid } from '@mui/x-data-grid';
import LoadingSpinner from '../../components/LoadingSpinner';
import { useGetDepartmentsQuery } from '../../redux/api/departmentApiSlice';
import { useGetEmployeesQuery } from '../../redux/api/employeeApiSlice';
import { StyledScrollableContainer, StyledLink } from '../../style/globalStyle';
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
    const employee = employeesData?.employees?.find(
      (employee: Employee) => employee._id === employeeId,
    );
    if (!employee) {
      return 'Unavailable';
    }
    return `${employee?.firstName} ${employee?.lastName}`;
  };

  const columns = [
    {
      field: 'id',
      headerName: 'ID',
      flex: 0.5,
      renderCell: (params: any) => (
        <StyledScrollableContainer>{params.value}</StyledScrollableContainer>
      ),
    },
    {
      field: 'name',
      headerName: 'Name',
      flex: 1,
      renderCell: (params: any) => (
        <StyledScrollableContainer>
          <StyledLink to={`/departments/${params.row.id}`}>
            {params.value}
          </StyledLink>
        </StyledScrollableContainer>
      ),
    },
    {
      field: 'manager',
      headerName: 'Manager',
      flex: 1,
      renderCell: (params: any) => {
        if (!params.value) {
          return (
            <StyledScrollableContainer>No manager</StyledScrollableContainer>
          );
        } else {
          return (
            <StyledScrollableContainer>
              <StyledLink to={`/employees/${params.value}`}>
                {getEmployeeFullName(params.value)}
              </StyledLink>
            </StyledScrollableContainer>
          );
        }
      },
    },

    {
      field: 'employees',
      headerName: 'Employees',
      flex: 1,
      renderCell: (params: any) => {
        if (params.value.length === 0) {
          return (
            <StyledScrollableContainer>
              'No employees'
            </StyledScrollableContainer>
          );
        } else {
          return (
            <StyledScrollableContainer>
              <ul>
                {params.value.map((employeeId: string) => (
                  <li key={employeeId}>
                    <StyledLink to={`/employees/${employeeId}`}>
                      {getEmployeeFullName(employeeId)}
                    </StyledLink>
                  </li>
                ))}
              </ul>
            </StyledScrollableContainer>
          );
        }
      },
    },
  ];

  const rows =
    departmentsData?.departments?.map((department: Department) => ({
      id: department._id,
      name: department.name,
      manager: department.manager,
      employees: department.employees,
    })) || [];

  return (
    <StyledDepartmentsContainer>
      <StyledDepartmentsTitle>Departments</StyledDepartmentsTitle>
      <StyledDepartmentsTableContainer style={{ width: '100%' }}>
        <DataGrid
          autoHeight={true}
          rows={rows}
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[5]}
          disableSelectionOnClick={true}
        />
      </StyledDepartmentsTableContainer>
      <StyledLink to="/departments/new">
        <StyledDepartmentsNewDepartmentButton>
          New department
        </StyledDepartmentsNewDepartmentButton>
      </StyledLink>
    </StyledDepartmentsContainer>
  );
}
