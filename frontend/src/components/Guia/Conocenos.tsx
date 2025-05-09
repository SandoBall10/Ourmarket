import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Navbar, Nav, Container, Row, Col, Button, NavDropdown } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';
// Importar bibliotecas para animaciones e iconos
import AOS from 'aos';
import 'aos/dist/aos.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './Conocenos.css'; // Asegúrate de crear este archivo CSS

const Conocenos: React.FC = () => {
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

    function handleLogout(_event: React.MouseEvent<HTMLElement>): void {
        setUser(null);
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
                                                </ul>
                                            </Col>
                                            <Col>
                                                <h6 className="fw-bold mb-3">Tipo de propiedad</h6>
                                                <ul className="list-unstyled">
                                                    <li>Departamento</li>
                                                    <li>Casa</li>
                                                    <li>Terreno/Lote</li>
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

                            {/* Menú Vender */}
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
                                                    <li>
                                                        <Link to="/compradores" className="text-decoration-none text-dark">
                                                            Guía para Comprar
                                                        </Link>
                                                    </li>
                                                </ul>
                                            </Col>
                                            <Col>
                                                <h6 className="fw-bold mb-3">Nuestra Misión y Visión</h6>
                                                <ul className="list-unstyled">
                                                    <li>
                                                        <Link to="/conocenos" className="text-decoration-none text-dark">
                                                            Conócenos
                                                        </Link>
                                                    </li>
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
                                <span className="nav-link-text">Notificaciones <i className="bi bi-bell"></i></span>
                            </Nav.Link>

                            {/* Ingresar o Avatar de Usuario */}
                            {isLoggedIn && user ? (
                                <NavDropdown
                                    title={
                                        <div className="user-avatar">
                                            {user.name.charAt(0).toUpperCase()}
                                        </div>
                                    }
                                    id="user-dropdown"
                                    align="end"
                                >
                                    <NavDropdown.Item as={Link} to="/perfil">Mi Perfil</NavDropdown.Item>
                                    <NavDropdown.Item as={Link} to="/mis-publicaciones">Mis Publicaciones</NavDropdown.Item>
                                    <NavDropdown.Divider />
                                    <NavDropdown.Item onClick={handleLogout}>Cerrar Sesión</NavDropdown.Item>
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
            <div className="hero-section-conocenos">
                <div className="hero-overlay"></div>
                <Container>
                    <div className="hero-content" data-aos="fade-up">
                        <div className="hero-icon-container mb-4">
                            <i className="bi bi-building-fill"></i>
                        </div>
                        <h1 className="text-center">Conócenos</h1>
                        <p className="text-center lead">
                            Descubre quiénes somos y cómo estamos transformando el mercado inmobiliario
                        </p>
                        <div className="hero-divider">
                            <span></span><i className="bi bi-diamond-fill"></i><span></span>
                        </div>
                    </div>
                </Container>
            </div>

            {/* Contenido principal con animaciones y mejoras */}
            <Container className="content-section py-5">
                {/* Sección Sobre Nosotros */}
                <div className="about-section mb-5">
                    <h2 className="section-title text-center mb-5" data-aos="fade-up">
                        <i className="bi bi-building me-2"></i>Nuestra Historia
                    </h2>

                    <Row className="align-items-center mb-5">
                        <Col lg={6} data-aos="fade-right">
                            <p className="lead fw-bold">
                                Desde 2025, InmoMarket ha sido un gran reto pero con el equipo adecuado se logo realizar.
                            </p>
                            <p>
                                Nacimos como un proyecto universitario con una misión clara: transformar la forma en que
                                las personas compran y venden propiedades, haciendo el proceso más transparente,
                                eficiente y accesible para todos.
                            </p>
                            <p>
                                Lo que comenzó como una iniciativa académica entre estudiantes apasionados por
                                la tecnología y el sector inmobiliario en la universidad, se ha convertido en una
                                plataforma integral que conecta a compradores, vendedores y profesionales del sector.
                            </p>
                            <p>
                                Hoy, tras un arduo trabajo y dedicación constante, el proyecto llamado InmoMarket es un
                                es una realiadad.
                            </p>
                        </Col>
                        <Col lg={6} className="text-center" data-aos="fade-left">
                            <div className="history-image-container">
                                <i className="bi bi-graph-up-arrow history-icon"></i>
                                <div className="history-year">
                                    <span>2025</span>
                                </div>
                            </div>
                        </Col>
                    </Row>
                </div>

                {/* Sección de Misión y Visión */}
                <div className="mission-vision-section mb-5">
                    <Row>
                        {/* Misión */}
                        <Col lg={6} className="mb-4" data-aos="fade-right">
                            <div className="mission-card">
                                <div className="mission-icon">
                                    <i className="bi bi-bullseye"></i>
                                </div>
                                <h3>Nuestra Misión</h3>
                                <p>
                                    Democratizar el acceso al mercado inmobiliario a través de una plataforma digital
                                    transparente y eficiente que conecte de forma directa a compradores y vendedores,
                                    proporcionando las herramientas y el conocimiento necesarios para tomar decisiones
                                    informadas y confiables.
                                </p>
                                <p>
                                    Nos esforzamos por hacer que cada transacción inmobiliaria sea un proceso
                                    claro, seguro y satisfactorio, eliminando intermediarios innecesarios y
                                    aportando valor real a cada etapa del proceso.
                                </p>
                            </div>
                        </Col>

                        {/* Visión */}
                        <Col lg={6} className="mb-4" data-aos="fade-left">
                            <div className="vision-card">
                                <div className="vision-icon">
                                    <i className="bi bi-eye"></i>
                                </div>
                                <h3>Nuestra Visión</h3>
                                <p>
                                    Aspiramos a ser la plataforma inmobiliaria líder en Latinoamérica,
                                    reconocida por transformar la industria a través de la innovación tecnológica
                                    y un enfoque centrado en el usuario.
                                </p>
                                <p>
                                    Buscamos crear un ecosistema inmobiliario donde la transparencia,
                                    la confianza y la accesibilidad sean los pilares fundamentales,
                                    permitiendo a las personas encontrar el hogar de sus sueños o
                                    realizar inversiones inmobiliarias exitosas con facilidad y seguridad.
                                </p>
                            </div>
                        </Col>
                    </Row>
                </div>

                {/* Sección de valores */}
                <div className="values-section my-5">
                    <h3 className="section-title text-center mb-4">Nuestros Valores</h3>
                    <Row>
                        <Col md={4} className="mb-4">
                            <div className="value-card">
                                <div className="value-icon">
                                    <i className="bi bi-shield-check"></i>
                                </div>
                                <h4>Transparencia</h4>
                                <p>Creemos que la claridad y la honestidad son fundamentales en cada transacción inmobiliaria. 
                                Nos comprometemos a proporcionar información precisa y completa.</p>
                            </div>
                        </Col>
                        <Col md={4} className="mb-4">
                            <div className="value-card">
                                <div className="value-icon">
                                    <i className="bi bi-lightbulb"></i>
                                </div>
                                <h4>Innovación</h4>
                                <p>Buscamos constantemente nuevas formas de mejorar la experiencia inmobiliaria a través de la 
                                tecnología y soluciones creativas.</p>
                            </div>
                        </Col>
                        <Col md={4} className="mb-4">
                            <div className="value-card">
                                <div className="value-icon">
                                    <i className="bi bi-people"></i>
                                </div>
                                <h4>Comunidad</h4>
                                <p>Fomentamos un sentido de pertenencia entre nuestros usuarios, creando un espacio donde
                                todos pueden colaborar y beneficiarse mutuamente.</p>
                            </div>
                        </Col>
                        <Col md={4} className="mb-4">
                            <div className="value-card">
                                <div className="value-icon">
                                    <i className="bi bi-award"></i>
                                </div>
                                <h4>Excelencia</h4>
                                <p>Nos esforzamos por superar las expectativas en todo lo que hacemos, desde el desarrollo de la 
                                plataforma hasta el servicio al cliente.</p>
                            </div>
                        </Col>
                        <Col md={4} className="mb-4">
                            <div className="value-card">
                                <div className="value-icon">
                                    <i className="bi bi-lock"></i>
                                </div>
                                <h4>Confianza</h4>
                                <p>Construimos relaciones duraderas basadas en la confianza mutua y el respeto con nuestros usuarios
                                y socios comerciales.</p>
                            </div>
                        </Col>
                        <Col md={4} className="mb-4">
                            <div className="value-card">
                                <div className="value-icon">
                                    <i className="bi bi-recycle"></i>
                                </div>
                                <h4>Sostenibilidad</h4>
                                <p>Promovemos prácticas inmobiliarias sostenibles y responsables con el medio ambiente y las
                                comunidades locales.</p>
                            </div>
                        </Col>
                    </Row>
                </div>

                {/* Sección de Equipo Directivo */}
                <div className="team-section mb-5">
                    <h2 className="section-title text-center mb-5" data-aos="fade-up">
                        <i className="bi bi-people-fill me-2"></i>Nuestro Equipo Directivo
                    </h2>

                    <Row data-aos="fade-up">
                        <Col lg={3} md={6} className="mb-4">
                            <div className="team-card">
                                <div className="team-img-container">
                                    <i className="bi bi-person-circle team-placeholder"></i>
                                </div>
                                <div className="team-info">
                                    <h4>Adrian Sandobal Ballona</h4>
                                    <p className="team-position">Estudiante Ing. Sistemas</p>
                                    <p className="team-bio">
                                        Enfocado en la optimización y eficiencia del frontend, implementó
                                        las secciones responsivas y la integración con APIs.
                                    </p>
                                    <div className="team-social">
                                        <a href="#" className="social-link"><i className="bi bi-linkedin"></i></a>
                                        <a href="#" className="social-link"><i className="bi bi-twitter"></i></a>
                                        <a href="#" className="social-link"><i className="bi bi-envelope"></i></a>
                                    </div>
                                </div>
                            </div>
                        </Col>

                        <Col lg={3} md={6} className="mb-4">
                            <div className="team-card">
                                <div className="team-img-container">
                                    <i className="bi bi-person-circle team-placeholder"></i>
                                </div>
                                <div className="team-info">
                                    <h4>Andersson Flores Ruiz</h4>
                                    <p className="team-position">Estudiante Ing. Sistemas</p>
                                    <p className="team-bio">
                                        Enfocado en desarrollo frontend utilizando React y TypeScript, responsable de la
                                        implementación de componentes interactivos y la experiencia de usuario.
                                    </p>
                                    <div className="team-social">
                                        <a href="#" className="social-link"><i className="bi bi-linkedin"></i></a>
                                        <a href="#" className="social-link"><i className="bi bi-twitter"></i></a>
                                        <a href="#" className="social-link"><i className="bi bi-envelope"></i></a>
                                    </div>
                                </div>
                            </div>
                        </Col>

                        <Col lg={3} md={6} className="mb-4">
                            <div className="team-card">
                                <div className="team-img-container">
                                    <i className="bi bi-person-circle team-placeholder"></i>
                                </div>
                                <div className="team-info">
                                    <h4>Aaron Silva Chorres</h4>
                                    <p className="team-position">Estudiante Ing. Sistemas</p>
                                    <p className="team-bio">
                                        Enfocado en desarrollo backend y arquitectura de sistemas.
                                        Responsable de la creación de la estructura de bases de datos y
                                        los sistemas de autenticación de la plataforma.
                                    </p>
                                    <div className="team-social">
                                        <a href="#" className="social-link"><i className="bi bi-linkedin"></i></a>
                                        <a href="#" className="social-link"><i className="bi bi-twitter"></i></a>
                                        <a href="#" className="social-link"><i className="bi bi-envelope"></i></a>
                                    </div>
                                </div>
                            </div>
                        </Col>

                        <Col lg={3} md={6} className="mb-4">
                            <div className="team-card">
                                <div className="team-img-container">
                                    <i className="bi bi-person-circle team-placeholder"></i>
                                </div>
                                <div className="team-info">
                                    <h4>Gabriel Marreros Navarro</h4>
                                    <p className="team-position">Estudiante Ing. Sistemas</p>
                                    <p className="team-bio">
                                        Enfocado en el backend en seguridad y rendimiento.
                                        Diseñó e implementó las APIs que potencian la plataforma y los
                                        sistemas de procesamiento de datos inmobiliarios.
                                    </p>
                                    <div className="team-social">
                                        <a href="#" className="social-link"><i className="bi bi-linkedin"></i></a>
                                        <a href="#" className="social-link"><i className="bi bi-twitter"></i></a>
                                        <a href="#" className="social-link"><i className="bi bi-envelope"></i></a>
                                    </div>
                                </div>
                            </div>
                        </Col>
                    </Row>
                </div>
                {/* Sección de estadísticas */}
                <Row className="stats-section text-center mt-5 pt-3">
                    <h4 className="mb-4">InmoMarket en números</h4>
                    <Col md={3} sm={6} className="mb-4">
                        <div className="stat-item">
                            <div className="stat-icon">
                                <i className="bi bi-people-fill"></i>
                            </div>
                            <h3>10K+</h3>
                            <p>Usuarios activos</p>
                        </div>
                    </Col>
                    <Col md={3} sm={6} className="mb-4">
                        <div className="stat-item">
                            <div className="stat-icon">
                                <i className="bi bi-house-heart-fill"></i>
                            </div>
                            <h3>5K+</h3>
                            <p>Propiedades listadas</p>
                        </div>
                    </Col>
                    <Col md={3} sm={6} className="mb-4">
                        <div className="stat-item">
                            <div className="stat-icon">
                                <i className="bi bi-geo-alt-fill"></i>
                            </div>
                            <h3>15+</h3>
                            <p>Ciudades cubiertas</p>
                        </div>
                    </Col>
                    <Col md={3} sm={6} className="mb-4">
                        <div className="stat-item">
                            <div className="stat-icon">
                                <i className="bi bi-laptop"></i>
                            </div>
                            <h3>24/7</h3>
                            <p>Soporte disponible</p>
                        </div>
                    </Col>
                </Row>
            </Container>

            {/* Footer */}
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

export default Conocenos;