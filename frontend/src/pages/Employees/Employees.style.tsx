import styled from 'styled-components';
import {
  StyledPrimaryButton,
  StyledPrimaryTitle,
} from '../../style/globalStyle';

export const StyledEmployeesContainer = styled.main`
  max-width: ${({ theme }) => theme.largeMaxWidth};
  width: 100%;
  align-self: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1rem;
`;

export const StyledEmployeesTitle = styled(StyledPrimaryTitle)``;

export const StyledEmployeesFilterContainer = styled.section`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

export const StyledEmployeesTableContainer = styled.section`
  div {
    border-color: ${({ theme }) => theme.colors.grey};
  }
  .MuiDataGrid-row {
    .MuiDataGrid-cell--withRenderer.MuiDataGrid-cell {
      border-color: ${({ theme }) => theme.colors.grey};
    }
  }
`;

export const StyledEmployeesNewEmployeeButton = styled(StyledPrimaryButton)`
  margin-top: 1rem;
`;
