import styled from 'styled-components';
import {
  StyledPrimaryButton,
  StyledPrimaryTitle,
  StyledSecondaryButton,
} from '../../style/globalStyle';

export const StyledShiftsContainer = styled.main`
  max-width: ${({ theme }) => theme.smallMaxWidth};
  width: 100%;
  align-self: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1rem;
`;

export const StyledShiftsTitle = styled(StyledPrimaryTitle)``;

export const StyledNewShiftButton = styled(StyledPrimaryButton)`
  margin: 1rem 0;
`;

export const StyledNewShiftCancelButton = styled(StyledSecondaryButton)`
  margin: 1rem 0;
`;
