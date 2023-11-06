import "./header.css";

import { useContext } from "react";
import { Navbar, Container, Nav } from "react-bootstrap";
import { LinkContainer } from 'react-router-bootstrap';
import DarkModeToggle from "./DarkmodeToggle/DarkmodeToggle";
import { DarkModeContext } from "../../context/DarkModeProvider";

import "bootstrap/dist/css/bootstrap.min.css";
import Icone from '../../images/logoOdema.png';

type Props = {
  indicatorName?: string;
};

export const Header = ({ indicatorName }: Props) => {
  const { darkMode } = useContext(DarkModeContext);

  return (
    <Navbar expand="lg" className={darkMode ? "bg-secondary" : "bg-odema"}>
      <Container>
        <LinkContainer to={`/`}>
          <Nav.Link className="headerTitle">
            <img src={Icone} height="55" />
          </Nav.Link>
        </LinkContainer>
        <Navbar.Brand className="headerTitle text-light" style={{ whiteSpace: 'normal' }}>{indicatorName}</Navbar.Brand>
          <Nav className="ms-auto">
            <DarkModeToggle />
          </Nav>
      </Container>
    </Navbar>
  );
};
