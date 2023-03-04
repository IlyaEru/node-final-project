import { NavLink } from 'react-router-dom';
import { navBarLinks } from './NavBar.constanst';
import { StyledHamburgerWrapper, StyledNavBarContainer } from './NavBar.style';
import { useEffect, useRef, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import {
  clearAuth,
  selectActions,
  selectUser,
} from '../../redux/features/auth/authSlice';
import { useLogoutMutation } from '../../redux/api/authApiSlice';
import LoadingSpinner from '../LoadingSpinner';
import Hamburger from 'hamburger-react';
import { IconButton, Tooltip } from '@mui/material';
import { FaQuestionCircle } from 'react-icons/fa';

export default function NavBar() {
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  const [logout, { isLoading }] = useLogoutMutation();

  const fullName = useAppSelector(selectUser);
  const actions = useAppSelector(selectActions);
  const dispatch = useAppDispatch();

  const navbarRef = useRef<HTMLUListElement>(null);

  useOnClickOutside(navbarRef, () => setIsMobileNavOpen(false));

  const handleLogout = async () => {
    const refreshToken = localStorage.getItem('refreshToken');
    if (refreshToken) {
      await logout({ refreshToken });
      dispatch(clearAuth());
    } else {
      dispatch(clearAuth());
    }
  };

  const getUserSection = () => {
    return (
      <>
        <span className="user-name">{fullName}</span>
        <span className="user-actions">
          Actions left: {actions.actionsLeft}
          <Tooltip title="You have a limited number of actions that you can perform each day. When you reach the maximum number of actions allowed, you will not be able to perform any more actions for the day, and you will be logged out until the following day. ">
            <IconButton>
              <FaQuestionCircle color="#61dafb" />
            </IconButton>
          </Tooltip>
        </span>
        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </>
    );
  };

  return (
    <StyledNavBarContainer>
      <nav>
        <NavLink className="home-link" to="/">
          Home
        </NavLink>
        <ul ref={navbarRef} className={isMobileNavOpen ? 'open' : ''}>
          {navBarLinks.map((link, index) => (
            <li key={index} onClick={() => setIsMobileNavOpen(false)}>
              <NavLink to={link.path} end>
                {link.label}
              </NavLink>
            </li>
          ))}
        </ul>
        {fullName && getUserSection()}

        <StyledHamburgerWrapper className="hamburger">
          <Hamburger
            color="#61dafb"
            toggled={isMobileNavOpen}
            toggle={setIsMobileNavOpen}
          />
        </StyledHamburgerWrapper>
      </nav>
      {isLoading && <LoadingSpinner />}
    </StyledNavBarContainer>
  );
}

function useOnClickOutside(ref: any, handler: any) {
  useEffect(
    () => {
      const listener = (event: any) => {
        // Do nothing if clicking ref's element or descendent elements
        // Or if the hamburger menu is clicked
        if (
          !ref.current ||
          ref.current.contains(event.target) ||
          event.target.className === 'hamburger' ||
          event.target.className === 'hamburger-react'
        ) {
          return;
        }

        handler(event);
      };

      document.addEventListener('mousedown', listener);
      document.addEventListener('touchstart', listener);

      return () => {
        document.removeEventListener('mousedown', listener);
        document.removeEventListener('touchstart', listener);
      };
    },
    // Add ref and handler to effect dependencies
    // It's worth noting that because passed in handler is a new ...
    // ... function on every render that will cause this effect ...
    // ... callback/cleanup to run every render. It's not a big deal ...
    // ... but to optimize you can wrap handler in useCallback before ...
    // ... passing it into this hook.
    [ref, handler],
  );
}
