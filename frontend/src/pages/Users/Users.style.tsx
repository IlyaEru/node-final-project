import styled from 'styled-components';
import { StyledPrimaryTitle } from '../../style/globalStyle';

export const StyledUsersContainer = styled.main`
  max-width: ${({ theme }) => theme.smallMaxWidth};
  width: 100%;
  align-self: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1rem;
`;

export const StyledUsersTitle = styled(StyledPrimaryTitle)``;

export const StyledUsersTableContainer = styled.section`
  div {
    border-color: ${({ theme }) => theme.colors.grey};
  }
  .MuiDataGrid-row {
    .MuiDataGrid-cell--withRenderer.MuiDataGrid-cell,
    .MuiDataGrid-cell {
      border-color: ${({ theme }) => theme.colors.grey};
    }
  }
`;
