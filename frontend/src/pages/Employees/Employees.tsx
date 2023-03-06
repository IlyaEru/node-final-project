import LoadingSpinner from '../../components/LoadingSpinner';
import { useGetDepartmentsQuery } from '../../redux/api/departmentApiSlice';
import { useGetEmployeesQuery } from '../../redux/api/employeeApiSlice';
import {
  StyledEmployeesContainer,
  StyledEmployeesTitle,
  StyledEmployeesTableContainer,
  StyledEmployeesNewEmployeeButton,
  StyledEmployeesFilterContainer,
} from './Employees.style';
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import { Employee } from '../../types/employee.type';
import { useEffect, useState } from 'react';
import { Department } from '../../types/department.type';
import FormInput from '../../components/FormInput';
import { useGetShiftsQuery } from '../../redux/api/shiftApiSlice';
import { Shift } from '../../types/shift.type';
import dayjs from 'dayjs';
import { StyledLink, StyledScrollableContainer } from '../../style/globalStyle';

export default function Employees() {
  const { data: employeesData, isLoading: isLoadingEmployees } =
    useGetEmployeesQuery();
  const { data: departmentsData, isLoading: isLoadingDepartments } =
    useGetDepartmentsQuery();
  const { data: shiftsData, isLoading: isLoadingShifts } = useGetShiftsQuery();

  const [filteredEmployees, setFilteredEmployees] = useState<Employee[]>(
    employeesData?.employees || [],
  );

  const [filterDepartment, setFilterDepartment] = useState('All departments');

  useEffect(() => {
    if (isLoadingEmployees || isLoadingDepartments || isLoadingShifts) {
      return;
    }
    if (filterDepartment === 'All departments') {
      setFilteredEmployees(employeesData?.employees);
    } else {
      setFilteredEmployees(
        employeesData?.employees.filter(
          (employee: Employee) =>
            getEmployeeDepartment(employee.department || '') ===
            filterDepartment,
        ),
      );
    }
  }, [
    filterDepartment,
    isLoadingEmployees,
    isLoadingDepartments,
    isLoadingShifts,
  ]);

  if (isLoadingEmployees || isLoadingDepartments || isLoadingShifts) {
    return <LoadingSpinner />;
  }

  const getEmployeeDepartment = (departmentId: string) => {
    if (departmentId === '') {
      return 'No department';
    } else {
      return departmentsData?.departments.find(
        (department: Department) => department._id === departmentId,
      )?.name;
    }
  };

  const getEmployeeShifts = (employeeId: string) => {
    const employeesShifts =
      shiftsData?.shifts?.filter((shift: any) =>
        shift.employees.includes(employeeId),
      ) || [];
    if (employeesShifts.length === 0) {
      return 'No shifts';
    }
    return employeesShifts.map((shift: Shift) => {
      return `${dayjs(shift.date).format('DD/MM/YYYY')} from ${dayjs(
        shift.startTime,
      ).format('HH:mm')} to ${dayjs(shift.endTime).format('HH:mm')}`;
    });
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
      field: 'fullname',
      headerName: 'Full name',
      flex: 1,
      renderCell: (params: any) => (
        <StyledScrollableContainer>
          <StyledLink to={`/employees/${params.row.id}`}>
            {params.value}
          </StyledLink>
        </StyledScrollableContainer>
      ),
    },

    {
      field: 'department',
      headerName: 'Department',
      flex: 1,
      renderCell: (params: any) => {
        if (params.value === 'No department') {
          return <p>{params.value}</p>;
        } else {
          return (
            <StyledScrollableContainer>
              <StyledLink to={`/departments/${params.value.id}`}>
                {params.value.name}
              </StyledLink>
            </StyledScrollableContainer>
          );
        }
      },
    },
    {
      field: 'startingWorkYear',
      headerName: 'Starting work year',
      flex: 1,
      renderCell: (params: any) => (
        <StyledScrollableContainer>{params.value}</StyledScrollableContainer>
      ),
    },
    {
      field: 'shifts',
      headerName: 'Shifts',
      flex: 2,
      renderCell: (params: any) => {
        if (params.value === 'No shifts') {
          return <p>{params.value}</p>;
        }
        return (
          <ul
            style={{
              overflow: 'scroll',
              height: '100%',
              width: '100%',
            }}
          >
            {params.value.map((shift: string, index: any) => (
              <li key={index}>{shift}</li>
            ))}
          </ul>
        );
      },
    },
  ];

  const rows =
    filteredEmployees?.map((employee: Employee) => ({
      id: employee._id,
      fullname: `${employee.firstName} ${employee.lastName}`,
      department: {
        id: employee.department,
        name: getEmployeeDepartment(employee.department || ''),
      },
      startingWorkYear: employee.startingWorkYear,
      shifts: getEmployeeShifts(employee._id),
    })) || [];

  const filterDepartmentOptions = [
    { value: 'All departments', label: 'All departments' },
    ...departmentsData?.departments.map((department: Department) => ({
      value: department.name,
      label: department.name,
    })),
  ];

  return (
    <StyledEmployeesContainer>
      <StyledEmployeesTitle>Employees</StyledEmployeesTitle>
      <StyledEmployeesFilterContainer>
        <h3>Filter By Department</h3>
        <FormInput
          type="select"
          value={filterDepartment}
          onChange={(e) => {
            setFilterDepartment(e.target.value);
          }}
          isLoadingOptions={isLoadingDepartments}
          options={filterDepartmentOptions}
        />
      </StyledEmployeesFilterContainer>
      <StyledEmployeesTableContainer style={{ width: '100%' }}>
        <DataGrid
          autoHeight={true}
          rows={rows}
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[5]}
          disableSelectionOnClick={true}
        />
      </StyledEmployeesTableContainer>
      <StyledLink to="/employees/new">
        <StyledEmployeesNewEmployeeButton>
          New employee
        </StyledEmployeesNewEmployeeButton>
      </StyledLink>
    </StyledEmployeesContainer>
  );
}
