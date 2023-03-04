import { Link } from 'react-router-dom';
import {
  StyledHomeButton,
  StyledNotFoundContainer,
  StyledNotFoundDescription,
  StyledNotFoundTitle,
} from './NotFound.style';

export default function NotFound() {
  return (
    <StyledNotFoundContainer>
      <StyledNotFoundTitle>404 - Page not found</StyledNotFoundTitle>
      <StyledNotFoundDescription>
        The requested page could not be found.
      </StyledNotFoundDescription>
      <Link to="/">
        <StyledHomeButton>Go to home page</StyledHomeButton>
      </Link>
    </StyledNotFoundContainer>
  );
}
