import styled from 'styled-components';
import { StyledPrimaryButton } from '../../style/globalStyle';

export const StyledEmployeesContainer = styled.main`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const StyledEmployeesTitle = styled.h1``;

export const StyledEmployeesFilterContainer = styled.section`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

export const StyledEmployeesTableContainer = styled.section``;

export const StyledEmployeesNewEmployeeButton = styled(StyledPrimaryButton)`
  margin-top: 1rem;
`;
