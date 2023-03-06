import styled from 'styled-components';
import {
  StyledDangerButton,
  StyledOutlineButton,
  StyledPrimaryButton,
  StyledPrimaryTitle,
  StyledSecondaryButton,
  StyledSecondaryTitle,
} from '../../style/globalStyle';

export const StyledEditEmployeeContainer = styled.main`
  max-width: ${({ theme }) => theme.smallMaxWidth};
  width: 100%;
  align-self: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1rem;
`;

export const StyledEditEmployeeFullname = styled(StyledPrimaryTitle)``;

export const StyledEditEmployeeDepartmentHeader = styled(
  StyledSecondaryTitle,
)``;

export const StyledEditEmployeeShiftsHeader = styled.h3`
  margin: 1rem 0;
`;

export const StyledEditEmployeeButtonContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-auto-flow: column;
  grid-gap: 1rem;
  margin: 1rem 0;
`;

export const StyledEditEmployeeEditButton = styled(StyledPrimaryButton)``;

export const StyledEditEmployeeDeleteButton = styled(StyledDangerButton)``;

export const StyledEditEmployeeShiftsContainer = styled.div`
  div {
    border-color: ${({ theme }) => theme.colors.grey};
  }
  .MuiDataGrid-row {
    .MuiDataGrid-cell--withRenderer.MuiDataGrid-cell {
      border-color: ${({ theme }) => theme.colors.grey};
    }
  }
`;

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
