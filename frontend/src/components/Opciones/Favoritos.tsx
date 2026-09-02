import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Badge, Navbar, Nav, NavDropdown, Modal, Carousel } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Favoritos.css';

// Interfaces
interface FavoritoItem {
  id: number;
  titulo: string;
  imagen: string;
  imagenes: string[];
  precio: number;
  ubicacion: string;
  descripcion: string;
  metros: number;
  habitaciones: string;
  tipo: string;
  estado: string;
  idInmueble: number;
  idCliente: number;
  servicios?: string;
  distrito?: string;
  provincia?: string;
  region?: string;
  direccion?: string;
}

interface FavoritoBackend {
  id_inmueble?: number;
  inmuebleId?: number;
}

interface InmuebleBackend {
  id: number;
  idCliente?: number;
  tipo?: string;
  precio?: number;
  direccion?: string;
  distrito?: string;
  provincia?: string;
  region?: string;
  area?: number;
  numhabitaciones?: number;
  habitaciones?: number;
  numHabitaciones?: number;
  imagenes?: string;
  descripcion?: string;
  servicios?: string;
}

interface PublicacionBackend {
  id?: number;
  idPublicacion?: number;
  idInmueble?: number;
  id_inmueble?: number;
  titulo?: string;
  descripcion?: string;
  estado?: string;
  idCliente?: number;
  autorizado?: number;
  inmueble?: InmuebleBackend;
}

interface User {
  id: number;
  nombre: string;
  email: string;
}

const Favoritos: React.FC = () => {
  const [favoritos, setFavoritos] = useState<FavoritoItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [selectedFavorito, setSelectedFavorito] = useState<FavoritoItem | null>(null);
  const navigate = useNavigate();
  
  useEffect(() => {
    // Verificar si el usuario está logueado
    const userData = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    
    if (userData && token) {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      setIsLoggedIn(true);
      cargarFavoritos(parsedUser.id);
    } else {
      setLoading(false);
      navigate('/login');
    }
  }, [navigate]);

  const cargarFavoritos = async (userId: number) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const authToken = token && token.startsWith('Bearer ') ? token : `Bearer ${token}`;
      
      console.log('Cargando favoritos para usuario:', userId);
      
      // 1. Obtener los favoritos del usuario
      const favoritosResponse = await axios.get<FavoritoBackend[]>(`http://localhost:8080/api/favoritos/usuario/${userId}`, {
        headers: {
          'Authorization': authToken
        }
      });
      
      console.log('Favoritos del usuario:', favoritosResponse.data);
      
      if (favoritosResponse.data.length === 0) {
        setFavoritos([]);
        setLoading(false);
        return;
      }
      
      // 2. Obtener todas las publicaciones CON sus inmuebles
      let publicaciones: PublicacionBackend[];
      try {
        const response = await axios.get<PublicacionBackend[]>('http://localhost:8080/api/publicaciones', {
          headers: {
            'Authorization': authToken
          }
        });
        publicaciones = response.data;
      } catch (error) {
        console.error('Error al obtener publicaciones:', error);
        setFavoritos([]);
        setLoading(false);
        return;
      }
      
      console.log('Publicaciones disponibles:', publicaciones.length);
      
      // 3. Obtener todos los inmuebles por separado como backup
      let inmuebles: InmuebleBackend[] = [];
      try {
        const response = await axios.get<InmuebleBackend[]>('http://localhost:8080/api/inmuebles', {
          headers: {
            'Authorization': authToken
          }
        });
        inmuebles = response.data;
        console.log('Inmuebles disponibles:', inmuebles.length);
      } catch (error) {
        console.log('No se pudieron obtener los inmuebles:', error);
      }
      
      // 4. Procesar favoritos
      const publicacionesFavoritas: FavoritoItem[] = [];
      
      for (const favorito of favoritosResponse.data) {
        const inmuebleId = favorito.id_inmueble || favorito.inmuebleId;
        if (inmuebleId === undefined) {
          console.warn('Favorito ignorado porque no contiene un ID de inmueble:', favorito);
          continue;
        }
        console.log('Procesando favorito con inmueble ID:', inmuebleId);
        
        // Primero buscar la publicación
        let publicacion = publicaciones.find((pub) => {
          return pub.inmueble && pub.inmueble.id === inmuebleId;
        });
        
        // Si no se encuentra por inmueble, buscar por otros campos
        if (!publicacion) {
          publicacion = publicaciones.find((pub) => {
            return pub.idInmueble === inmuebleId || pub.id_inmueble === inmuebleId;
          });
        }
        
        // Buscar el inmueble en la lista de inmuebles
        let inmuebleData = null;
        if (publicacion && publicacion.inmueble) {
          inmuebleData = publicacion.inmueble;
        } else {
          inmuebleData = inmuebles.find((inm) => inm.id === inmuebleId);
        }
        
        // Si encontramos el inmueble pero no la publicación, buscar la publicación por el inmueble
        if (inmuebleData && !publicacion) {
          publicacion = publicaciones.find((pub) => {
            return pub.idInmueble === inmuebleId || 
                   (pub.inmueble && pub.inmueble.id === inmuebleId);
          });
        }
        
        if (inmuebleData) {
          console.log('✓ Inmueble encontrado:', inmuebleData.id);
          
          // Crear datos por defecto de publicación si no existe
          if (!publicacion) {
            publicacion = {
              id: inmuebleId,
              idPublicacion: inmuebleId,
              titulo: inmuebleData.direccion || `Propiedad en ${inmuebleData.distrito || 'ubicación no especificada'}`,
              descripcion: inmuebleData.descripcion || 'Sin descripción',
              estado: 'activa',
              idCliente: inmuebleData.idCliente || 0,
              autorizado: 2
            };
            console.log('Publicación creada por defecto para inmueble:', inmuebleId);
          }
          
          const ubicacion = [
            inmuebleData.direccion,
            inmuebleData.distrito,
            inmuebleData.provincia,
            inmuebleData.region
          ].filter(Boolean).join(', ');

          // Procesar las imágenes como array
          const imagenesArray = inmuebleData.imagenes
            ? inmuebleData.imagenes.split(';').filter((img: string) => img.trim() !== '').map((img: string) => `http://localhost:8080/assets/inmuebles/${img}`)
            : [];

          console.log('Datos del inmueble para debugging:', {
            id: inmuebleData.id,
            numhabitaciones: inmuebleData.numhabitaciones,
            habitaciones: inmuebleData.habitaciones,
            numHabitaciones: inmuebleData.numHabitaciones,
            area: inmuebleData.area,
            allFields: Object.keys(inmuebleData)
          });

          const publicacionFavorita: FavoritoItem = {
            id: publicacion.idPublicacion ?? publicacion.id ?? inmuebleId,
            tipo: inmuebleData.tipo || 'casa',
            titulo: publicacion.titulo || inmuebleData.direccion || 'Sin título',
            precio: inmuebleData.precio ?? 0,
            ubicacion: ubicacion || 'Ubicación no especificada',
            metros: inmuebleData.area ?? 0,
            habitaciones: String(inmuebleData.numhabitaciones ?? inmuebleData.habitaciones ?? inmuebleData.numHabitaciones ?? ''),
            imagen: imagenesArray[0] || 'https://via.placeholder.com/400x300?text=Sin+Imagen',
            imagenes: imagenesArray,
            estado: publicacion.estado || 'activa',
            descripcion: inmuebleData.descripcion || publicacion.descripcion || 'Sin descripción',
            idCliente: publicacion.idCliente ?? inmuebleData.idCliente ?? 0,
            idInmueble: inmuebleData.id,
            servicios: inmuebleData.servicios || '',
            distrito: inmuebleData.distrito || '',
            provincia: inmuebleData.provincia || '',
            region: inmuebleData.region || '',
            direccion: inmuebleData.direccion || '',
          };

          console.log('Datos finales de la publicación favorita:', {
            id: publicacionFavorita.id,
            titulo: publicacionFavorita.titulo,
            habitaciones: publicacionFavorita.habitaciones,
            metros: publicacionFavorita.metros
          });

          console.log('✓ Agregando publicación favorita:', publicacionFavorita.titulo);
          publicacionesFavoritas.push(publicacionFavorita);
        } else {
          console.log('✗ No se encontró inmueble con ID:', inmuebleId);
        }
      }
      
      console.log('Total publicaciones favoritas procesadas:', publicacionesFavoritas.length);
      setFavoritos(publicacionesFavoritas);
      
    } catch (error) {
      console.error('Error al cargar favoritos:', error);
      setFavoritos([]);
    } finally {
      setLoading(false);
    }
  };

  // Función para manejar cierre de sesión
  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    setUser(null);
    navigate('/login');
  };

  // Función para eliminar de favoritos - IGUAL QUE EN BUSCAR
  const removeFavorito = async (inmuebleId: number) => {
    if (!user) return;
    
    try {
      const token = localStorage.getItem('token');
      const authToken = token && token.startsWith('Bearer ') ? token : `Bearer ${token}`;
      
      console.log('Eliminando favorito:', { id_cliente: user.id, id_inmueble: inmuebleId });
      
      // USAR EXACTAMENTE EL MISMO MÉTODO QUE EN BUSCAR
      await axios.delete(`http://localhost:8080/api/favoritos/eliminar`, {
        headers: {
          'Authorization': authToken,
          'Content-Type': 'application/json'
        },
        data: {
          id_cliente: user.id,
          id_inmueble: inmuebleId
        }
      });
      
      console.log('Favorito eliminado del servidor');
      
      // ACTUALIZAR ESTADO LOCAL INMEDIATAMENTE - FILTRAR POR idInmueble
      const nuevaListaFavoritos = favoritos.filter(item => item.idInmueble !== inmuebleId);
      setFavoritos(nuevaListaFavoritos);
      
      console.log(`Favorito eliminado. Antes: ${favoritos.length}, Después: ${nuevaListaFavoritos.length}`);
      
      // Cerrar modal si está abierto y es el mismo favorito
      if (selectedFavorito && selectedFavorito.idInmueble === inmuebleId) {
        setShowModal(false);
        setSelectedFavorito(null);
      }
      
      // Mostrar mensaje de éxito
      alert('Favorito eliminado correctamente');
      
    } catch (error: unknown) {
      console.error('Error al eliminar favorito:', error);
      
      // Manejo de errores igual que en Buscar
      if (axios.isAxiosError(error) && error.response) {
        console.error('Response data:', error.response.data);
        console.error('Response status:', error.response.status);
        
        if (error.response.status === 403) {
          alert('No tienes permisos para realizar esta acción. Verifica que hayas iniciado sesión correctamente.');
        } else if (error.response.status === 400) {
          alert('Datos inválidos. Por favor, inténtalo de nuevo.');
        } else {
          alert(`Error al eliminar de favoritos: ${error.response.data.message || error.response.statusText}`);
        }
      } else if (axios.isAxiosError(error) && error.request) {
        console.error('No se recibió respuesta del servidor:', error.request);
        alert('Error de conexión. Verifica que el servidor esté funcionando.');
      } else {
        console.error('Error:', error instanceof Error ? error.message : error);
        alert('Error inesperado. Inténtalo de nuevo.');
      }
    }
  };

  const handleContactar = (publicacion: FavoritoItem) => {
    setShowModal(false);
    navigate('/chats', { 
      state: { 
        publicacionId: publicacion.id,
        inmuebleId: publicacion.idInmueble,
        propietarioId: publicacion.idCliente,
        publicacionTitulo: publicacion.titulo
      } 
    });
  };

  const handleVerDetalle = (publicacion: FavoritoItem) => {
    setSelectedFavorito(publicacion);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedFavorito(null);
  };

  // Función para procesar servicios
  const procesarServicios = (servicios: string) => {
    if (!servicios) return [];
    return servicios.split(',').map(s => s.trim()).filter(s => s.length > 0);
  };

  // (debugEliminarFavorito function removed because it was unused)

  return (
    <div className="favoritos-page">
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
                    as="a"
                    href="/publicaciones"
                    className="nav-link-text"
                    id="comprar-dropdown"
                  >
                    Mis Publicaciones
                  </Nav.Link>
              </div>

              {/* Menú Favoritos */}
              <div className="nav-item mega-dropdown">
                <Nav.Link
                    as="a"
                    href="/mis-favoritos"
                    className="nav-link-text active"
                    id="favoritos-dropdown"
                  >
                    Favoritos
                  </Nav.Link>
              </div>

              {/* Menú Mis Chats */}
              <div className="nav-item mega-dropdown">
                <Nav.Link
                    as="a"
                    href="/chats"
                    className="nav-link-text"
                    id="chats-dropdown"
                  >
                    Mis Chats
                  </Nav.Link>
              </div>
            </Nav>

            <Nav className="ms-auto">
              {/* Notificaciones */}
              <Nav.Link href="#" className="me-2">
                <span className="nav-link-text">Notificaciones <i className="far fa-bell"></i></span>
              </Nav.Link>
              
              {/* Usuario logueado */}
              {isLoggedIn && user ? (
                <NavDropdown
                  title={
                    <div className="avatar-container">
                      <div className="user-avatar">
                        {user.nombre?.charAt(0).toUpperCase() || 'U'}
                      </div>
                      <i className="fas fa-chevron-down avatar-arrow"></i>
                    </div>
                  }
                  id="user-dropdown"
                  align="end"
                  className="custom-dropdown"
                >
                  <NavDropdown.Item as="a" href="/" className="dropdown-item-custom">
                    <div className="icon-wrapper"><i className="fas fa-home"></i></div>
                    <span>Inicio</span>
                  </NavDropdown.Item>
                  <NavDropdown.Divider />
                  <NavDropdown.Item as="a" href="/publicaciones" className="dropdown-item-custom">
                    <div className="icon-wrapper"><i className="far fa-file-alt"></i></div>
                    <span>Mis publicaciones</span>
                  </NavDropdown.Item>
                  <NavDropdown.Item as="a" href="/inmuebles" className="dropdown-item-custom">
                    <div className="icon-wrapper"><i className="bi-house-door-fill"></i></div>
                    <span>Mis inmuebles</span>
                  </NavDropdown.Item>
                  <NavDropdown.Item as="a" href="/favoritos" className="dropdown-item-custom">
                    <div className="icon-wrapper"><i className="far fa-heart"></i></div>
                    <span>Favoritos</span>
                  </NavDropdown.Item>
                  <NavDropdown.Item as="a" href="/chats" className="dropdown-item-custom">
                    <div className="icon-wrapper"><i className="far fa-comments"></i></div>
                    <span>Mis chats</span>
                  </NavDropdown.Item>
                  <NavDropdown.Divider />
                  <NavDropdown.Item as="a" href="/perfil" className="dropdown-item-custom">
                    <div className="icon-wrapper"><i className="far fa-user"></i></div>
                    <span>Mi cuenta</span>
                  </NavDropdown.Item>
                  <NavDropdown.Divider />
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
          <h1 className="favoritos-title">Mis Favoritos</h1>
          
          {/* Contador de favoritos */}
          {favoritos.length > 0 && (
            <Badge bg="primary" className="fs-6">
              {favoritos.length} {favoritos.length === 1 ? 'favorito' : 'favoritos'}
            </Badge>
          )}
        </div>
        
        {loading ? (
          <div className="loading-container d-flex justify-content-center align-items-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Cargando favoritos...</span>
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
            <Link to="/buscar">
              <Button variant="primary">
                <i className="fas fa-search me-2"></i>Explorar propiedades
              </Button>
            </Link>
          </div>
        ) : (
          <Row className="g-4">
            {favoritos.map((item) => (
              <Col xs={12} key={item.id} data-aos="fade-up">
                <Card className="favorito-card overflow-hidden shadow-sm border-0">
                  <Row className="g-0">
                    <Col md={4} className="favorito-img-container">
                      <div className="position-relative h-100">
                        <img 
                          src={item.imagen} 
                          alt={item.titulo} 
                          className="favorito-img w-100 h-100 object-fit-cover"
                          style={{ minHeight: '250px' }}
                        />
                        <Button 
                          variant="light" 
                          className="btn-heart position-absolute top-0 end-0 m-2 rounded-circle p-2"
                          onClick={(e) => {
                            e.stopPropagation();
                            console.log('Datos del item:', item);
                            console.log('Eliminando favorito desde tarjeta:', { 
                              publicacionId: item.id, 
                              inmuebleId: item.idInmueble,
                              item: item
                            });
                            
                            // Asegurar que tenemos un inmuebleId válido
                            const inmuebleIdFinal = item.idInmueble || item.id;
                            removeFavorito(inmuebleIdFinal);
                          }}
                        >
                          <i className="fas fa-heart text-danger"></i>
                        </Button>

                        <Badge className={`estado-badge position-absolute top-0 start-0 m-2 estado-${item.estado}`}>
                          {item.estado.toUpperCase()}
                        </Badge>
                      </div>
                    </Col>
                    <Col md={8}>
                      <Card.Body>
                        <div className="d-flex justify-content-between align-items-start mb-2">
                          <Badge bg="success" className="px-2 py-1">
                            {item.tipo.charAt(0).toUpperCase() + item.tipo.slice(1)}
                          </Badge>
                          <div className="precio-container text-end">
                            <h4 className="mb-0 text-success fw-bold">$ {item.precio.toLocaleString()}</h4>
                          </div>
                        </div>

                        <h5 className="mb-2 fw-bold">{item.titulo}</h5>
                        <p className="text-muted mb-2">
                          <i className="bi bi-geo-alt-fill me-1"></i>
                          {item.ubicacion}
                        </p>
                        
                        <div className="caracteristicas mb-3">
                          <span className="me-3">
                            <i className="bi bi-rulers me-1"></i>
                            {item.metros}m²
                          </span>
                          {item.habitaciones && item.habitaciones !== '' && item.habitaciones !== '0' && (
                            <span className="me-3">
                              <i className="bi bi-house-door me-1"></i>
                              {item.habitaciones} {parseInt(item.habitaciones) === 1 ? 'habitación' : 'habitaciones'}
                            </span>
                          )}
                        </div>
                        
                        <p className="mb-3 desc-text text-muted">
                          {item.descripcion.length > 150 
                            ? `${item.descripcion.substring(0, 150)}...` 
                            : item.descripcion
                          }
                        </p>
                        
                        <div className="d-flex gap-2 mt-auto">
                          <Button 
                            variant="success" 
                            className="flex-fill"
                            onClick={() => handleContactar(item)}
                          >
                            <i className="bi bi-chat-text-fill me-2"></i>
                            Contactar
                          </Button>
                          <Button 
                            variant="outline-primary"
                            onClick={() => handleVerDetalle(item)}
                          >
                            Ver detalles
                          </Button>
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

      {/* Modal de Detalles */}
      <Modal 
        show={showModal} 
        onHide={handleCloseModal} 
        size="lg" 
        centered
        className="publicacion-modal"
      >
        <Modal.Header closeButton className="border-0 pb-0">
          <Modal.Title className="w-100">
            <div className="d-flex justify-content-between align-items-start">
              <div>
                <h4 className="mb-1 text-dark fw-bold">{selectedFavorito?.titulo}</h4>
                <p className="text-muted mb-0">
                  <i className="bi bi-geo-alt-fill me-1"></i>
                  {selectedFavorito?.ubicacion}
                </p>
              </div>
              <div className="text-end">
                <h3 className="text-success fw-bold mb-0">
                  $ {selectedFavorito?.precio.toLocaleString()}
                </h3>
                <Badge bg="success" className="px-2 py-1">
                  {selectedFavorito?.tipo.charAt(0).toUpperCase()}{selectedFavorito?.tipo.slice(1)}
                </Badge>
              </div>
            </div>
          </Modal.Title>
        </Modal.Header>
        
        <Modal.Body className="p-0">
          {selectedFavorito && (
            <>
              {/* Carrusel de Imágenes */}
              {selectedFavorito.imagenes.length > 0 ? (
                <Carousel className="property-carousel">
                  {selectedFavorito.imagenes.map((imagen, index) => (
                    <Carousel.Item key={index}>
                      <img
                        className="d-block w-100 carousel-image"
                        src={imagen}
                        alt={`Imagen ${index + 1}`}
                        style={{ height: '300px', objectFit: 'cover' }}
                      />
                    </Carousel.Item>
                  ))}
                </Carousel>
              ) : (
                <div className="no-image-placeholder d-flex align-items-center justify-content-center" 
                     style={{ height: '300px', backgroundColor: '#f8f9fa' }}>
                  <div className="text-center">
                    <i className="bi bi-image text-muted" style={{ fontSize: '3rem' }}></i>
                    <p className="text-muted mt-2">Sin imágenes disponibles</p>
                  </div>
                </div>
              )}

              {/* Información Principal */}
              <div className="p-4">
                {/* Características Principales */}
                <div className="row mb-4">
                  <div className="col-md-6 text-center">
                    <div className="feature-box p-3 rounded bg-light">
                      <i className="bi bi-rulers text-primary fs-3"></i>
                      <h6 className="mt-2 mb-0">Área</h6>
                      <p className="mb-0 fw-bold">{selectedFavorito.metros}m²</p>
                    </div>
                  </div>
                  {selectedFavorito.habitaciones && selectedFavorito.habitaciones !== '' && selectedFavorito.habitaciones !== '0' && (
                    <div className="col-md-6 text-center">
                      <div className="feature-box p-3 rounded bg-light">
                        <i className="bi bi-house-door text-primary fs-3"></i>
                        <h6 className="mt-2 mb-0">Habitaciones</h6>
                        <p className="mb-0 fw-bold">
                          {selectedFavorito.habitaciones} 
                          {parseInt(selectedFavorito.habitaciones) === 1 ? ' habitación' : ' habitaciones'}
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Descripción */}
                <div className="mb-4">
                  <h5 className="fw-bold mb-3">
                    <i className="bi bi-text-paragraph me-2 text-primary"></i>
                    Descripción
                  </h5>
                  <p className="text-muted">{selectedFavorito.descripcion}</p>
                </div>

                {/* Servicios */}
                {selectedFavorito.servicios && procesarServicios(selectedFavorito.servicios).length > 0 && (
                  <div className="mb-4">
                    <h5 className="fw-bold mb-3">
                      <i className="bi bi-gear me-2 text-primary"></i>
                      Servicios
                    </h5>
                    <div className="d-flex flex-wrap gap-2">
                      {procesarServicios(selectedFavorito.servicios).map((servicio, index) => (
                        <Badge key={index} bg="outline-primary" className="px-3 py-2 border border-primary text-primary">
                          {servicio}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Ubicación Detallada */}
                <div className="mb-4">
                  <h5 className="fw-bold mb-3">
                    <i className="bi bi-geo-alt me-2 text-primary"></i>
                    Ubicación
                  </h5>
                  <div className="row">
                    {selectedFavorito.direccion && (
                      <div className="col-md-6 mb-2">
                        <strong>Dirección:</strong> {selectedFavorito.direccion}
                      </div>
                    )}
                    {selectedFavorito.distrito && (
                      <div className="col-md-6 mb-2">
                        <strong>Distrito:</strong> {selectedFavorito.distrito}
                      </div>
                    )}
                    {selectedFavorito.provincia && (
                      <div className="col-md-6 mb-2">
                        <strong>Provincia:</strong> {selectedFavorito.provincia}
                      </div>
                    )}
                    {selectedFavorito.region && (
                      <div className="col-md-6 mb-2">
                        <strong>Región:</strong> {selectedFavorito.region}
                      </div>
                    )}
                  </div>
                </div>

                {/* Estado */}
                <div className="mb-4">
                  <h5 className="fw-bold mb-3">
                    <i className="bi bi-info-circle me-2 text-primary"></i>
                    Estado
                  </h5>
                  <Badge className={`estado-badge-large estado-${selectedFavorito.estado} px-3 py-2 fs-6`}>
                    {selectedFavorito.estado.toUpperCase()}
                  </Badge>
                </div>
              </div>
            </>
          )}
        </Modal.Body>
        
        <Modal.Footer className="border-0 pt-0">
          <div className="d-flex w-100 gap-2">
            <Button 
              variant="outline-danger"
              onClick={() => {
                if (selectedFavorito) {
                  console.log('Datos del selectedFavorito:', selectedFavorito);
                  console.log('Eliminando favorito desde modal:', { 
                    publicacionId: selectedFavorito.id, 
                    inmuebleId: selectedFavorito.idInmueble,
                    selectedFavorito: selectedFavorito
                  });
                  
                  // Asegurar que tenemos un inmuebleId válido
                  const inmuebleIdFinal = selectedFavorito.idInmueble || selectedFavorito.id;
                  removeFavorito(inmuebleIdFinal);
                }
              }}
            >
              <i className="bi bi-heart-fill me-2"></i>
              Quitar de favoritos
            </Button>
            <Button 
              variant="success" 
              className="flex-fill"
              onClick={() => selectedFavorito && handleContactar(selectedFavorito)}
            >
              <i className="bi bi-chat-text-fill me-2"></i>
              Contactar propietario
            </Button>
          </div>
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

export default Favoritos;
