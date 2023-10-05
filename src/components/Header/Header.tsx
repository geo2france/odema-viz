import "./header.css";

import { useContext } from "react";
import { Navbar, Container, Nav } from "react-bootstrap";
import DarkModeToggle from "./DarkmodeToggle/DarkmodeToggle";
import { DarkModeContext } from "../../context/DarkModeProvider";

import "bootstrap/dist/css/bootstrap.min.css";
import Icone from '../../images/logoOdema.png'; // Assurez-vous que le chemin est correct

type Props = {
  indicatorName?: string;
};

export const Header = ({ indicatorName }: Props) => {
  const { darkMode } = useContext(DarkModeContext);

  return (
    <Navbar expand="lg" className={darkMode ? "bg-secondary" : "bg-primary"}>
      <Container>
        <img src={Icone} height="55" />
        <Navbar.Brand className="ms-5 text-light">{indicatorName}</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            <DarkModeToggle />
            <Nav.Link className="ms-5 text-light" href="/">
              Accueil
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};
