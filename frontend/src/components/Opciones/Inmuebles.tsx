import React, { useEffect, useState } from 'react';
import { Navbar, Nav, Container, Row, Col, Button, Card, Badge, NavDropdown, Modal, Carousel } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { API_BASE_URL } from '../../api/config';
import './Inmuebles.css';

interface Inmueble {
  idInmueble: number;
  direccion: string;
  tipo: string;
  precio: number;
  area: number;
  numHabitaciones: number;
  numBanos: number;
  estado?: string;
  imagenes?: string;
  cliente?: {
    email?: string;
  };
  servicios?: string;
}

const Inmuebles: React.FC = () => {
  const navigate = useNavigate();
  const [inmuebles, setInmuebles] = useState<Inmueble[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<{ name?: string; rol?: string } | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  // Estados para edición
  const [showModal, setShowModal] = useState(false);
  const [inmuebleEdit, setInmuebleEdit] = useState<Inmueble | null>(null);
  const [editDireccion, setEditDireccion] = useState('');
  const [editPrecio, setEditPrecio] = useState<number>(0);
  const [editArea, setEditArea] = useState<number>(0);
  const [editNumHabitaciones, setEditNumHabitaciones] = useState<number>(0);
  // Eliminado: const [editNumBanos, setEditNumBanos] = useState<number>(0);
  const [editTipo, setEditTipo] = useState('');
  const [editServicios, setEditServicios] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    // Cargar usuario
    const userData = localStorage.getItem('user');
    if (userData) {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      setIsLoggedIn(true);
    }

    // Cargar inmuebles del usuario autenticado
    const fetchInmuebles = async () => {
      setIsLoading(true);
      try {
        const token = localStorage.getItem('token');
        const authToken = token && token.startsWith('Bearer ') ? token : `Bearer ${token}`;
        const response = await axios.get(API_BASE_URL + '/api/inmuebles', {
          headers: { 'Authorization': authToken }
        });
        // Filtrar por email del cliente si es ROLE_CLIENTE
        let inmueblesFiltrados = response.data as Inmueble[];
        if (user?.rol === 'ROLE_CLIENTE') {
          inmueblesFiltrados = inmueblesFiltrados.filter(
            (inm) => inm.cliente && inm.cliente.email === user.name
          );
        }
        setInmuebles(inmueblesFiltrados);
      } catch {
        setInmuebles([]);
      }
      setIsLoading(false);
    };
    if (userData) fetchInmuebles();
  }, [user?.rol, user?.name]);

  // Navbar exacto proporcionado por el usuario
  const userRole = user?.rol;
  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    setUser(null);
    navigate('/login');
  };

  const navbar = (
    <Navbar bg="white" expand="lg" className="w-100 border-bottom">
      <Container fluid className="px-4">
        <Navbar.Brand as={Link} to="/">
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
            {/* Menú Comprar */}
            <div className="nav-item mega-dropdown">
              <Nav.Link className="nav-link-text" id="comprar-dropdown">
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

            {/* Menú Alquilar */}
            <div className="nav-item mega-dropdown">
              <Nav.Link className="nav-link-text" id="vender-dropdown">
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
              <Nav.Link className="nav-link-text" id="servicios-dropdown">
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
                      <h6 className="fw-bold mb-3">Nuestra Mision y Vision</h6>
                      <ul className="list-unstyled">
                        <li>
                          <Link to="/conocenos" className="text-decoration-none text-dark">
                            Conocenos
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
                      {user.name ? user.name.charAt(0).toUpperCase() : '?'}
                    </div>
                    <i className="fas fa-chevron-down avatar-arrow"></i>
                  </div>
                }
                id="user-dropdown"
                align="end"
                className="custom-dropdown"
              >
                <NavDropdown.Item as={Link} to="/publicaciones" className="dropdown-item-custom">
                  <div className="icon-wrapper"><i className="far fa-file-alt"></i></div>
                  <span>Mis publicaciones</span>
                </NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/inmuebles" className="dropdown-item-custom">
                  <div className="icon-wrapper"><i className="bi-house-door-fill"></i></div>
                  <span>Mis inmuebles</span>
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

                {/* Dashboard Admin (solo visible para ADMIN y MASTER) */}
                {(userRole === 'ROLE_ADMIN' || userRole === 'ROLE_MASTER') && (
                  <>
                    <NavDropdown.Item as={Link} to="/dashboard" className="dropdown-item-custom">
                      <div className="icon-wrapper"><i className="fas fa-tachometer-alt"></i></div>
                      <span>Dashboard Admin</span>
                    </NavDropdown.Item>
                    <NavDropdown.Divider />
                  </>
                )}

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
  );

  return (
    <div className="publicaciones-page">
      {navbar}
      <div className="publicaciones-container">
        <div className="filtros-section" data-aos="fade-down">
          <h2>Mis Inmuebles</h2>
        </div>
        <div className="publicaciones-grid">
          {isLoading ? (
            <div className="loading-spinner">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Cargando...</span>
              </div>
            </div>
          ) : inmuebles.length === 0 ? (
            <div className="no-resultados" data-aos="fade-up">
              <i className="bi bi-search"></i>
              <p>No tienes inmuebles registrados</p>
            </div>
          ) : (
            inmuebles.map(inm => (
              <Card key={inm.idInmueble} className="publicacion-card" data-aos="fade-up">
                <Card.Body style={{ padding: 0 }}>
                  {inm.imagenes ? (
  <Carousel interval={null}>
    {inm.imagenes.split(";").map((img, index) => (
      <Carousel.Item key={index}>
        <img
          className="d-block w-100"
          src={`${API_BASE_URL}/assets/inmuebles/${img}`}
          alt={`Imagen ${index + 1}`}
          style={{
            height: 180,
            objectFit: "cover",
            borderTopLeftRadius: 12,
            borderTopRightRadius: 12
          }}
          onError={(e) => {
            (e.target as HTMLImageElement).src = API_BASE_URL + "/assets/inmuebles/img_default.jpg";
          }}
        />
      </Carousel.Item>
    ))}
  </Carousel>
) : (
  <div style={{
    height: 180,
    backgroundColor: "#f0f0f0",
    textAlign: "center",
    paddingTop: 70,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12
  }}>
    Sin imágenes
  </div>
)}

                  <div style={{ padding: 16 }}>
                    <Card.Title>{inm.tipo.charAt(0).toUpperCase() + inm.tipo.slice(1)}</Card.Title>
                    <Badge bg="info" className="mb-2">{inm.estado || 'Disponible'}</Badge>
                    <div className="detalles">
                      <p className="precio">S/. {inm.precio?.toLocaleString()}</p>
                      <p className="ubicacion">
                        <i className="bi bi-geo-alt-fill"></i> {inm.direccion}
                      </p>
                      <div className="caracteristicas">
                        <span>
                          <i className="bi bi-rulers"></i> {inm.area}m²
                        </span>
                        <span>
                          <i className="bi bi-house-door"></i> {inm.numHabitaciones} hab.
                        </span>
                      </div>
                    </div>
                    <div className="acciones">
                      <Button
                        variant="outline-primary"
                        size="sm"
                        onClick={() => {
                          setInmuebleEdit(inm);
                          setEditDireccion(inm.direccion ?? '');
                          setEditPrecio(typeof inm.precio === 'number' ? inm.precio : 0);
                          setEditArea(typeof inm.area === 'number' ? inm.area : 0);
                          setEditNumHabitaciones(typeof inm.numHabitaciones === 'number' ? inm.numHabitaciones : 0);
                          setEditTipo(inm.tipo ?? '');
                          setEditServicios(inm.servicios ?? '');
                          setShowModal(true);
                        }}
                      >
                        <i className="bi bi-pencil-fill"></i> Editar
                      </Button>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            ))
          )}
        </div>
      </div>
    {/* Modal para editar inmueble */}
    <Modal
      show={showModal}
      onHide={() => setShowModal(false)}
      centered
      size="lg"
    >
      <Modal.Header closeButton>
        <Modal.Title>Editar inmueble</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <form>
          <div className="mb-3">
            <label className="form-label">Dirección</label>
            <input
              type="text"
              className="form-control"
              value={editDireccion ?? ''}
              onChange={e => setEditDireccion(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Tipo</label>
            <select
              className="form-select"
              value={editTipo ?? ''}
              onChange={e => setEditTipo(e.target.value)}
            >
              <option value="casa">Casa</option>
              <option value="departamento">Departamento</option>
              <option value="terreno">Terreno</option>
              <option value="oficina">Oficina</option>
              <option value="local">Local Comercial</option>
            </select>
          </div>
          <div className="mb-3">
            <label className="form-label">Precio</label>
            <input
              type="number"
              className="form-control"
              value={editPrecio ?? 0}
              onChange={e => setEditPrecio(Number(e.target.value))}
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Área (m²)</label>
            <input
              type="number"
              className="form-control"
              value={editArea ?? 0}
              onChange={e => setEditArea(Number(e.target.value))}
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Habitaciones</label>
            <input
              type="number"
              className="form-control"
              value={editNumHabitaciones ?? 0}
              onChange={e => setEditNumHabitaciones(Number(e.target.value))}
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Servicios</label>
            <textarea
              className="form-control"
              value={editServicios}
              onChange={e => setEditServicios(e.target.value)}
              rows={2}
              placeholder="Ej: Agua, Luz, Internet, etc."
            />
          </div>
        </form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => setShowModal(false)}>
          Cancelar
        </Button>
        <Button
          variant="success"
          onClick={async () => {
            if (!inmuebleEdit) return;
            setSaving(true);
            try {
              const token = localStorage.getItem('token');
              const authToken = token && token.startsWith('Bearer ') ? token : `Bearer ${token}`;
              await axios.put(
                `${API_BASE_URL}/api/inmuebles/actualizar/${inmuebleEdit.idInmueble}`,
                {
                  ...inmuebleEdit,
                  direccion: editDireccion ?? '',
                  tipo: editTipo ?? '',
                  precio: Number(editPrecio) || 0,
                  area: Number(editArea) || 0,
                  numHabitaciones: typeof editNumHabitaciones === 'number' && !isNaN(editNumHabitaciones) ? editNumHabitaciones : 0,
                  numeroHabitaciones: typeof editNumHabitaciones === 'number' && !isNaN(editNumHabitaciones) ? editNumHabitaciones : 0,
                  num_habitaciones: typeof editNumHabitaciones === 'number' && !isNaN(editNumHabitaciones) ? editNumHabitaciones : 0,
                  servicios: editServicios ?? '',
                },
                {
                  headers: {
                    'Authorization': authToken,
                    'Content-Type': 'application/json'
                  }
                }
              );
              setInmuebles(prev =>
                prev.map(i =>
                  i.idInmueble === inmuebleEdit.idInmueble
                    ? { ...i, direccion: editDireccion ?? '', tipo: editTipo ?? '', precio: Number(editPrecio) || 0, area: Number(editArea) || 0, numHabitaciones: typeof editNumHabitaciones === 'number' && !isNaN(editNumHabitaciones) ? editNumHabitaciones : 0, servicios: editServicios ?? '' }
                    : i
                )
              );
              setShowModal(false);
            } catch {
              alert('Error al actualizar el inmueble');
            }
            setSaving(false);
          }}
          disabled={saving}
        >
          Guardar cambios
        </Button>
      </Modal.Footer>
    </Modal>
    <footer className="bg-dark text-light py-4 mt-auto">
      <Container fluid>
        <p className="text-center mb-0">© 2023 InmoMarket. Todos los derechos reservados.</p>
      </Container>
    </footer>
    </div>
  );
};

export default Inmuebles;
