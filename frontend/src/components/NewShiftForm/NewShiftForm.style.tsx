import styled from 'styled-components';
import {
  StyledOutlineButton,
  StyledPrimaryButton,
  StyledSecondaryTitle,
} from '../../style/globalStyle';

export const StyledNewShiftForm = styled.form`
  margin: 1rem 0;
  position: relative;
  max-width: ${({ theme }) => theme.formMaxWidth};
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
  width: 100%;
  padding: 2rem;
  border-radius: 4px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  background-color: #fff;
`;

export const StyledNewShiftFormHeader = styled(StyledSecondaryTitle)``;

export const StyledDifferentDateButton = styled(StyledOutlineButton)``;

export const StyledNewShiftFormEmployeesHeader = styled.h2`
  margin-top: 1rem;
  margin-bottom: 0;
`;

export const StyledNoEmployeesMessage = styled.p``;

export const StyledAddEmployeeHeader = styled.h3``;

export const StyledAddEmployeeButton = styled(StyledOutlineButton)``;

export const StyledNewShiftFormSubmitButton = styled(StyledPrimaryButton)`
  margin-top: 1rem;
`;
