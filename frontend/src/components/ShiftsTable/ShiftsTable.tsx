import { DataGrid } from '@mui/x-data-grid';
import dayjs from 'dayjs';
import { useGetEmployeesQuery } from '../../redux/api/employeeApiSlice';
import { useGetShiftsQuery } from '../../redux/api/shiftApiSlice';
import { Employee } from '../../types/employee.type';
import { Shift } from '../../types/shift.type';
import LoadingSpinner from '../LoadingSpinner';
import {
  StyledEditShiftButton,
  StyledShiftsTableContainer,
} from './ShiftsTable.style';

interface ShiftsTableProps {
  handleEditShift: (shift: string) => void;
}

export default function ShiftsTable({ handleEditShift }: ShiftsTableProps) {
  const { data: shiftsData, isLoading: isLoadingShifts } = useGetShiftsQuery();
  const { data: employeesData, isLoading: isLoadingEmployees } =
    useGetEmployeesQuery();

  const getEmployeeName = (employeeId: string) => {
    const employee = employeesData?.employees?.find(
      (employee: Employee) => employee._id === employeeId,
    );
    return employee?.firstName + ' ' + employee?.lastName;
  };

  const columns = [
    { field: 'id', headerName: 'ID', width: 70 },
    {
      field: 'date',
      headerName: 'Date',
      width: 130,
      renderCell: (params: any) => dayjs(params.value).format('DD/MM/YYYY'),
    },
    {
      field: 'startTime',
      headerName: 'Start time',
      width: 130,
      renderCell: (params: any) => dayjs(params.value).format('HH:mm'),
    },
    {
      field: 'endTime',
      headerName: 'End time',
      width: 130,
      renderCell: (params: any) => dayjs(params.value).format('HH:mm'),
    },
    {
      field: 'employees',
      headerName: 'Employees',
      width: 130,
      renderCell: (params: any) => {
        return params.value.length === 0 ? (
          'No employees'
        ) : (
          <ul>
            {params.value.map((employeeName: string, index: number) => (
              <li key={index}>{employeeName}</li>
            ))}
          </ul>
        );
      },
    },
    {
      field: 'edit',
      headerName: 'Edit shift',
      width: 130,
      renderCell: (params: any) => (
        <StyledEditShiftButton onClick={() => handleEditShift(params.row.id)}>
          Edit Shift
        </StyledEditShiftButton>
      ),
    },
  ];

  const rows = shiftsData?.shifts?.map((shift: Shift) => ({
    id: shift._id,
    date: shift.date,
    startTime: shift.startTime,
    endTime: shift.endTime,
    employees: shift?.employees?.map((employeeId: string) =>
      getEmployeeName(employeeId),
    ),
  }));

  if (isLoadingShifts || isLoadingEmployees) {
    return <LoadingSpinner />;
  }
  return (
    <StyledShiftsTableContainer style={{ height: 400, width: '100%' }}>
      <DataGrid
        rows={rows}
        columns={columns}
        pageSize={5}
        rowsPerPageOptions={[5]}
      />
    </StyledShiftsTableContainer>
  );
}
