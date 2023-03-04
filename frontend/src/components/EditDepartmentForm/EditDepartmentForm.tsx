import { useEffect, useState } from 'react';
import {
  UpdateDepartmentBody,
  useGetDepartmentsQuery,
  useUpdateDepartmentMutation,
} from '../../redux/api/departmentApiSlice';
import {
  UpdateEmployeeBody,
  useGetEmployeesQuery,
  useUpdateEmployeeMutation,
} from '../../redux/api/employeeApiSlice';
import { Department } from '../../types/department.type';
import { Employee } from '../../types/employee.type';
import ErrorList from '../ErrorList';
import FormInput from '../FormInput';
import LoadingSpinner from '../LoadingSpinner';
import {
  StyledEditDepartmentForm,
  StyledEditDepartmentFormButtonContainer,
  StyledEditDepartmentFormCancelButton,
  StyledEditDepartmentFormContainer,
  StyledEditDepartmentFormHeader,
  StyledEditDepartmentFormSubmitButton,
} from './EditDepartmentForm.style';
import { validateEditDepartment } from './EditDepartmentForm.validation';

interface EditDepartmentFormProps {
  departmentData: Department;
  handleEditDepartmentCancel: () => void;
}

export default function EditDepartmentForm({
  departmentData,
  handleEditDepartmentCancel,
}: EditDepartmentFormProps) {
  const [name, setName] = useState(departmentData.name);
  const [manager, setManager] = useState(departmentData.manager);
  const [employees, setEmployees] = useState(departmentData.employees || []);
  const [errors, setErrors] = useState<string[]>([]);

  const [
    updateDepartment,
    { isLoading: isLoadingDepartmentUpdate, error, status },
  ] = useUpdateDepartmentMutation();

  const { data: departmentsData, isLoading: isLoadingDepartments } =
    useGetDepartmentsQuery();

  const { data: employeesData, isLoading: isLoadingEmployees } =
    useGetEmployeesQuery();

  useEffect(() => {
    errors.length > 0 && setErrors([]);
  }, [name, manager, employees]);

  const handleEditDepartmentSubmit = async (
    e: React.FormEvent<HTMLFormElement>,
  ) => {
    e.preventDefault();

    const validationErrors = validateEditDepartment({
      name,
      manager,
      employees,
    });

    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }
    const updatePayload: UpdateDepartmentBody = {
      id: departmentData._id,
      name,
      manager,
    };

    if (employees.length > 0) {
      updatePayload.employees = employees;
    }

    try {
      const updatedEmployee = await updateDepartment(updatePayload).unwrap();

      console.log(updatedEmployee.department.name);

      if (
        updatedEmployee.department.name &&
        updatedEmployee.department.name === name
      ) {
        handleEditDepartmentCancel();
      }
    } catch (error: any) {
      setErrors([error.data.error.message]);
    }
  };

  const managerSelectOptions = employeesData?.employees.map(
    (employee: Employee) => {
      return {
        value: employee._id,
        label: `
          ${employee.firstName} ${employee.lastName} 
        `,
      };
    },
  );

  return (
    <StyledEditDepartmentFormContainer>
      <StyledEditDepartmentFormHeader>
        Edit Department {departmentData.name}
      </StyledEditDepartmentFormHeader>
      <StyledEditDepartmentForm onSubmit={handleEditDepartmentSubmit}>
        {(isLoadingDepartmentUpdate || isLoadingDepartments) && (
          <LoadingSpinner />
        )}
        <FormInput
          type="text"
          label="Name"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
          }}
        />

        <FormInput
          type="select"
          label="Manager"
          value={manager}
          options={managerSelectOptions}
          onChange={(e) => {
            setManager(e.target.value);
          }}
          isLoadingOptions={isLoadingEmployees}
        />
        <StyledEditDepartmentFormButtonContainer>
          <StyledEditDepartmentFormSubmitButton type="submit">
            Save changes
          </StyledEditDepartmentFormSubmitButton>
          <StyledEditDepartmentFormCancelButton
            onClick={handleEditDepartmentCancel}
          >
            Cancel
          </StyledEditDepartmentFormCancelButton>
        </StyledEditDepartmentFormButtonContainer>
      </StyledEditDepartmentForm>
      {errors.length > 0 && <ErrorList errors={errors} />}
    </StyledEditDepartmentFormContainer>
  );
}
