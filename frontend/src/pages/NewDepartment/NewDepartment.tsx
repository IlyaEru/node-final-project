import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ErrorList from '../../components/ErrorList';
import FormInput from '../../components/FormInput';
import LoadingSpinner from '../../components/LoadingSpinner';
import { useCreateDepartmentMutation } from '../../redux/api/departmentApiSlice';
import { useGetEmployeesQuery } from '../../redux/api/employeeApiSlice';
import { Employee } from '../../types/employee.type';
import {
  StyledFormButtonContainer,
  StyledFormCancelButton,
  StyledFormContainer,
  StyledFormSubmitButton,
  StyledNewDepartmentContainer,
  StyledNewDepartmentTitle,
} from './NewDepartment.style';
import { validateNewDepartment } from './NewDepartment.validation';

export default function NewDepartment() {
  const [name, setName] = useState('');
  const [manager, setManager] = useState('');
  const [errors, setErrors] = useState<string[]>([]);

  const navigate = useNavigate();

  const { data, isLoading: isLoadingEmployees } = useGetEmployeesQuery();

  const [createDepartment, { isLoading: isLoadingDepartmentCreation }] =
    useCreateDepartmentMutation();

  useEffect(() => {
    errors.length > 0 && setErrors([]);
  }, [name, manager]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const validationErrors = validateNewDepartment({
      name,
      manager,
    });

    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      const newDepartment = await createDepartment({
        name,
        manager,
      }).unwrap();

      if (newDepartment) {
        navigate(`/departments/${newDepartment.department._id}`);
      }
    } catch (error: any) {
      setErrors([error.data.error.message]);
    }
  };
  return (
    <StyledNewDepartmentContainer>
      <StyledNewDepartmentTitle>New Department</StyledNewDepartmentTitle>
      <StyledFormContainer onSubmit={handleSubmit}>
        <FormInput
          label="Name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <FormInput
          label="Manager"
          type="select"
          value={manager}
          isLoadingOptions={isLoadingEmployees}
          options={data?.employees.map((employee: Employee) => ({
            value: employee._id,
            label: `${employee.firstName} ${employee.lastName}`,
          }))}
          onChange={(e) => setManager(e.target.value)}
        />
        <StyledFormButtonContainer>
          <StyledFormSubmitButton>Create</StyledFormSubmitButton>
          <Link to="/departments">
            <StyledFormCancelButton>Cancel</StyledFormCancelButton>
          </Link>
        </StyledFormButtonContainer>
        {errors.length > 0 && <ErrorList errors={errors} />}
        {isLoadingDepartmentCreation && <LoadingSpinner />}
      </StyledFormContainer>
    </StyledNewDepartmentContainer>
  );
}
