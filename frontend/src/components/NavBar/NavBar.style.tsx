import Hamburger from 'hamburger-react';
import { FaQuestionCircle } from 'react-icons/fa';
import { NavLink } from 'react-router-dom';
import styled from 'styled-components';

export const StyledNavBarContainer = styled.header`
  position: relative;
  display: flex;
  justify-content: center;
`;

export const StyledNav = styled.nav`
  width: 100%;
  max-width: ${({ theme }) => theme.navBarMaxWidth};
  display: flex;
  justify-content: space-between;
  padding: 1rem 2rem;

  @media (max-width: ${({ theme }) => theme.breakpoints.xSmall}) {
    padding: 1rem;
  }
`;

export const StyledNavLinkList = styled.ul`
  align-items: center;
  gap: 1rem;
  display: flex;
  margin: 0 1rem;
  z-index: 2;
  @media (max-width: ${({ theme }) => theme.breakpoints.medium}) {
    display: none;
    &.open {
      position: absolute;
      display: flex;
      left: 50%;
      transform: translateX(-50%);
      top: 1rem;
      right: 1rem;
      gap: 1rem;
      padding: 1rem;
    }
    flex-direction: column;
    border-radius: 4px;
    background-color: ${({ theme }) => theme.colors.balticSea};
    box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.2);
    a {
      color: ${({ theme }) => theme.colors.whiteRock};
    }
  }
`;

export const StyledUserSection = styled.section`
  display: flex;
  align-items: center;
  gap: 1rem;
  color: ${({ theme }) => theme.colors.balticSea};
  font-family: 700;
  &.home-page {
    color: ${({ theme }) => theme.colors.whiteRock};
    svg {
      color: ${({ theme }) => theme.colors.whiteRock};
    }
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.medium}) {
    margin-left: auto;
    margin-right: 1rem;
  }
`;

export const StyledUserNameAndActions = styled.div`
  display: flex;
  flex-direction: column;
  padding-top: 1rem;
  * {
    font-family: 'Lato', sans-serif;
  }
  .user-name,
  .user-action-value {
    font-weight: 700;
  }
  @media (max-width: ${({ theme }) => theme.breakpoints.xSmall}) {
    font-size: 0.8rem;
  }
`;

export const StyledFaQuestionCircle = styled(FaQuestionCircle)`
  font-size: 1.2rem;
  margin-top: -3px;
`;

export const StyledNavLink = styled(NavLink)`
  font-size: 1rem;
  color: ${({ theme }) => theme.colors.balticSea};
  display: flex;
  align-items: center;
  font-family: 'Lato', sans-serif;
  font-weight: 900;
  text-decoration: none;
  text-transform: capitalize;
  opacity: 0.75;
  transition: all 0.2s ease-in-out;
  cursor: pointer;
  &.home {
    font-size: 1.5rem;
    margin-top: -4px;
  }
  &.home-page {
    color: ${({ theme }) => theme.colors.whiteRock};
  }
  &:hover,
  &.active {
    opacity: 1;
  }
  @media (max-width: ${({ theme }) => theme.breakpoints.xSmall}) {
    font-size: 0.8rem;
    &.home {
      font-size: 1.2rem;
    }
  }
`;

export const StyledMobileNewLinksContainer = styled.div`
  display: none;
  @media (max-width: ${({ theme }) => theme.breakpoints.medium}) {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
`;

export const StyledNewLinksButton = styled(StyledNavLink).attrs({
  as: 'button',
  to: '/',
})`
  position: relative;
  background: transparent;
  border: none;
  display: flex;
  justify-content: center;
  &:hover,
  &:focus,
  &:active {
    .links-dropdown {
      display: flex;
    }
  }
  @media (max-width: ${({ theme }) => theme.breakpoints.medium}) {
    display: none;
  }
`;

export const StyledNewLinkDropdown = styled.div`
  display: none;
  flex-direction: column;
  gap: 1rem;
  background-color: ${({ theme }) => theme.colors.balticSea};
  position: absolute;
  top: 100%;
  padding: 1rem 1.5rem;
  border-radius: 5px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
  z-index: 1;
  width: fit-content;
  cursor: default;
  &.home-page {
    color: ${({ theme }) => theme.colors.whiteRock};
  }
  a {
    color: ${({ theme }) => theme.colors.whiteRock};
    font-size: 1rem;
  }
`;

export const StyledLogoutButton = styled.button`
  border: 1px solid ${({ theme }) => theme.colors.balticSea};
  font-weight: 500;
  background-color: transparent;
  border-radius: 4px;
  color: ${({ theme }) => theme.colors.balticSea};
  cursor: pointer;
  font-size: 1rem;
  padding: 0.3rem 0.6rem;
  white-space: nowrap;
  transition: all 0.2s ease-in-out;
  box-shadow: rgba(213, 217, 217, 0.5) 0 2px 5px 0;
  &.home-page {
    color: ${({ theme }) => theme.colors.whiteRock};
    border-color: ${({ theme }) => theme.colors.whiteRock};
    box-shadow: none;
  }
  &:hover {
    box-shadow: rgba(213, 217, 217, 0.308) 0 20px 50px 0 inset;
  }
  @media (max-width: ${({ theme }) => theme.breakpoints.xSmall}) {
    font-size: 0.8rem;
  }
`;

export const StyledHamburgerWrapper = styled.div`
  display: flex;
  align-items: center;

  @media (min-width: calc(${({ theme }) => theme.breakpoints.medium} + 1px)) {
    display: none;
  }
`;
