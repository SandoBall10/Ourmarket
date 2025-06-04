import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Card, ListGroup, Alert, InputGroup, Navbar, Nav, NavDropdown, Button } from 'react-bootstrap';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import './Perfil.css';

const Perfil: React.FC = () => {
  const location = useLocation();
  // Estado para los datos del perfil y navegación
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState({
    nombre: '',
    apellido: '',
    documento: '',
    identificador: '',
    email: '',
    telefono: ''
  });

  // Estados existentes
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [emailData, setEmailData] = useState({
    currentEmail: '',
    newEmail: '',
    password: ''
  });

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    newListings: true,
    priceChanges: true,
    marketUpdates: false,
    promotions: false
  });

  const [activeSection, setActiveSection] = useState<string>(
    location.state && location.state.activeSection ? location.state.activeSection : 'datos'
  );
  const [message, setMessage] = useState<{ type: string, text: string } | null>(null);
  
  // Estado para el usuario logueado
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<any>(null);

  // Efecto de entrada para animaciones
  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    in: { opacity: 1, y: 0 },
    out: { opacity: 0, y: -20 }
  };

  const pageTransition = {
    type: "tween",
    ease: "anticipate",
    duration: 0.5
  };

  const sidebarItemVariants = {
    hover: {
      x: 5,
      transition: { duration: 0.3 }
    }
  };

  const listItemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: (i: number) => ({
      opacity: 1,
      x: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5
      }
    })
  };

  // Cargar datos del usuario desde localStorage o API
  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      const user = JSON.parse(userData);
      setUser(user);
      setIsLoggedIn(true);
      setProfileData({
        nombre: user.name || '',
        apellido: '',
        documento: '',
        identificador: '',
        email: '',
        telefono: ''
      });

      setEmailData(prev => ({
        ...prev,
        currentEmail: ''
      }));
    }
  }, []);

  // Asegúrate de que el useEffect se ejecute cuando el location.state cambie
  useEffect(() => {
    if (location.state && location.state.activeSection) {
      setActiveSection(location.state.activeSection);
    }
  }, [location.state]);

  // Handlers existentes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEmailData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleNotificationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setNotificationSettings(prev => ({
      ...prev,
      [name]: checked
    }));
  };

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Aquí irían las llamadas a API para actualizar perfil
    setMessage({
      type: 'success',
      text: 'Perfil actualizado correctamente'
    });

    setTimeout(() => {
      setMessage(null);
    }, 3000);
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage({
        type: 'danger',
        text: 'Las contraseñas no coinciden'
      });
      return;
    }

    // Aquí irían las llamadas a API para cambiar contraseña
    setMessage({
      type: 'success',
      text: 'Contraseña actualizada correctamente'
    });

    // Reiniciar campos
    setPasswordData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });

    setTimeout(() => {
      setMessage(null);
    }, 3000);
  };

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Aquí irían las llamadas a API para cambiar email
    setMessage({
      type: 'success',
      text: 'Email actualizado correctamente. Se ha enviado un correo de verificación.'
    });

    // Reiniciar campos
    setEmailData(prev => ({
      currentEmail: prev.newEmail,
      newEmail: '',
      password: ''
    }));

    setTimeout(() => {
      setMessage(null);
    }, 3000);
  };

  const handleNotificationsSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Aquí irían las llamadas a API para actualizar preferencias
    setMessage({
      type: 'success',
      text: 'Preferencias de notificaciones actualizadas'
    });

    setTimeout(() => {
      setMessage(null);
    }, 3000);
  };
  
  // Función para manejar el cierre de sesión
  const handleLogout = () => {
    // Limpiar localStorage y redirigir a login
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    setUser(null);
    navigate('/login');
  };

  return (
    <motion.div
      className="perfil-fullscreen"
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
      transition={pageTransition}
    >
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
                        {user.name.charAt(0).toUpperCase()}
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
                  <NavDropdown.Item as={Link} to="/favoritos" className="dropdown-item-custom">
                    <div className="icon-wrapper"><i className="far fa-heart"></i></div>
                    <span>Favoritos</span>
                  </NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="/chats" className="dropdown-item-custom">
                    <div className="icon-wrapper"><i className="far fa-comments"></i></div>
                    <span>Mis chats</span>
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
                  <NavDropdown.Item as={Link} to="/compradores" className="dropdown-item-custom">
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

      {/* Contenido original del perfil */}
      <Container fluid className="profile-container h-100 py-4">
        <Row className="h-100">
          {/* Sidebar de navegación con animaciones */}
          <Col md={3} lg={2} className="mb-4">
            <motion.div
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="h-100"
            >
              <Card className="profile-sidebar sticky-top">
                <Card.Header className="sidebar-header bg-primary text-white">
                  <i className="bi bi-person-circle me-2"></i> Mi perfil
                </Card.Header>
                <ListGroup variant="flush">
                  {[
                    { id: 'datos', icon: 'bi-person-vcard', label: 'Datos' },
                    { id: 'password', icon: 'bi-key', label: 'Cambiar contraseña' },
                    { id: 'email', icon: 'bi-envelope', label: 'Cambiar email' },
                    { id: 'notificaciones', icon: 'bi-bell', label: 'Ajustes de notificaciones' }
                  ].map((item, index) => (
                    <motion.div
                      key={item.id}
                      custom={index}
                      initial="hidden"
                      animate="visible"
                      variants={listItemVariants}
                    >
                      <motion.div
                        whileHover="hover"
                        variants={sidebarItemVariants}
                      >
                        <ListGroup.Item
                          active={activeSection === item.id}
                          onClick={() => setActiveSection(item.id)}
                          className={`d-flex align-items-center sidebar-item ${activeSection === item.id ? 'active-sidebar-item' : ''}`}
                        >
                          <i className={`bi ${item.icon} me-2`}></i>
                          {item.label}
                        </ListGroup.Item>
                      </motion.div>
                    </motion.div>
                  ))}
                </ListGroup>
              </Card>
            </motion.div>
          </Col>

          {/* Contenido principal con animaciones */}
          <Col md={9} lg={10}>
            <motion.div
              className="profile-content-container h-100"
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="profile-content p-4">
                <AnimatePresence mode="wait">
                  {message && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Alert variant={message.type} className="mb-4">
                        {message.text}
                      </Alert>
                    </motion.div>
                  )}
                </AnimatePresence>

                <AnimatePresence mode="wait">
                  {/* SECCIÓN DE DATOS PERSONALES */}
                  {activeSection === 'datos' && (
                    <motion.div
                      key="datos"
                      initial="initial"
                      animate="in"
                      exit="out"
                      variants={pageVariants}
                      transition={pageTransition}
                    >
                      <h2 className="mb-4 section-title">
                        <span className="title-icon"><i className="bi bi-person-vcard"></i></span>
                        Datos
                      </h2>

                      <Form onSubmit={handleProfileSubmit}>
                        <motion.section
                          className="profile-section mb-5"
                          initial={{ y: 20, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          transition={{ delay: 0.2, duration: 0.5 }}
                        >
                          <h4 className="section-subtitle">Personales</h4>
                          <p className="text-muted mb-4">Completa con tus datos personales.</p>

                          <Row>
                            <Col md={6} className="mb-3">
                              <Form.Group>
                                <Form.Label>Nombre</Form.Label>
                                <InputGroup className="input-group-custom">
                                  <InputGroup.Text className="input-icon-wrapper">
                                    <i className="bi bi-person-fill"></i>
                                  </InputGroup.Text>
                                  <Form.Control
                                    type="text"
                                    name="nombre"
                                    value={profileData.nombre}
                                    onChange={handleInputChange}
                                    className="form-control-with-icon"
                                  />
                                </InputGroup>
                              </Form.Group>
                            </Col>

                            <Col md={6} className="mb-3">
                              <Form.Group>
                                <Form.Label>Apellido</Form.Label>
                                <InputGroup className="input-group-custom">
                                  <InputGroup.Text className="input-icon-wrapper">
                                    <i className="bi bi-person-badge"></i>
                                  </InputGroup.Text>
                                  <Form.Control
                                    type="text"
                                    name="apellido"
                                    value={profileData.apellido}
                                    onChange={handleInputChange}
                                    className="form-control-with-icon"
                                  />
                                </InputGroup>
                              </Form.Group>
                            </Col>
                          </Row>

                          <Row>
                            <Col md={6} className="mb-3">
                              <Form.Group>
                                <Form.Label>Documento</Form.Label>
                                <InputGroup className="input-group-custom">
                                  <InputGroup.Text className="input-icon-wrapper">
                                    <i className="bi bi-card-text"></i>
                                  </InputGroup.Text>
                                  <Form.Control
                                    type="text"
                                    name="documento"
                                    value={profileData.documento}
                                    onChange={handleInputChange}
                                    className="form-control-with-icon"
                                  />
                                </InputGroup>
                              </Form.Group>
                            </Col>

                            <Col md={6} className="mb-3">
                              <Form.Group>
                                <Form.Label>Identificador</Form.Label>
                                <InputGroup className="input-group-custom">
                                  <InputGroup.Text className="input-icon-wrapper">
                                    <i className="bi bi-hash"></i>
                                  </InputGroup.Text>
                                  <Form.Control
                                    type="text"
                                    name="identificador"
                                    value={profileData.identificador}
                                    readOnly
                                    className="form-control-with-icon bg-light"
                                  />
                                </InputGroup>
                              </Form.Group>
                            </Col>
                          </Row>
                        </motion.section>

                        <motion.section
                          className="profile-section mb-5"
                          initial={{ y: 20, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          transition={{ delay: 0.4, duration: 0.5 }}
                        >
                          <h4 className="section-subtitle">Contacto</h4>
                          <p className="text-muted mb-4">
                            Estos datos son para que podamos enviarte información, ofertas y, si publicaste un aviso, para
                            que puedan contactarte.
                          </p>

                          <Row>
                            <Col md={6} className="mb-3">
                              <Form.Group>
                                <Form.Label>Email</Form.Label>
                                <InputGroup className="input-group-custom">
                                  <InputGroup.Text className="input-icon-wrapper">
                                    <i className="bi bi-envelope-fill"></i>
                                  </InputGroup.Text>
                                  <Form.Control
                                    type="email"
                                    name="email"
                                    value={profileData.email}
                                    onChange={handleInputChange}
                                    className="form-control-with-icon"
                                  />
                                </InputGroup>
                              </Form.Group>
                            </Col>

                            <Col md={6} className="mb-3">
                              <Form.Group>
                                <Form.Label>Teléfono</Form.Label>
                                <InputGroup className="input-group-custom">
                                  <InputGroup.Text className="input-icon-wrapper">
                                    <i className="bi bi-telephone-fill"></i>
                                  </InputGroup.Text>
                                  <Form.Control
                                    type="tel"
                                    name="telefono"
                                    value={profileData.telefono}
                                    onChange={handleInputChange}
                                    className="form-control-with-icon"
                                  />
                                </InputGroup>
                              </Form.Group>
                            </Col>
                          </Row>
                        </motion.section>

                        <motion.div
                          className="d-flex justify-content-end"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.6, duration: 0.5 }}
                        >
                          <motion.button
                            type="submit"
                            className="btn btn-primary px-4"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <i className="bi bi-check-circle me-2"></i>
                            Guardar cambios
                          </motion.button>
                        </motion.div>
                      </Form>
                    </motion.div>
                  )}

                  {/* SECCIÓN DE CAMBIO DE CONTRASEÑA */}
                  {activeSection === 'password' && (
                    <motion.div
                      key="password"
                      initial="initial"
                      animate="in"
                      exit="out"
                      variants={pageVariants}
                      transition={pageTransition}
                    >
                      <h2 className="mb-4 section-title">
                        <span className="title-icon"><i className="bi bi-key"></i></span>
                        Cambiar contraseña
                      </h2>
                      <p className="text-muted mb-4">
                        Para cambiar tu contraseña, ingresa tu contraseña actual y luego la nueva contraseña dos veces.
                      </p>

                      <Form onSubmit={handlePasswordSubmit}>
                        <Row>
                          <Col md={6} className="mb-3">
                            <Form.Group>
                              <Form.Label>Contraseña actual</Form.Label>
                              <InputGroup className="input-group-custom">
                                <InputGroup.Text className="input-icon-wrapper">
                                  <i className="bi bi-lock-fill"></i>
                                </InputGroup.Text>
                                <Form.Control
                                  type="password"
                                  name="currentPassword"
                                  value={passwordData.currentPassword}
                                  onChange={handlePasswordChange}
                                  className="form-control-with-icon"
                                  required
                                />
                              </InputGroup>
                            </Form.Group>
                          </Col>
                        </Row>

                        <Row>
                          <Col md={6} className="mb-3">
                            <Form.Group>
                              <Form.Label>Nueva contraseña</Form.Label>
                              <InputGroup className="input-group-custom">
                                <InputGroup.Text className="input-icon-wrapper">
                                  <i className="bi bi-key-fill"></i>
                                </InputGroup.Text>
                                <Form.Control
                                  type="password"
                                  name="newPassword"
                                  value={passwordData.newPassword}
                                  onChange={handlePasswordChange}
                                  className="form-control-with-icon"
                                  required
                                />
                              </InputGroup>
                              <Form.Text className="text-muted mt-2">
                                <i className="bi bi-info-circle me-1"></i> La contraseña debe tener al menos 8 caracteres e incluir letras y números
                              </Form.Text>
                            </Form.Group>
                          </Col>

                          <Col md={6} className="mb-3">
                            <Form.Group>
                              <Form.Label>Confirmar nueva contraseña</Form.Label>
                              <InputGroup className="input-group-custom">
                                <InputGroup.Text className="input-icon-wrapper">
                                  <i className="bi bi-check-circle-fill"></i>
                                </InputGroup.Text>
                                <Form.Control
                                  type="password"
                                  name="confirmPassword"
                                  value={passwordData.confirmPassword}
                                  onChange={handlePasswordChange}
                                  className="form-control-with-icon"
                                  required
                                />
                              </InputGroup>
                            </Form.Group>
                          </Col>
                        </Row>

                        <div className="d-flex justify-content-end mt-4">
                          <button type="submit" className="btn btn-primary px-4">
                            <i className="bi bi-key me-2"></i>
                            Cambiar contraseña
                          </button>
                        </div>
                      </Form>
                    </motion.div>
                  )}

                  {/* SECCIÓN DE CAMBIO DE EMAIL */}
                  {activeSection === 'email' && (
                    <motion.div
                      key="email"
                      initial="initial"
                      animate="in"
                      exit="out"
                      variants={pageVariants}
                      transition={pageTransition}
                    >
                      <h2 className="mb-4 section-title">
                        <span className="title-icon"><i className="bi bi-envelope"></i></span>
                        Cambiar email
                      </h2>
                      <p className="text-muted mb-4">
                        Para cambiar tu dirección de correo electrónico, ingresa tu nueva dirección y tu contraseña actual.
                        Enviaremos un correo de verificación a la nueva dirección.
                      </p>

                      <Form onSubmit={handleEmailSubmit}>
                        <Row>
                          <Col md={6} className="mb-3">
                            <Form.Group>
                              <Form.Label>Email actual</Form.Label>
                              <InputGroup className="input-group-custom">
                                <InputGroup.Text className="input-icon-wrapper">
                                  <i className="bi bi-envelope-fill"></i>
                                </InputGroup.Text>
                                <Form.Control
                                  type="email"
                                  value={emailData.currentEmail}
                                  readOnly
                                  className="form-control-with-icon bg-light"
                                />
                              </InputGroup>
                            </Form.Group>
                          </Col>

                          <Col md={6} className="mb-3">
                            <Form.Group>
                              <Form.Label>Nuevo email</Form.Label>
                              <InputGroup className="input-group-custom">
                                <InputGroup.Text className="input-icon-wrapper">
                                  <i className="bi bi-envelope-plus-fill"></i>
                                </InputGroup.Text>
                                <Form.Control
                                  type="email"
                                  name="newEmail"
                                  value={emailData.newEmail}
                                  onChange={handleEmailChange}
                                  className="form-control-with-icon"
                                  required
                                />
                              </InputGroup>
                            </Form.Group>
                          </Col>
                        </Row>

                        <Row>
                          <Col md={6} className="mb-3">
                            <Form.Group>
                              <Form.Label>Contraseña actual (para confirmar)</Form.Label>
                              <InputGroup className="input-group-custom">
                                <InputGroup.Text className="input-icon-wrapper">
                                  <i className="bi bi-shield-lock-fill"></i>
                                </InputGroup.Text>
                                <Form.Control
                                  type="password"
                                  name="password"
                                  value={emailData.password}
                                  onChange={handleEmailChange}
                                  className="form-control-with-icon"
                                  required
                                />
                              </InputGroup>
                            </Form.Group>
                          </Col>
                        </Row>

                        <div className="d-flex justify-content-end mt-4">
                          <button type="submit" className="btn btn-primary px-4">
                            <i className="bi bi-envelope-check me-2"></i>
                            Cambiar email
                          </button>
                        </div>
                      </Form>
                    </motion.div>
                  )}

                  {/* SECCIÓN DE NOTIFICACIONES */}
                  {activeSection === 'notificaciones' && (
                    <motion.div
                      key="notificaciones"
                      initial="initial"
                      animate="in"
                      exit="out"
                      variants={pageVariants}
                      transition={pageTransition}
                    >
                      <h2 className="mb-4 section-title">
                        <span className="title-icon"><i className="bi bi-bell"></i></span>
                        Ajustes de notificaciones
                      </h2>
                      <p className="text-muted mb-4">
                        Personaliza cómo y cuándo quieres recibir notificaciones.
                      </p>

                      <Form onSubmit={handleNotificationsSubmit}>
                        <section className="mb-4 profile-section">
                          <div className="section-subtitle-container mb-3">
                            <i className="bi bi-megaphone-fill me-2 text-primary"></i>
                            <h4 className="section-subtitle mb-0">Canales de notificación</h4>
                          </div>
                          
                          <div className="mb-3 d-flex justify-content-between p-3 border-bottom notification-item">
                            <div className="d-flex align-items-center">
                              <div className="notification-icon-wrapper me-3">
                                <i className="bi bi-envelope-paper text-primary fs-4"></i>
                              </div>
                              <div>
                                <h5 className="mb-1">Email</h5>
                                <p className="text-muted mb-0">Recibir notificaciones por correo electrónico</p>
                              </div>
                            </div>
                            <Form.Check
                              type="switch"
                              name="emailNotifications"
                              checked={notificationSettings.emailNotifications}
                              onChange={handleNotificationChange}
                              className="fs-4 custom-switch"
                            />
                          </div>

                          <div className="mb-3 d-flex justify-content-between p-3 border-bottom notification-item">
                            <div className="d-flex align-items-center">
                              <div className="notification-icon-wrapper me-3">
                                <i className="bi bi-phone-vibrate text-primary fs-4"></i>
                              </div>
                              <div>
                                <h5 className="mb-1">Notificaciones push</h5>
                                <p className="text-muted mb-0">Recibir notificaciones en tu navegador</p>
                              </div>
                            </div>
                            <Form.Check
                              type="switch"
                              name="pushNotifications"
                              checked={notificationSettings.pushNotifications}
                              onChange={handleNotificationChange}
                              className="fs-4 custom-switch"
                            />
                          </div>
                        </section>

                        <section className="mb-4 profile-section">
                          <div className="section-subtitle-container mb-3">
                            <i className="bi bi-filter-square-fill me-2 text-primary"></i>
                            <h4 className="section-subtitle mb-0">Tipos de notificaciones</h4>
                          </div>

                          <div className="mb-3 d-flex justify-content-between p-3 border-bottom notification-item">
                            <div className="d-flex align-items-center">
                              <div className="notification-icon-wrapper me-3">
                                <i className="bi bi-house-add text-primary fs-4"></i>
                              </div>
                              <div>
                                <h5 className="mb-1">Nuevas propiedades</h5>
                                <p className="text-muted mb-0">Notificar cuando aparezcan nuevas propiedades que coincidan con tus búsquedas guardadas</p>
                              </div>
                            </div>
                            <Form.Check
                              type="switch"
                              name="newListings"
                              checked={notificationSettings.newListings}
                              onChange={handleNotificationChange}
                              className="fs-4 custom-switch"
                            />
                          </div>

                          <div className="mb-3 d-flex justify-content-between p-3 border-bottom notification-item">
                            <div className="d-flex align-items-center">
                              <div className="notification-icon-wrapper me-3">
                                <i className="bi bi-currency-dollar text-primary fs-4"></i>
                              </div>
                              <div>
                                <h5 className="mb-1">Cambios de precio</h5>
                                <p className="text-muted mb-0">Notificar cuando cambien los precios de propiedades en tu lista de favoritos</p>
                              </div>
                            </div>
                            <Form.Check
                              type="switch"
                              name="priceChanges"
                              checked={notificationSettings.priceChanges}
                              onChange={handleNotificationChange}
                              className="fs-4 custom-switch"
                            />
                          </div>

                          <div className="mb-3 d-flex justify-content-between p-3 border-bottom notification-item">
                            <div className="d-flex align-items-center">
                              <div className="notification-icon-wrapper me-3">
                                <i className="bi bi-bar-chart-line text-primary fs-4"></i>
                              </div>
                              <div>
                                <h5 className="mb-1">Actualizaciones del mercado</h5>
                                <p className="text-muted mb-0">Recibir informes y tendencias del mercado inmobiliario</p>
                              </div>
                            </div>
                            <Form.Check
                              type="switch"
                              name="marketUpdates"
                              checked={notificationSettings.marketUpdates}
                              onChange={handleNotificationChange}
                              className="fs-4 custom-switch"
                            />
                          </div>

                          <div className="mb-3 d-flex justify-content-between p-3 border-bottom notification-item">
                            <div className="d-flex align-items-center">
                              <div className="notification-icon-wrapper me-3">
                                <i className="bi bi-gift-fill text-primary fs-4"></i>
                              </div>
                              <div>
                                <h5 className="mb-1">Promociones y ofertas</h5>
                                <p className="text-muted mb-0">Recibir información sobre descuentos y ofertas especiales</p>
                              </div>
                            </div>
                            <Form.Check
                              type="switch"
                              name="promotions"
                              checked={notificationSettings.promotions}
                              onChange={handleNotificationChange}
                              className="fs-4 custom-switch"
                            />
                          </div>
                        </section>

                        <div className="d-flex justify-content-end mt-4">
                          <button type="submit" className="btn btn-primary px-4">
                            <i className="bi bi-save me-2"></i>
                            Guardar preferencias
                          </button>
                        </div>
                      </Form>
                    </motion.div>
                  )}

                </AnimatePresence>
              </div>
            </motion.div>
          </Col>
        </Row>
      </Container>
    </motion.div>
  );
};

export default Perfil;