import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button, Card, Navbar, Nav, NavDropdown, InputGroup } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';
import './Vender.css';
import AOS from 'aos';
import 'aos/dist/aos.css';
import peruUbigeo from '../Operaciones/peruUbigeo.json';
import axios from 'axios';

const Vender: React.FC = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [operationType] = useState<string>('venta');
  const [propertyType, setPropertyType] = useState<string>('');
  const [propertySubtype] = useState<string>('');
  const [userName, setUserName] = useState<string>('');
  // 
  // Estado para mensajes de error/éxito
  const [message, setMessage] = useState<{type: string, text: string} | null>(null);

  // Estado real de autenticación
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  interface User {
    name?: string;
    // Agrega aquí otras propiedades relevantes del usuario si las conoces
    // email?: string;
    // id?: number;
  }
  const [user, setUser] = useState<User | null>(null);

  // Verificar autenticación al iniciar
  useEffect(() => {
    // Inicializar AOS
    AOS.init({
      duration: 800,
      once: false
    });

    // Verificar si hay un usuario y token válidos
    const userData = localStorage.getItem('user');
    const token = localStorage.getItem('token');

    if (userData && token) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);    
        setUserName(parsedUser.name || 'usuario');
        setIsLoggedIn(true);
        
        // Verificar que el token es válido mediante una petición al backend
        axios.get('http://localhost:8080/api/clientes/me', {
          headers: {
            'Authorization': token.startsWith('Bearer ') ? token : `Bearer ${token}`
          }
        }).catch(error => {
          console.error("Error verificando sesión:", error);
          if (error.response && (error.response.status === 401 || error.response.status === 403)) {
            // Token inválido o expirado, redirigir al login
            localStorage.removeItem('token');
            setMessage({type: 'danger', text: 'Tu sesión ha expirado. Por favor, inicia sesión nuevamente.'});
            setTimeout(() => navigate('/login'), 2000);
          }
        });
      } catch (error) {
        console.error("Error al procesar datos de usuario:", error);
        setIsLoggedIn(false);
      }
    } else {
      setIsLoggedIn(false);
      // Si no hay sesión, redirigir al login
      setMessage({type: 'warning', text: 'Debes iniciar sesión para crear un inmueble'});
      setTimeout(() => navigate('/login'), 2000);
    }
  }, [navigate]);

  const handleLogout = () => {
    setIsLoggedIn(false);
    navigate('/login');
  };

  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});

  const validateForm = () => {
    const errors: { [key: string]: string } = {};
    if (!propertyType) {
      errors.propertyType = 'Selecciona el tipo de inmueble.';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleContinue = () => {
    if (validateForm()) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleSaveAndExit = () => {
    navigate('/mis-publicaciones');
  };

  const [region, setRegion] = useState('');
  const [address, setAddress] = useState('');
  const [province, setProvince] = useState('');
  const [district, setDistrict] = useState('');
  const [provinceOptions, setProvinceOptions] = useState<string[]>([]);
  const [districtOptions, setDistrictOptions] = useState<string[]>([]);
interface Inmueble {
  idInmueble: number;
  direccion: string;
  cliente?: {
    idCliente: number;
    email?: string;
    // Puedes agregar más propiedades si las necesitas
  };
  // Agrega aquí otras propiedades si las necesitas
}

const [inmueblesCreados, setInmueblesCreados] = useState<{ id: number, nombre: string }[]>([]);

useEffect(() => {
  const fetchInmuebles = async () => {
    try {
      const token = localStorage.getItem('token');
      const userData = localStorage.getItem('user');
      const user = userData ? JSON.parse(userData) : null;
      const authToken = token && token.startsWith('Bearer ') ? token : `Bearer ${token}`;
      const response = await axios.get('http://localhost:8080/api/inmuebles', {
        headers: { 'Authorization': authToken }
      });
      setInmueblesCreados(
        (response.data as Inmueble[])
          .filter(inm => {
            if (user?.rol === 'ROLE_CLIENTE') {
              // Filtra por email si es cliente
              return inm.cliente && inm.cliente.email === user.name;
            }
          })
          .map((inm) => ({
            id: inm.idInmueble,
            nombre: inm.direccion
          }))
      );
    } catch {
      setInmueblesCreados([]);
    }
  };
  fetchInmuebles();
}, []);

  useEffect(() => {
    if (region && peruUbigeo[region as keyof typeof peruUbigeo]) {
      setProvinceOptions(Object.keys(peruUbigeo[region as keyof typeof peruUbigeo]));
      setProvince('');
      setDistrict('');
    } else {
      setProvinceOptions([]);
      setProvince('');
      setDistrict('');
    }
  }, [region]);

  useEffect(() => {
    if (
      region &&
      province &&
      peruUbigeo[region as keyof typeof peruUbigeo] &&
      (peruUbigeo[region as keyof typeof peruUbigeo] as Record<string, string[]>)[province]
    ) {
      setDistrictOptions(
        (peruUbigeo[region as keyof typeof peruUbigeo] as Record<string, string[]>)[province]
      );
      setDistrict('');
    } else {
      setDistrictOptions([]);
      setDistrict('');
    }
  }, [region, province]);

  const [bedrooms, setBedrooms] = useState<number>(0);
  const [estado, setEstado] = useState<string>('disponible');
  const [area, setArea] = useState<number>(0);
  const [precio, setPrecio] = useState<number>(0);
  const [servicios, setServicios] = useState<string>('');

  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [uploadError, setUploadError] = useState<string>('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    if (uploadedFiles.length + files.length > 8) {
      setUploadError("Solo puedes subir un máximo de 8 archivos");
      return;
    }

    const totalSize = [...uploadedFiles, ...Array.from(files)].reduce(
      (acc, file) => acc + file.size, 0
    );
    if (totalSize > 500 * 1024 * 1024) {
      setUploadError("El tamaño total de los archivos no puede superar los 500MB");
      return;
    }

    setUploadError("");

    const newFiles = Array.from(files);
    setUploadedFiles([...uploadedFiles, ...newFiles]);
    const newPreviewUrls = newFiles.map(file => URL.createObjectURL(file));
    setPreviewUrls([...previewUrls, ...newPreviewUrls]);
  };

  // Aquí deberías cargar los inmuebles del usuario desde la API
  // const inmueblesCreados = [
  //   { id: 1, nombre: "Casa en Miraflores" },
  //   { id: 2, nombre: "Departamento en Surco" }
  // ];

  const [inmuebleSeleccionado, setInmuebleSeleccionado] = useState<string>("");

  // --- GUARDAR INMUEBLE ---
  const handleGuardarInmueble = async () => {
    try {
      setMessage({type: 'info', text: 'Guardando inmueble...'});
      const token = localStorage.getItem('token');
      if (!token) {
        setMessage({type: 'danger', text: 'No hay sesión activa. Inicia sesión para continuar.'});
        setTimeout(() => navigate('/login'), 2000);
        return;
      }
      if (!propertyType || !region || !province || !district) {
        setMessage({type: 'danger', text: 'Completa todos los campos obligatorios'});
        return;
      }

      // 1. Crear el inmueble (sin el campo imagenes)
      const inmuebleData = {
        area,
        direccion: address,
        distrito: district,
        estado: estado,
        fecha_registro: new Date().toISOString(),
        num_habitaciones: bedrooms,
        precio: precio,
        provincia: province,
        region: region,
        servicios: servicios,
        tipo: propertyType
      };

      const authToken = token.startsWith('Bearer ') ? token : `Bearer ${token}`;
      const response = await axios.post(
        'http://localhost:8080/api/inmuebles/crear',
        inmuebleData,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': authToken
          }
        }
      );

      // 2. Subir imágenes si hay archivos (con reintentos)
      if (response.data && response.data.idInmueble && uploadedFiles.length > 0) {

        setInmuebleSeleccionado(String(response.data.idInmueble));
        setMessage({type: 'info', text: 'Inmueble creado, subiendo imágenes...'});
        const formData = new FormData();
        uploadedFiles.forEach(file => {
          formData.append('imagenes', file);
        });

        let success = false, retries = 0;
        const maxRetries = 4;
        while (!success && retries < maxRetries) {
          try {
            await axios.post(
              `http://localhost:8080/api/inmuebles/${response.data.idInmueble}/imagenes`,
              formData,
              {
                headers: {
                  'Authorization': authToken,
                  'Content-Type': 'multipart/form-data'
                }
              }
            );
            setMessage({
              type: 'success', 
              text: '¡Inmueble e imágenes guardados exitosamente!'
            });
            success = true;
          } catch {
            retries++;
            if (retries < maxRetries) {
              await new Promise(res => setTimeout(res, 600)); // espera 600ms antes de reintentar
            } else {
              setMessage({
                type: 'warning', 
                text: 'El inmueble se creó correctamente, pero hubo un problema al subir las imágenes.'
              });
            }
          }
        }
      } else {
        setMessage({
          type: 'success', 
          text: '¡Inmueble guardado exitosamente!'
        });
      }

      setTimeout(() => {
        setCurrentStep(5);
        setMessage(null);
      }, 2000);

    } catch (error) {
      console.error('Error completo:', error);
      if (axios.isAxiosError(error)) {
        if (error.response) {
          if (error.response.status === 401) {
            setMessage({type: 'danger', text: 'Tu sesión ha expirado. Inicia sesión nuevamente.'});
            setTimeout(() => navigate('/login'), 1500);
          } else if (error.response.status === 403) {
            setMessage({
              type: 'danger', 
              text: 'No tienes permisos para crear inmuebles. Contacta al administrador.'
            });
          } else {
            setMessage({
              type: 'danger', 
              text: `Error: ${error.response.data.message || error.response.data || 'No se pudo crear el inmueble'}`
            });
          }
        } else {
          setMessage({type: 'danger', text: 'Error de conexión con el servidor'});
        }
      } else {
        setMessage({type: 'danger', text: 'Error inesperado al guardar el inmueble'});
      }
    }
  };

  const [titulo, setTitulo] = useState<string>('');
  const [descripcion, setDescripcion] = useState<string>('');

  return (
    <div className="vender-page">
      {/* Barra de Navegación */}
      <Navbar bg="white" expand="lg" className="w-100 border-bottom">
        <Container fluid className="px-4">
          <Navbar.Brand href="#">
            <img
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTm6ETphfVq-SfJmeaX42jYRIUxikXCNQvu56BxSPdkWxgHO2KAov9MXLWJRZWjbBgwOR4&usqp=CAU"
              alt="InmoMarket"
              height="30"
              className="d-inline-block align-top"
            />
            <span className="fw-bold"> InmoMarket</span>
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
                <div className="mega-menu-wrapper"></div>
              </div>
              <div className="nav-item mega-dropdown">
                <Nav.Link
                  as={Link}
                  to="/mis-favoritos"
                  className="nav-link-text"
                  id="favoritos-dropdown"
                >
                  Favoritos <i className="fas fa-chevron-down fa-xs"></i>
                </Nav.Link>
                <div className="mega-menu-wrapper"></div>
              </div>
              <div className="nav-item mega-dropdown">
                <Nav.Link
                  as={Link}
                  to="/chats"
                  className="nav-link-text"
                  id="chats-dropdown"
                >
                  Mis Chats <i className="fas fa-chevron-down fa-xs"></i>
                </Nav.Link>
                <div className="mega-menu-wrapper"></div>
              </div>
              <div className="nav-item mega-dropdown">
                <Nav.Link
                  as={Link}
                  to="/historial"
                  className="nav-link-text"
                  id="historial-dropdown"
                >
                  Historial <i className="fas fa-chevron-down fa-xs"></i>
                </Nav.Link>
                <div className="mega-menu-wrapper"></div>
              </div>
            </Nav>
            <Nav className="ms-auto">
              <Nav.Link href="#" className="me-2">
                <span className="nav-link-text">Notificaciones <i className="far fa-bell"></i></span>
              </Nav.Link>
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
                      document.body.click();
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
      {/* Progress Steps */}
      <div className="progress-steps-container">
        <div className="progress-bar-container">
          <div className="progress-bar" style={{ width: `${(currentStep / 5) * 100}%` }}></div>
        </div>
        <div className="steps-container">
          <div className={`step-item ${currentStep >= 1 ? 'active' : ''}`} onClick={() => setCurrentStep(1)}>
        <div className="step-number">
          <span>1</span>
          {currentStep > 1 && <i className="bi bi-check-lg"></i>}
        </div>
        <span className="step-title">Principales</span>
          </div>
          <div className={`step-item ${currentStep >= 2 ? 'active' : ''}`} onClick={() => setCurrentStep(2)}>
        <div className="step-number">
          <span>2</span>
          {currentStep > 2 && <i className="bi bi-check-lg"></i>}
        </div>
        <span className="step-title">Ubicación</span>
          </div>
          <div className={`step-item ${currentStep >= 3 ? 'active' : ''}`} onClick={() => setCurrentStep(3)}>
        <div className="step-number">
          <span>3</span>
          {currentStep > 3 && <i className="bi bi-check-lg"></i>}
        </div>
        <span className="step-title">Características</span>
          </div>
          <div className={`step-item ${currentStep >= 4 ? 'active' : ''}`} onClick={() => setCurrentStep(4)}>
        <div className="step-number">
          <span>4</span>
          {currentStep > 4 && <i className="bi bi-check-lg"></i>}
        </div>
        <span className="step-title">Fotos y videos</span>
          </div>
          <div className={`step-item ${currentStep >= 5 ? 'active' : ''}`} onClick={() => setCurrentStep(5)}>
        <div className="step-number">
          <span>5</span>
          {currentStep > 5 && <i className="bi bi-check-lg"></i>}
        </div>
        <span className="step-title">Publiquemos</span>
          </div>
        </div>
      </div>

      <Container className="vender-container mt-4">
        <Row>
          {/* Sidebar de navegación */}
          <Col md={3}>
        <Card className="sidebar-nav" data-aos="fade-right" style={{ minHeight: '300px' }}>
          <div className={`sidebar-item ${currentStep === 1 ? 'active' : ''}`} onClick={() => setCurrentStep(1)}>
            <i className="bi bi-house-door me-2"></i>
            Empecemos a crear tu inmueble
          </div>
          <div className={`sidebar-item ${currentStep === 2 ? 'active' : ''}`} onClick={() => setCurrentStep(2)}>
            <i className="bi bi-geo-alt me-2"></i>
            Ubicación
          </div>
          <div className={`sidebar-item ${currentStep === 3 ? 'active' : ''}`} onClick={() => setCurrentStep(3)}>
            <i className="bi bi-card-checklist me-2"></i>
            Características
          </div>
          <div className={`sidebar-item ${currentStep === 4 ? 'active' : ''}`} onClick={() => setCurrentStep(4)}>
            <i className="bi bi-image me-2"></i>
            Fotos y videos
          </div>
          <div className={`sidebar-item ${currentStep === 5 ? 'active' : ''}`} onClick={() => setCurrentStep(5)}>
            <i className="bi bi-send-check me-2"></i>
            Publiquemos
          </div>
            </Card>
            <Card className="mt-4" style={{ borderRadius: '16px', boxShadow: '0 2px 16px #0001', height: '160px' }}>
              <Card.Body>
                <Card.Title as="h6" className="mb-3 fw-bold">Detalle del aviso</Card.Title>
                <div className="mb-2 text-secondary">
                  <i className="bi bi-key me-2"></i>
                  {operationType === 'venta' ? 'Venta' : operationType.charAt(0).toUpperCase() + operationType.slice(1)}
                </div>
                <div className="mb-2 text-secondary">
                  <i className="bi bi-building me-2"></i>
                  {propertyType
                    ? `${propertyType.charAt(0).toUpperCase() + propertyType.slice(1)}${propertySubtype ? ' ' + propertySubtype.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) : ''}`
                    : 'Tipo de inmueble'}
                </div>
                <div className="mb-2 text-secondary">
                  <i className="bi bi-geo-alt me-2"></i>
                  {district ? district : 'Ubicación'}
                </div>
              </Card.Body>
            </Card>
          </Col>

          {/* Contenido principal */}
          <Col md={9}>
            <div className="main-content" data-aos="fade-up">
              <h2 className="greeting-text">¡Hola {userName}, empecemos a crear tu inmueble!</h2>

              {currentStep === 1 && (
                <div className="step-content" data-aos="fade-in">
                  <h3 className="mb-4">Cuéntanos, sobre tu Inmueble</h3>
                  <Form.Group className="mb-4">
                    <Form.Label>¿Quieres publicar un inmueble ya creado?</Form.Label>
                    <Form.Select
                      value={inmuebleSeleccionado}
                      onChange={e => {
                        setInmuebleSeleccionado(e.target.value);
                        if (e.target.value) {
                          setCurrentStep(5);
                        }
                      }}
                    >
                      <option value="">No, deseo crear uno nuevo</option>
                      {inmueblesCreados.map((inm) => (
                        <option key={inm.id} value={inm.id}>{inm.nombre}</option>
                      ))}
                    </Form.Select>
                    <Form.Text className="text-muted">
                      Si seleccionas un inmueble, irás directo a la publicación.
                    </Form.Text>
                  </Form.Group>
                  <Form.Group className="mb-4">
                    <Form.Label><i className="bi bi-tags me-2"></i>Tipo de operación</Form.Label>
                    <div className="operation-info-card">
                      <div className="d-flex align-items-center">
                        <div className="operation-icon">
                          <i className="bi bi-cash-coin"></i>
                        </div>
                        <div className="ms-3">
                          <h5 className="mb-1">Venta</h5>
                          <p className="text-muted mb-0">Estás creando un anuncio para vender tu inmueble</p>
                        </div>
                      </div>
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
                        </Form.Select>
                      </Form.Group>
                    </Col>
                  </Row>
                </div>
              )}

              {currentStep === 2 && (
                <div className="step-content" data-aos="fade-in">
                  <h3 className="mb-4">¿Dónde está ubicado tu inmueble?</h3>
                  <Form.Group className="mb-4">
                    <Form.Label>Ingresa la dirección del inmueble</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Ingresa una dirección"
                      onChange={(e) => {
                        setAddress(e.target.value);
                        if (formErrors.address) {
                          setFormErrors({ ...formErrors, address: '' });
                        }
                      }}
                      isInvalid={!!formErrors.address}
                    />
                    {formErrors.address && (
                      <Form.Control.Feedback type="invalid">
                        {formErrors.address}
                      </Form.Control.Feedback>
                    )}
                  </Form.Group>
                  <Row className="mb-4">
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label>Región</Form.Label>
                        <Form.Select
                          value={region}
                          onChange={(e) => {
                            setRegion(e.target.value);
                            if (formErrors.region) {
                              setFormErrors({ ...formErrors, region: '' });
                            }
                          }}
                          isInvalid={!!formErrors.region}
                        >
                          <option value="">Selecciona una región</option>
                          {Object.keys(peruUbigeo).map((reg) => (
                            <option key={reg} value={reg}>{reg}</option>
                          ))}
                        </Form.Select>
                        {formErrors.region && (
                          <Form.Control.Feedback type="invalid">
                            {formErrors.region}
                          </Form.Control.Feedback>
                        )}
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label>Provincia</Form.Label>
                        <Form.Select
                          value={province}
                          onChange={(e) => {
                            setProvince(e.target.value);
                            if (formErrors.province) {
                              setFormErrors({ ...formErrors, province: '' });
                            }
                          }}
                          disabled={!region}
                          isInvalid={!!formErrors.province}
                        >
                          <option value="">Selecciona una provincia</option>
                          {provinceOptions.map((prov) => (
                            <option key={prov} value={prov}>{prov}</option>
                          ))}
                        </Form.Select>
                        {formErrors.province && (
                          <Form.Control.Feedback type="invalid">
                            {formErrors.province}
                          </Form.Control.Feedback>
                        )}
                      </Form.Group>
                    </Col>
                  </Row>
                  <Row className="mb-4">
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label>Distrito</Form.Label>
                        <Form.Select
                          value={district}
                          onChange={(e) => {
                            setDistrict(e.target.value);
                            if (formErrors.district) {
                              setFormErrors({ ...formErrors, district: '' });
                            }
                          }}
                          disabled={!province}
                          isInvalid={!!formErrors.district}
                        >
                          <option value="">Selecciona un distrito</option>
                          {districtOptions.map((dist) => (
                            <option key={dist} value={dist}>{dist}</option>
                          ))}
                        </Form.Select>
                        {formErrors.district && (
                          <Form.Control.Feedback type="invalid">
                            {formErrors.district}
                          </Form.Control.Feedback>
                        )}
                      </Form.Group>
                    </Col>
                  </Row>
                  
                </div>
              )}

              {currentStep === 3 && (
                <div className="step-content" data-aos="fade-in">
                  <h3>Características principales</h3>
                  <p className="text-muted">Cuéntanos un poco más de tu inmueble.</p>
                  <Row className="mb-4">
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label>Numero de habitaciones</Form.Label>
                        <InputGroup>
                          <Button
                            variant="light"
                            onClick={() => setBedrooms(Math.max(0, bedrooms - 1))}
                          >-</Button>
                          <Form.Control
                            type="number"
                            value={bedrooms}
                            className="text-center"
                            readOnly
                          />
                          <Button
                            variant="light"
                            onClick={() => setBedrooms(bedrooms + 1)}
                          >+</Button>
                        </InputGroup>
                      </Form.Group>
                    </Col>
                  </Row>
                  <h4 className="mt-4 mb-3">Superficie</h4>
                  <Row className="mb-4">
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label>Área </Form.Label>
                        <InputGroup>
                          <Form.Control
                            type="number"
                            placeholder="0"
                            value={area}
                            onChange={e => setArea(Number(e.target.value))}
                          />
                          <Form.Select style={{ maxWidth: "80px" }}>
                            <option value="m2">m²</option>
                          </Form.Select>
                        </InputGroup>
                      </Form.Group>
                    </Col>
                  </Row>
                  <h4 className="mt-4">Precio</h4>
                  <div className="mb-4">
                    <Form.Label>Precio del inmueble</Form.Label>
                    <Row>
                      <Col md={6}>
                        <InputGroup className="mb-3">
                          <InputGroup.Text>S/.</InputGroup.Text>
                          <Form.Control
                            type="number"
                            placeholder="0"
                            min="0"
                            value={precio}
                            onChange={e => setPrecio(Number(e.target.value))}
                          />
                        </InputGroup>
                      </Col>
                    </Row>
                  </div>
                  <h4 className="mt-4">Estado</h4>
                  <div className="mb-4">
                    <Form.Group>
                      <Form.Label>Selecciona el estado del inmueble</Form.Label>
                      <Form.Select
                        value={estado}
                        onChange={(e) => setEstado(e.target.value)}
                      >
                        <option value="disponible">Disponible</option>
                        <option value="vendido">Vendido</option>
                      </Form.Select>
                    </Form.Group>
                  </div>
                  <h4 className="mt-4">Servicios</h4>
                  <p className="text-muted">Comenta con que servicios cuenta tu inmueble, ya sea agua, luz o gas.</p>
                  <div className="mb-4">
                    <Form.Group className="mb-3">
                      <Form.Control
                        type="text"
                        placeholder="Agua, luz, gas..."
                        value={servicios}
                        onChange={e => setServicios(e.target.value)}
                      />
                    </Form.Group>
                  </div>
                </div>
              )}

              {currentStep === 4 && (
                <div className="step-content" data-aos="fade-in">
                  <h3>Añade fotos y videos de tu propiedad</h3>
                  <p className="text-muted mb-4">Las imágenes de alta calidad aumentan el interés en tu propiedad.</p>
                  <Card className="mb-4 border-0 shadow-sm">
                    <Card.Body className="p-4">
                      <div className="file-upload-container text-center py-5">
                        <div className="upload-icon mb-3">
                          <i className="bi bi-cloud-arrow-up" style={{ fontSize: '2.5rem', color: '#6c757d' }}></i>
                        </div>
                        <h5 className="mb-3">Subir archivo</h5>
                        <div className="d-flex justify-content-center">
                          <Button
                            variant="primary"
                            className="position-relative"
                          >
                            <i className="bi bi-upload me-2"></i>
                            Elegir archivos
                            <Form.Control
                              type="file"
                              multiple
                              accept=".jpg,.jpeg,.png,.heic,.mp4"
                              className="position-absolute top-0 start-0 opacity-0 w-100 h-100"
                              style={{ cursor: 'pointer' }}
                              onChange={handleFileChange}
                            />
                          </Button>
                        </div>
                        <div className="mt-3 text-secondary">
                          <small>Máximo 8 archivos</small>
                        </div>
                        <div className="mt-4 text-secondary small">
                          Archivos JPG, JPEG, PNG, HEIC, mp3, mp4
                          <br />
                          (Máximo tamaño de archivos 500 MB)
                        </div>
                      </div>
                    </Card.Body>
                  </Card>
                  <div className="uploaded-files mb-4">
                    <h5 className="mb-3">Archivos subidos ({uploadedFiles.length}/8)</h5>
                    {uploadError && (
                      <div className="alert alert-danger">{uploadError}</div>
                    )}
                    <div className="file-preview-grid">
                      {uploadedFiles.length > 0 ? (
                        <Row className="g-3">
                          {previewUrls.map((url, index) => (
                            <Col xs={6} md={3} key={index}>
                              <div className="file-preview-item position-relative">
                                {uploadedFiles[index].type.includes('image') ? (
                                  <img src={url} alt={`Imagen ${index + 1}`} className="img-fluid rounded" />
                                ) : (
                                  <div className="video-preview rounded d-flex align-items-center justify-content-center">
                                    <i className="bi bi-film" style={{ fontSize: '2rem' }}></i>
                                  </div>
                                )}
                                <Button
                                  variant="danger"
                                  size="sm"
                                  className="position-absolute top-0 end-0 rounded-circle p-1"
                                  style={{ margin: '5px' }}
                                  onClick={() => {
                                    const newFiles = [...uploadedFiles];
                                    const newUrls = [...previewUrls];
                                    URL.revokeObjectURL(newUrls[index]);
                                    newFiles.splice(index, 1);
                                    newUrls.splice(index, 1);
                                    setUploadedFiles(newFiles);
                                    setPreviewUrls(newUrls);
                                  }}
                                >
                                  <i className="bi bi-x"></i>
                                </Button>
                              </div>
                            </Col>
                          ))}
                        </Row>
                      ) : (
                        <div className="empty-state text-center py-4 text-secondary">
                          <i className="bi bi-image me-2"></i>
                          Aún no has subido ningún archivo
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="tips-section alert alert-info">
                    <h5><i className="bi bi-lightbulb me-2"></i>Tips para buenas fotos</h5>
                    <ul className="mb-0">
                      <li>Utiliza luz natural para que los ambientes se vean más amplios</li>
                      <li>Muestra todos los ambientes para dar una idea completa de la propiedad</li>
                      <li>Asegúrate que las fotos estén nítidas y bien enfocadas</li>
                      <li>Para videos, mantén una filmación estable y enfoca los mejores ángulos</li>
                    </ul>
                  </div>
                  <div className="text-end mt-4">
                    <Form.Check
                      type="checkbox"
                      id="terms-check"
                      label="Certifico que tengo los derechos de todas las imágenes y videos subidos"
                      className="mb-3 d-inline-block"
                    />
                  </div>
                </div>
              )}

              {currentStep === 5 && (
                <div className="step-content" data-aos="fade-in">
                  <h3>¡Tu anuncio está listo para publicarse!</h3>
                  <p className="text-muted">Revisa toda la información antes de publicar tu inmueble.</p>
                  <div className="mb-4">
                    <Form.Group className="mb-3">
                      <Form.Label>Título</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Completa el título de tu aviso."
                        value={titulo}
                        onChange={e => setTitulo(e.target.value)}
                      />
                    </Form.Group>
                    <Form.Group>
                      <Form.Label>Descripción</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={4}
                        placeholder="Escribe un mínimo de 150 caracteres"
                        value={descripcion}
                        onChange={e => setDescripcion(e.target.value)}
                      />
                      <Form.Text className="text-end d-block">{descripcion.length}</Form.Text>
                    </Form.Group>
                  </div>
                  <Button
                    variant="success"
                    onClick={async () => {
                      if (!inmuebleSeleccionado) {
                        setMessage({type: 'danger', text: 'Selecciona un inmueble para publicar.'});
                        return;
                      }
                      if (titulo.trim().length < 5 || descripcion.trim().length < 20) {
                        setMessage({type: 'danger', text: 'Completa el título y una descripción suficiente.'});
                        return;
                      }
                      try {
                        const token = localStorage.getItem('token');
                        const authToken = token && token.startsWith('Bearer ') ? token : `Bearer ${token}`;
                        const publicacion = {
                          inmueble: { idInmueble: Number(inmuebleSeleccionado) },
                          titulo,
                          descripcion
                        };
                        await axios.post(
                          'http://localhost:8080/api/publicaciones/publicar',
                          publicacion,
                          {
                            headers: {
                              'Authorization': authToken,
                              'Content-Type': 'application/json'
                            }
                          }
                        );
                        setMessage({type: 'success', text: '¡Publicación creada exitosamente!'});
                        // Opcional: redirigir o limpiar campos
                      } catch {
                        setMessage({type: 'danger', text: 'Error al crear la publicación.'});
                      }
                    }}
                    className="continue-btn"
                  >
                    Publicar ahora
                    <i className="bi bi-check-circle ms-2"></i>
                  </Button>
                </div>
              )}

              {/* Mensaje de error/éxito */}
              {message && (
                <div className={`alert alert-${message.type} alert-dismissible fade show m-3`} role="alert">
                  {message.text}
                  <button type="button" className="btn-close" onClick={() => setMessage(null)}></button>
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
                {currentStep === 4 && (
                  <Button
                    variant="success"
                    onClick={handleGuardarInmueble}
                    className="continue-btn"
                  >
                    Guardar mi inmueble
                    <i className="bi bi-check-circle ms-2"></i>
                  </Button>
                )}
                {currentStep < 4 && (
                  <Button
                    variant="success"
                    onClick={handleContinue}
                    className="continue-btn"
                  >
                    Continuar
                    <i className="bi bi-arrow-right ms-2"></i>
                  </Button>
                )}
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
  };

export default Vender;