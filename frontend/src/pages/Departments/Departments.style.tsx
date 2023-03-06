import styled from 'styled-components';
import {
  StyledPrimaryButton,
  StyledPrimaryTitle,
} from '../../style/globalStyle';

export const StyledDepartmentsContainer = styled.main`
  max-width: ${({ theme }) => theme.smallMaxWidth};
  width: 100%;
  align-self: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1rem;
`;

export const StyledDepartmentsTitle = styled(StyledPrimaryTitle)``;

export const StyledDepartmentsTableContainer = styled.section`
  div {
    border-color: ${({ theme }) => theme.colors.grey};
  }
  .MuiDataGrid-row {
    .MuiDataGrid-cell--withRenderer.MuiDataGrid-cell {
      border-color: ${({ theme }) => theme.colors.grey};
    }
  }
`;

export const StyledDepartmentsNewDepartmentButton = styled(StyledPrimaryButton)`
  margin-top: 1rem;
`;
