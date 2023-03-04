import styled from 'styled-components';
import {
  StyledPrimaryButton,
  StyledSecondaryButton,
} from '../../style/globalStyle';

export const StyledNewDepartmentContainer = styled.main`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 1rem;
`;

export const StyledNewDepartmentTitle = styled.h1`
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 20px;
  text-align: center;
`;

export const StyledFormContainer = styled.form`
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

export const StyledFormButtonContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

export const StyledFormSubmitButton = styled(StyledPrimaryButton)``;

export const StyledFormCancelButton = styled(StyledSecondaryButton)`
  width: 100%;
`;
