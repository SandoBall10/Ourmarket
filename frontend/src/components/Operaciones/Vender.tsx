import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button, Card, Navbar, Nav, NavDropdown, InputGroup } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';
import './Vender.css';
import AOS from 'aos';
import 'aos/dist/aos.css';
import peruUbigeo from '../Operaciones/peruUbigeo.json'; // Ajusta la ruta si es necesario
import GoogleMapComponent from './MapaGoogle'; // Asegúrate de importar tu componente de mapa

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

  // Add to existing state variables
  const [formErrors, setFormErrors] = useState<{[key: string]: string}>({});

  // Add this function to handle validation
  const validateForm = () => {
    const errors: {[key: string]: string} = {};

    if (!propertyType) {
      errors.propertyType = 'Selecciona el tipo de inmueble.';
    }

    if (propertyType && !propertySubtype) {
      errors.propertySubtype = 'Selecciona el subtipo de inmueble.';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Continuar al siguiente paso
  const handleContinue = () => {
    if (validateForm()) {
      handleStepChange(currentStep + 1);
    }
  };

  // Guardar y salir
  const handleSaveAndExit = () => {
    // Lógica para guardar el progreso
    navigate('/mis-publicaciones');
  };

  const [department, setDepartment] = useState('');
  const [province, setProvince] = useState('');
  const [district, setDistrict] = useState('');
  const [urbanization, setUrbanization] = useState('');
  const [provinceOptions, setProvinceOptions] = useState<string[]>([]);
  const [districtOptions, setDistrictOptions] = useState<string[]>([]);

  // Cuando cambia el departamento, actualiza las provincias
  useEffect(() => {
    if (department && peruUbigeo[department as keyof typeof peruUbigeo]) {
      setProvinceOptions(Object.keys(peruUbigeo[department as keyof typeof peruUbigeo]));
      setProvince('');
      setDistrict('');
    } else {
      setProvinceOptions([]);
      setProvince('');
      setDistrict('');
    }
  }, [department]);

  // Nuevo useEffect para los distritos
  useEffect(() => {
    if (
      department &&
      province &&
      peruUbigeo[department as keyof typeof peruUbigeo] &&
      (peruUbigeo[department as keyof typeof peruUbigeo] as Record<string, string[]>)[province]
    ) {
      setDistrictOptions(
        (peruUbigeo[department as keyof typeof peruUbigeo] as Record<string, string[]>)[province]
      );
      setDistrict('');
    } else {
      setDistrictOptions([]);
      setDistrict('');
    }
  }, [department, province]);

  const [bedrooms, setBedrooms] = useState(0);
  const [bathrooms, setBathrooms] = useState(0);
  const [halfBathrooms, setHalfBathrooms] = useState(0);
  const [parkingSpaces, setParkingSpaces] = useState(0);

  // Agrega esto con los otros estados al inicio del componente
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [uploadError, setUploadError] = useState<string>('');

  // Agregar esta función dentro del componente
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    
    // Verificar límite de archivos
    if (uploadedFiles.length + files.length > 8) {
      setUploadError("Solo puedes subir un máximo de 8 archivos");
      return;
    }
    
    // Verificar tamaño (500MB en total)
    const totalSize = [...uploadedFiles, ...Array.from(files)].reduce(
      (acc, file) => acc + file.size, 0
    );
    if (totalSize > 500 * 1024 * 1024) {
      setUploadError("El tamaño total de los archivos no puede superar los 500MB");
      return;
    }
    
    setUploadError("");
    
    // Crear previsualizaciones
    const newFiles = Array.from(files);
    setUploadedFiles([...uploadedFiles, ...newFiles]);
    
    // Generar URLs para previsualización
    const newPreviewUrls = newFiles.map(file => URL.createObjectURL(file));
    setPreviewUrls([...previewUrls, ...newPreviewUrls]);
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

            {/* Detalle del aviso */}
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
              <h2 className="greeting-text">¡Hola {userName}, empecemos a crear tu aviso!</h2>

              {currentStep === 1 && (
                <div className="step-content" data-aos="fade-in">
                  <h3 className="mb-4">Cuéntanos, sobre tu Inmueble</h3>

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

                    <Col md={6}>
                      <Form.Group>
                        <Form.Label><i className="bi bi-building-add me-2"></i>Subtipo de inmueble</Form.Label>
                        <Form.Select
                          value={propertySubtype}
                          onChange={(e) => {
                            setPropertySubtype(e.target.value);
                            // Clear the error when user selects a value
                            if (formErrors.propertySubtype) {
                              setFormErrors({...formErrors, propertySubtype: ''});
                            }
                          }}
                          disabled={!propertyType}
                          isInvalid={!!formErrors.propertySubtype}
                        >
                          <option value="">Selecciona el subtipo de inmueble</option>
                          {propertyType === 'casa' && (
                            <>
                              <option value="casa_standard">Casa de campo</option>
                              <option value="casa_campo">Casa de ciudad</option>
                              <option value="casa_playa">Casa de playa</option>
                              <option value="duplex">Casa en condominio</option>
                              <option value="duplex">Casa en quinta</option>
                            </>
                          )}
                          {propertyType === 'departamento' && (
                            <>
                              <option value="depto_standard">Departamento de campo</option>
                              <option value="depto_standard">Departamento de ciudad</option>
                              <option value="depto_standard">Departamento de playa</option>
                              <option value="depto_standard">Departamento Loft</option>
                              <option value="penthouse">Departamento PentHouse</option>
                              <option value="loft">Minidepartamento</option>
                            </>
                          )}
                          {propertyType === 'terreno' && (
                            <>
                              <option value="terreno_comercial">Terreno Comercial</option>
                              <option value="terreno_campestre">Terreno campestre</option>
                              <option value="terreno_playa">Terreno de playa</option>
                              <option value="terreno_eriazo">Terreno eriazo</option>
                              <option value="terreno_industrial">Terreno industrial</option>
                              <option value="terreno_residencial">Terreno residencial</option>
                            </>
                          )}
                        </Form.Select>
                        {formErrors.propertySubtype && (
                          <Form.Control.Feedback type="invalid">
                            {formErrors.propertySubtype}
                          </Form.Control.Feedback>
                        )}
                      </Form.Group>
                    </Col>
                  </Row>
                </div>
              )}

              {currentStep === 2 && (
                <div className="step-content" data-aos="fade-in">
                  <h3 className="mb-4">¿Dónde está ubicado tu inmueble?</h3>
                  
                  <Form.Group className="mb-4">
                    <Form.Label>Ingresa calle y número</Form.Label>
                    <Form.Control 
                      type="text" 
                      placeholder="Ingresa una dirección"
                      onChange={(e) => {
                        // Add state handling for address
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
                        <Form.Label>Departamento</Form.Label>
                        <Form.Select
                          value={department}
                          onChange={(e) => {
                            setDepartment(e.target.value);
                            if (formErrors.department) {
                              setFormErrors({...formErrors, department: ''});
                            }
                          }}
                          isInvalid={!!formErrors.department}
                        >
                          <option value="">Selecciona un departamento</option>
                          {Object.keys(peruUbigeo).map((dept) => (
                            <option key={dept} value={dept}>{dept}</option>
                          ))}
                        </Form.Select>
                        {formErrors.department && (
                          <Form.Control.Feedback type="invalid">
                            {formErrors.department}
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
                              setFormErrors({...formErrors, province: ''});
                            }
                          }}
                          disabled={!department}
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
                              setFormErrors({...formErrors, district: ''});
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

                    <Col md={6}>
                      <Form.Group>
                        <Form.Label>Urbanización</Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="Ingresa la urbanización (opcional)"
                          value={urbanization}
                          onChange={(e) => {
                            setUrbanization(e.target.value);
                            if (formErrors.urbanization) {
                              setFormErrors({...formErrors, urbanization: ''});
                            }
                          }}
                          disabled={!district}
                          isInvalid={!!formErrors.urbanization}
                        />
                        {formErrors.urbanization && (
                          <Form.Control.Feedback type="invalid">
                            {formErrors.urbanization}
                          </Form.Control.Feedback>
                        )}
                      </Form.Group>
                    </Col>
                  </Row>
                  
                  {/* You might want to add a map component here */}
                  <div className="map-container mb-4">
                    <h5 className="mb-3">¿Cómo quieres mostrar tu ubicación?</h5>
                    <div className="d-flex mb-3">
                      <Form.Check 
                        type="radio"
                        id="location-exact"
                        name="location-type"
                        label="Exacta"
                        className="me-4"
                        defaultChecked
                      />
                      <Form.Check 
                        type="radio"
                        id="location-approximate"
                        name="location-type"
                        label="Aproximada"
                      />
                    </div>

                    <GoogleMapComponent 
                      address={`${district && district + ', '}${province && province + ', '}${department}`}
                      setCoordinates={(lat, lng) => {
                        // Guarda las coordenadas en el estado
                        console.log("Coordenadas seleccionadas:", lat, lng);
                      }}
                    />
                    
                    <div className="alert alert-info mt-3">
                      <i className="bi bi-info-circle me-2"></i>
                      Recuerda que al seleccionar "Aproximada" tu inmueble no aparecerá en el mapa de búsqueda
                    </div>
                  </div>
                </div>
              )}

              {currentStep === 3 && (
                <div className="step-content" data-aos="fade-in">
                  <h3>Características principales</h3>
                  <p className="text-muted">Cuéntanos un poco más de tu inmueble.</p>

                  <Row className="mb-4">
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label>Dormitorios (opcional)</Form.Label>
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

                    <Col md={6}>
                      <Form.Group>
                        <Form.Label>Baños (opcional)</Form.Label>
                        <InputGroup>
                          <Button 
                            variant="light" 
                            onClick={() => setBathrooms(Math.max(0, bathrooms - 1))}
                          >-</Button>
                          <Form.Control 
                            type="number" 
                            value={bathrooms}
                            className="text-center"
                            readOnly
                          />
                          <Button 
                            variant="light" 
                            onClick={() => setBathrooms(bathrooms + 1)}
                          >+</Button>
                        </InputGroup>
                      </Form.Group>
                    </Col>
                  </Row>

                  <Row className="mb-4">
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label>Medio baño (opcional)</Form.Label>
                        <InputGroup>
                          <Button 
                            variant="light" 
                            onClick={() => setHalfBathrooms(Math.max(0, halfBathrooms - 1))}
                          >-</Button>
                          <Form.Control 
                            type="number" 
                            value={halfBathrooms}
                            className="text-center"
                            readOnly
                          />
                          <Button 
                            variant="light" 
                            onClick={() => setHalfBathrooms(halfBathrooms + 1)}
                          >+</Button>
                        </InputGroup>
                      </Form.Group>
                    </Col>

                    <Col md={6}>
                      <Form.Group>
                        <Form.Label>Estacionamientos (opcional)</Form.Label>
                        <InputGroup>
                          <Button 
                            variant="light" 
                            onClick={() => setParkingSpaces(Math.max(0, parkingSpaces - 1))}
                          >-</Button>
                          <Form.Control 
                            type="number" 
                            value={parkingSpaces}
                            className="text-center"
                            readOnly
                          />
                          <Button 
                            variant="light" 
                            onClick={() => setParkingSpaces(parkingSpaces + 1)}
                          >+</Button>
                        </InputGroup>
                      </Form.Group>
                    </Col>
                  </Row>

                  <h4 className="mt-4 mb-3">Superficie</h4>
                  <Row className="mb-4">
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label>Área construida</Form.Label>
                        <InputGroup>
                          <Form.Control type="number" placeholder="0" />
                          <Form.Select style={{maxWidth: "80px"}}>
                            <option value="m2">m²</option>
                          </Form.Select>
                        </InputGroup>
                      </Form.Group>
                    </Col>

                    <Col md={6}>
                      <Form.Group>
                        <Form.Label>Área terreno</Form.Label>
                        <InputGroup>
                          <Form.Control type="number" placeholder="0" />
                          <Form.Select style={{maxWidth: "80px"}}>
                            <option value="m2">m²</option>
                          </Form.Select>
                        </InputGroup>
                      </Form.Group>
                    </Col>
                  </Row>

                  <h4 className="mt-4">Antigüedad</h4>
                  <div className="mb-4">
                    <Form.Check
                      type="radio"
                      id="nuevo"
                      name="antiguedad"
                      label="A estrenar"
                      className="mb-2"
                      defaultChecked
                    />
                    <Form.Check
                      type="radio"
                      id="anos"
                      name="antiguedad"
                      label="Años de antigüedad"
                      className="mb-2"
                    />
                    <Form.Check
                      type="radio"
                      id="construccion"
                      name="antiguedad"
                      label="En construcción"
                      className="mb-2"
                    />
                  </div>

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
                          />
                        </InputGroup>
                      </Col>
                      <Col md={6}>
                        <InputGroup>
                          <InputGroup.Text>USD</InputGroup.Text>
                          <Form.Control
                            type="number"
                            placeholder="0"
                            min="0"
                          />
                        </InputGroup>
                      </Col>
                    </Row>

                    <Form.Label>Mantenimiento (opcional)</Form.Label>
                    <InputGroup style={{maxWidth: "250px"}}>
                      <InputGroup.Text>S/.</InputGroup.Text>
                      <Form.Control
                        type="number"
                        placeholder="0"
                        min="0"
                      />
                    </InputGroup>
                  </div>

                  <h4 className="mt-4">Describe el inmueble</h4>
                  <p className="text-muted">Asegúrate de incluir el tipo de inmueble y el tipo de operación de tu aviso.</p>
                  <div className="mb-4">
                    <Form.Group className="mb-3">
                      <Form.Label>Título</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Completa el título de tu aviso."
                      />
                    </Form.Group>

                    <Form.Group>
                      <Form.Label>Descripción</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={4}
                        placeholder="Escribe un mínimo de 150 caracteres"
                      />
                      <Form.Text className="text-end d-block">0</Form.Text>
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
                  
                  {/* Preview area for uploaded files */}
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
                                    <i className="bi bi-film" style={{fontSize: '2rem'}}></i>
                                  </div>
                                )}
                                <Button 
                                  variant="danger"
                                  size="sm"
                                  className="position-absolute top-0 end-0 rounded-circle p-1"
                                  style={{margin: '5px'}}
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

                {currentStep === 4 ? (
                  <Button
                    variant="success"
                    onClick={() => {
                      // Aquí puedes agregar la lógica para publicar el anuncio
                      // Por ejemplo: handlePublish()
                    }}
                    className="continue-btn"
                  >
                    Publicar
                    <i className="bi bi-check-circle ms-2"></i>
                  </Button>
                ) : (
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