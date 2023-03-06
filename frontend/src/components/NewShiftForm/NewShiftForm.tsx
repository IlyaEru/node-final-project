import dayjs, { Dayjs } from 'dayjs';
import { useEffect, useState } from 'react';
import FormInput from '../FormInput';
import {
  StyledAddEmployeeButton,
  StyledAddEmployeeHeader,
  StyledDifferentDateButton,
  StyledNewShiftForm,
  StyledNewShiftFormEmployeesHeader,
  StyledNewShiftFormHeader,
  StyledNewShiftFormSubmitButton,
  StyledNoEmployeesMessage,
} from './NewShiftForm.style';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import {
  DesktopDatePicker,
  LocalizationProvider,
  TimePicker,
} from '@mui/x-date-pickers';
import { TextField } from '@mui/material';
import ShiftEmployeesList from '../ShiftEmployeesList';
import { useGetEmployeesQuery } from '../../redux/api/employeeApiSlice';
import { Employee } from '../../types/employee.type';
import { validateNewShift } from './NewShiftForm.validation';
import ErrorList from '../ErrorList';
import { useCreateShiftMutation } from '../../redux/api/shiftApiSlice';
import LoadingSpinner from '../LoadingSpinner';

export default function NewShiftForm({
  handleNewShiftCancel,
}: {
  handleNewShiftCancel: () => void;
}) {
  const [date, setDate] = useState<Date | null>(null);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [endTime, setEndTime] = useState<Date | null>(null);
  const [shiftEmployees, setShiftEmployees] = useState<string[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [errors, setErrors] = useState<string[]>([]);

  const { data: employeesData, isLoading: isLoadingEmployeesData } =
    useGetEmployeesQuery();

  const [availableEmployees, setAvailableEmployees] = useState(
    employeesData.employees,
  );

  const [createShift, { isLoading }] = useCreateShiftMutation();

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

  const handleNewShiftSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
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
      const createShiftResponse = await createShift({
        date,
        startTime,
        endTime,
        employees: shiftEmployees,
      }).unwrap();
      if (createShiftResponse.shift) {
        handleNewShiftCancel();
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
      <StyledNewShiftForm onSubmit={handleNewShiftSubmit}>
        {isLoading && <LoadingSpinner />}
        <StyledNewShiftFormHeader>New Shift</StyledNewShiftFormHeader>
        {date && 'Shift date - ' + dayjs(date).format('DD/MM/YYYY')}
        {date && (
          <StyledDifferentDateButton
            type="button"
            onClick={() => {
              setDate(null);
              setStartTime(null);
              setEndTime(null);
            }}
          >
            Choose different date
          </StyledDifferentDateButton>
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
        <StyledNewShiftFormEmployeesHeader>
          Employees in this shift
        </StyledNewShiftFormEmployeesHeader>
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
        <StyledNewShiftFormSubmitButton type="submit">
          Create new shift
        </StyledNewShiftFormSubmitButton>
        {errors.length > 0 && <ErrorList errors={errors} />}
      </StyledNewShiftForm>
    </LocalizationProvider>
  );
}
