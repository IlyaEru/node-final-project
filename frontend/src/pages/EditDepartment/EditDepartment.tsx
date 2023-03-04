import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import EditDepartmentForm from '../../components/EditDepartmentForm/EditDepartmentForm';
import FormInput from '../../components/FormInput';
import LoadingSpinner from '../../components/LoadingSpinner';
import Modal from '../../components/Modal';
import { getEmployeeFullName } from '../../helpers/departmentUtils';
import {
  useDeleteDepartmentMutation,
  useGetDepartmentQuery,
  useUpdateDepartmentMutation,
} from '../../redux/api/departmentApiSlice';
import { useGetEmployeesQuery } from '../../redux/api/employeeApiSlice';
import { Employee } from '../../types/employee.type';
import {
  StyledAllocateEmployeeButton,
  StyledEditDepartmentButtonContainer,
  StyledEditDepartmentContainer,
  StyledEditDepartmentDeleteButton,
  StyledEditDepartmentEditButton,
  StyledEditDepartmentEmployeesHeader,
  StyledEditDepartmentEmployeesList,
  StyledEditDepartmentManager,
  StyledEditDepartmentMoveEmployeeButton,
  StyledEditDepartmentMoveEmployeeCancelButton,
  StyledEditDepartmentTitle,
} from './EditDepartment.style';

export default function EditDepartment() {
  const { id: departmentId } = useParams<{ id: string }>();

  const navigate = useNavigate();

  const [isEditingDepartment, setIsEditingDepartment] = useState(false);

  const [isMovingEmployee, setIsMovingEmployee] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [isDeleteDepartmentModalShown, setIsDeleteDepartmentModalShown] =
    useState(false);
  const { data, isLoading } = useGetDepartmentQuery(departmentId || '');

  const { data: employeesData, isLoading: isLoadingEmployees } =
    useGetEmployeesQuery();

  const [updateDepartment, { isLoading: isLoadingDepartmentUpdate }] =
    useUpdateDepartmentMutation();

  const [deleteDepartment, { isLoading: isLoadingDepartmentRemoval }] =
    useDeleteDepartmentMutation();

  const availableEmployees = employeesData?.employees.filter(
    (employee: Employee) => employee.department !== departmentId,
  );

  const availableEmployeesOptions = availableEmployees?.map(
    (employee: Employee) => ({
      value: employee._id,
      label: getEmployeeFullName(employee._id, employeesData?.employees || []),
    }),
  );

  const handleMoveEmployee = async () => {
    if (!selectedEmployee || !data || !departmentId) {
      return;
    }
    const updateResp = await updateDepartment({
      id: departmentId,
      name: data?.department.name,
      manager: data?.department.manager,
      employees: [...data?.department.employees, selectedEmployee],
    }).unwrap();
    if (updateResp.department) {
      setIsMovingEmployee(false);
      setSelectedEmployee('');
    }
  };

  const handleDeleteDepartment = async () => {
    if (!departmentId) {
      return;
    }
    try {
      setIsDeleteDepartmentModalShown(false);
      await deleteDepartment({ id: departmentId }).unwrap();
      navigate('/departments');
    } catch (error: any) {
      console.log({ error });
    }
  };

  if (isLoading || isLoadingEmployees) {
    return <LoadingSpinner />;
  }

  if (!data) {
    return <p>Department not found</p>;
  }

  return (
    <StyledEditDepartmentContainer>
      {(isLoadingDepartmentUpdate || isLoadingDepartmentRemoval) && (
        <LoadingSpinner />
      )}
      {isEditingDepartment ? (
        <EditDepartmentForm
          departmentData={data.department}
          handleEditDepartmentCancel={() => setIsEditingDepartment(false)}
        />
      ) : (
        <>
          <StyledEditDepartmentTitle>
            Department: {data.department.name}
          </StyledEditDepartmentTitle>
          <StyledEditDepartmentManager>
            Manager:{' '}
            {data.department.manager ? (
              <Link to={`/employees/${data.department.manager}`}>
                {getEmployeeFullName(
                  data.department.manager,
                  employeesData?.employees || [],
                )}
              </Link>
            ) : (
              'No manager'
            )}
          </StyledEditDepartmentManager>
          <StyledEditDepartmentEmployeesHeader>
            Employees
          </StyledEditDepartmentEmployeesHeader>
          {data.department.employees.length === 0 ? (
            'No employees'
          ) : (
            <StyledEditDepartmentEmployeesList>
              {data.department.employees.map((employeeId: string) => (
                <li key={employeeId}>
                  <Link to={`/employees/${employeeId}`}>
                    {getEmployeeFullName(
                      employeeId,
                      employeesData?.employees || [],
                    )}
                  </Link>
                </li>
              ))}
            </StyledEditDepartmentEmployeesList>
          )}
          <StyledEditDepartmentButtonContainer>
            <StyledEditDepartmentEditButton
              onClick={() => setIsEditingDepartment(true)}
            >
              Edit
            </StyledEditDepartmentEditButton>

            <StyledEditDepartmentDeleteButton
              onClick={() => setIsDeleteDepartmentModalShown(true)}
            >
              Delete
            </StyledEditDepartmentDeleteButton>
          </StyledEditDepartmentButtonContainer>
        </>
      )}
      {isDeleteDepartmentModalShown && (
        <Modal
          title="Delete Department"
          modalText="Are you sure you want to delete this department?, this action will delete all employees in this department"
          handleModalClose={() => setIsDeleteDepartmentModalShown(false)}
          handleModalConfirm={handleDeleteDepartment}
          modalConfirmText={'Delete Department'}
        />
      )}

      {isMovingEmployee ? (
        <StyledEditDepartmentMoveEmployeeCancelButton
          onClick={() => setIsMovingEmployee(false)}
        >
          Cancel
        </StyledEditDepartmentMoveEmployeeCancelButton>
      ) : (
        <StyledEditDepartmentMoveEmployeeButton
          onClick={() => setIsMovingEmployee(true)}
        >
          Allocate Employee to Department
        </StyledEditDepartmentMoveEmployeeButton>
      )}
      {isMovingEmployee &&
        (availableEmployeesOptions.length === 0 ? (
          <p>No available employees</p>
        ) : (
          <>
            <FormInput
              onChange={(e) => setSelectedEmployee(e.target.value)}
              options={availableEmployeesOptions}
              selectPlaceholder="Select employee"
              type="select"
              value={selectedEmployee}
            />
            <StyledAllocateEmployeeButton onClick={handleMoveEmployee}>
              Allocate Employee
            </StyledAllocateEmployeeButton>
          </>
        ))}
    </StyledEditDepartmentContainer>
  );
}
