import React, { useState } from 'react';

import 'bootstrap/dist/css/bootstrap.min.css';
import { Navbar, Nav, Container, Row, Col, Button, NavDropdown,Card } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';

const Vendedores: React.FC = () => {
  const navigate = useNavigate();
  const [isComprarOpen, setIsComprarOpen] = useState(false);
  const [isAlquilarOpen, setIsAlquilarOpen] = useState(false);
  const [isServiciosOpen, setIsServiciosOpen] = useState(false);

  return (
    <div className="full-width-container">
      {/* Barra de Navegación */}
      <Navbar bg="white" expand="lg" className="w-100 border-bottom">
        <Container fluid className="px-4">
          <Navbar.Brand as={Link} to="/">
            <img
              src="imagen"
              alt="InmoMarket"
              height="30"
              className="d-inline-block align-top"
            />
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="navbar-nav" />
          <Navbar.Collapse id="navbar-nav">
            <Nav className="me-auto">
              {/* Menú Comprar */}
              <NavDropdown
                title={
                  <span className="nav-link-text">Comprar <i className="fas fa-chevron-down fa-xs"></i></span>
                }
                id="comprar-dropdown"
                className="mega-dropdown"
                show={isComprarOpen}
                onMouseEnter={() => setIsComprarOpen(true)}
                onMouseLeave={() => setIsComprarOpen(false)}
              >
                <div className="mega-menu-wrapper">
                  <Container fluid className="mega-menu-container py-4 px-4">
                    <Row>
                      <Col>
                        <h6 className="fw-bold mb-3">Estado</h6>
                        <ul className="list-unstyled">
                          <li>Lima</li>
                          <li>Piura</li>
                          <li>Callao</li>
                          <li>Ica</li>
                          <li>Lambayeque</li>
                          <li>La Libertad</li>
                          <li>Arequipa</li>
                          <li>Cusco</li>
                          <li>Tumbes</li>
                          <li>Junín</li>
                          <li>Ancash</li>
                        </ul>
                      </Col>
                      <Col>
                        <h6 className="fw-bold mb-3">Tipo de propiedad</h6>
                        <ul className="list-unstyled">
                          <li>Departamento</li>
                          <li>Casa</li>
                          <li>Terreno / Lote</li>
                          <li>Oficina</li>
                          <li>Local Comercial</li>
                        </ul>
                      </Col>
                      <Col>
                        <h6 className="fw-bold mb-3">Dormitorios</h6>
                        <ul className="list-unstyled">
                          <li>3 dormitorios</li>
                          <li>2 dormitorios</li>
                          <li>4 dormitorios</li>
                          <li>5 o más dormitorios</li>
                          <li>1 dormitorio</li>
                        </ul>
                      </Col>
                    </Row>
                  </Container>
                </div>
              </NavDropdown>

              {/* Menú Alquilar */}
              <NavDropdown
                title={
                  <span className="nav-link-text">Vender <i className="fas fa-chevron-down fa-xs"></i></span>
                }
                id="alquilar-dropdown"
                className="mega-dropdown"
                show={isAlquilarOpen}
                onMouseEnter={() => setIsAlquilarOpen(true)}
                onMouseLeave={() => setIsAlquilarOpen(false)}
              >
                <div className="mega-menu-wrapper">
                  <Container fluid className="mega-menu-container py-4 px-4">
                    <Row>
                      <Col>
                        <h6 className="fw-bold mb-3">Estado</h6>
                        <ul className="list-unstyled">
                          <li>Lima</li>
                          <li>Piura</li>
                          <li>Arequipa</li>
                          <li>Cusco</li>
                        </ul>
                      </Col>
                      <Col>
                        <h6 className="fw-bold mb-3">Tipo de propiedad</h6>
                        <ul className="list-unstyled">
                          <li>Departamento</li>
                          <li>Casa</li>
                          <li>Oficina</li>
                          <li>Local Comercial</li>
                        </ul>
                      </Col>
                      <Col>
                        <h6 className="fw-bold mb-3">Dormitorios</h6>
                        <ul className="list-unstyled">
                          <li>3 dormitorios</li>
                          <li>2 dormitorios</li>
                          <li>1 dormitorio</li>
                        </ul>
                      </Col>
                    </Row>
                  </Container>
                </div>
              </NavDropdown>

              {/* Menú Servicios */}
              <NavDropdown
                title={
                  <span className="nav-link-text">InmoMarket te ayuda <i className="fas fa-chevron-down fa-xs"></i></span>
                }
                id="servicios-dropdown"
                className="mega-dropdown"
                show={isServiciosOpen}
                onMouseEnter={() => setIsServiciosOpen(true)}
                onMouseLeave={() => setIsServiciosOpen(false)}
              >
                <div className="mega-menu-wrapper">
                  <Container fluid className="mega-menu-container py-4 px-4">
                    <Row>
                      <Col>
                <h6 className="fw-bold mb-3">Para Vendedores</h6>
                <ul className="list-unstyled">
                  <li>
                    <Link to="/vendedores" className="text-decoration-none text-dark">
                      Guía para Vender
                    </Link>
                  </li>
                </ul>
              </Col>
                      <Col>
                        <h6 className="fw-bold mb-3">Para compradores</h6>
                        <ul className="list-unstyled">
                          <li>Guía de compra</li>
                        </ul>
                      </Col>
                      <Col>
                        <h6 className="fw-bold mb-3">Nuestra Mision y Vision</h6>
                        <ul className="list-unstyled">
                          <li>Conocenos</li>
                        </ul>
                      </Col>
                    </Row>
                  </Container>
                </div>
              </NavDropdown>
            </Nav>

            <Nav className="ms-auto">
              {/* Notificaciones */}
              <Nav.Link href="#" className="me-2">
                <span className="nav-link-text">Notificaciones <i className="far fa-bell"></i></span>
              </Nav.Link>
              {/* Ingresar */}
              <Nav.Link href="#">
                <Button
                  variant="success"
                  className="btn-ingresar"
                  onClick={() => navigate('/login')}
                >
                  Ingresar
                </Button>
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      
{/* Inicio body */}
    
    <div className="guia-vendedores-container">
      <div className="hero-section">
        <Container>
          <h1 className="text-center text-black">Guía para Vendedores</h1>
          <p className="text-center text-black">
            Aprende cómo vender tu propiedad de manera rápida y efectiva con nuestra guía.
          </p>
        </Container>
      </div>

      <Container className="content-section">
        <Row className="mb-4">
          <Col md={6} lg={4}>
            <Card className="info-card">
              <Card.Body>
                <Card.Title className="fw-bold">Paso 1: Prepara tu propiedad</Card.Title>
                <Card.Text>
                  Asegúrate de que tu propiedad esté en las mejores condiciones para atraer compradores.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col md={6} lg={4}>
            <Card className="info-card">
              <Card.Body>
                <Card.Title className="fw-bold">Paso 2: Publica tu anuncio</Card.Title>
                <Card.Text>
                  Usa nuestra plataforma para publicar tu propiedad con fotos y descripciones atractivas.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col md={6} lg={4}>
            <Card className="info-card">
              <Card.Body>
                <Card.Title className="fw-bold">Paso 3: Negocia y vende</Card.Title>
                <Card.Text>
                  Aprende a negociar con los compradores y cierra el trato de manera segura.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <div className="text-center">
          <Button variant="success" className="btn-start">Comenzar ahora</Button>
        </div>
      </Container>
    </div>
      {/* Fin body */}

      {/* Enhanced Footer */}
<footer className="footer-section">
  {/* Footer Top Section */}
  <div className="footer-top">
    <Container>
      <Row className="footer-row">
        <Col lg={4} md={6} className="mb-4 mb-md-0">
          <div className="footer-brand">
            <h2 className="text-white mb-3">InmoMarket</h2>
            <p className="footer-desc">
              La plataforma inmobiliaria que conecta a compradores y 
              vendedores para hacer realidad sus sueños inmobiliarios.
            </p>
            <div className="footer-social">
              <a href="#" className="social-icon"><i className="fab fa-facebook-f"></i></a>
              <a href="#" className="social-icon"><i className="fab fa-instagram"></i></a>
              <a href="#" className="social-icon"><i className="fab fa-twitter"></i></a>
              <a href="#" className="social-icon"><i className="fab fa-linkedin-in"></i></a>
              <a href="#" className="social-icon"><i className="fab fa-youtube"></i></a>
            </div>
          </div>
        </Col>
        
        <Col lg={2} md={6} className="mb-4 mb-lg-0">
          <h5 className="footer-heading">Comprar</h5>
          <ul className="footer-links">
            <li><a href="#">Departamentos</a></li>
            <li><a href="#">Casas</a></li>
            <li><a href="#">Terrenos</a></li>
          </ul>
        </Col>
        
        <Col lg={2} md={6} className="mb-4 mb-lg-0">
          <h5 className="footer-heading">Vender</h5>
          <ul className="footer-links">
            <li><a href="#">Publicar Propiedad</a></li>
            <li><a href="#">Consejos de Venta</a></li>
            <li><a href="#">Valoración de Inmuebles</a></li>
            <li><a href="#">Publicaciones Destacadas</a></li>
          </ul>
        </Col>
        
        <Col lg={4} md={6}>
          <h5 className="footer-heading">Suscríbete</h5>
          <p className="footer-newsletter-text">
            Recibe las mejores ofertas inmobiliarias en tu correo
          </p>
          <div className="footer-newsletter">
            <input type="email" placeholder="Tu correo electrónico" className="footer-input" />
            <button className="footer-subscribe-btn">Suscribirse</button>
          </div>
          <div className="footer-contact mt-4">
            <div className="d-flex align-items-center mb-2">
              <i className="fas fa-phone-alt me-2"></i>
              <span>(01) 555-1234</span>
            </div>
            <div className="d-flex align-items-center">
              <i className="fas fa-envelope me-2"></i>
              <span>contacto@inmomarket.com</span>
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  </div>
  
  {/* Footer Bottom Section */}
  <div className="footer-bottom">
    <Container>
      <Row className="align-items-center">
        <Col md={6} className="text-center text-md-start">
          <p className="mb-md-0">
            &copy; {new Date().getFullYear()} InmoMarket. Todos los derechos reservados.
          </p>
        </Col>
        <Col md={6} className="text-center text-md-end footer-links-bottom">
          <a href="#">Política de Privacidad</a>
          <a href="#">Términos y Condiciones</a>
          <a href="#">Mapa del Sitio</a>
        </Col>
      </Row>
    </Container>
  </div>
</footer>
    </div>
  );
};

export default Vendedores;