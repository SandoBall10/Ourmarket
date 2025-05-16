import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Navbar, Nav, Container, Row, Col, Button, NavDropdown, Card } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';
// Importar bibliotecas para animaciones e iconos
import AOS from 'aos';
import 'aos/dist/aos.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './Compradores.css'; // Asegúrate de crear este archivo CSS

const Compradores: React.FC = () => {
    const navigate = useNavigate();
    const [isComprarOpen, setIsComprarOpen] = useState(false);
    const [isAlquilarOpen, setIsAlquilarOpen] = useState(false);
    const [isServiciosOpen, setIsServiciosOpen] = useState(false);

    // Mock user authentication state
    const [isLoggedIn, setIsLoggedIn] = useState(true); // Change to false if not logged in
    const [user, setUser] = useState<{ name: string } | null>({ name: 'A' }); // Replace with actual user data

    // Inicializar animaciones cuando el componente se monta
    useEffect(() => {
        AOS.init({
            duration: 800,
            once: false,
            easing: 'ease-in-out',
        });
    }, []);

    function handleLogout(): void {
        setUser(null); // Set user to null when logging out
        setIsLoggedIn(false);
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
            <div className="hero-section-compradores">
                <div className="hero-overlay"></div>
                <Container>
                    <div className="hero-content" data-aos="fade-up">
                        <div className="hero-icon-container mb-4">
                            <i className="bi bi-building-check"></i>
                        </div>
                        <h1 className="text-center">Guía para Compradores</h1>
                        <p className="text-center lead">
                            Encuentra tu propiedad ideal y aprende todo sobre el proceso de compra inmobiliaria
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
                    <i className="bi bi-signpost-split me-2"></i>Pasos para comprar tu propiedad
                </h2>

                <Row className="mb-5">
                    {/* Paso 1 */}
                    <Col md={4} className="mb-4">
                        <Card className="info-card h-100 shadow hover-card" data-aos="fade-up" data-aos-delay="100">
                            <div className="card-icon-top">
                                <i className="bi bi-search"></i>
                            </div>
                            <Card.Body className="text-center">
                                <div className="step-number">1</div>
                                <Card.Title className="fw-bold">Búsqueda inteligente</Card.Title>
                                <Card.Text>
                                    Utiliza nuestros filtros avanzados para encontrar propiedades que se ajusten
                                    a tus necesidades y presupuesto.
                                </Card.Text>
                                <Button variant="outline-primary" className="btn-icon-text mt-3">
                                    <i className="bi bi-funnel-fill me-2"></i>Explorar filtros
                                </Button>
                            </Card.Body>
                        </Card>
                    </Col>

                    {/* Paso 2 */}
                    <Col md={4} className="mb-4">
                        <Card className="info-card h-100 shadow hover-card" data-aos="fade-up" data-aos-delay="200">
                            <div className="card-icon-top">
                                <i className="bi bi-bar-chart-steps"></i>
                            </div>
                            <Card.Body className="text-center">
                                <div className="step-number">2</div>
                                <Card.Title className="fw-bold">Compara opciones</Card.Title>
                                <Card.Text>
                                    Analiza las diferentes propiedades disponibles y compara características,
                                    precios y beneficios para tomar la mejor decisión de compra.
                                </Card.Text>
                                <Button variant="outline-success" className="btn-icon-text mt-3">
                                    <i className="bi bi-grid-3x3-gap me-2"></i>Tabla comparativa
                                </Button>
                            </Card.Body>
                        </Card>
                    </Col>

                    {/* Paso 3 */}
                    <Col md={4} className="mb-4">
                        <Card className="info-card h-100 shadow hover-card" data-aos="fade-up" data-aos-delay="300">
                            <div className="card-icon-top">
                                <i className="bi bi-file-earmark-text"></i>
                            </div>
                            <Card.Body className="text-center">
                                <div className="step-number">3</div>
                                <Card.Title className="fw-bold">Cierre seguro</Card.Title>
                                <Card.Text>
                                    Negocia el precio, revisa la documentación legal y cierra el trato con total
                                    seguridad y confianza.
                                </Card.Text>
                                <Button variant="outline-primary" className="btn-icon-text mt-3">
                                    <i className="bi bi-shield-check me-2"></i>Guía legal
                                </Button>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>

                {/* Sección de testimonios */}
                <div className="testimonial-section my-5" data-aos="fade-up">
                    <div className="testimonial-quote">
                        <i className="bi bi-quote"></i>
                    </div>
                    <p className="testimonial-text">
                        "Gracias a la guía de compradores de InmoMarket pude encontrar mi departamento ideal.
                        La información sobre el proceso de compra y los consejos para la negociación fueron fundamentales."
                    </p>
                    <div className="testimonial-author">
                        <div className="testimonial-avatar">
                            <i className="bi bi-person-circle"></i>
                        </div>
                        <div className="testimonial-info">
                            <h5>Mariana López</h5>
                            <p>Arequipa, Perú</p>
                        </div>
                    </div>
                </div>

                {/* Sección de consideraciones importantes - animaciones reducidas */}
                <div className="considerations-section">
                    <h3 className="text-center mb-4">
                        <i className="bi bi-lightbulb me-2"></i>
                        Consideraciones importantes
                    </h3>
                    <Row>
                        <Col md={6} lg={3} className="mb-4">
                            <div className="consideration-card">
                                <div className="consideration-icon">
                                    <i className="bi bi-geo-alt"></i>
                                </div>
                                <h5>Ubicación</h5>
                                <p>Evalúa la cercanía a servicios, transporte y la proyección futura de la zona.</p>
                            </div>
                        </Col>
                        <Col md={6} lg={3} className="mb-4">
                            <div className="consideration-card">
                                <div className="consideration-icon">
                                    <i className="bi bi-rulers"></i>
                                </div>
                                <h5>Tamaño y distribución</h5>
                                <p>Considera tus necesidades actuales y futuras al evaluar los espacios.</p>
                            </div>
                        </Col>
                        <Col md={6} lg={3} className="mb-4">
                            <div className="consideration-card">
                                <div className="consideration-icon">
                                    <i className="bi bi-clipboard-data"></i>
                                </div>
                                <h5>Documentación legal</h5>
                                <p>Verifica que la propiedad esté libre de gravámenes y con todos sus papeles en regla.</p>
                            </div>
                        </Col>
                        <Col md={6} lg={3} className="mb-4">
                            <div className="consideration-card">
                                <div className="consideration-icon">
                                    <i className="bi bi-tools"></i>
                                </div>
                                <h5>Estado y mantenimiento</h5>
                                <p>Evalúa el estado general y posibles costos de renovación o mantenimiento.</p>
                            </div>
                        </Col>
                    </Row>
                </div>

                {/* Call to action */}
                <div className="cta-banner" data-aos="zoom-in">
                    <h3><i className="bi bi-house-heart-fill me-2"></i>¿Listo para encontrar tu nueva casa?</h3>
                    <p>Nuestros asesores pueden ayudarte a iniciar tu búsqueda ahora mismo</p>
                    <Button
                        variant="primary"
                        size="lg"
                        className="animated-btn"
                        onClick={() => navigate('/buscar-propiedades')}
                    >
                        <i className="bi bi-search-heart me-2"></i>Comenzar búsqueda
                    </Button>
                </div>

                {/* Sección de preguntas frecuentes - animaciones reducidas */}
                <div className="faq-section text-center mt-5">
                    <h4 className="section-title mb-5">Preguntas frecuentes de compradores</h4>
                    <Row>
                        <Col md={6} className="mb-4">
                            <div className="faq-card">
                                <div className="faq-icon">
                                    <i className="bi bi-cash-coin"></i>
                                </div>
                                <h5>¿Cuál es la mejor forma de financiar mi compra?</h5>
                                <p>Evalúa tus opciones entre créditos hipotecarios, préstamos personales o financiamiento directo con el vendedor, según tu capacidad y plazo de pago.</p>
                                <div className="faq-more">
                                </div>
                            </div>
                        </Col>
                        <Col md={6} className="mb-4">
                            <div className="faq-card">
                                <div className="faq-icon">
                                    <i className="bi bi-file-earmark-text"></i>
                                </div>
                                <h5>¿Qué documentos necesito para comprar?</h5>
                                <p>Para iniciar el proceso de compra necesitarás identificación oficial, comprobantes de ingresos y documentos que acrediten tu historial crediticio.</p>
                                <div className="faq-more">
                                </div>
                            </div>
                        </Col>
                        <Col md={6} className="mb-4">
                            <div className="faq-card">
                                <div className="faq-icon">
                                    <i className="bi bi-calendar-check"></i>
                                </div>
                                <h5>¿Cuánto tiempo toma el proceso de compra?</h5>
                                <p>El tiempo promedio desde la oferta hasta la escrituración puede variar entre 30 y 90 días, dependiendo de las condiciones de la transacción y el tipo de financiamiento.</p>
                                <div className="faq-more">
                                </div>
                            </div>
                        </Col>
                        <Col md={6} className="mb-4">
                            <div className="faq-card">
                                <div className="faq-icon">
                                    <i className="bi bi-graph-up-arrow"></i>
                                </div>
                                <h5>¿Es buen momento para invertir en propiedades?</h5>
                                <p>Actualmente el mercado inmobiliario muestra estabilidad y oportunidades de plusvalía en zonas estratégicas, pero siempre es recomendable evaluar cada inversión individualmente.</p>
                                <div className="faq-more">
                                </div>
                            </div>
                        </Col>
                    </Row>
                </div>
            </Container>

            {/* Footer mejorado */}
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

export default Compradores;