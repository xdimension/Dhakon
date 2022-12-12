import { useState, useEffect, useContext, useCallback } from "react"
import { BrowserRouter as Router } from "react-router-dom"
import { Navbar, Nav, NavDropdown, Container } from "react-bootstrap"
import logo from '../assets/img/logo.svg'
import navIcon1 from '../assets/img/nav-icon1.svg'
import navIcon2 from '../assets/img/nav-icon2.svg'
import navIcon3 from '../assets/img/nav-icon3.svg'
import { ConnectWallet } from "./ConnectWallet"
import { Web3Context } from "./Web3Provider"
import { GameContext } from "./GameProvider"

export const NavBar = () => {

  const [activeLink, setActiveLink] = useState('home');
  const [scrolled, setScrolled] = useState(false);

  const { isOwner } = useContext(Web3Context)
  const { pickWinner } = useContext(GameContext)
  
  useEffect(() => {
    const onScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    }

    window.addEventListener("scroll", onScroll);

    return () => window.removeEventListener("scroll", onScroll);
  }, [])

  const onUpdateActiveLink = useCallback((value) => {
    setActiveLink(value);
  }, [])

  return (
    <Router>
      <Navbar expand="md" className={scrolled ? "scrolled" : ""}>
        <Container>
          <Navbar.Brand href="/">
            <img src={logo} alt="Logo" />
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav">
            <span className="navbar-toggler-icon"></span>
          </Navbar.Toggle>
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto">
              <Nav.Link href="#home" className={activeLink === 'home' ? 'active navbar-link' : 'navbar-link'} onClick={() => onUpdateActiveLink('home')}>Home</Nav.Link>
              <Nav.Link href="#stats" className={activeLink === 'stats' ? 'active navbar-link' : 'navbar-link'} onClick={() => onUpdateActiveLink('stats')}>Stats</Nav.Link>
              <Nav.Link href="#contact" className={activeLink === 'contact' ? 'active navbar-link' : 'navbar-link'} onClick={() => onUpdateActiveLink('contact')}>Contact</Nav.Link>
              {isOwner && 
                  <NavDropdown title="Admin" id="basic-nav-dropdown">
                    <NavDropdown.Item onClick={pickWinner}>Pick Winner</NavDropdown.Item>  
                  </NavDropdown>}
            </Nav>
            <span className="navbar-text">
              <div className="social-icon">
                <a href="#"><img src={navIcon1} alt="" /></a>
                <a href="#"><img src={navIcon2} alt="" /></a>
                <a href="#"><img src={navIcon3} alt="" /></a>
              </div>

              <ConnectWallet />
            </span>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </Router>
  )
}
