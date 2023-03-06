import { navBarLinks, navBarNewLinks } from './NavBar.constanst';
import {
  StyledFaQuestionCircle,
  StyledHamburgerWrapper,
  StyledLogoutButton,
  StyledMobileNewLinksContainer,
  StyledNav,
  StyledNavBarContainer,
  StyledNavLink,
  StyledNavLinkList,
  StyledNewLinkDropdown,
  StyledNewLinksButton,
  StyledUserNameAndActions,
  StyledUserSection,
} from './NavBar.style';
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
import { FaAngleDown, FaQuestionCircle } from 'react-icons/fa';

export default function NavBar({ isHome = false }) {
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
      <StyledUserSection className={isHome ? 'home-page' : ''}>
        <StyledUserNameAndActions>
          <span className="user-name">{fullName}</span>
          <span className="user-actions">
            Actions left:{' '}
            <span className="user-action-value">{actions.actionsLeft}</span>
            <Tooltip title="You have a limited number of actions that you can perform each day. When you reach the maximum number of actions allowed, you will not be able to perform any more actions for the day, and you will be logged out until the following day. ">
              <IconButton>
                <StyledFaQuestionCircle />
              </IconButton>
            </Tooltip>
          </span>
        </StyledUserNameAndActions>
        <StyledLogoutButton
          className={isHome ? 'home-page' : ''}
          onClick={handleLogout}
        >
          Log out
        </StyledLogoutButton>
      </StyledUserSection>
    );
  };

  return (
    <StyledNavBarContainer>
      <StyledNav>
        <StyledNavLink
          onClick={() => setIsMobileNavOpen(false)}
          className={isHome ? 'home home-page' : 'home'}
          to="/"
        >
          <div>Home</div>
        </StyledNavLink>
        <StyledNavLinkList
          ref={navbarRef}
          className={isMobileNavOpen ? 'open' : ''}
        >
          {navBarLinks.map((link, index) => (
            <li key={index} onClick={() => setIsMobileNavOpen(false)}>
              <StyledNavLink
                onClick={() => setIsMobileNavOpen(false)}
                className={isHome ? 'home-page' : ''}
                to={link.path}
                end
              >
                {link.label}
              </StyledNavLink>
            </li>
          ))}
          <StyledMobileNewLinksContainer>
            {navBarNewLinks.map((link, index) => (
              <StyledNavLink
                onClick={() => setIsMobileNavOpen(false)}
                key={index}
                to={link.path}
                end
              >
                {link.label}
              </StyledNavLink>
            ))}
          </StyledMobileNewLinksContainer>
          <StyledNewLinksButton className={isHome ? 'home-page' : ''}>
            new <FaAngleDown />
            <StyledNewLinkDropdown className="links-dropdown">
              {navBarNewLinks.map((link, index) => (
                <StyledNavLink key={index} to={link.path} end>
                  {link.label}
                </StyledNavLink>
              ))}
            </StyledNewLinkDropdown>
          </StyledNewLinksButton>
        </StyledNavLinkList>
        {fullName && getUserSection()}

        <StyledHamburgerWrapper className="hamburger">
          <Hamburger
            color={isHome ? '#e8e7cd' : '#282C34'}
            size={30}
            toggled={isMobileNavOpen}
            toggle={setIsMobileNavOpen}
          />
        </StyledHamburgerWrapper>
      </StyledNav>
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
