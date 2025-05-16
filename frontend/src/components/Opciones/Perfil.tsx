import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Card, ListGroup, Alert } from 'react-bootstrap';
import { motion, AnimatePresence } from 'framer-motion'; // Importar framer-motion para animaciones
import './Perfil.css';

const Perfil: React.FC = () => {
  // Estado para los datos del perfil
  const [profileData, setProfileData] = useState({
    nombre: '',
    apellido: '',
    documento: '',
    identificador: '',
    email: '',
    telefono: ''
  });

  // Estado para contraseñas
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // Estado para email
  const [emailData, setEmailData] = useState({
    currentEmail: '',
    newEmail: '',
    password: ''
  });

  // Estado para notificaciones
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    newListings: true,
    priceChanges: true,
    marketUpdates: false,
    promotions: false
  });

  // Estado para la sección activa
  const [activeSection, setActiveSection] = useState('datos');
  const [message, setMessage] = useState<{ type: string, text: string } | null>(null);

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
      setProfileData({
        nombre: user.name || 'Adrián',
        apellido: 'Sandoval Ballona',
        documento: '73666349',
        identificador: '102820971',
        email: 'adrian@inmomarket.com',
        telefono: '999888777'
      });

      setEmailData(prev => ({
        ...prev,
        currentEmail: 'adrian@inmomarket.com'
      }));
    }
  }, []);

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

  return (
    <motion.div
      className="perfil-fullscreen"
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
      transition={pageTransition}
    >
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
                          className="d-flex align-items-center sidebar-item"
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
                          className="mb-5"
                          initial={{ y: 20, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          transition={{ delay: 0.2, duration: 0.5 }}
                        >
                          <h4 className="text-primary mb-2">Personales</h4>
                          <p className="text-muted mb-4">Completa con tus datos personales.</p>

                          <Row>
                            <Col md={6} className="mb-3">
                              <Form.Group>
                                <Form.Label>Nombre</Form.Label>
                                <Form.Control
                                  type="text"
                                  name="nombre"
                                  value={profileData.nombre}
                                  onChange={handleInputChange}
                                />
                              </Form.Group>
                            </Col>

                            <Col md={6} className="mb-3">
                              <Form.Group>
                                <Form.Label>Apellido</Form.Label>
                                <Form.Control
                                  type="text"
                                  name="apellido"
                                  value={profileData.apellido}
                                  onChange={handleInputChange}
                                />
                              </Form.Group>
                            </Col>
                          </Row>

                          <Row>
                            <Col md={6} className="mb-3">
                              <Form.Group>
                                <Form.Label>Documento</Form.Label>
                                <Form.Control
                                  type="text"
                                  name="documento"
                                  value={profileData.documento}
                                  onChange={handleInputChange}
                                />
                              </Form.Group>
                            </Col>

                            <Col md={6} className="mb-3">
                              <Form.Group>
                                <Form.Label>Identificador</Form.Label>
                                <Form.Control
                                  type="text"
                                  name="identificador"
                                  value={profileData.identificador}
                                  readOnly
                                  className="bg-light"
                                />
                              </Form.Group>
                            </Col>
                          </Row>
                        </motion.section>

                        <motion.section
                          className="mb-5"
                          initial={{ y: 20, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          transition={{ delay: 0.4, duration: 0.5 }}
                        >
                          <h4 className="text-primary mb-2">Contacto</h4>
                          <p className="text-muted mb-4">
                            Estos datos son para que podamos enviarte información, ofertas y, si publicaste un aviso, para
                            que puedan contactarte.
                          </p>

                          <Row>
                            <Col md={6} className="mb-3">
                              <Form.Group>
                                <Form.Label>Email</Form.Label>
                                <Form.Control
                                  type="email"
                                  name="email"
                                  value={profileData.email}
                                  onChange={handleInputChange}
                                />
                              </Form.Group>
                            </Col>

                            <Col md={6} className="mb-3">
                              <Form.Group>
                                <Form.Label>Teléfono</Form.Label>
                                <Form.Control
                                  type="tel"
                                  name="telefono"
                                  value={profileData.telefono}
                                  onChange={handleInputChange}
                                />
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
                            className="btn btn-success px-4"
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
                      <h2 className="mb-4">Cambiar contraseña</h2>
                      <p className="text-muted mb-4">
                        Para cambiar tu contraseña, ingresa tu contraseña actual y luego la nueva contraseña dos veces.
                      </p>

                      <Form onSubmit={handlePasswordSubmit}>
                        <Row>
                          <Col md={6} className="mb-3">
                            <Form.Group>
                              <Form.Label>Contraseña actual</Form.Label>
                              <Form.Control
                                type="password"
                                name="currentPassword"
                                value={passwordData.currentPassword}
                                onChange={handlePasswordChange}
                                required
                              />
                            </Form.Group>
                          </Col>
                        </Row>

                        <Row>
                          <Col md={6} className="mb-3">
                            <Form.Group>
                              <Form.Label>Nueva contraseña</Form.Label>
                              <Form.Control
                                type="password"
                                name="newPassword"
                                value={passwordData.newPassword}
                                onChange={handlePasswordChange}
                                required
                              />
                              <Form.Text className="text-muted">
                                La contraseña debe tener al menos 8 caracteres e incluir letras y números
                              </Form.Text>
                            </Form.Group>
                          </Col>

                          <Col md={6} className="mb-3">
                            <Form.Group>
                              <Form.Label>Confirmar nueva contraseña</Form.Label>
                              <Form.Control
                                type="password"
                                name="confirmPassword"
                                value={passwordData.confirmPassword}
                                onChange={handlePasswordChange}
                                required
                              />
                            </Form.Group>
                          </Col>
                        </Row>

                        <div className="d-flex justify-content-end mt-4">
                          <button type="submit" className="btn btn-success px-4">
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
                      <h2 className="mb-4">Cambiar email</h2>
                      <p className="text-muted mb-4">
                        Para cambiar tu dirección de correo electrónico, ingresa tu nueva dirección y tu contraseña actual.
                        Enviaremos un correo de verificación a la nueva dirección.
                      </p>

                      <Form onSubmit={handleEmailSubmit}>
                        <Row>
                          <Col md={6} className="mb-3">
                            <Form.Group>
                              <Form.Label>Email actual</Form.Label>
                              <Form.Control
                                type="email"
                                value={emailData.currentEmail}
                                readOnly
                                className="bg-light"
                              />
                            </Form.Group>
                          </Col>

                          <Col md={6} className="mb-3">
                            <Form.Group>
                              <Form.Label>Nuevo email</Form.Label>
                              <Form.Control
                                type="email"
                                name="newEmail"
                                value={emailData.newEmail}
                                onChange={handleEmailChange}
                                required
                              />
                            </Form.Group>
                          </Col>
                        </Row>

                        <Row>
                          <Col md={6} className="mb-3">
                            <Form.Group>
                              <Form.Label>Contraseña actual (para confirmar)</Form.Label>
                              <Form.Control
                                type="password"
                                name="password"
                                value={emailData.password}
                                onChange={handleEmailChange}
                                required
                              />
                            </Form.Group>
                          </Col>
                        </Row>

                        <div className="d-flex justify-content-end mt-4">
                          <button type="submit" className="btn btn-success px-4">
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
                      <h2 className="mb-4">Ajustes de notificaciones</h2>
                      <p className="text-muted mb-4">
                        Personaliza cómo y cuándo quieres recibir notificaciones de InmoMarket.
                      </p>

                      <Form onSubmit={handleNotificationsSubmit}>
                        <section className="mb-4">
                          <h4 className="mb-3">Canales de notificación</h4>
                          <div className="mb-3 d-flex justify-content-between p-3 border-bottom">
                            <div>
                              <h5 className="mb-1">Email</h5>
                              <p className="text-muted mb-0">Recibir notificaciones por correo electrónico</p>
                            </div>
                            <Form.Check
                              type="switch"
                              name="emailNotifications"
                              checked={notificationSettings.emailNotifications}
                              onChange={handleNotificationChange}
                              className="fs-4"
                            />
                          </div>

                          <div className="mb-3 d-flex justify-content-between p-3 border-bottom">
                            <div>
                              <h5 className="mb-1">Notificaciones push</h5>
                              <p className="text-muted mb-0">Recibir notificaciones en tu navegador</p>
                            </div>
                            <Form.Check
                              type="switch"
                              name="pushNotifications"
                              checked={notificationSettings.pushNotifications}
                              onChange={handleNotificationChange}
                              className="fs-4"
                            />
                          </div>
                        </section>

                        <section className="mb-4">
                          <h4 className="mb-3">Tipos de notificaciones</h4>

                          <div className="mb-3 d-flex justify-content-between p-3 border-bottom">
                            <div>
                              <h5 className="mb-1">Nuevas propiedades</h5>
                              <p className="text-muted mb-0">Notificar cuando aparezcan nuevas propiedades que coincidan con tus búsquedas guardadas</p>
                            </div>
                            <Form.Check
                              type="switch"
                              name="newListings"
                              checked={notificationSettings.newListings}
                              onChange={handleNotificationChange}
                              className="fs-4"
                            />
                          </div>

                          <div className="mb-3 d-flex justify-content-between p-3 border-bottom">
                            <div>
                              <h5 className="mb-1">Cambios de precio</h5>
                              <p className="text-muted mb-0">Notificar cuando cambien los precios de propiedades en tu lista de favoritos</p>
                            </div>
                            <Form.Check
                              type="switch"
                              name="priceChanges"
                              checked={notificationSettings.priceChanges}
                              onChange={handleNotificationChange}
                              className="fs-4"
                            />
                          </div>

                          <div className="mb-3 d-flex justify-content-between p-3 border-bottom">
                            <div>
                              <h5 className="mb-1">Actualizaciones del mercado</h5>
                              <p className="text-muted mb-0">Recibir informes y tendencias del mercado inmobiliario</p>
                            </div>
                            <Form.Check
                              type="switch"
                              name="marketUpdates"
                              checked={notificationSettings.marketUpdates}
                              onChange={handleNotificationChange}
                              className="fs-4"
                            />
                          </div>

                          <div className="mb-3 d-flex justify-content-between p-3 border-bottom">
                            <div>
                              <h5 className="mb-1">Promociones y ofertas</h5>
                              <p className="text-muted mb-0">Recibir información sobre descuentos y ofertas especiales</p>
                            </div>
                            <Form.Check
                              type="switch"
                              name="promotions"
                              checked={notificationSettings.promotions}
                              onChange={handleNotificationChange}
                              className="fs-4"
                            />
                          </div>
                        </section>

                        <div className="d-flex justify-content-end mt-4">
                          <button type="submit" className="btn btn-success px-4">
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