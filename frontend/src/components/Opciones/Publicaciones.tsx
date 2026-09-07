import React, { useState, useEffect } from 'react';
import { Navbar, Container, Nav, Form, Button, Card, Badge, NavDropdown } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import './Publicaciones.css';
import AOS from 'aos';
import 'aos/dist/aos.css';
import axios from 'axios';
import { API_BASE_URL } from '../../api/config';
import Carousel from 'react-bootstrap/Carousel';
import Modal from 'react-bootstrap/Modal';

interface Publicacion {
  id: number;
  tipo: 'casa' | 'departamento' | 'terreno';
  titulo: string;
  precio: number;
  ubicacion: string;
  metros: number;
  habitaciones?: number;
  banos?: number;
  imagenes: string[];
  estado: 'activa' | 'vendida' | 'reservada';
  descripcion?: string;
  autorizado?: boolean; // <-- agrega esto
  propietarioEmail?: string; // <-- agrega esto para evitar el error
}

const Publicaciones: React.FC = () => {
  const navigate = useNavigate();
  const [publicaciones, setPublicaciones] = useState<Publicacion[]>([]);
  const [filtroTipo, setFiltroTipo] = useState<string>('todos');
  const [filtroEstado, setFiltroEstado] = useState<string>('todos');
  const [busqueda, setBusqueda] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Estados para la autenticación
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  interface User {
    name?: string;
    // Agrega aquí otras propiedades del usuario si las necesitas
  }
  
    const [user, setUser] = useState<User | null>(null);

  // Nuevo estado para el modal
  const [showModal, setShowModal] = useState(false);
  const [publicacionEdit, setPublicacionEdit] = useState<Publicacion | null>(null);
  const [editTitulo, setEditTitulo] = useState('');
  const [editDescripcion, setEditDescripcion] = useState('');
  const [saving, setSaving] = useState(false);

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

    // Cargar publicaciones reales
    const cargarPublicaciones = async () => {
      setIsLoading(true);
      try {
        const token = localStorage.getItem('token');
        const user = userData ? JSON.parse(userData) : null;
        const authToken = token && token.startsWith('Bearer ') ? token : `Bearer ${token}`;
        const response = await axios.get(API_BASE_URL + '/api/publicaciones', {
          headers: { 'Authorization': authToken }
        });

        // Mapea la respuesta a tu interfaz Publicacion
        interface ApiPublicacion {
          idPublicacion?: number;
          id?: number;
          id_publicacion?: number;
          titulo: string;
          estado?: string;
          descripcion?: string;
          autorizado?: boolean;
          inmueble?: {
            tipo?: string;
            precio?: number;
            direccion?: string;
            distrito?: string;
            area?: number;
            num_habitaciones?: number;
            numero_habitaciones?: number;
            num_banos?: number;
            numero_banos?: number;
            imagenes?: string;
            cliente?: {
              email?: string;
              // otros campos si necesitas
            }
          };
        }

        let publicacionesMapeadas: Publicacion[] = response.data.map(
          (pub: ApiPublicacion) => {
            const inm = pub.inmueble || {};
            let imagenes: string[] = [];
            if (inm.imagenes) {
              imagenes = inm.imagenes
                .split(';')
                .filter((img: string) => img.trim() !== '')
                .map((img: string) => `${API_BASE_URL}/assets/inmuebles/${img}`);
            }
            return {
              id: pub.idPublicacion ?? pub.id ?? pub.id_publicacion,
              tipo: inm.tipo || 'casa',
              titulo: pub.titulo,
              precio: inm.precio ?? 0,
              ubicacion: `${inm.direccion || ''}${inm.distrito ? ', ' + inm.distrito : ''}`,
              metros: inm.area ?? 0,
              habitaciones: inm.num_habitaciones ?? inm.numero_habitaciones,
              banos: inm.num_banos ?? inm.numero_banos,
              imagenes,
              estado: pub.estado || 'activa',
              descripcion: pub.descripcion || '',
              autorizado: pub.autorizado ?? false,
              propietarioEmail: inm.cliente?.email ?? '', // <-- ASIGNA EL EMAIL DEL DUEÑO AQUÍ
            };
          }
        );
        // Filtrar si es cliente
    if (user?.rol === 'ROLE_CLIENTE') {
      // Filtra publicaciones del cliente autenticado usando el email
      publicacionesMapeadas = publicacionesMapeadas.filter((_, idx) =>
        response.data[idx]?.inmueble?.cliente?.email === user.name
      );
    }
        setPublicaciones(publicacionesMapeadas);

        // Filtra publicaciones según el usuario autenticado
        // (Esta lógica ya está implementada fuera del useEffect)

      } catch {
        setPublicaciones([]);
      }
      setIsLoading(false);
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

  // Función para guardar cambios en la publicación
  const handleGuardarEdicion = async () => {
    if (!publicacionEdit) return;
    setSaving(true);

    // Verifica usuario dueño
    if (user?.name !== publicacionEdit?.propietarioEmail) {
      alert('Solo el dueño puede editar esta publicación.');
      setSaving(false);
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const authToken = token && token.startsWith('Bearer ') ? token : `Bearer ${token}`;
      // Solo envía los campos requeridos
      await axios.put(
        `${API_BASE_URL}/api/publicaciones/${publicacionEdit.id}`,
        {
          titulo: editTitulo,
          descripcion: editDescripcion
        },
        {
          headers: {
            'Authorization': authToken,
            'Content-Type': 'application/json'
          }
        }
      );
      setPublicaciones(prev =>
        prev.map(p =>
          p.id === publicacionEdit.id
            ? { ...p, titulo: editTitulo, descripcion: editDescripcion }
            : p
        )
      );
      setShowModal(false);
    } catch {
      alert('Error al actualizar la publicación');
    }
    setSaving(false);
  };

  const handleEditar = (pub: Publicacion) => {
    setPublicacionEdit(pub);
    setEditTitulo(pub.titulo);
    setEditDescripcion(pub.descripcion || '');
    setShowModal(true);
  };

  return (
    <div className="publicaciones-page">
      {/* Barra de Navegación */}
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
                  to="/favoritos"
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

      <div className="publicaciones-container">
        <div className="filtros-section" data-aos="fade-down">
          <h2>Mis Publicaciones</h2>
          <div className="row g-3">
            <div className="col-12 col-md-4">
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
            <div className="col-12 col-md-3">
              <Form.Select
                value={filtroEstado}
                onChange={(e) => setFiltroEstado(e.target.value)}
                className="filtro-select"
              >
                <option value="todos">Todos los estados</option>
                <option value="activa">Activas</option>
                <option value="vendida">Vendidas</option>
                <option value="reservada">Reservadas</option>
              </Form.Select>
            </div>
            <div className="col-12 col-md-2">
              <Button
                className="nuevo-inmueble-btn w-100"
                onClick={() => navigate('/vender')}
              >
                <i className="bi bi-plus-circle me-2"></i>
                Nueva
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
                <Card.Body style={{ padding: 0 }}>
                  <div
                    className="imagen-container"
                    style={{
                      height: 180,
                      width: '100%',
                      overflow: 'hidden',
                      borderTopLeftRadius: 12,
                      borderTopRightRadius: 12,
                      position: 'relative',
                      background: '#eee'
                    }}
                  >
                    {pub.imagenes && pub.imagenes.length > 0 ? (
                      <Carousel
                        interval={null}
                        indicators={pub.imagenes.length > 1}
                        style={{ height: 180 }}
                        controls={pub.imagenes.length > 1}
                      >
                        {pub.imagenes.map((img, idx) => (
                          <Carousel.Item key={idx} style={{ height: 180 }}>
                            <img
                              src={img}
                              alt={`Imagen ${idx + 1}`}
                              style={{
                                width: '100%',
                                height: 180,
                                objectFit: 'cover',
                                borderTopLeftRadius: 12,
                                borderTopRightRadius: 12
                              }}
                              onError={e => {
                                (e.target as HTMLImageElement).src = API_BASE_URL + '/assets/inmuebles/img_default.jpg';
                              }}
                            />
                          </Carousel.Item>
                        ))}
                      </Carousel>
                    ) : (
                      <div
                        style={{
                          width: '100%',
                          height: 180,
                          background: '#eee',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#aaa',
                          borderTopLeftRadius: 12,
                          borderTopRightRadius: 12
                        }}
                      >
                        Sin imágenes
                      </div>
                    )}
                    <Badge
                      className={`estado-badge estado-${pub.estado}`}
                      style={{
                        position: 'absolute',
                        top: 12,
                        right: 12,
                        zIndex: 2,
                        fontSize: 14,
                        padding: '6px 16px'
                      }}
                    >
                      {pub.estado.toUpperCase()}
                    </Badge>
                  </div>
                  {/* El resto del contenido de la tarjeta */}
                  <div style={{ padding: 16 }}>
                    <Card.Title>{pub.titulo}</Card.Title>
                    {pub.autorizado === false ? (
                      <Badge bg="warning" text="dark" className="mb-2">
                        Pendiente de aprobación
                      </Badge>
                    ) : (
                      <Badge bg="success" className="mb-2">
                        Aprobado
                      </Badge>
                    )}
                    <div className="detalles">
                      <p className="precio">S/. {pub.precio.toLocaleString()}</p>
                      <p className="ubicacion">
                        <i className="bi bi-geo-alt-fill"></i> {pub.ubicacion}
                      </p>
                      <div className="caracteristicas">
                        <span>
                          <i className="bi bi-rulers"></i> {pub.metros}m²
                        </span>
                        {pub.habitaciones && (
                          <span>
                            <i className="bi bi-house-door"></i> {pub.habitaciones} hab.
                          </span>
                        )}
                        {pub.banos && (
                          <span>
                            <i className="bi bi-water"></i> {pub.banos} baños
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="acciones">
                      <Button
                        variant="outline-primary"
                        size="sm"
                        onClick={() => handleEditar(pub)}
                      >
                        <i className="bi bi-pencil-fill"></i> Editar
                      </Button>
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={async () => {
                          if (window.confirm('¿Estás seguro de eliminar esta publicación?')) {
                            try {
                              const token = localStorage.getItem('token');
                              const authToken = token && token.startsWith('Bearer ') ? token : `Bearer ${token}`;
                              await axios.delete(
                                `${API_BASE_URL}/api/publicaciones/${pub.id}`,
                                {
                                  headers: {
                                    'Authorization': authToken
                                  }
                                }
                              );
                              setPublicaciones(prev => prev.filter(p => p.id !== pub.id));
                            } catch {
                              alert('Error al eliminar la publicación');
                            }
                          }
                        }}
                      >
                        <i className="bi bi-trash-fill"></i> Eliminar
                      </Button>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            ))
          )}
        </div>
      </div>

      {/* Modal para editar publicación */}
      <Modal
        show={showModal}
        onHide={() => setShowModal(false)}
        centered
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>Editar publicación</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Título</Form.Label>
              <Form.Control
                type="text"
                value={editTitulo}
                onChange={e => setEditTitulo(e.target.value)}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Descripción</Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                value={editDescripcion}
                onChange={e => setEditDescripcion(e.target.value)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancelar
          </Button>
          <Button variant="success" onClick={handleGuardarEdicion} disabled={saving}>
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

export default Publicaciones;