import styled from 'styled-components';
import {
  StyledDangerButton,
  StyledOutlineButton,
  StyledPrimaryButton,
  StyledSecondaryButton,
} from '../../style/globalStyle';

export const StyledEditEmployeeContainer = styled.main`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const StyledEditEmployeeFullname = styled.h1``;

export const StyledEditEmployeeDepartmentHeader = styled.h2``;

export const StyledEditEmployeeShiftsHeader = styled.h3``;

export const StyledEditEmployeeButtonContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-auto-flow: column;
  grid-gap: 1rem;
  margin: 1rem 0;
`;

export const StyledEditEmployeeEditButton = styled(StyledPrimaryButton)``;

export const StyledEditEmployeeDeleteButton = styled(StyledDangerButton)``;

export const StyledEditEmployeeShiftsContainer = styled.div``;

export const StyledEditEmployeeRegisterShiftButton = styled(
  StyledOutlineButton,
)`
  margin: 1rem;
`;
export const StyledEditEmployeeRegisterShiftCancelButton = styled(
  StyledSecondaryButton,
)`
  margin: 1rem;
`;
