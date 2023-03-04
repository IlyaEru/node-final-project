import styled from 'styled-components';
import {
  StyledPrimaryButton,
  StyledSecondaryButton,
} from '../../style/globalStyle';

export const StyledShiftsContainer = styled.main`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const StyledShiftsTitle = styled.h1``;

export const StyledNewShiftButton = styled(StyledPrimaryButton)`
  margin: 1rem 0;
`;

export const StyledNewShiftCancelButton = styled(StyledSecondaryButton)`
  margin: 1rem 0;
`;
