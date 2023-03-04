import { useEffect, useState } from 'react';
import { useGetDepartmentsQuery } from '../../redux/api/departmentApiSlice';
import {
  UpdateEmployeeBody,
  useUpdateEmployeeMutation,
} from '../../redux/api/employeeApiSlice';
import { Department } from '../../types/department.type';
import { Employee } from '../../types/employee.type';
import ErrorList from '../ErrorList';
import FormInput from '../FormInput';
import LoadingSpinner from '../LoadingSpinner';
import {
  StyledEditEmployeeForm,
  StyledEditEmployeeFormButtonContainer,
  StyledEditEmployeeFormCancelButton,
  StyledEditEmployeeFormContainer,
  StyledEditEmployeeFormHeader,
  StyledEditEmployeeFormSubmitButton,
} from './EditEmployeeForm.style';
import { validateEditEmployee } from './EditEmployeeForm.validation';

interface EditEmployeeFormProps {
  employeeData: Employee;
  handleEditEmployeeCancel: () => void;
}

export default function EditEmployeeForm({
  employeeData,
  handleEditEmployeeCancel,
}: EditEmployeeFormProps) {
  const [firstName, setFirstName] = useState(employeeData.firstName);
  const [lastName, setLastName] = useState(employeeData.lastName);
  const [startingWorkYear, setStartingWorkYear] = useState<number | ''>(
    employeeData.startingWorkYear,
  );
  const [department, setDepartment] = useState(employeeData.department || '');
  const [errors, setErrors] = useState<string[]>([]);

  const [
    updateEmployee,
    { isLoading: isLoadingEmployeeUpdate, error, status },
  ] = useUpdateEmployeeMutation();

  const { data: departmentsData, isLoading: isLoadingDepartments } =
    useGetDepartmentsQuery();

  useEffect(() => {
    errors.length > 0 && setErrors([]);
  }, [firstName, lastName, startingWorkYear, department]);

  const handleEditEmployeeSubmit = async (
    e: React.FormEvent<HTMLFormElement>,
  ) => {
    e.preventDefault();

    const validationErrors = validateEditEmployee({
      firstName,
      lastName,
      startingWorkYear,
      department,
    });

    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }
    const updatePayload: UpdateEmployeeBody = {
      id: employeeData._id,
      firstName,
      lastName,
      startingWorkYear: Number(startingWorkYear),
    };
    if (department) {
      updatePayload.department = department;
    }

    try {
      const updatedEmployee = await updateEmployee(updatePayload);
      if (updatedEmployee) {
        handleEditEmployeeCancel();
      }
    } catch (error: any) {
      setErrors([error.data.error.message]);
    }
  };

  const departmentSelectOptions = departmentsData?.departments.map(
    (department: Department) => {
      return {
        value: department._id,
        label: department.name,
      };
    },
  );

  return (
    <StyledEditEmployeeFormContainer>
      <StyledEditEmployeeFormHeader>
        Edit Employee {employeeData.firstName} {employeeData.lastName}
      </StyledEditEmployeeFormHeader>
      <StyledEditEmployeeForm onSubmit={handleEditEmployeeSubmit}>
        {isLoadingEmployeeUpdate && <LoadingSpinner />}
        <FormInput
          type="text"
          label="First name"
          value={firstName}
          onChange={(e) => {
            setFirstName(e.target.value);
          }}
        />
        <FormInput
          type="text"
          label="Last name"
          value={lastName}
          onChange={(e) => {
            setLastName(e.target.value);
          }}
        />
        <FormInput
          type="number"
          label="Starting work year"
          value={startingWorkYear}
          onChange={(e) => {
            setStartingWorkYear(Number(e.target.value) || '');
          }}
        />
        <FormInput
          type="select"
          label="Department"
          value={department}
          options={departmentSelectOptions}
          onChange={(e) => {
            setDepartment(e.target.value);
          }}
          isLoadingOptions={isLoadingDepartments}
        />
        <StyledEditEmployeeFormButtonContainer>
          <StyledEditEmployeeFormSubmitButton type="submit">
            Save changes
          </StyledEditEmployeeFormSubmitButton>
          <StyledEditEmployeeFormCancelButton
            onClick={handleEditEmployeeCancel}
          >
            Cancel
          </StyledEditEmployeeFormCancelButton>
        </StyledEditEmployeeFormButtonContainer>
      </StyledEditEmployeeForm>
      {errors.length > 0 && <ErrorList errors={errors} />}
    </StyledEditEmployeeFormContainer>
  );
}
