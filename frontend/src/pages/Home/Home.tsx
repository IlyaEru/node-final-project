import { FaGithub } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { navBarLinks } from '../../components/NavBar/NavBar.constanst';
import {
  StyledHomeContainer,
  StyledHomeContent,
  StyledHomeDescription,
  StyledHomeFooter,
  StyledHomeFooterLink,
  StyledHomeHeader,
  StyledHomeTitle,
  StyledLinkList,
  StyledLinkListItem,
} from './Home.style';

export default function Home() {
  return (
    <StyledHomeContainer>
      <StyledHomeHeader>
        <StyledHomeTitle>
          Welcome to the Factory Management System
        </StyledHomeTitle>
        <StyledHomeDescription>
          This web site allows you to manage employees, departments, shifts and
          users at your factory. With our easy-to-use interface, you can view
          and edit employee and department data, schedule shifts, and monitor
          user activity
        </StyledHomeDescription>
      </StyledHomeHeader>
      <StyledHomeContent>
        <StyledLinkList>
          {navBarLinks.map(
            (
              link: {
                label: string;
                path: string;
              },
              index: any,
            ) => (
              <StyledLinkListItem key={index}>
                <Link to={link.path}>{link.label}</Link>
              </StyledLinkListItem>
            ),
          )}
        </StyledLinkList>
      </StyledHomeContent>
      <StyledHomeFooter>
        <StyledHomeFooterLink href="https://github.com/IlyaEru/node-final-project">
          <FaGithub />
        </StyledHomeFooterLink>
      </StyledHomeFooter>
    </StyledHomeContainer>
  );
}
