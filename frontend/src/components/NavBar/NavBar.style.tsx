import Hamburger from 'hamburger-react';
import styled from 'styled-components';

export const StyledNavBarContainer = styled.header`
  position: relative;
  nav {
    background-color: #282c34;
    display: flex;
    justify-content: space-between;
    padding: 10px;
  }

  ul {
    align-items: center;
    display: flex;
    list-style-type: none;
    margin: 0;
    padding: 0;
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
      background-color: #33373f;
      border-radius: 4px;
    }
  }

  li {
    margin: 0 10px;
  }

  a {
    color: #fff;
    text-decoration: none;
    padding: 10px;
    border-radius: 4px;
    transition: all 0.2s ease-in-out;
    display: flex;
    align-items: center;
  }

  a:hover {
    background-color: #61dafb;
    color: #282c34;
  }

  .active {
    background-color: #61dafb;
    color: #282c34;
  }
  .user-name {
    display: flex;
    align-items: center;
    color: #fff;
    margin-right: 10px;
  }
  .user-actions {
    display: flex;
    align-items: center;
    color: #fff;
  }
  .logout-btn {
    border: 1px solid #61dafb;
    background-color: transparent;
    border-radius: 4px;
    color: #61dafb;
    cursor: pointer;
    font-size: 1rem;
    padding: 10px;
    transition: all 0.2s ease-in-out;
    &:hover {
      background-color: #fff;
      color: #282c34;
    }
  }
`;

export const StyledHamburgerWrapper = styled.div`
  @media (min-width: calc(${({ theme }) => theme.breakpoints.medium} + 1px)) {
    display: none;
  }
`;
