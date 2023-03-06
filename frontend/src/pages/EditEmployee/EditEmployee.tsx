import { DataGrid } from '@mui/x-data-grid';
import dayjs from 'dayjs';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import EditEmployeeForm from '../../components/EditEmployeeForm';
import FormInput from '../../components/FormInput';
import LoadingSpinner from '../../components/LoadingSpinner';
import Modal from '../../components/Modal';
import { useGetDepartmentsQuery } from '../../redux/api/departmentApiSlice';
import {
  useDeleteEmployeeMutation,
  useGetEmployeeQuery,
} from '../../redux/api/employeeApiSlice';
import {
  useGetShiftsQuery,
  useUpdateShiftMutation,
} from '../../redux/api/shiftApiSlice';
import { StyledLink, StyledScrollableContainer } from '../../style/globalStyle';
import { Department } from '../../types/department.type';
import { Shift } from '../../types/shift.type';
import {
  StyledEditEmployeeButtonContainer,
  StyledEditEmployeeContainer,
  StyledEditEmployeeDeleteButton,
  StyledEditEmployeeDepartmentHeader,
  StyledEditEmployeeEditButton,
  StyledEditEmployeeFullname,
  StyledEditEmployeeRegisterShiftButton,
  StyledEditEmployeeRegisterShiftCancelButton,
  StyledEditEmployeeShiftsContainer,
  StyledEditEmployeeShiftsHeader,
} from './EditEmployee.style';

export default function EditEmployee() {
  const { id: employeeId } = useParams<{ id: string }>();

  const [isEditingEmployee, setIsEditingEmployee] = useState(false);

  const [isRegisteringToAShift, setIsRegisteringToAShift] = useState(false);

  const [selectedShift, setSelectedShift] = useState(``);

  const [isDeleteEmployeeModalShown, setIsDeleteEmployeeModalShown] =
    useState(false);

  const navigate = useNavigate();

  const [deleteEmployee, { isLoading: isLoadingEmployeeDelete }] =
    useDeleteEmployeeMutation();

  const { data, isLoading } = useGetEmployeeQuery(employeeId || '');

  const { data: shiftsData, isLoading: isLoadingShifts } = useGetShiftsQuery();

  const { data: departmentsData, isLoading: isLoadingDepartments } =
    useGetDepartmentsQuery();

  const [updateShift, { isLoading: isLoadingShiftUpdate }] =
    useUpdateShiftMutation();

  const employeeDepartmentName =
    departmentsData?.departments.find(
      (department: Department) => department._id === data?.employee.department,
    )?.name || 'No department';

  const employeeShifts =
    shiftsData?.shifts.filter((shift: Shift) =>
      shift.employees?.includes(employeeId || ''),
    ) || [];

  const availableShifts = shiftsData?.shifts.filter(
    (shift: Shift) => !shift.employees?.includes(employeeId || ''),
  );

  const availableShiftsOptions = availableShifts?.map((shift: Shift) => ({
    value: shift._id,
    label: `${dayjs(shift.date).format('DD/MM/YYYY')} - from ${dayjs(
      shift.startTime,
    ).format('HH:mm')} to ${dayjs(shift.endTime).format('HH:mm')}`,
  }));

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
      field: 'date',
      headerName: 'Date',
      flex: 1,
      renderCell: (params: any) => (
        <StyledScrollableContainer>{params.value}</StyledScrollableContainer>
      ),
    },
    {
      field: 'startTime',
      headerName: 'Start Time',
      flex: 1,
      renderCell: (params: any) => (
        <StyledScrollableContainer>{params.value}</StyledScrollableContainer>
      ),
    },
    {
      field: 'endTime',
      headerName: 'End Time',
      flex: 1,
      renderCell: (params: any) => (
        <StyledScrollableContainer>{params.value}</StyledScrollableContainer>
      ),
    },
  ];

  const rows =
    employeeShifts.map((shift: Shift) => ({
      id: shift._id,
      date: dayjs(shift.date).format('DD/MM/YYYY'),
      startTime: dayjs(shift.startTime).format('HH:mm'),
      endTime: dayjs(shift.endTime).format('HH:mm'),
    })) || [];

  const handleShiftRegistration = async () => {
    if (selectedShift) {
      const shiftData = shiftsData?.shifts.find(
        (shift: Shift) => shift._id === selectedShift,
      );
      const updateResp = await updateShift({
        id: selectedShift,
        date: shiftData?.date,
        startTime: shiftData?.startTime,
        endTime: shiftData?.endTime,
        employees: [...(shiftData?.employees || []), employeeId],
      }).unwrap();
      if (updateResp.updatedShift) {
        setIsRegisteringToAShift(false);
        setSelectedShift(``);
      }
    }
  };

  const handleDeleteEmployee = async () => {
    if (!employeeId) {
      return;
    }
    try {
      setIsDeleteEmployeeModalShown(false);
      await deleteEmployee({ id: employeeId });
      navigate('/employees');
    } catch (error: any) {
      console.log({ error });
    }
  };

  if (isLoading || isLoadingDepartments || isLoadingShifts) {
    return <LoadingSpinner />;
  }

  if (!data) {
    return <p>Employee not found</p>;
  }

  return (
    <StyledEditEmployeeContainer>
      {isLoadingEmployeeDelete && <LoadingSpinner />}
      {isLoadingShiftUpdate && <LoadingSpinner />}
      {isEditingEmployee ? (
        <EditEmployeeForm
          employeeData={data.employee}
          handleEditEmployeeCancel={() => {
            setIsEditingEmployee(false);
          }}
        />
      ) : (
        <>
          <StyledEditEmployeeFullname>
            Employee: {data.employee.firstName} {data.employee.lastName}
          </StyledEditEmployeeFullname>
          <StyledEditEmployeeDepartmentHeader>
            Department:{' '}
            <StyledLink to={`/departments/${data.employee.department}`}>
              {employeeDepartmentName}
            </StyledLink>
          </StyledEditEmployeeDepartmentHeader>
          <StyledEditEmployeeButtonContainer>
            <StyledEditEmployeeEditButton
              onClick={() => setIsEditingEmployee(true)}
            >
              Edit
            </StyledEditEmployeeEditButton>
            <StyledEditEmployeeDeleteButton
              onClick={() => setIsDeleteEmployeeModalShown(true)}
            >
              Delete
            </StyledEditEmployeeDeleteButton>
          </StyledEditEmployeeButtonContainer>
        </>
      )}
      {isDeleteEmployeeModalShown && (
        <Modal
          title="Delete employee"
          modalText="Are you sure you want to delete this employee? This action will also remove the employee from all registered shifts and departments"
          handleModalConfirm={handleDeleteEmployee}
          modalConfirmText="Delete Employee"
          handleModalClose={() => setIsDeleteEmployeeModalShown(false)}
        />
      )}
      <StyledEditEmployeeShiftsHeader>Shifts</StyledEditEmployeeShiftsHeader>
      {employeeShifts.length === 0 ? (
        <p>This employee is not registered to any shifts</p>
      ) : (
        <StyledEditEmployeeShiftsContainer
          style={{
            width: '100%',
          }}
        >
          <DataGrid
            autoHeight={true}
            rows={rows}
            columns={columns}
            pageSize={5}
            rowsPerPageOptions={[5]}
            disableSelectionOnClick={true}
          />
        </StyledEditEmployeeShiftsContainer>
      )}
      {isRegisteringToAShift ? (
        <StyledEditEmployeeRegisterShiftCancelButton
          onClick={() => setIsRegisteringToAShift(false)}
        >
          Cancel
        </StyledEditEmployeeRegisterShiftCancelButton>
      ) : (
        <StyledEditEmployeeRegisterShiftButton
          onClick={() => setIsRegisteringToAShift(true)}
        >
          Register to a shift
        </StyledEditEmployeeRegisterShiftButton>
      )}

      {isRegisteringToAShift &&
        (availableShiftsOptions.length === 0 ? (
          <p>There are no available shifts left</p>
        ) : (
          <>
            <FormInput
              onChange={(e) => setSelectedShift(e.target.value)}
              type="select"
              selectPlaceholder="Select a shift"
              value={selectedShift}
              options={availableShiftsOptions}
            />
            <StyledEditEmployeeRegisterShiftButton
              onClick={handleShiftRegistration}
            >
              Register
            </StyledEditEmployeeRegisterShiftButton>
          </>
        ))}
    </StyledEditEmployeeContainer>
  );
}
