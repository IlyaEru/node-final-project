import { FaGithub } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import NavBar from '../../components/NavBar';
import {
  navBarLinks,
  navBarNewLinks,
} from '../../components/NavBar/NavBar.constanst';
import {
  StyledHeaderContent,
  StyledHeaderFactoryImageContainer,
  StyledHeaderFactoryTextContainer,
  StyledHeaderPicture,
  StyledHomeContainer,
  StyledHomeContent,
  StyledHomeDescription,
  StyledHomeFooter,
  StyledHomeFooterLink,
  StyledHomeHeader,
  StyledHomeTitle,
  StyledLink,
  StyledLinkList,
  StyledLinkListItem,
  StyledLinkListItemIconWrapper,
  StyledLinkListItemPlusIcon,
  StyledLinkListItemTitle,
} from './Home.style';

import factoryPng from '../../assets/images/factory.png';
import factoryWebp from '../../assets/images/factory.webp';

export default function Home() {
  return (
    <StyledHomeContainer>
      <StyledHomeHeader>
        <NavBar isHome={true} />
        <StyledHeaderContent>
          <StyledHeaderFactoryTextContainer>
            <StyledHomeTitle>
              Welcome to the Factory Management System
            </StyledHomeTitle>
            <StyledHomeDescription>
              Manage employees, departments, shifts and users at your factory
              with ease. View and edit employee and department data, schedule
              shifts, and monitor user activity through our user-friendly
              interface.
            </StyledHomeDescription>
          </StyledHeaderFactoryTextContainer>
          <StyledHeaderFactoryImageContainer>
            <StyledHeaderPicture>
              <source srcSet={factoryWebp} type="image/webp" />
              <img src={factoryPng} />
            </StyledHeaderPicture>
          </StyledHeaderFactoryImageContainer>
        </StyledHeaderContent>
      </StyledHomeHeader>
      <StyledHomeContent>
        <StyledLinkList>
          {navBarLinks.map(
            (
              link: {
                label: string;
                path: string;
                icon: JSX.Element;
              },
              index: any,
            ) => (
              <StyledLinkListItem key={index}>
                <StyledLink to={link.path}>
                  <StyledLinkListItemIconWrapper>
                    {link.icon}
                  </StyledLinkListItemIconWrapper>
                  <StyledLinkListItemTitle>
                    {link.label}
                  </StyledLinkListItemTitle>
                </StyledLink>
              </StyledLinkListItem>
            ),
          )}
          {navBarNewLinks.map(
            (
              link: {
                label: string;
                path: string;
                icon: JSX.Element;
              },
              index: any,
            ) => (
              <StyledLinkListItem key={index}>
                <StyledLink to={link.path}>
                  <StyledLinkListItemIconWrapper>
                    <StyledLinkListItemPlusIcon />
                    {link.icon}
                  </StyledLinkListItemIconWrapper>
                  <StyledLinkListItemTitle>
                    {link.label}
                  </StyledLinkListItemTitle>
                </StyledLink>
              </StyledLinkListItem>
            ),
          )}
        </StyledLinkList>
      </StyledHomeContent>
      <StyledHomeFooter>
        <StyledHomeFooterLink
          target={'_blank'}
          href="https://github.com/IlyaEru/node-final-project"
        >
          <FaGithub />
        </StyledHomeFooterLink>
      </StyledHomeFooter>
    </StyledHomeContainer>
  );
}
