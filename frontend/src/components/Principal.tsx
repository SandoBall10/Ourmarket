import React, { useState } from 'react';
import './Principal.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Navbar, Nav, Container, Row, Col, Form, Button, Card, NavDropdown } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const Principal: React.FC = () => {
  const navigate = useNavigate();
  const [isComprarOpen, setIsComprarOpen] = useState(false);
  const [isAlquilarOpen, setIsAlquilarOpen] = useState(false);
  const [isServiciosOpen, setIsServiciosOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('comprar');

  const propiedades = [
    { id: 1, titulo: 'Departamento en Miraflores', imagen: 'https://via.placeholder.com/300x200', precio: 'S/ 350,000' },
    { id: 2, titulo: 'Casa en San Isidro', imagen: 'https://via.placeholder.com/300x200', precio: 'S/ 750,000' },
    { id: 3, titulo: 'Terreno en Surco', imagen: 'https://via.placeholder.com/300x200', precio: 'S/ 500,000' },
    { id: 4, titulo: 'Oficina en San Isidro', imagen: 'https://via.placeholder.com/300x200', precio: 'S/ 450,000' },
  ];

  return (
    <div className="full-width-container">
      {/* Barra de Navegación */}
      <Navbar bg="white" expand="lg" className="w-100 border-bottom">
        <Container fluid className="px-4">
          <Navbar.Brand href="#">
            <img 
              src="https://urbania.pe/blog/wp-content/themes/urbania/img/logo.svg" 
              alt="Urbania" 
              height="30" 
              className="d-inline-block align-top"
            />
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="navbar-nav" />
          <Navbar.Collapse id="navbar-nav">
            <Nav className="me-auto">
              {/* Menú Comprar */}
              <NavDropdown 
                title={
                  <span className="nav-link-text">Comprar <i className="fas fa-chevron-down fa-xs"></i></span>
                }
                id="comprar-dropdown"
                className="mega-dropdown"
                show={isComprarOpen}
                onMouseEnter={() => setIsComprarOpen(true)}
                onMouseLeave={() => setIsComprarOpen(false)}
              >
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
                      <Col>
                        <h6 className="fw-bold mb-3">Servicios</h6>
                        <ul className="list-unstyled">
                          <li>Guía para comprar un inmueble</li>
                          <li>Publica un inmueble para venta</li>
                        </ul>
                      </Col>
                      <Col>
                        <h6 className="fw-bold mb-3">Otras operaciones</h6>
                        <ul className="list-unstyled">
                          <li>Proyectos</li>
                        </ul>
                      </Col>
                    </Row>
                  </Container>
                </div>
              </NavDropdown>
              
              {/* Menú Alquilar */}
              <NavDropdown 
                title={
                  <span className="nav-link-text">Alquilar <i className="fas fa-chevron-down fa-xs"></i></span>
                }
                id="alquilar-dropdown"
                className="mega-dropdown"
                show={isAlquilarOpen}
                onMouseEnter={() => setIsAlquilarOpen(true)}
                onMouseLeave={() => setIsAlquilarOpen(false)}
              >
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
                      <Col>
                        <h6 className="fw-bold mb-3">Servicios</h6>
                        <ul className="list-unstyled">
                          <li>Publicar propiedad en alquiler</li>
                          <li>Guía para alquilar</li>
                        </ul>
                      </Col>
                      <Col>
                        <h6 className="fw-bold mb-3">Otras operaciones</h6>
                        <ul className="list-unstyled">
                          <li>Alquiler temporal</li>
                          <li>Alquiler vacacional</li>
                        </ul>
                      </Col>
                    </Row>
                  </Container>
                </div>
              </NavDropdown>
              
              {/* Menú Servicios */}
              <NavDropdown 
                title={
                  <span className="nav-link-text">Servicios <i className="fas fa-chevron-down fa-xs"></i></span>
                }
                id="servicios-dropdown"
                className="mega-dropdown"
                show={isServiciosOpen}
                onMouseEnter={() => setIsServiciosOpen(true)}
                onMouseLeave={() => setIsServiciosOpen(false)}
              >
                <div className="mega-menu-wrapper">
                  <Container fluid className="mega-menu-container py-4 px-4">
                    <Row>
                      <Col>
                        <h6 className="fw-bold mb-3">Para propietarios</h6>
                        <ul className="list-unstyled">
                          <li>Vender inmuebles</li>
                          <li>Alquilar inmuebles</li>
                          <li>Promocionar proyectos</li>
                        </ul>
                      </Col>
                      <Col>
                        <h6 className="fw-bold mb-3">Para compradores</h6>
                        <ul className="list-unstyled">
                          <li>Guía de compra</li>
                          <li>Financiamiento</li>
                          <li>Tasaciones</li>
                        </ul>
                      </Col>
                      <Col>
                        <h6 className="fw-bold mb-3">Otros servicios</h6>
                        <ul className="list-unstyled">
                          <li>Blog inmobiliario</li>
                          <li>Asesoría legal</li>
                          <li>Atención al cliente</li>
                        </ul>
                      </Col>
                    </Row>
                  </Container>
                </div>
              </NavDropdown>
              
              {/* Buscar inmobiliarias */}
              <Nav.Link href="#" className="nav-link-text">Buscar inmobiliarias</Nav.Link>
            </Nav>
            
            <Nav className="ms-auto">
              {/* Notificaciones */}
              <Nav.Link href="#" className="me-2">
                <span className="nav-link-text">Notificaciones <i className="far fa-bell"></i></span>
              </Nav.Link>
              
              {/* Mis contactos */}
              <Nav.Link href="#" className="me-2">
                <span className="nav-link-text">Mis contactos <i className="far fa-comment"></i></span>
              </Nav.Link>
              
              {/* Publicar */}
              <Nav.Link href="#" className="me-2">
                <Button 
                  variant="outline-dark" 
                  className="me-2 btn-publicar"
                >
                  Publicar
                </Button>
              </Nav.Link>
              
              {/* Ingresar */}
              <Nav.Link href="#">
                <Button 
                  variant="success" 
                  className="btn-ingresar"
                  onClick={() => navigate('/login')}
                >
                  Ingresar
                </Button>
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* Hero Section con búsqueda */}
      <div className="search-hero" style={{
        backgroundImage: 'url("https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        minHeight: '550px',
        display: 'flex',
        alignItems: 'center',
        position: 'relative'
      }}>
        <div className="search-overlay" style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.4)'
        }}></div>
        
        <Container className="position-relative" style={{zIndex: 1}}>
          <h1 className="text-center mb-5 text-white display-4 fw-bold">Encuentra tu hogar</h1>
          
          <div className="search-box bg-white p-4 rounded mx-auto" style={{maxWidth: '1200px'}}>
            {/* Tabs de Comprar/Vender */}
            <ul className="nav nav-tabs border-0 mb-4">
              <li className="nav-item">
                <a 
                  className={`nav-link px-4 border-0 ${activeTab === 'comprar' ? 'active fw-bold' : 'text-dark'}`}
                  style={activeTab === 'comprar' ? {borderBottom: '3px solid #136254', color: '#136254'} : {}}
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    setActiveTab('comprar');
                  }}
                >
                  Comprar
                </a>
              </li>
              <li className="nav-item">
                <a 
                  className={`nav-link px-4 border-0 ${activeTab === 'vender' ? 'active fw-bold' : 'text-dark'}`}
                  style={activeTab === 'vender' ? {borderBottom: '3px solid #136254', color: '#136254'} : {}}
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    setActiveTab('vender');
                  }}
                >
                  Vender
                </a>
              </li>
            </ul>
            
            {/* Formulario de búsqueda */}
            <Form className="search-form">
              <Row className="align-items-center g-3">
                <Col xs={12} md={3}>
                  {/* Asegúrate que el ícono esté colocado correctamente */}
                  <div className="position-relative">
                    <Form.Select 
                      className="py-3 border-1 select-dark" 
                      style={{
                        color: 'black',
                        fontWeight: '600',
                        fontSize: '18px',
                        paddingLeft: '15px',
                        paddingRight: '30px', // Añade más espacio a la derecha para el ícono
                        backgroundColor: 'white',
                        border: '1px solid #ced4da'
                      }}
                    >
                      <option>Departamento</option>
                      <option>Casa</option>
                      <option>Terreno</option>
                      {activeTab === 'comprar' && (
                        <>
                          <option>Oficina</option>
                          <option>Local Comercial</option>
                        </>
                      )}
                    </Form.Select>
                    <i className="fas fa-chevron-down select-icon"></i>
                  </div>
                </Col>
                <Col xs={12} md={7}>
                  <Form.Control 
                    type="text" 
                    placeholder={activeTab === 'comprar' 
                      ? "Ingresa ubicaciones o características (ej: piscina)" 
                      : "Ingresa la ubicación de tu propiedad"}
                    className="py-3 border-1"
                  />
                </Col>
                <Col xs={12} md={2}>
                  <Button 
                    variant="success" 
                    type="submit" 
                    className="w-100 py-3 fw-bold text-white"
                    style={{backgroundColor: '#136254', borderColor: '#136254'}}
                  >
                    {activeTab === 'comprar' ? 'Buscar' : 'Siguiente'}
                  </Button>
                </Col>
              </Row>
            </Form>
          </div>
        </Container>
      </div>

      {/* Propiedades destacadas */}
      <Container fluid className="px-4 py-5">
        <h3 className="mb-4">Propiedades Destacadas</h3>
        <Row className="g-4">
          {propiedades.map((propiedad) => (
            <Col xs={12} sm={6} lg={3} key={propiedad.id}>
              <Card className="h-100 shadow-sm">
                <Card.Img variant="top" src={propiedad.imagen} />
                <Card.Body>
                  <Card.Title>{propiedad.titulo}</Card.Title>
                  <Card.Text>{propiedad.precio}</Card.Text>
                  <Button variant="outline-primary" size="sm">Ver detalles</Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>

      {/* Footer */}
      <footer className="bg-light py-4 w-100">
        <Container fluid className="px-4">
          <Row>
            <Col md={6}>
              <p>&copy; {new Date().getFullYear()} Urbania. Todos los derechos reservados.</p>
            </Col>
            <Col md={6} className="text-md-end">
              <a href="#privacidad">Política de Privacidad</a> |{' '}
              <a href="#terminos">Términos y Condiciones</a>
            </Col>
          </Row>
        </Container>
      </footer>
    </div>
  );
};

export default Principal;