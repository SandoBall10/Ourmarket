import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Badge, Navbar, Nav, NavDropdown, Form } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import './Favoritos.css';

// Interfaces
interface FavoritoItem {
  id: string;
  titulo: string;
  imagen: string;
  precioSoles: number;
  precioDolares: number;
  direccion: string;
  distrito: string;
  ciudad: string;
  descripcion: string;
  inmobiliaria: {
    nombre: string;
    logo: string;
  };
}

const Favoritos: React.FC = () => {
  const [favoritos, setFavoritos] = useState<FavoritoItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(true); // Asumimos que el usuario está logueado
  const [user, setUser] = useState<{name?: string}>({name: 'Usuario'}); // Información del usuario
  const navigate = useNavigate();
  
  // Simulando carga de datos
  useEffect(() => {
    const fetchFavoritos = async () => {
      try {
        // Mantener el loading por 1.5 segundos para ver el spinner
        setTimeout(() => {
          // Establecer favoritos como array vacío
          setFavoritos([]);
          // Cambiar loading a false después del tiempo simulado
          setLoading(false);
        }, 1500);
      } catch (error) {
        console.error("Error al cargar favoritos:", error);
        setLoading(false);
      }
    };
    
    fetchFavoritos();
    // Array vacío como dependencia para que solo se ejecute una vez
  }, []);

  // Función para manejar cierre de sesión
  const handleLogout = () => {
    // Aquí iría la lógica para cerrar sesión
    setIsLoggedIn(false);
    navigate('/login');
  };

  // Función para eliminar de favoritos
  const removeFavorito = (id: string) => {
    setFavoritos(favoritos.filter(item => item.id !== id));
  };

  return (
    <div className="favoritos-page">
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
              {/* Menú Mis Publicaciones */}
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
                  className="nav-link-text active"
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

      {/* Contenido Principal */}
      <Container className="favoritos-container py-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h1 className="favoritos-title">Favoritos</h1>
          
          {/* Opciones de filtrado y orden */}
          <div className="d-flex gap-3">
            <Form.Select className="form-select-sm" style={{ width: 'auto' }}>
              <option>Ordenar por</option>
              <option>Precio: menor a mayor</option>
              <option>Precio: mayor a menor</option>
              <option>Más recientes</option>
              <option>Más antiguos</option>
            </Form.Select>
            
            <Button variant="outline-secondary" size="sm">
              <i className="fas fa-sort-amount-down me-2"></i>Filtrar
            </Button>
          </div>
        </div>
        
        {loading ? (
          <div className="loading-container d-flex justify-content-center align-items-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Cargando...</span>
            </div>
          </div>
        ) : favoritos.length === 0 ? (
          <div className="empty-state-container text-center py-5 animate__animated animate__fadeIn">
            <div className="empty-icon mb-4">
              <i className="far fa-heart fa-4x text-secondary opacity-50"></i>
            </div>
            <h3 className="mb-3">No tienes favoritos guardados</h3>
            <p className="text-muted mb-4">
              Guarda propiedades como favoritas para verlas aquí y compararlas fácilmente.
            </p>
            <Button variant="primary" as={Link as any} to="/buscar">
              <i className="fas fa-search me-2"></i>Explorar propiedades
            </Button>
          </div>
        ) : (
          <Row className="g-4">
            {favoritos.map((item) => (
              <Col xs={12} key={item.id} data-aos="fade-up">
                <Card className="favorito-card overflow-hidden">
                  <Row className="g-0">
                    <Col md={5} className="favorito-img-container">
                      <div className="position-relative h-100">
                        <img 
                          src={item.imagen} 
                          alt={item.titulo} 
                          className="favorito-img w-100 h-100 object-fit-cover"
                        />
                        <Button 
                          variant="light" 
                          className="btn-heart position-absolute top-0 end-0 m-2 rounded-circle p-2"
                          onClick={() => removeFavorito(item.id)}
                        >
                          <i className="fas fa-heart text-danger"></i>
                        </Button>
                        <div className="slider-controls position-absolute bottom-0 end-0 m-2">
                          <Button variant="light" size="sm" className="rounded-circle p-1 me-1">
                            <i className="fas fa-chevron-right"></i>
                          </Button>
                        </div>
                      </div>
                    </Col>
                    <Col md={7}>
                      <Card.Body>
                        <div className="d-flex justify-content-between align-items-start mb-2">
                          <Badge bg="light" text="dark" className="p-2">Desde</Badge>
                          <div className="precio-container">
                            <h4 className="mb-0">S/. {item.precioSoles.toLocaleString()} · USD {item.precioDolares.toLocaleString()}</h4>
                          </div>
                        </div>

                        <h5 className="mb-1">{item.direccion}</h5>
                        <p className="text-muted mb-2">{item.distrito}, {item.ciudad}</p>
                        
                        <p className="mb-3 desc-text">{item.descripcion}</p>
                        
                        <div className="d-flex justify-content-between align-items-center mt-auto">
                          <div className="inmobiliaria">
                            <img src={item.inmobiliaria.logo} alt={item.inmobiliaria.nombre} height="30" />
                          </div>
                          <div>
                            <Button variant="outline-dark" className="me-2">Agregar nota</Button>
                            <Button variant="success">Contactar</Button>
                          </div>
                        </div>
                      </Card.Body>
                    </Col>
                  </Row>
                </Card>
              </Col>
            ))}
          </Row>
        )}
      </Container>
    </div>
  );
};

export default Favoritos;