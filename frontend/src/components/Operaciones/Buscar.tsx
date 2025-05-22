import React, { useState, useEffect, useRef } from 'react';
import { Navbar, Container, Nav, Form, Button, Card, Badge, NavDropdown, Row, Col, InputGroup } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import './Buscar.css';
import AOS from 'aos';
import 'aos/dist/aos.css';

// Mover la interfaz User fuera del componente
interface User {
  name?: string;
  // Otras propiedades del usuario
}

interface Publicacion {
  id: number;
  tipo: 'casa' | 'departamento' | 'terreno';
  titulo: string;
  precio: number;
  ubicacion: string;
  metros: number;
  habitaciones?: number;
  banos?: number;
  imagen: string;
  estado: 'activa' | 'vendida' | 'reservada';
}

const Buscar: React.FC = () => {
  const navigate = useNavigate();
  const [publicaciones, setPublicaciones] = useState<Publicacion[]>([]);
  const [filtroTipo, setFiltroTipo] = useState<string>('todos');
  const [filtroEstado, setFiltroEstado] = useState<string>('todos');
  const [busqueda, setBusqueda] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  // Estados para la autenticación
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);

  // Estados para el menú desplegable de tipo de propiedad
  const [showTipoDropdown, setShowTipoDropdown] = useState<boolean>(false);
  const [selectedTipos, setSelectedTipos] = useState<{[key: string]: boolean}>({
    casa: false,
    terreno: false
  });
  
  // Ref para cerrar el dropdown al hacer clic fuera
  const tipoDropdownRef = useRef<HTMLDivElement>(null);

  // Estados para el menú desplegable de dormitorios
  const [showDormitoriosDropdown, setShowDormitoriosDropdown] = useState<boolean>(false);
  const [selectedDormitorios, setSelectedDormitorios] = useState<string>('');

  // Ref para cerrar el dropdown al hacer clic fuera
  const dormitoriosDropdownRef = useRef<HTMLDivElement>(null);

  // Agrega estos estados para el menú desplegable de precio
  const [showPrecioDropdown, setShowPrecioDropdown] = useState<boolean>(false);
  const [moneda, setMoneda] = useState<string>('soles');
  const [precioDesde, setPrecioDesde] = useState<string>('');
  const [precioHasta, setPrecioHasta] = useState<string>('');

  // Ref para cerrar el dropdown al hacer clic fuera
  const precioDropdownRef = useRef<HTMLDivElement>(null);

  // Agrega estos estados para el menú desplegable de más filtros
  const [showMasFilters, setShowMasFilters] = useState<boolean>(false);
  const [caracteristicas, setCaracteristicas] = useState<string>('');

  // Estados para superficie
  const [tipoSuperficie, setTipoSuperficie] = useState<string>('techada');
  const [superficieDesde, setSuperficieDesde] = useState<string>('');
  const [superficieHasta, setSuperficieHasta] = useState<string>('');

  // Estados para baños
  const [banos, setBanos] = useState<string>('');

  // Estados para estacionamientos
  const [estacionamientos, setEstacionamientos] = useState<string>('');

  // Estados para tipo de anunciante
  const [tipoAnunciante, setTipoAnunciante] = useState<string>('todos');

  // Estados para antigüedad
  const [antiguedad, setAntigüedad] = useState<string[]>([]);

  // Estados para fecha de publicación
  const [fechaPublicacion, setFechaPublicacion] = useState<string>('');

  // Ref para cerrar el dropdown al hacer clic fuera
  const masFiltersDropdownRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    AOS.init({
      duration: 800,
      once: false
    });

    // Cargar datos de usuario
    const userData = localStorage.getItem('user');
    if (userData) {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      setIsLoggedIn(true);
    }

    // Simulación de carga de datos
    const cargarPublicaciones = async () => {
      try {
        setTimeout(() => {
          setPublicaciones([
            {
              id: 1,
              tipo: 'casa',
              titulo: 'Casa moderna en zona residencial',
              precio: 250000,
              ubicacion: 'San Borja, Lima',
              metros: 150,
              habitaciones: 3,
              banos: 2,
              imagen: '/path-to-image.jpg',
              estado: 'activa'
            },
            // Aquí puedes agregar más publicaciones de ejemplo
          ]);
          setIsLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error al cargar publicaciones:', error);
        setIsLoading(false);
      }
    };

    cargarPublicaciones();
  }, []);

  // Función para cerrar sesión
  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    setUser(null);
    navigate('/login');
  };

  const publicacionesFiltradas = publicaciones.filter(pub => {
    const cumpleTipo = filtroTipo === 'todos' || pub.tipo === filtroTipo;
    const cumpleEstado = filtroEstado === 'todos' || pub.estado === filtroEstado;
    const cumpleBusqueda = pub.titulo.toLowerCase().includes(busqueda.toLowerCase()) ||
      pub.ubicacion.toLowerCase().includes(busqueda.toLowerCase());
    return cumpleTipo && cumpleEstado && cumpleBusqueda;
  });

  // Efecto para cerrar el dropdown al hacer clic fuera
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (tipoDropdownRef.current && !tipoDropdownRef.current.contains(event.target as Node)) {
        setShowTipoDropdown(false);
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  // Efecto para cerrar el dropdown de dormitorios al hacer clic fuera
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dormitoriosDropdownRef.current && !dormitoriosDropdownRef.current.contains(event.target as Node)) {
        setShowDormitoriosDropdown(false);
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Efecto para cerrar el dropdown de precio al hacer clic fuera
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (precioDropdownRef.current && !precioDropdownRef.current.contains(event.target as Node)) {
        setShowPrecioDropdown(false);
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Efecto para cerrar el dropdown de más filtros al hacer clic fuera
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (masFiltersDropdownRef.current && !masFiltersDropdownRef.current.contains(event.target as Node)) {
        setShowMasFilters(false);
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  // Función para manejar la selección de tipos
  const handleTipoChange = (tipo: string) => {
    setSelectedTipos(prev => ({
      ...prev,
      [tipo]: !prev[tipo]
    }));
  };
  
  // Función para limpiar selecciones
  const handleLimpiarTipos = () => {
    setSelectedTipos({
      casa: false,
      terreno: false
    });
  };
  
  // Función para aplicar filtros
  const handleVerResultados = () => {
    // Aquí se aplicarían los filtros seleccionados
    console.log("Filtros aplicados:", selectedTipos);
    setShowTipoDropdown(false);
  };

  // Función para limpiar la selección
  const handleLimpiarDormitorios = () => {
    setSelectedDormitorios('');
  };
  
  // Función para aplicar filtros de dormitorios
  const handleVerResultadosDormitorios = () => {
    console.log("Dormitorios seleccionados:", selectedDormitorios);
    setShowDormitoriosDropdown(false);
  };

  // Función para limpiar la selección de precio
  const handleLimpiarPrecio = () => {
    setPrecioDesde('');
    setPrecioHasta('');
  };
  
  // Función para aplicar filtros de precio
  const handleVerResultadosPrecio = () => {
    console.log("Precio seleccionado:", { moneda, desde: precioDesde, hasta: precioHasta });
    setShowPrecioDropdown(false);
  };

  // Función para limpiar todos los filtros adicionales
  const handleLimpiarMasFilters = () => {
    setCaracteristicas('');
    setTipoSuperficie('techada');
    setSuperficieDesde('');
    setSuperficieHasta('');
    setBanos('');
    setEstacionamientos('');
    setTipoAnunciante('todos');
    setAntigüedad([]);
    setFechaPublicacion('');
  };

  // Función para aplicar los filtros adicionales
  const handleVerResultadosMasFilters = () => {
    console.log("Filtros adicionales aplicados:", {
      caracteristicas,
      superficie: { tipo: tipoSuperficie, desde: superficieDesde, hasta: superficieHasta },
      banos,
      estacionamientos,
      tipoAnunciante,
      antiguedad,
      fechaPublicacion
    });
    setShowMasFilters(false);
  };

  return (
    <div className="publicaciones-page">
      {/* Barra de Navegación */}
      <Navbar bg="white" expand="lg" className="w-100 border-bottom">
        <Container fluid className="px-4">
          <Navbar.Brand as={Link} to="/">
            <img
              src="/logo.png" // Asegúrate de que esta ruta sea correcta
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
                  as={Link}
                  to="/buscar"
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

              {/* Menú Vender */}
              <div className="nav-item mega-dropdown">
                <Nav.Link
                  as={Link}
                  to="/publicar"
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
                        {user.name?.charAt(0).toUpperCase() || 'U'}
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

      <div className="publicaciones-container">
        {/* Campo de búsqueda grande sin título */}
        <div className="search-section container py-3">
          <div className="big-search-bar">
            <div className="input-group search-input-group">
              <InputGroup.Text className="search-icon-prepend bg-white border-end-0">
                <i className="bi bi-geo-alt text-muted"></i>
              </InputGroup.Text>
              <Form.Control
                type="text"
                placeholder="Ingresa departamentos o distritos"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                className="search-input form-control-lg border-start-0"
              />
              <Button variant="success" size="lg" className="search-button">
                <i className="bi bi-search"></i>
              </Button>
            </div>
          </div>
        </div>

        {/* Filtros justo debajo */}
        <div className="filters-container container mt-4">
          <div className="row g-3">
            {/* Botón de Tipo de propiedad */}
            <div className="col-md-3 position-relative">
              <Button 
                variant="outline-secondary"
                className="more-filters-btn form-control-clean text-start d-flex align-items-center w-100"
                onClick={() => setShowTipoDropdown(!showTipoDropdown)}
                aria-expanded={showTipoDropdown}
              >
                <i className="bi bi-building me-2"></i>
                <span>Tipo de propiedad</span>
                <i className="bi bi-chevron-down ms-auto"></i>
              </Button>
              
              {/* Dropdown para Tipo de propiedad */}
              {showTipoDropdown && (
                <div 
                  ref={tipoDropdownRef}
                  className="tipo-dropdown shadow position-absolute mt-1 z-index-dropdown" 
                >
                  <div className="p-4">
                    <div className="dropdown-header">
                      <h6 className="mb-0 fw-bold">Tipo de inmueble</h6>
                    </div>
                    
                    <div className="mb-2 form-check">
                      <input 
                        type="checkbox" 
                        className="form-check-input" 
                        id="tipo-casa" 
                        checked={selectedTipos.casa}
                        onChange={() => handleTipoChange('casa')}
                      />
                      <label className="form-check-label" htmlFor="tipo-casa">Casa</label>
                    </div>
                    
                    <div className="mb-2 form-check">
                      <input 
                        type="checkbox" 
                        className="form-check-input" 
                        id="tipo-terreno" 
                        checked={selectedTipos.terreno}
                        onChange={() => handleTipoChange('terreno')}
                      />
                      <label className="form-check-label" htmlFor="tipo-terreno">Terreno / Lote</label>
                    </div>
                    
                    <div className="dropdown-buttons">
                      <Button 
                        variant="link" 
                        className="btn-limpiar"
                        onClick={handleLimpiarTipos}
                      >
                        Limpiar
                      </Button>
                      <Button 
                        variant="primary" 
                        className="btn-ver-resultados"
                        onClick={handleVerResultados}
                      >
                        Ver resultados
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            {/* Botón de Dormitorios */}
            <div className="col-md-3 position-relative">
              <Button 
                variant="outline-secondary"
                className="more-filters-btn form-control-clean text-start d-flex align-items-center w-100"
                onClick={() => setShowDormitoriosDropdown(!showDormitoriosDropdown)}
                aria-expanded={showDormitoriosDropdown}
              >
                <i className="bi bi-door-closed me-2"></i>
                <span>Dormitorios {selectedDormitorios && ` (${selectedDormitorios})`}</span>
                <i className="bi bi-chevron-down ms-auto"></i>
              </Button>
              
              {/* Dropdown para Dormitorios Simplificado */}
              {showDormitoriosDropdown && (
                <div 
                  ref={dormitoriosDropdownRef}
                  className="tipo-dropdown shadow position-absolute mt-1 z-index-dropdown" 
                >
                  <div className="p-4">
                    <div className="dropdown-header">
                      <h6 className="mb-0 fw-bold">Dormitorios</h6>
                    </div>
                    
                    <div className="dormitorios-options">
                      <div className="mb-2 form-check">
                        <input 
                          type="radio" 
                          className="form-check-input" 
                          id="dormitorios-all" 
                          name="dormitorios"
                          checked={selectedDormitorios === ''}
                          onChange={() => setSelectedDormitorios('')}
                        />
                        <label className="form-check-label" htmlFor="dormitorios-all">Todos</label>
                      </div>
                      
                      <div className="mb-2 form-check">
                        <input 
                          type="radio" 
                          className="form-check-input" 
                          id="dormitorios-1" 
                          name="dormitorios"
                          checked={selectedDormitorios === '1'}
                          onChange={() => setSelectedDormitorios('1')}
                        />
                        <label className="form-check-label" htmlFor="dormitorios-1">1 dormitorio</label>
                      </div>
                      
                      <div className="mb-2 form-check">
                        <input 
                          type="radio" 
                          className="form-check-input" 
                          id="dormitorios-2" 
                          name="dormitorios"
                          checked={selectedDormitorios === '2'}
                          onChange={() => setSelectedDormitorios('2')}
                        />
                        <label className="form-check-label" htmlFor="dormitorios-2">2 dormitorios</label>
                      </div>
                      
                      <div className="mb-2 form-check">
                        <input 
                          type="radio" 
                          className="form-check-input" 
                          id="dormitorios-3" 
                          name="dormitorios"
                          checked={selectedDormitorios === '3'}
                          onChange={() => setSelectedDormitorios('3')}
                        />
                        <label className="form-check-label" htmlFor="dormitorios-3">3 dormitorios</label>
                      </div>
                      
                      <div className="mb-2 form-check">
                        <input 
                          type="radio" 
                          className="form-check-input" 
                          id="dormitorios-4" 
                          name="dormitorios"
                          checked={selectedDormitorios === '4'}
                          onChange={() => setSelectedDormitorios('4')}
                        />
                        <label className="form-check-label" htmlFor="dormitorios-4">4 dormitorios</label>
                      </div>
                      
                      <div className="mb-2 form-check">
                        <input 
                          type="radio" 
                          className="form-check-input" 
                          id="dormitorios-5" 
                          name="dormitorios"
                          checked={selectedDormitorios === '5+'}
                          onChange={() => setSelectedDormitorios('5+')}
                        />
                        <label className="form-check-label" htmlFor="dormitorios-5">5 o más dormitorios</label>
                      </div>
                    </div>
                    
                    <div className="dropdown-buttons">
                      <Button 
                        variant="link" 
                        className="btn-limpiar"
                        onClick={handleLimpiarDormitorios}
                      >
                        Limpiar
                      </Button>
                      <Button 
                        variant="primary" 
                        className="btn-ver-resultados"
                        onClick={handleVerResultadosDormitorios}
                      >
                        Ver resultados
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            {/* Botón de Precio */}
            <div className="col-md-3 position-relative">
              <Button 
                variant="outline-secondary"
                className="more-filters-btn form-control-clean text-start d-flex align-items-center w-100"
                onClick={() => setShowPrecioDropdown(!showPrecioDropdown)}
                aria-expanded={showPrecioDropdown}
              >
                <i className="bi bi-currency-dollar me-2"></i>
                <span>Precio{(precioDesde || precioHasta) ? 
      ` (${moneda === 'soles' ? 'S/ ' : '$'}${precioDesde || '0'} - ${precioHasta || '∞'})` : 
      ''}
    </span>
                <i className="bi bi-chevron-down ms-auto"></i>
              </Button>
              
              {/* Dropdown para Precio */}
              {showPrecioDropdown && (
                <div 
                  ref={precioDropdownRef}
                  className="tipo-dropdown shadow position-absolute mt-1 z-index-dropdown" 
                >
                  <div className="p-4">
                    <div className="dropdown-header">
                      <h6 className="mb-0 fw-bold">Precio</h6>
                    </div>
                    
                    <div className="moneda-options d-flex gap-4 mb-3">
          <div className="form-check">
            <input
              type="radio"
              className="form-check-input"
              id="moneda-soles"
              name="moneda"
              checked={moneda === 'soles'}
              onChange={() => setMoneda('soles')}
            />
            <label className="form-check-label" htmlFor="moneda-soles">Soles</label>
          </div>
          
          <div className="form-check">
            <input
              type="radio"
              className="form-check-input"
              id="moneda-usd"
              name="moneda"
              checked={moneda === 'usd'}
              onChange={() => setMoneda('usd')}
            />
            <label className="form-check-label" htmlFor="moneda-usd">USD</label>
          </div>
        </div>
        
        <div className="precio-range-container d-flex gap-2 my-3">
          <div className="position-relative flex-grow-1">
            <input
              type="text"
              className="form-control"
              placeholder="Desde"
              value={precioDesde}
              onChange={(e) => setPrecioDesde(e.target.value.replace(/[^0-9]/g, ''))}
            />
          </div>
          
          <div className="position-relative flex-grow-1">
            <input
              type="text"
              className="form-control"
              placeholder="Hasta"
              value={precioHasta}
              onChange={(e) => setPrecioHasta(e.target.value.replace(/[^0-9]/g, ''))}
            />
          </div>
        </div>
        
                    <div className="dropdown-buttons">
                      <Button 
                        variant="link" 
                        className="btn-limpiar"
                        onClick={handleLimpiarPrecio}
                      >
                        Limpiar
                      </Button>
                      <Button 
                        variant="primary" 
                        className="btn-ver-resultados"
                        onClick={handleVerResultadosPrecio}
                      >
                        Ver resultados
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            {/* Botones filtros y alertas */}
            <div className="col-md-3">
              <div className="d-flex gap-3">
                <div className="flex-grow-1 position-relative">
                  <Button 
                    variant="outline-secondary" 
                    className="more-filters-btn form-control-clean text-start d-flex align-items-center w-100"
                    onClick={() => setShowMasFilters(!showMasFilters)}
                    aria-expanded={showMasFilters}
                  >
                    <i className="bi bi-sliders me-2"></i>
                    <span>Más filtros</span>
                    <i className="bi bi-chevron-down ms-auto"></i>
                  </Button>
                  
                  {/* Dropdown para Más Filtros */}
                  {showMasFilters && (
                    <div 
                      ref={masFiltersDropdownRef}
                      className="mas-filtros-dropdown shadow position-absolute mt-1" 
                    >
                      <div className="p-4">
                        <div className="dropdown-header mb-3">
                          <h6 className="mb-0 fw-bold">Filtros adicionales</h6>
                        </div>
                        
                        {/* Características especiales */}
                        <div className="filter-section">
                          <h6 className="mb-2 fw-bold">Características</h6>
                          <input
                            type="text"
                            className="form-control mb-3"
                            placeholder="Ej.: piscina, amueblado, permite mascotas..."
                            value={caracteristicas}
                            onChange={(e) => setCaracteristicas(e.target.value)}
                          />
                        </div>
                        
                        {/* Superficie */}
                        <div className="filter-section">
                          <h6 className="mb-2 fw-bold">Superficie</h6>
                          <div className="d-flex gap-4 mb-3">
                            <div className="form-check">
                              <input
                                type="radio"
                                className="form-check-input"
                                id="superficie-techada"
                                name="tipo-superficie"
                                checked={tipoSuperficie === 'techada'}
                                onChange={() => setTipoSuperficie('techada')}
                              />
                              <label className="form-check-label" htmlFor="superficie-techada">Techada</label>
                            </div>
                            
                            <div className="form-check">
                              <input
                                type="radio"
                                className="form-check-input"
                                id="superficie-total"
                                name="tipo-superficie"
                                checked={tipoSuperficie === 'total'}
                                onChange={() => setTipoSuperficie('total')}
                              />
                              <label className="form-check-label" htmlFor="superficie-total">Total</label>
                            </div>
                          </div>
                          
                          <div className="d-flex gap-2 mb-3">
                            <div className="input-group" style={{ width: "90px" }}>
                              <select className="form-select">
                                <option>m²</option>
                              </select>
                            </div>
                            
                            <div className="flex-grow-1">
                              <input
                                type="text"
                                className="form-control"
                                placeholder="Desde"
                                value={superficieDesde}
                                onChange={(e) => setSuperficieDesde(e.target.value.replace(/[^0-9]/g, ''))}
                              />
                            </div>
                            
                            <div className="flex-grow-1">
                              <input
                                type="text"
                                className="form-control"
                                placeholder="Hasta"
                                value={superficieHasta}
                                onChange={(e) => setSuperficieHasta(e.target.value.replace(/[^0-9]/g, ''))}
                              />
                            </div>
                          </div>
                        </div>
                        
                        {/* Baños */}
                        <div className="filter-section">
                          <h6 className="mb-2 fw-bold">Baños</h6>
                          <div className="d-flex flex-wrap gap-2 mb-3">
                            <Button
                              variant={banos === '1+' ? "primary" : "outline-secondary"}
                              className="rounded-pill"
                              onClick={() => setBanos(banos === '1+' ? '' : '1+')}
                            >
                              1+
                            </Button>
                            <Button
                              variant={banos === '2+' ? "primary" : "outline-secondary"}
                              className="rounded-pill"
                              onClick={() => setBanos(banos === '2+' ? '' : '2+')}
                            >
                              2+
                            </Button>
                            <Button
                              variant={banos === '3+' ? "primary" : "outline-secondary"}
                              className="rounded-pill"
                              onClick={() => setBanos(banos === '3+' ? '' : '3+')}
                            >
                              3+
                            </Button>
                            <Button
                              variant={banos === '4+' ? "primary" : "outline-secondary"}
                              className="rounded-pill"
                              onClick={() => setBanos(banos === '4+' ? '' : '4+')}
                            >
                              4+
                            </Button>
                            <Button
                              variant={banos === '5+' ? "primary" : "outline-secondary"}
                              className="rounded-pill"
                              onClick={() => setBanos(banos === '5+' ? '' : '5+')}
                            >
                              5+
                            </Button>
                          </div>
                        </div>
                        
                        {/* Tipo de anunciante */}
                        <div className="filter-section">
                          <h6 className="mb-2 fw-bold">Tipo de anunciante</h6>
                          <div className="d-flex flex-column mb-3">
                            <div className="mb-2 form-check">
                              <input
                                type="radio"
                                className="form-check-input"
                                id="anunciante-todos"
                                name="tipo-anunciante"
                                checked={tipoAnunciante === 'todos'}
                                onChange={() => setTipoAnunciante('todos')}
                              />
                              <label className="form-check-label" htmlFor="anunciante-todos">Todos</label>
                            </div>
                            
                            <div className="mb-2 form-check">
                              <input
                                type="radio"
                                className="form-check-input"
                                id="anunciante-inmobiliaria"
                                name="tipo-anunciante"
                                checked={tipoAnunciante === 'inmobiliaria'}
                                onChange={() => setTipoAnunciante('inmobiliaria')}
                              />
                              <label className="form-check-label" htmlFor="anunciante-inmobiliaria">Inmobiliaria</label>
                            </div>
                            
                            <div className="form-check">
                              <input
                                type="radio"
                                className="form-check-input"
                                id="anunciante-dueno"
                                name="tipo-anunciante"
                                checked={tipoAnunciante === 'dueno'}
                                onChange={() => setTipoAnunciante('dueno')}
                              />
                              <label className="form-check-label" htmlFor="anunciante-dueno">Dueño directo</label>
                            </div>
                          </div>
                        </div>
                        
                        {/* Antigüedad */}
                        <div className="filter-section">
                          <h6 className="mb-2 fw-bold">Antigüedad</h6>
                          <div className="d-flex flex-column mb-2">
                            <div className="mb-2 form-check">
                              <input
                                type="checkbox"
                                className="form-check-input"
                                id="antiguedad-construccion"
                                checked={antiguedad.includes('construccion')}
                                onChange={() => {
                                  if (antiguedad.includes('construccion')) {
                                    setAntigüedad(antiguedad.filter(a => a !== 'construccion'));
                                  } else {
                                    setAntigüedad([...antiguedad, 'construccion']);
                                  }
                                }}
                              />
                              <label className="form-check-label" htmlFor="antiguedad-construccion">En construcción</label>
                            </div>
                            
                            <div className="mb-2 form-check">
                              <input
                                type="checkbox"
                                className="form-check-input"
                                id="antiguedad-estrenar"
                                checked={antiguedad.includes('estrenar')}
                                onChange={() => {
                                  if (antiguedad.includes('estrenar')) {
                                    setAntigüedad(antiguedad.filter(a => a !== 'estrenar'));
                                  } else {
                                    setAntigüedad([...antiguedad, 'estrenar']);
                                  }
                                }}
                              />
                              <label className="form-check-label" htmlFor="antiguedad-estrenar">A estrenar</label>
                            </div>
                            
                            <div className="mb-2 form-check">
                              <input
                                type="checkbox"
                                className="form-check-input"
                                id="antiguedad-5anos"
                                checked={antiguedad.includes('5anos')}
                                onChange={() => {
                                  if (antiguedad.includes('5anos')) {
                                    setAntigüedad(antiguedad.filter(a => a !== '5anos'));
                                  } else {
                                    setAntigüedad([...antiguedad, '5anos']);
                                  }
                                }}
                              />
                              <label className="form-check-label" htmlFor="antiguedad-5anos">Hasta 5 años</label>
                            </div>
                          </div>
                        </div>
                        
                        {/* Fecha de publicación */}
                        <div className="filter-section">
                          <h6 className="mb-2 fw-bold">Fecha de publicación</h6>
                          <div className="d-flex flex-column mb-2">
                            <div className="mb-2 form-check">
                              <input
                                type="radio"
                                className="form-check-input"
                                id="fecha-ayer"
                                name="fecha-publicacion"
                                checked={fechaPublicacion === 'ayer'}
                                onChange={() => setFechaPublicacion('ayer')}
                              />
                              <label className="form-check-label" htmlFor="fecha-ayer">Desde ayer</label>
                            </div>
                            
                            <div className="mb-2 form-check">
                              <input
                                type="radio"
                                className="form-check-input"
                                id="fecha-hoy"
                                name="fecha-publicacion"
                                checked={fechaPublicacion === 'hoy'}
                                onChange={() => setFechaPublicacion('hoy')}
                              />
                              <label className="form-check-label" htmlFor="fecha-hoy">Hoy</label>
                            </div>
                            
                            <div className="mb-2 form-check">
                              <input
                                type="radio"
                                className="form-check-input"
                                id="fecha-semana"
                                name="fecha-publicacion"
                                checked={fechaPublicacion === 'semana'}
                                onChange={() => setFechaPublicacion('semana')}
                              />
                              <label className="form-check-label" htmlFor="fecha-semana">Última semana</label>
                            </div>
                          </div>
                        </div>
                        
                        {/* Botones de acción */}
                        <div className="dropdown-buttons mt-3 pt-3 border-top d-flex justify-content-between">
                          <Button 
                            variant="link" 
                            className="btn-limpiar"
                            onClick={handleLimpiarMasFilters}
                          >
                            Limpiar
                          </Button>
                          <Button 
                            variant="primary" 
                            className="btn-ver-resultados"
                            onClick={handleVerResultadosMasFilters}
                          >
                            Ver resultados
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="bell-container">
                  <Button 
                    variant="outline-secondary" 
                    className="create-alert-btn form-control-clean d-flex align-items-center justify-content-center"
                  >
                    <i className="bi bi-bell"></i>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Contador de resultados */}
        <div className="container mt-3">
          <div className="results-header d-flex justify-content-between align-items-center">
            <div className="results-count">
              <strong>{publicacionesFiltradas.length}</strong> propiedades encontradas
            </div>
            <div className="results-actions d-flex align-items-center gap-2">
              <Button variant="outline-secondary" size="sm" className="view-map-btn">
                <i className="bi bi-map me-1"></i> Ver mapa
              </Button>
              <div className="dropdown">
                <Button variant="outline-secondary" size="sm" className="dropdown-toggle">
                  Ordenar
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Contenido de las publicaciones */}
        <div className="publicaciones-grid container mt-3">
          {isLoading ? (
            <div className="loading-spinner">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Cargando...</span>
              </div>
            </div>
          ) : publicacionesFiltradas.length === 0 ? (
            <div className="no-resultados" data-aos="fade-up">
              <i className="bi bi-search"></i>
              <p>No se encontraron publicaciones</p>
            </div>
          ) : (
            publicacionesFiltradas.map(pub => (
              <Card key={pub.id} className="publicacion-card" data-aos="fade-up">
                <div className="imagen-container">
                  <Card.Img variant="top" src={pub.imagen} />
                  <Badge className={`estado-badge estado-${pub.estado}`}>
                    {pub.estado.toUpperCase()}
                  </Badge>
                </div>
                <Card.Body>
                  <Card.Title>{pub.titulo}</Card.Title>
                  <div className="detalles">
                    <p className="precio">$ {pub.precio.toLocaleString()}</p>
                    <p className="ubicacion">
                      <i className="bi bi-geo-alt-fill"></i> {pub.ubicacion}
                    </p>
                    <div className="caracteristicas">
                      <span><i className="bi bi-rulers"></i> {pub.metros}m²</span>
                      {pub.habitaciones && (
                        <span><i className="bi bi-house-door"></i> {pub.habitaciones} hab.</span>
                      )}
                      {pub.banos && (
                        <span><i className="bi bi-water"></i> {pub.banos} baños</span>
                      )}
                    </div>
                  </div>
                  
                  {/* Botones de contacto */}
                  <div className="mt-3 d-flex gap-2">
                    <Button variant="success" className="w-100 d-flex align-items-center justify-content-center">
                      <i className="bi bi-chat-text-fill me-2"></i>
                      <span>Contactar</span>
                    </Button>
                    <Button variant="outline-primary" className="contact-phone-btn">
                      <i className="bi bi-telephone-fill"></i>
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            ))
          )}
        </div>
      </div>

      <footer className="bg-dark text-light py-4 mt-auto">
        <Container fluid>
          <p className="text-center mb-0">© 2023 InmoMarket. Todos los derechos reservados.</p>
        </Container>
      </footer>
    </div>
  );
};

export default Buscar;