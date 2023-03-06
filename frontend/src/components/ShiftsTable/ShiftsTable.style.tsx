import styled from 'styled-components';
import { StyledPrimaryButton } from '../../style/globalStyle';

export const StyledShiftsTableContainer = styled.div`
  div {
    border-color: ${({ theme }) => theme.colors.grey};
  }
  .MuiDataGrid-row {
    .MuiDataGrid-cell--withRenderer.MuiDataGrid-cell {
      border-color: ${({ theme }) => theme.colors.grey};
    }
  }
`;

export const StyledEditShiftButton = styled(StyledPrimaryButton)`
  padding: 0.5rem 1rem;
  @media (max-width: ${({ theme }) => theme.breakpoints.small}) {
    font-size: 0.8rem;
    padding: 0.3rem 0.5rem;
  }
`;
