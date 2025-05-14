import React from "react";
import { Navbar, Nav, Container, Offcanvas } from "react-bootstrap";
import "../css/Navsbar.css";

function ResponsiveNavbar() {
  return (
    <div className="AppNavbar">
      <Navbar bg="dark" expand="lg" className="mb-3">
        <Container fluid>
          <Navbar.Brand href="/">
            ALE <i className="fab fa-typo3" />
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="offcanvasNavbar" />
          <Navbar.Offcanvas
            id="offcanvasNavbar"
            aria-labelledby="offcanvasNavbarLabel"
            placement="start"
            className="offcanvas-dark"
          >
            <Offcanvas.Header closeButton>
              <Offcanvas.Title id="offcanvasNavbarLabel">Menu</Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body>
              <Nav className="justify-content-end flex-grow-1 pe-3">
                <Nav.Link href="/">Home</Nav.Link>
                <Nav.Link href="/LoginData">Login</Nav.Link>
                <Nav.Link href="/register">Register</Nav.Link>
                <Nav.Link href="/contact">Contact</Nav.Link>
              </Nav>
            </Offcanvas.Body>
          </Navbar.Offcanvas>
        </Container>
      </Navbar>
    </div>
  );
}

export default ResponsiveNavbar;
