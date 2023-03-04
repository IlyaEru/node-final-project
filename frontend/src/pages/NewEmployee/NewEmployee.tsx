import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ErrorList from '../../components/ErrorList';
import FormInput from '../../components/FormInput';
import LoadingSpinner from '../../components/LoadingSpinner';
import { useCreateEmployeeMutation } from '../../redux/api/employeeApiSlice';
import {
  StyledFormButtonContainer,
  StyledFormCancelButton,
  StyledFormContainer,
  StyledFormSubmitButton,
  StyledNewEmployeeContainer,
  StyledNewEmployeeTitle,
} from './NewEmployee.style';
import validateNewEmployee from './NewEmployee.validation';

export default function NewEmployee() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [startingWorkYear, setStartingWorkYear] = useState('');
  const [errors, setErrors] = useState<string[]>([]);

  const navigate = useNavigate();

  const [createEmployee, { isLoading }] = useCreateEmployeeMutation();

  useEffect(() => {
    errors.length > 0 && setErrors([]);
  }, [firstName, lastName, startingWorkYear]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const validationErrors = validateNewEmployee({
      firstName,
      lastName,
      startingWorkYear,
    });
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      const newEmployee = await createEmployee({
        firstName,
        lastName,
        startingWorkYear: Number(startingWorkYear),
      }).unwrap();

      if (newEmployee) {
        navigate(`/employees/${newEmployee.employee._id}`);
      }
    } catch (error: any) {
      setErrors([error.data.error.message]);
    }
  };

  return (
    <StyledNewEmployeeContainer>
      <StyledNewEmployeeTitle>New Employee</StyledNewEmployeeTitle>
      <StyledFormContainer onSubmit={handleSubmit}>
        <FormInput
          label="First Name"
          type="text"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
        />
        <FormInput
          label="Last Name"
          type="text"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
        />
        <FormInput
          label="Starting Work Year"
          type="number"
          value={startingWorkYear}
          onChange={(e) => setStartingWorkYear(e.target.value)}
          min="1900"
          max="2100"
        />
        <StyledFormButtonContainer>
          <StyledFormSubmitButton>Create</StyledFormSubmitButton>
          <Link to="/employees">
            <StyledFormCancelButton>Cancel</StyledFormCancelButton>
          </Link>
        </StyledFormButtonContainer>
        {errors.length > 0 && <ErrorList errors={errors} />}
        {isLoading && <LoadingSpinner />}
      </StyledFormContainer>
    </StyledNewEmployeeContainer>
  );
}
