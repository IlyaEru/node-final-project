import {
  StyledErrorListContainer,
  StyledErrorListItem,
} from './ErrorList.style';

export default function ErrorList({ errors }: { errors: string[] }) {
  return (
    <StyledErrorListContainer>
      {errors.map((error, index) => (
        <StyledErrorListItem key={index}>{error}</StyledErrorListItem>
      ))}
    </StyledErrorListContainer>
  );
}
