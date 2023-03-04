import { TextField } from '@mui/material';
import {
  DesktopDatePicker,
  LocalizationProvider,
  TimePicker,
} from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import { useEffect, useState } from 'react';
import { useGetEmployeesQuery } from '../../redux/api/employeeApiSlice';
import {
  useGetShiftQuery,
  useUpdateShiftMutation,
} from '../../redux/api/shiftApiSlice';
import { Employee } from '../../types/employee.type';
import ErrorList from '../ErrorList';
import FormInput from '../FormInput';
import LoadingSpinner from '../LoadingSpinner';
import { validateNewShift } from '../NewShiftForm/NewShiftForm.validation';
import ShiftEmployeesList from '../ShiftEmployeesList';
import {
  StyledAddEmployeeButton,
  StyledAddEmployeeHeader,
  StyledEditShiftForm,
  StyledEditShiftFormButtonContainer,
  StyledEditShiftFormCancelButton,
  StyledEditShiftFormEmployeesHeader,
  StyledEditShiftFormHeader,
  StyledEditShiftFormSubmitButton,
  StyledNoEmployeesMessage,
} from './EditShiftForm.style';

interface EditShiftProps {
  shiftId: string;
  handleEditShiftCancel: () => void;
}

export default function EditShiftForm({
  shiftId,
  handleEditShiftCancel,
}: EditShiftProps) {
  const { data: shiftData, isLoading: isLoadingShiftData } =
    useGetShiftQuery(shiftId);
  const { data: employeesData, isLoading: isLoadingEmployeesData } =
    useGetEmployeesQuery();

  const [date, setDate] = useState<Date | null>(shiftData?.shift?.date || null);
  const [startTime, setStartTime] = useState<Date | null>(
    shiftData?.shift?.startTime || null,
  );
  const [endTime, setEndTime] = useState<Date | null>(
    shiftData?.shift?.endTime || null,
  );
  const [shiftEmployees, setShiftEmployees] = useState<string[]>(
    shiftData?.shift?.employees || [],
  );
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [errors, setErrors] = useState<string[]>([]);

  const [availableEmployees, setAvailableEmployees] = useState(
    employeesData.employees,
  );

  const [updateShift, { isLoading }] = useUpdateShiftMutation();

  useEffect(() => {
    if (employeesData) {
      setAvailableEmployees(
        employeesData.employees.filter(
          (employee: Employee) => !shiftEmployees.includes(employee._id),
        ),
      );
    }
  }, [shiftEmployees]);

  useEffect(() => {
    if (errors.length > 0) {
      setErrors([]);
    }
  }, [date, startTime, endTime, shiftEmployees]);

  useEffect(() => {
    if (isLoadingShiftData || isLoadingEmployeesData) {
      return;
    }
    if (shiftData?.shift) {
      setDate(shiftData.shift.date);
      setStartTime(shiftData.shift.startTime);
      setEndTime(shiftData.shift.endTime);
      setShiftEmployees(shiftData.shift.employees);
    }
  }, [isLoadingShiftData, isLoadingEmployeesData]);

  const handleEditShiftSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const validationErrors = validateNewShift({
      date,
      startTime,
      endTime,
      employees: shiftEmployees,
    });

    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }
    if (!date || !startTime || !endTime) return;
    try {
      const updateResp = await updateShift({
        id: shiftId,
        date,
        startTime,
        endTime,
        employees: shiftEmployees,
      }).unwrap();
      if (updateResp.updatedShift) {
        handleEditShiftCancel();
      }
    } catch (error: any) {
      setErrors([error.data.error.message]);
    }
  };

  const handleDateChange = (newValue: Dayjs | null) => {
    if (!dayjs(newValue).isValid()) {
      return;
    }
    setDate(newValue?.toDate() || null);
  };

  const handleStartTimeChange = (newValue: Dayjs | null) => {
    const startTime = dayjs(date)
      .set('hour', newValue?.hour() || 0)
      .set('minute', newValue?.minute() || 0);
    setStartTime(startTime.toDate());
  };

  const handleEndTimeChange = (newValue: Dayjs | null) => {
    const endTime = dayjs(date)
      .set('hour', newValue?.hour() || 0)
      .set('minute', newValue?.minute() || 0);
    setEndTime(endTime.toDate());
  };

  const handleAddEmployee = (employeeId: string) => {
    if (selectedEmployee === '') return;

    setShiftEmployees((prev) => [...prev, employeeId]);
    setSelectedEmployee('');
  };

  const handleRemoveEmployee = (employeeId: string) => {
    setShiftEmployees((prev) => prev.filter((id) => id !== employeeId));
  };
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <StyledEditShiftForm onSubmit={handleEditShiftSubmit}>
        {(isLoading || isLoadingEmployeesData || isLoadingShiftData) && (
          <LoadingSpinner />
        )}
        <StyledEditShiftFormHeader>Edit Shift</StyledEditShiftFormHeader>
        {date && 'Shift date - ' + dayjs(date).format('DD/MM/YYYY')}
        {date && (
          <button
            type="button"
            onClick={() => {
              setDate(null);
              setStartTime(null);
              setEndTime(null);
            }}
          >
            Choose different date
          </button>
        )}
        <h2>{date ? 'Choose Shift time' : 'Choose Shift Date'}</h2>
        {!date && (
          <DesktopDatePicker
            label="Shift Date"
            value={date}
            inputFormat="DD/MM/YYYY"
            renderInput={(params) => <TextField {...params} />}
            onChange={handleDateChange}
          />
        )}
        {date && (
          <>
            <TimePicker
              label="Start Time"
              value={startTime}
              renderInput={(params) => <TextField {...params} />}
              onChange={handleStartTimeChange}
            />
            <TimePicker
              label="End Time"
              value={endTime}
              renderInput={(params) => <TextField {...params} />}
              onChange={handleEndTimeChange}
            />
          </>
        )}
        <StyledEditShiftFormEmployeesHeader>
          Employees in this shift
        </StyledEditShiftFormEmployeesHeader>
        {shiftEmployees.length === 0 ? (
          <StyledNoEmployeesMessage>
            No employees in this shift
          </StyledNoEmployeesMessage>
        ) : (
          <ShiftEmployeesList
            employees={shiftEmployees}
            employeesData={employeesData.employees}
            handleRemoveEmployee={handleRemoveEmployee}
          />
        )}

        <StyledAddEmployeeHeader>
          Add Employee to this shift
        </StyledAddEmployeeHeader>
        <FormInput
          type="select"
          value={selectedEmployee}
          selectPlaceholder={
            availableEmployees.length === 0
              ? 'No employees available'
              : 'Select employee'
          }
          options={availableEmployees?.map((employee: Employee) => ({
            value: employee._id,
            label: `${employee.firstName} ${employee.lastName}`,
          }))}
          isLoadingOptions={isLoadingEmployeesData}
          onChange={(e) => setSelectedEmployee(e.target.value)}
        />
        <StyledAddEmployeeButton
          onClick={() => handleAddEmployee(selectedEmployee)}
          type="button"
        >
          Add Employee
        </StyledAddEmployeeButton>
        <StyledEditShiftFormButtonContainer>
          <StyledEditShiftFormSubmitButton type="submit">
            Update shift
          </StyledEditShiftFormSubmitButton>
          <StyledEditShiftFormCancelButton
            type="button"
            onClick={() => handleEditShiftCancel()}
          >
            Cancel edit
          </StyledEditShiftFormCancelButton>
        </StyledEditShiftFormButtonContainer>
        {errors.length > 0 && <ErrorList errors={errors} />}
      </StyledEditShiftForm>
    </LocalizationProvider>
  );
}
