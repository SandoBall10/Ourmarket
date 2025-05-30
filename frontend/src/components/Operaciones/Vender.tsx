import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button, Card, Navbar, Nav, NavDropdown } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';
import './Vender.css';
import AOS from 'aos';
import 'aos/dist/aos.css';

const Vender: React.FC = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [operationType, setOperationType] = useState<string>('venta');
  const [propertyType, setPropertyType] = useState<string>('');
  const [propertySubtype, setPropertySubtype] = useState<string>('');
  const [userName, setUserName] = useState<string>('');

  // Mock user authentication state
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(true);
  const [user, setUser] = useState({ name: 'Usuario' });

  // Logout handler
  const handleLogout = () => {
    // Implement logout functionality
    setIsLoggedIn(false);
    navigate('/login');
  };

  // Efecto para inicializar AOS (animaciones)
  useEffect(() => {
    AOS.init({
      duration: 800,
      once: false
    });

    // Simulación de obtener el nombre del usuario
    setUserName('usuario');
  }, []);

  // Manejar cambio de paso
  const handleStepChange = (step: number) => {
    if (step >= 1 && step <= 4) {
      setCurrentStep(step);
    }
  };

  // Continuar al siguiente paso
  const handleContinue = () => {
    handleStepChange(currentStep + 1);
  };

  // Guardar y salir
  const handleSaveAndExit = () => {
    // Lógica para guardar el progreso
    navigate('/mis-publicaciones');
  };

  return (

    <div className="vender-page">
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
              {/* Menú Mis Publicaiones */}
              <div className="nav-item mega-dropdown">
                <Nav.Link
                  as={Link}
                  to="/publicaciones"
                  className="nav-link-text"
                  id="comprar-dropdown"
                >
                  Mis Publicaciones <i className="fas fa-chevron-down fa-xs"></i>
                </Nav.Link>
                <div className="mega-menu-wrapper">
                </div>
              </div>

              {/* Menú Favoritos */}
              <div className="nav-item mega-dropdown">
                <Nav.Link
                  as={Link}
                  to="/mis-favoritos"
                  className="nav-link-text"
                  id="favoritos-dropdown"
                >
                  Favoritos <i className="fas fa-chevron-down fa-xs"></i>
                </Nav.Link>
                <div className="mega-menu-wrapper">
                </div>
              </div>

              {/* Menú Mis Chats */}
              <div className="nav-item mega-dropdown">
                <Nav.Link
                  as={Link}
                  to="/chats"
                  className="nav-link-text"
                  id="chats-dropdown"
                >
                  Mis Chats <i className="fas fa-chevron-down fa-xs"></i>
                </Nav.Link>
                <div className="mega-menu-wrapper">
                </div>
              </div>

              {/* Menú Historial*/}
              <div className="nav-item mega-dropdown">
                <Nav.Link
                  as={Link}
                  to="/historial"
                  className="nav-link-text"
                  id="historial-dropdown"
                >
                  Historial <i className="fas fa-chevron-down fa-xs"></i>
                </Nav.Link>
                <div className="mega-menu-wrapper">
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
                        {"A"}
                      </div>
                      <i className="fas fa-chevron-down avatar-arrow"></i>
                    </div>
                  }
                  id="user-dropdown"
                  align="end"
                  className="custom-dropdown"
                >
                  {/* Botón de Inicio */}
                  <NavDropdown.Item as={Link} to="/" className="dropdown-item-custom">
                    <div className="icon-wrapper"><i className="fas fa-home"></i></div>
                    <span>Inicio</span>
                  </NavDropdown.Item>
                  <NavDropdown.Divider />
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
                  <NavDropdown.Item
                    onClick={() => {
                      // Cerrar el dropdown
                      document.body.click();
                      // Cambiar a la sección de notificaciones en Perfil
                      navigate('/perfil', { state: { activeSection: 'notificaciones' } });
                    }}
                    className="dropdown-item-custom"
                  >
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

      {/* Progress Steps */}
      <div className="progress-steps-container">
        <div className="progress-bar-container">
          <div className="progress-bar" style={{ width: `${(currentStep / 4) * 100}%` }}></div>
        </div>
        <div className="steps-container">
          <div className={`step-item ${currentStep >= 1 ? 'active' : ''}`} onClick={() => handleStepChange(1)}>
            <div className="step-number">
              <span>1</span>
              {currentStep > 1 && <i className="bi bi-check-lg"></i>}
            </div>
            <span className="step-title">Principales</span>
          </div>

          <div className={`step-item ${currentStep >= 2 ? 'active' : ''}`} onClick={() => handleStepChange(2)}>
            <div className="step-number">
              <span>2</span>
              {currentStep > 2 && <i className="bi bi-check-lg"></i>}
            </div>
            <span className="step-title">Multimedia</span>
          </div>

          <div className={`step-item ${currentStep >= 3 ? 'active' : ''}`} onClick={() => handleStepChange(3)}>
            <div className="step-number">
              <span>3</span>
              {currentStep > 3 && <i className="bi bi-check-lg"></i>}
            </div>
            <span className="step-title">Extras</span>
          </div>

          <div className={`step-item ${currentStep >= 4 ? 'active' : ''}`} onClick={() => handleStepChange(4)}>
            <div className="step-number">
              <span>4</span>
              {currentStep > 4 && <i className="bi bi-check-lg"></i>}
            </div>
            <span className="step-title">Publicar</span>
          </div>
        </div>
      </div>

      <Container className="vender-container mt-4">
        <Row>
          {/* Sidebar de navegación */}
          <Col md={3}>
            <Card className="sidebar-nav" data-aos="fade-right">
              <div className={`sidebar-item ${currentStep === 1 ? 'active' : ''}`} onClick={() => handleStepChange(1)}>
                <i className="bi bi-house-door me-2"></i>
                Operación y tipo de inmueble
              </div>
              <div className={`sidebar-item ${currentStep === 2 ? 'active' : ''}`} onClick={() => handleStepChange(2)}>
                <i className="bi bi-geo-alt me-2"></i>
                Ubicación
              </div>
              <div className={`sidebar-item ${currentStep === 3 ? 'active' : ''}`} onClick={() => handleStepChange(3)}>
                <i className="bi bi-card-checklist me-2"></i>
                Características
              </div>
              <div className={`sidebar-item ${currentStep === 4 ? 'active' : ''}`} onClick={() => handleStepChange(4)}>
                <i className="bi bi-image me-2"></i>
                Fotos y videos
              </div>
            </Card>
          </Col>

          {/* Contenido principal */}
          <Col md={9}>
            <div className="main-content" data-aos="fade-up">
              <h2 className="greeting-text">¡Hola {userName}, empecemos a crear tu aviso!</h2>

              {currentStep === 1 && (
                <div className="step-content" data-aos="fade-in">
                  <h3 className="mb-4">Cuéntanos, sobre tu Inmueble</h3>

                  <Form.Group className="mb-4">
                    <Form.Label><i className="bi bi-tags me-2"></i>Tipo de operación</Form.Label>
                    <div className="operation-type-buttons">
                      <Button
                        variant={operationType === 'venta' ? 'success' : 'outline-secondary'}
                        className="operation-btn"
                        onClick={() => setOperationType('venta')}
                      >
                        <i className="bi bi-cash-coin me-2"></i>Venta
                      </Button>
                      <Button
                        variant={operationType === 'alquiler' ? 'success' : 'outline-secondary'}
                        className="operation-btn"
                        onClick={() => setOperationType('alquiler')}
                      >
                        <i className="bi bi-calendar-date me-2"></i>Alquiler
                      </Button>
                      <Button
                        variant={operationType === 'temporada' ? 'success' : 'outline-secondary'}
                        className="operation-btn"
                        onClick={() => setOperationType('temporada')}
                      >
                        <i className="bi bi-sun me-2"></i>Temporada
                      </Button>
                    </div>
                  </Form.Group>

                  <Row className="mb-4">
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label><i className="bi bi-building me-2"></i>Tipo de inmueble</Form.Label>
                        <Form.Select
                          value={propertyType}
                          onChange={(e) => setPropertyType(e.target.value)}
                        >
                          <option value="">Selecciona...</option>
                          <option value="casa">Casa</option>
                          <option value="departamento">Departamento</option>
                          <option value="terreno">Terreno / Lote</option>
                          <option value="local">Local comercial</option>
                          <option value="oficina">Oficina</option>
                        </Form.Select>
                      </Form.Group>
                    </Col>

                    <Col md={6}>
                      <Form.Group>
                        <Form.Label><i className="bi bi-building-add me-2"></i>Subtipo de inmueble</Form.Label>
                        <Form.Select
                          value={propertySubtype}
                          onChange={(e) => setPropertySubtype(e.target.value)}
                          disabled={!propertyType}
                        >
                          <option value="">Selecciona...</option>
                          {propertyType === 'casa' && (
                            <>
                              <option value="casa_standard">Casa estándar</option>
                              <option value="casa_campo">Casa de campo</option>
                              <option value="casa_playa">Casa de playa</option>
                              <option value="duplex">Dúplex</option>
                            </>
                          )}
                          {propertyType === 'departamento' && (
                            <>
                              <option value="depto_standard">Departamento estándar</option>
                              <option value="penthouse">Penthouse</option>
                              <option value="loft">Loft</option>
                            </>
                          )}
                        </Form.Select>
                      </Form.Group>
                    </Col>
                  </Row>
                </div>
              )}

              {currentStep === 2 && (
                <div className="step-content" data-aos="fade-in">
                  <h3>Cuéntanos más sobre la ubicación</h3>
                  {/* Contenido del paso 2 */}
                </div>
              )}

              {currentStep === 3 && (
                <div className="step-content" data-aos="fade-in">
                  <h3>Características de la propiedad</h3>
                  {/* Contenido del paso 3 */}
                </div>
              )}

              {currentStep === 4 && (
                <div className="step-content" data-aos="fade-in">
                  <h3>Añade fotos y videos de tu propiedad</h3>
                  {/* Contenido del paso 4 */}
                </div>
              )}

              {/* Botones de navegación */}
              <div className="navigation-buttons mt-5">
                <Button
                  variant="outline-secondary"
                  onClick={handleSaveAndExit}
                  className="save-exit-btn"
                >
                  <i className="bi bi-save me-2"></i>
                  Guardar y salir
                </Button>

                <Button
                  variant="success"
                  onClick={handleContinue}
                  className="continue-btn"
                  disabled={currentStep === 4}
                >
                  Continuar
                  <i className="bi bi-arrow-right ms-2"></i>
                </Button>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Vender;