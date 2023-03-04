import { GridLoader } from 'react-spinners';
import { StyledLoadingSpinnerContainer } from './LoadingSpinner.style';

export default function LoadingSpinner() {
  return (
    <StyledLoadingSpinnerContainer>
      <GridLoader color="#36d7b7" />
    </StyledLoadingSpinnerContainer>
  );
}
