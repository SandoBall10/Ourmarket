import React, { useState, useEffect } from 'react';
import { Navbar, Container, Nav, Form, Button, Card, Badge, NavDropdown, Row, Col } from 'react-bootstrap';
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
              <Form.Control
                type="text"
                placeholder="Ingresa departamentos o distritos"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                className="search-input form-control-lg"
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
            {/* Dropdown de Tipo */}
            <div className="col-md-3">
              <label className="filter-label">Tipo de propiedad</label>
              <Form.Select
                value={filtroTipo}
                onChange={(e) => setFiltroTipo(e.target.value)}
                className="filter-select form-control-clean"
              >
                <option value="todos">Todos</option>
                <option value="casa">Casa</option>
                <option value="departamento">Departamento</option>
                <option value="terreno">Terreno</option>
              </Form.Select>
            </div>
            
            {/* Dropdown de Dormitorios */}
            <div className="col-md-3">
              <label className="filter-label">Dormitorios</label>
              <div className="custom-select-container">
    <Form.Select 
      className="filter-select form-control-clean"
      onChange={(e) => {
        // Manejar el cambio de valor aquí
        console.log("Dormitorios seleccionados:", e.target.value);
      }}
    >
      <option value="">Sin mínimo</option>
      <option value="1">1 dormitorio</option>
      <option value="2">2 dormitorios</option>
      <option value="3">3 dormitorios</option>
      <option value="4">4 dormitorios</option>
      <option value="5">5 dormitorios</option>
    </Form.Select>
  </div>
            </div>
            
            {/* Dropdown de Precio */}
            <div className="col-md-3">
              <label className="filter-label">Precio</label>
              <Form.Select className="filter-select form-control-clean">
                <option value="">Todos</option>
                <option value="0-100000">Hasta $100,000</option>
                <option value="100000-200000">$100,000 - $200,000</option>
                <option value="200000-300000">$200,000 - $300,000</option>
                <option value="300000+">Más de $300,000</option>
              </Form.Select>
            </div>
            
            {/* Botones filtros y alertas */}
            <div className="col-md-3">
              <div className="d-flex gap-3">
                <div className="flex-grow-1">
                  <label className="filter-label">Más opciones</label>
                  <Button 
                    variant="outline-secondary" 
                    className="more-filters-btn form-control-clean text-start d-flex align-items-center"
                  >
                    <i className="bi bi-sliders me-2"></i>
                    <span>Más filtros</span>
                    <i className="bi bi-chevron-down ms-auto"></i>
                  </Button>
                </div>
                
                <div className="bell-container">
                  <label className="filter-label">Alertas</label>
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