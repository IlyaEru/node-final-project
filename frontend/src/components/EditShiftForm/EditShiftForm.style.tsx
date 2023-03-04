import styled from 'styled-components';
import {
  StyledOutlineButton,
  StyledPrimaryButton,
} from '../../style/globalStyle';

export const StyledEditShiftForm = styled.form`
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

export const StyledEditShiftFormHeader = styled.h2``;

export const StyledEditShiftFormEmployeesHeader = styled.h2``;

export const StyledNoEmployeesMessage = styled.p``;

export const StyledAddEmployeeHeader = styled.h3``;

export const StyledAddEmployeeButton = styled(StyledOutlineButton)``;

export const StyledEditShiftFormButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
  width: 100%;
`;

export const StyledEditShiftFormCancelButton = styled(StyledOutlineButton)``;

export const StyledEditShiftFormSubmitButton = styled(StyledPrimaryButton)``;
