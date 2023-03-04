import styled from 'styled-components';
import {
  StyledPrimaryButton,
  StyledSecondaryButton,
} from '../../style/globalStyle';

export const StyledEditEmployeeFormContainer = styled.main`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const StyledEditEmployeeFormHeader = styled.h1``;

export const StyledEditEmployeeForm = styled.form`
  position: relative;
  max-width: ${({ theme }) => theme.formMaxWidth};
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 2rem;
  border-radius: 4px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  background-color: #fff;
`;

export const StyledEditEmployeeFormButtonContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-auto-flow: column;
  grid-gap: 1rem;
  margin: 1rem 0;
`;

export const StyledEditEmployeeFormSubmitButton = styled(StyledPrimaryButton)``;

export const StyledEditEmployeeFormCancelButton = styled(
  StyledSecondaryButton,
)``;
