import styled from 'styled-components';
import {
  StyledDangerButton,
  StyledOutlineButton,
  StyledPrimaryButton,
  StyledSecondaryButton,
} from '../../style/globalStyle';

export const StyledEditDepartmentContainer = styled.main`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const StyledEditDepartmentTitle = styled.h1``;

export const StyledEditDepartmentManager = styled.p``;

export const StyledEditDepartmentButtonContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-auto-flow: column;
  grid-gap: 1rem;
  margin: 1rem 0;
`;

export const StyledEditDepartmentEmployeesHeader = styled.h2``;

export const StyledEditDepartmentEmployeesList = styled.ul``;

export const StyledEditDepartmentEmployeesListItem = styled.li``;

export const StyledEditDepartmentEditButton = styled(StyledPrimaryButton)``;

export const StyledEditDepartmentDeleteButton = styled(StyledDangerButton)``;

export const StyledEditDepartmentMoveEmployeeButton = styled(
  StyledOutlineButton,
)`
  margin: 1rem 0;
`;

export const StyledEditDepartmentMoveEmployeeCancelButton = styled(
  StyledSecondaryButton,
)`
  margin: 1rem 0;
`;

export const StyledAllocateEmployeeButton = styled(StyledOutlineButton)``;
