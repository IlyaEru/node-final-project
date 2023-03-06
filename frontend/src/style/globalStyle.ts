import { Link } from 'react-router-dom';
import styled, { createGlobalStyle } from 'styled-components';

interface Props {
  width?: string;
  height?: string;
  color?: string;
  bg?: string;
  size?: string;
}

export const GlobalStyle = createGlobalStyle`
   *, ::after,
::before{
    margin: 0;
    padding: 0;
    box-sizing: border-box;
font-family: 'heebo', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
    Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
}
:root{
  font-size: clamp(0.5rem, calc(.6rem + 1vw), 1.2rem);
}

h1,
h2,
h3,
h4 {
  
  text-transform: capitalize;
  line-height: 1.25;
  margin-bottom: 0.75rem;
}
body{
  background-color: ${({ theme }) => theme.colors.whiteRock};
}
#root {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}
ul {
  list-style-type: none;
}
`;

export const StyledPrimaryTitle = styled.h1`
  font-size: 2.5rem;
  color: ${({ theme }) => theme.colors.redPurple};
  margin-bottom: 1rem;
  font-family: 'Poppins', sans-serif;
`;

export const StyledSecondaryTitle = styled.h2`
  font-size: 2rem;
  color: ${({ theme }) => theme.colors.blueGrey};
  margin-bottom: 1rem;
`;

export const StyledPrimaryButton = styled.button`
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 5px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s;
  padding: 0.8rem 2rem;
  &:hover {
    background-color: #0069d9;
  }
`;

export const StyledSecondaryButton = styled.button`
  background-color: #6c757d;
  color: #fff;
  border: none;
  border-radius: 5px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s;
  padding: 0.8rem 2rem;

  &:hover {
    background-color: #5a6268;
  }
`;

export const StyledOutlineButton = styled.button`
  background-color: transparent;
  color: #007bff;
  border: 1px solid #007bff;
  border-radius: 5px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s;
  padding: 0.8rem 2rem;

  &:hover {
    background-color: #007bff;
    color: #fff;
  }
`;

export const StyledDangerButton = styled.button`
  background-color: #dc3545;
  color: #fff;
  border: none;
  border-radius: 5px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s;
  padding: 0.8rem 2rem;

  &:hover {
    background-color: #bd2130;
  }
`;

export const StyledLink = styled(Link)`
  color: ${({ theme }) => theme.colors.darkPurple};
  text-decoration: none;
  transition: color 0.3s;
  text-transform: capitalize;
  &:hover {
    color: ${({ theme }) => theme.colors.redPurple};
  }
`;

export const StyledScrollableContainer = styled.div`
  overflow: scroll;
`;
