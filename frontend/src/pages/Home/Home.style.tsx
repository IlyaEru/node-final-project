import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { FaPlus } from 'react-icons/fa';

export const StyledHomeContainer = styled.main`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const StyledHomeHeader = styled.header`
  width: 100%;
  display: flex;
  flex-direction: column;

  background: rgb(113, 56, 44);
  background: linear-gradient(
    17deg,
    rgba(113, 56, 44, 1) 0%,
    rgba(42, 25, 28, 1) 54%,
    rgba(20, 18, 24, 1) 100%
  );
`;

export const StyledHeaderContent = styled.section`
  align-self: center;
  padding: 2rem 2rem 0 2rem;
  max-width: ${({ theme }) => theme.largeMaxWidth};
  display: grid;
  grid-template-columns: 2fr 3fr;
  grid-auto-flow: column;
  @media (max-width: ${({ theme }) => theme.breakpoints.medium}) {
    padding: 2rem 0 0 2rem;
    margin-bottom: 1rem;
  }
  @media (max-width: ${({ theme }) => theme.breakpoints.small}) {
    padding: 0 0 0 2rem;
  }
  @media (max-width: ${({ theme }) => theme.breakpoints.xSmall}) {
    grid-template-columns: 1fr;
    padding: 2rem;
  }
`;

export const StyledHomeTitle = styled.h1`
  position: absolute;
  top: 0;
  left: 0;
  width: 150%;
  font-family: 'Poppins', sans-serif;
  font-size: 2rem;
  letter-spacing: 0.1rem;
  @media (max-width: ${({ theme }) => theme.breakpoints.medium}) {
    font-size: 1.5rem;
  }
  @media (max-width: ${({ theme }) => theme.breakpoints.medium}) {
    font-size: 1.3rem;
  }
  @media (max-width: ${({ theme }) => theme.breakpoints.xSmall}) {
    width: auto;
    position: relative;
    font-size: 2rem;
    padding: 0 1rem;
  }
`;

export const StyledHomeDescription = styled.p`
  margin-top: 2rem;
  letter-spacing: 0.1rem;
  line-height: 1.5rem;
  font-size: 0.8rem;
  @media (max-width: ${({ theme }) => theme.breakpoints.medium}) {
    margin-top: 3rem;
    font-size: 0.7rem;
  }
  @media (max-width: ${({ theme }) => theme.breakpoints.small}) {
    margin-top: 4rem;
    font-size: 0.6rem;
  }
  @media (max-width: ${({ theme }) => theme.breakpoints.xSmall}) {
    margin-top: 2rem;
    font-size: 0.8rem;
    padding: 0 1rem;
  }
`;

export const StyledHeaderFactoryTextContainer = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  color: ${({ theme }) => theme.colors.whiteRock};
`;

export const StyledHeaderFactoryImageContainer = styled.div`
  margin-bottom: -4rem;
  @media (max-width: ${({ theme }) => theme.breakpoints.xSmall}) {
    display: none;
  }
`;

export const StyledHeaderPicture = styled.picture`
  img {
    width: 100%;
  }
`;

export const StyledHomeContent = styled.section`
  margin-top: 7rem;
  margin-bottom: 5rem;
  padding: 0 2rem;
  width: 100%;
  max-width: ${({ theme }) => theme.largeMaxWidth};
  @media (max-width: ${({ theme }) => theme.breakpoints.medium}) {
    margin-top: 5rem;
  }
`;

export const StyledLinkList = styled.ul`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(15rem, 1fr));
  grid-gap: 2rem;
  @media (max-width: ${({ theme }) => theme.breakpoints.medium}) {
    grid-template-columns: repeat(auto-fit, minmax(12rem, 1fr));
  }
  @media (max-width: ${({ theme }) => theme.breakpoints.small}) {
    grid-template-columns: repeat(auto-fit, minmax(10rem, 1fr));
  }
  @media (max-width: ${({ theme }) => theme.breakpoints.xSmall}) {
    grid-template-columns: repeat(auto-fit, minmax(8rem, 1fr));
  }
`;

export const StyledLinkListItem = styled.li`
  display: flex;
  align-items: center;
  flex-direction: column;
`;

export const StyledLink = styled(Link)`
  text-decoration: none;
  display: flex;
  align-items: center;
  flex-direction: column;
  &:hover {
    > div {
      box-shadow: ${({ theme }) => theme.darkShadow};
    }
  }
`;

export const StyledLinkListItemIconWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 5rem;
  height: 5rem;
  border-radius: 0.5rem;
  border: 2px solid ${({ theme }) => theme.colors.acadia};
  font-size: 2rem;
  color: ${({ theme }) => theme.colors.acadia};
  background-color: ${({ theme }) => theme.colors.lightAcadia};
`;

export const StyledLinkListItemPlusIcon = styled(FaPlus)`
  position: absolute;
  top: 0;
  left: 0;
`;

export const StyledLinkListItemTitle = styled.h3`
  margin-top: 1rem;
  font-size: 1.2rem;
  text-align: center;

  color: ${({ theme }) => theme.colors.acadia};
  text-decoration: none;
`;

export const StyledHomeFooter = styled.footer`
  width: 100%;
  background-color: rgb(113, 56, 44);
  margin-top: auto;
  padding: 0.6rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
`;

export const StyledHomeFooterLink = styled.a`
  color: ${({ theme }) => theme.colors.primaryBlue};
  text-decoration: none;
  font-weight: bold;
  color: ${({ theme }) => theme.colors.whiteRock};
  font-size: 1.4rem;
  &:hover {
    text-decoration: underline;
  }
`;
