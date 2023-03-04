import styled from 'styled-components';

export const StyledHomeContainer = styled.main`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const StyledHomeHeader = styled.header``;

export const StyledHomeTitle = styled.h1``;

export const StyledHomeDescription = styled.p``;

export const StyledHomeContent = styled.section``;

export const StyledLinkList = styled.ul``;

export const StyledLinkListItem = styled.li``;

export const StyledHomeFooter = styled.footer`
  width: 100%;
  background-color: ${({ theme }) => theme.colors.lightGrey2};
  margin-top: auto;
  padding: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
`;

export const StyledHomeFooterLink = styled.a`
  color: ${({ theme }) => theme.colors.primaryBlue};
  text-decoration: none;
  font-weight: bold;
  &:hover {
    text-decoration: underline;
  }
`;
