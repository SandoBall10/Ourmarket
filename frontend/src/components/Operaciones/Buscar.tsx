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
        <div className="filtros-section" data-aos="fade-down">
          <h2>Publicaciones</h2>
          <div className="row g-3">
            <div className="col-12 col-md-7">
              <Form.Control
                type="text"
                placeholder="Buscar por título o ubicación"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
              />
            </div>
            <div className="col-12 col-md-3">
              <Form.Select
                value={filtroTipo}
                onChange={(e) => setFiltroTipo(e.target.value)}
                className="filtro-select"
              >
                <option value="todos">Todos los tipos</option>
                <option value="casa">Casas</option>
                <option value="departamento">Departamentos</option>
                <option value="terreno">Terrenos</option>
              </Form.Select>
            </div>
            <div className="col-12 col-md-2">
              <Button
                variant="success"
                className="buscar-btn w-100"
                onClick={() => {
                  // Realizar acción de búsqueda
                }}
              >
                <i className="bi bi-search me-2"></i>
                Buscar
              </Button>
            </div>
          </div>
        </div>

        <div className="publicaciones-grid">
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