import styled from 'styled-components';

export const StyledShiftEmployeesList = styled.ul`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  width: 100%;
  border-radius: 4px;
`;

export const StyledShiftEmployeesNumber = styled.p`
  font-size: 1.5rem;
  font-weight: 600;
`;

export const StyledShiftEmployeesListItem = styled.li`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 2rem;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  background-color: ${({ theme }) => theme.colors.lightGrey};
`;

export const StyledRemoveEmployeeButton = styled.button`
  display: flex;
  align-items: center;
  background-color: transparent;
  border: none;
  cursor: pointer;
  font-size: 1.5rem;
  color: ${({ theme }) => theme.colors.red};
`;
