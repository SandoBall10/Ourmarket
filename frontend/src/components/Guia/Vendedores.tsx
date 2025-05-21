import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Navbar, Nav, Container, Row, Col, Button, NavDropdown, Card } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';
// Importar bibliotecas para animaciones e iconos
import AOS from 'aos';
import 'aos/dist/aos.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './Vendedores.css'; // Asegúrate de crear este archivo CSS

const Vendedores: React.FC = () => {
  const navigate = useNavigate();

  // Mock user authentication state
  const [isLoggedIn] = useState(true); // Change to false if not logged in
  const [user] = useState({ name: 'A' }); // Replace with actual user data

  // Inicializar animaciones cuando el componente se monta
  useEffect(() => {
    AOS.init({
      duration: 800,
      once: false,
      easing: 'ease-in-out',
    });
  }, []);

  function handleLogout(): void {
    throw new Error('Function not implemented.');
  }

  return (
    <div className="full-width-container">
      {/* Barra de Navegación */}
      <Navbar bg="white" expand="lg" className="w-100 border-bottom">
        <Container fluid className="px-4">
          <Navbar.Brand href="#">
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
              <div className="nav-item mega-dropdown">
                <Nav.Link
                  className="nav-link-text"
                  id="comprar-dropdown"
                >
                  Comprar <i className="fas fa-chevron-down fa-xs"></i>
                </Nav.Link>
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
              </div>

              {/* Menú Alquilar */}
              <div className="nav-item mega-dropdown">
                <Nav.Link
                  className="nav-link-text"
                  id="vender-dropdown"
                >
                  Vender <i className="fas fa-chevron-down fa-xs"></i>
                </Nav.Link>
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
              </div>

              {/* Menú Servicios */}
              <div className="nav-item mega-dropdown">
                <Nav.Link
                  className="nav-link-text"
                  id="servicios-dropdown"
                >
                  InmoMarket te ayuda <i className="fas fa-chevron-down fa-xs"></i>
                </Nav.Link>
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
                          <li>
                            <Link to="/compradores" className="text-decoration-none text-dark">
                              Guía para Comprar
                            </Link>
                          </li>
                        </ul>
                      </Col>
                      <Col>
                        <h6 className="fw-bold mb-3">Nuestra Mision y Vision</h6>
                        <ul className="list-unstyled">
                          <li>
                            <Link to="/conocenos" className="text-decoration-none text-dark">
                              Conocenos
                            </Link>
                          </li>
                        </ul>
                      </Col>
                    </Row>
                  </Container>
                </div>
              </div>
            </Nav>

            <Nav className="ms-auto">
              {/* Notificaciones */}
              <Nav.Link href="#" className="me-2">
                <span className="nav-link-text">Notificaciones <i className="far fa-bell"></i></span>
              </Nav.Link>
              {/* Ingresar o Avatar de Usuario */}
              {isLoggedIn && user ? (
                <NavDropdown
                  title={
                    <div className="avatar-container">
                      <div className="user-avatar">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      <i className="fas fa-chevron-down avatar-arrow"></i>
                    </div>
                  }
                  id="user-dropdown"
                  align="end"
                  className="custom-dropdown"
                >
                  <NavDropdown.Item as={Link} to="/publicaciones" className="dropdown-item-custom">
                    <div className="icon-wrapper"><i className="far fa-file-alt"></i></div>
                    <span>Mis publicaciones</span>
                  </NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="/mis-favoritos" className="dropdown-item-custom">
                    <div className="icon-wrapper"><i className="far fa-heart"></i></div>
                    <span>Favoritos</span>
                  </NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="/chats" className="dropdown-item-custom">
                    <div className="icon-wrapper"><i className="far fa-comments"></i></div>
                    <span>Mis chats</span>
                  </NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="/historial" className="dropdown-item-custom">
                    <div className="icon-wrapper"><i className="far fa-eye"></i></div>
                    <span>Historial</span>
                  </NavDropdown.Item>
                  <NavDropdown.Divider />
                  <NavDropdown.Item as={Link} to="/perfil" className="dropdown-item-custom">
                    <div className="icon-wrapper"><i className="far fa-user"></i></div>
                    <span>Mi cuenta</span>
                  </NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="/ajustes-notificaciones" className="dropdown-item-custom">
                    <div className="icon-wrapper"><i className="fas fa-cog"></i></div>
                    <span>Ajustes de notificaciones</span>
                  </NavDropdown.Item>
                  <NavDropdown.Divider />
                  <NavDropdown.Item as={Link} to="/ayuda" className="dropdown-item-custom">
                    <div className="icon-wrapper"><i className="far fa-question-circle"></i></div>
                    <span>Ayuda</span>
                  </NavDropdown.Item>
                  <NavDropdown.Item onClick={handleLogout} className="dropdown-item-custom">
                    <div className="icon-wrapper"><i className="fas fa-sign-out-alt"></i></div>
                    <span>Cerrar sesión</span>
                  </NavDropdown.Item>
                </NavDropdown>
              ) : (
                <Nav.Link href="#">
                  <Button
                    variant="success"
                    className="btn-ingresar"
                    onClick={() => navigate('/login')}
                  >
                    Ingresar
                  </Button>
                </Nav.Link>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* Hero section mejorado con animaciones */}
      <div className="hero-section-vendedores">
        <div className="hero-overlay"></div>
        <Container>
          <div className="hero-content" data-aos="fade-up">
            <div className="hero-icon-container mb-4">
              <i className="bi bi-house-check-fill"></i>
            </div>
            <h1 className="text-center">Guía para Vendedores</h1>
            <p className="text-center lead">
              Aprende cómo vender tu propiedad de manera rápida y efectiva con nuestra guía especializada.
            </p>
            <div className="hero-divider">
              <span></span><i className="bi bi-diamond-fill"></i><span></span>
            </div>
          </div>
        </Container>
      </div>

      {/* Contenido principal con animaciones y mejoras */}
      <Container className="content-section py-5">
        <h2 className="section-title text-center mb-5" data-aos="fade-up">
          <i className="bi bi-signpost-split me-2"></i>Tres pasos para vender exitosamente
        </h2>

        <Row className="mb-5">
          {/* Paso 1 */}
          <Col md={4} className="mb-4">
            <Card className="info-card h-100 shadow hover-card" data-aos="fade-up" data-aos-delay="100">
              <div className="card-icon-top">
                <i className="bi bi-house-gear"></i>
              </div>
              <Card.Body className="text-center">
                <div className="step-number">1</div>
                <Card.Title className="fw-bold">Prepara tu propiedad</Card.Title>
                <Card.Text>
                  Asegúrate de que tu propiedad esté en las mejores condiciones para atraer compradores.
                  Limpia, ordena y realiza reparaciones básicas.
                </Card.Text>
                <Button variant="outline-success" className="btn-icon-text mt-3">
                  <i className="bi bi-info-circle me-2"></i>Más detalles
                </Button>
              </Card.Body>
            </Card>
          </Col>

          {/* Paso 2 */}
          <Col md={4} className="mb-4">
            <Card className="info-card h-100 shadow hover-card" data-aos="fade-up" data-aos-delay="200">
              <div className="card-icon-top">
                <i className="bi bi-camera"></i>
              </div>
              <Card.Body className="text-center">
                <div className="step-number">2</div>
                <Card.Title className="fw-bold">Publica tu anuncio</Card.Title>
                <Card.Text>
                  Usa nuestra plataforma para publicar tu propiedad con fotos de calidad y
                  descripciones atractivas que destaquen sus mejores características.
                </Card.Text>
                <Button variant="outline-success" className="btn-icon-text mt-3">
                  <i className="bi bi-image me-2"></i>Ver ejemplos
                </Button>
              </Card.Body>
            </Card>
          </Col>

          {/* Paso 3 */}
          <Col md={4} className="mb-4">
            <Card className="info-card h-100 shadow hover-card" data-aos="fade-up" data-aos-delay="300">
              <div className="card-icon-top">
                <i className="bi bi-cash-coin"></i>
              </div>
              <Card.Body className="text-center">
                <div className="step-number">3</div>
                <Card.Title className="fw-bold">Negocia y vende</Card.Title>
                <Card.Text>
                  Aprende a negociar eficazmente con los compradores y cierra el trato
                  de manera segura utilizando nuestras herramientas profesionales.
                </Card.Text>
                <Button variant="outline-success" className="btn-icon-text mt-3">
                  <i className="bi bi-check2-circle me-2"></i>Consejos prácticos
                </Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Sección de testimonios - nueva */}
        <div className="testimonial-section my-5" data-aos="fade-up">
          <div className="testimonial-quote">
            <i className="bi bi-quote"></i>
          </div>
          <p className="testimonial-text">
            "Gracias a InmoMarket, pude vender mi departamento en menos de dos semanas.
            El proceso fue muy fácil y recibí un excelente asesoramiento en todo momento."
          </p>
          <div className="testimonial-author">
            <div className="testimonial-avatar">
              <i className="bi bi-person-circle"></i>
            </div>
            <div className="testimonial-info">
              <h5>Carlos Rodriguez</h5>
              <p>Lima, Perú</p>
            </div>
          </div>
        </div>

        {/* Call to action mejorado */}
        <div className="cta-banner" data-aos="zoom-in">
          <h3><i className="bi bi-lightning-charge-fill me-2"></i>¿Listo para comenzar a vender?</h3>
          <p>Nuestro equipo está preparado para ayudarte en cada paso del camino</p>
          <Button
            variant="success"
            size="lg"
            className="animated-btn"
            onClick={() => navigate('/publicar')}
          >
            <i className="bi bi-rocket-takeoff me-2"></i>Comenzar ahora
          </Button>
        </div>

        {/* Sección de estadísticas - nueva */}
        <Row className="stats-section text-center mt-5 pt-3">
          <h4 className="mb-4" data-aos="fade-up">Por qué elegir InmoMarket</h4>
          <Col md={3} sm={6} className="mb-4" data-aos="fade-up" data-aos-delay="100">
            <div className="stat-item">
              <div className="stat-icon">
                <i className="bi bi-people-fill"></i>
              </div>
              <h3>10K+</h3>
              <p>Usuarios activos</p>
            </div>
          </Col>
          <Col md={3} sm={6} className="mb-4" data-aos="fade-up" data-aos-delay="200">
            <div className="stat-item">
              <div className="stat-icon">
                <i className="bi bi-house-heart-fill"></i>
              </div>
              <h3>5K+</h3>
              <p>Propiedades vendidas</p>
            </div>
          </Col>
          <Col md={3} sm={6} className="mb-4" data-aos="fade-up" data-aos-delay="300">
            <div className="stat-item">
              <div className="stat-icon">
                <i className="bi bi-star-fill"></i>
              </div>
              <h3>4.8</h3>
              <p>Calificación promedio</p>
            </div>
          </Col>
          <Col md={3} sm={6} className="mb-4" data-aos="fade-up" data-aos-delay="400">
            <div className="stat-item">
              <div className="stat-icon">
                <i className="bi bi-clock-history"></i>
              </div>
              <h3>15 días</h3>
              <p>Tiempo promedio de venta</p>
            </div>
          </Col>
        </Row>
      </Container>

      {/* Footer (se mantiene el original pero se corrigen los errores de sintaxis) */}
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
                    <a href="#" className="social-icon"><i className="bi bi-facebook"></i></a>
                    <a href="#" className="social-icon"><i className="bi bi-instagram"></i></a>
                    <a href="#" className="social-icon"><i className="bi bi-twitter"></i></a>
                    <a href="#" className="social-icon"><i className="bi bi-linkedin"></i></a>
                    <a href="#" className="social-icon"><i className="bi bi-youtube"></i></a>
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
                    <i className="bi bi-telephone-fill me-2"></i>
                    <span>(01) 555-1234</span>
                  </div>
                  <div className="d-flex align-items-center">
                    <i className="bi bi-envelope-fill me-2"></i>
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