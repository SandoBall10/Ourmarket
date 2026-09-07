import React, { useState } from 'react';
import './Principal.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import AppNavbar from './layout/AppNavbar';

const Principal: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('comprar');
  const [selectedAction, setSelectedAction] = useState('comprar');
  const [heroQuery, setHeroQuery] = useState('');

  return (
    <div className="full-width-container">
      <AppNavbar />

      {/* Hero Section with Dynamic Background */}
      <div className={`search-hero ${activeTab === 'vender' ? 'vender-bg' : 'comprar-bg'}`}>
        <Container>
          <Row className="justify-content-center">
            <Col xs={12} className="text-center">
              <h1>{activeTab === 'vender' ? 'Publica tu propiedad' : 'Encuentra tu hogar'}</h1>
            </Col>
          </Row>
        </Container>

        {/* Search Box */}
        <div className="search-box">
          {/* Search Tabs */}
          <div className="search-tabs">
            <button
              className={`search-tab-btn ${activeTab === 'comprar' ? 'active' : ''}`}
              onClick={() => setActiveTab('comprar')}
            >
              Comprar
            </button>
            <button
              className={`search-tab-btn ${activeTab === 'vender' ? 'active' : ''}`}
              onClick={() => setActiveTab('vender')}
            >
              Vender
            </button>
          </div>

          {/* Search Form */}
          <div className="search-form">
            <div className="row g-3">
              <div className="col-12 col-md-4">
                <select className="form-select">
                  <option>Departamento</option>
                  <option>Casa</option>
                  <option>Terreno</option>
                  {activeTab === 'comprar' && (
                    <>
                    </>
                  )}
                </select>
              </div>
              <div className="col-12 col-md-6">
                <input
                  type="text"
                  className="form-control"
                  value={heroQuery}
                  onChange={(e) => setHeroQuery(e.target.value)}
                  placeholder={activeTab === 'comprar'
                    ? "Ingresa ubicaciones o características (ej: piscina)"
                    : "Ingresa la ubicación de tu propiedad"}
                />
              </div>
              <div className="col-12 col-md-2">
                <button 
                  className="btn btn-success w-100"
                  onClick={() => {
                    if (activeTab === 'comprar') {
                      const q = heroQuery.trim();
                      navigate(q ? `/buscar?q=${encodeURIComponent(q)}` : '/buscar');
                    } else {
                      navigate('/vender');
                    }
                  }}
                >
                  {activeTab === 'comprar' ? 'Buscar' : 'Siguiente'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Boxes Section - Smaller and Centered */}
      <Container fluid className="px-0 py-4">
        <Row className="justify-content-center g-0">
          <Col xs={5} sm={4} md={3} lg={2} className="px-1">
            <div
              className={`action-box action-box-comprar rounded shadow-sm p-3 text-center ${selectedAction === 'comprar' ? 'active' : ''}`}
              onClick={() => setSelectedAction('comprar')}
            >
              <h4 className="fw-bold fs-5 mb-1">Comprar</h4>
              <p className="text-muted mb-0 small">Encuentra tu propiedad</p>
            </div>
          </Col>
          <Col xs={5} sm={4} md={3} lg={2} className="px-1">
            <div
              className={`action-box action-box-venta rounded shadow-sm p-3 text-center ${selectedAction === 'venta' ? 'active' : ''}`}
              onClick={() => setSelectedAction('venta')}
            >
              <h4 className="fw-bold fs-5 mb-1">Venta</h4>
              <p className="text-muted mb-0 small">Publica tu propiedad</p>
            </div>
          </Col>
        </Row>
      </Container>

      {/* Information Cards Section - Conditionally rendered based on selectedAction */}
      <Container fluid className="px-0 mt-3">
        {selectedAction === 'comprar' && (
          <Row className="g-0">
            <Col xs={12} md={4} className="pe-md-2 mb-3 mb-md-0">
              <div className="info-card rounded shadow-sm p-4">
                <div className="d-flex align-items-start">
                  <div className="info-icon bg-light-green">
                    <i className="fas fa-coins text-green"></i>
                  </div>
                  <div className="ms-3">
                    <h5 className="fw-bold">Obtén tu crédito hipotecario</h5>
                    <p className="mb-0 text-muted">Simula tu cuota fácil, rápido y de manera 100% online.</p>
                  </div>
                </div>
              </div>
            </Col>

            <Col xs={12} md={4} className="px-md-1 mb-3 mb-md-0">
              <div className="info-card rounded shadow-sm p-4">
                <div className="d-flex align-items-start">
                  <div className="info-icon bg-light-pink">
                    <i className="fas fa-file-alt text-pink"></i>
                  </div>
                  <div className="ms-3">
                    <h5 className="fw-bold">Guía para comprar</h5>
                    <p className="mb-0 text-muted">Lo que necesitas saber para comprar tu próximo hogar en un solo lugar.</p>
                  </div>
                </div>
              </div>
            </Col>

            <Col xs={12} md={4} className="ps-md-2">
              <div className="info-card rounded shadow-sm p-4">
                <div className="d-flex align-items-start">
                  <div className="info-icon bg-light-teal">
                    <i className="fas fa-bullhorn text-teal"></i>
                  </div>
                  <div className="ms-3">
                    <h5 className="fw-bold">Conoce InmoMarket</h5>
                    <p className="mb-0 text-muted">Toda la información sobre cómo usar nuestro portal ¡y mucho más!</p>
                  </div>
                </div>
              </div>
            </Col>
          </Row>
        )}

        {selectedAction === 'venta' && (
          <Row className="g-0">
            <Col xs={12} md={4} className="pe-md-2 mb-3 mb-md-0">
              <div className="info-card rounded shadow-sm p-4">
                <div className="d-flex align-items-start">
                  <div className="info-icon bg-light-blue">
                    <i className="fas fa-camera text-blue"></i>
                  </div>
                  <div className="ms-3">
                    <h5 className="fw-bold">Prepara tu propiedad</h5>
                    <p className="mb-0 text-muted">Consejos para fotografiar y presentar tu propiedad de forma atractiva.</p>
                  </div>
                </div>
              </div>
            </Col>

            <Col xs={12} md={4} className="px-md-1 mb-3 mb-md-0">
              <div className="info-card rounded shadow-sm p-4">
                <div className="d-flex align-items-start">
                  <div className="info-icon bg-light-orange">
                    <i className="fas fa-dollar-sign text-orange"></i>
                  </div>
                  <div className="ms-3">
                    <h5 className="fw-bold">Valora tu inmueble</h5>
                    <p className="mb-0 text-muted">Determina el precio correcto para vender tu propiedad rápidamente.</p>
                  </div>
                </div>
              </div>
            </Col>

            <Col xs={12} md={4} className="ps-md-2">
              <div className="info-card rounded shadow-sm p-4">
                <div className="d-flex align-items-start">
                  <div className="info-icon bg-light-purple">
                    <i className="fas fa-handshake text-purple"></i>
                  </div>
                  <div className="ms-3">
                    <h5 className="fw-bold">Publicación destacada</h5>
                    <p className="mb-0 text-muted">Aumenta la visibilidad de tu propiedad con opciones de publicación premium.</p>
                  </div>
                </div>
              </div>
            </Col>
          </Row>
        )}
      </Container>

      {/* Property Listings Section - Full Width */}
      <section className="listings-section">
        <div className="container-fluid p-0">
          <div className="listings-content">
            <h2 className="fw-bold mb-4">Listados de inmuebles y terrenos que te pueden interesar</h2>
            <Row className="g-4">
              <Col xs={12} sm={6} md={3}>
                <div className="listing-card rounded border">
                  <div className="d-flex justify-content-between align-items-center p-4">
                    <div>
                      <h5 className="fw-bold mb-1">Inmuebles más vistos</h5>
                    </div>
                    <div className="listing-arrow blue-arrow">
                      <i className="fas fa-arrow-right"></i>
                    </div>
                  </div>
                </div>
              </Col>

              <Col xs={12} sm={6} md={3}>
                <div className="listing-card rounded border">
                  <div className="d-flex justify-content-between align-items-center p-4">
                    <div>
                      <h5 className="fw-bold mb-1">Los inmuebles recién publicados</h5>
                    </div>
                    <div className="listing-arrow orange-arrow">
                      <i className="fas fa-arrow-right"></i>
                    </div>
                  </div>
                </div>
              </Col>

              <Col xs={12} sm={6} md={3}>
                <div className="listing-card rounded border">
                  <div className="d-flex justify-content-between align-items-center p-4">
                    <div>
                      <h5 className="fw-bold mb-1">Inmuebles que bajaron de precio</h5>
                    </div>
                    <div className="listing-arrow green-arrow">
                      <i className="fas fa-arrow-right"></i>
                    </div>
                  </div>
                </div>
              </Col>

              <Col xs={12} sm={6} md={3}>
                <div className="listing-card rounded border">
                  <div className="d-flex justify-content-between align-items-center p-4">
                    <div>
                      <h5 className="fw-bold mb-1">Terrenos recien publicados</h5>
                    </div>
                    <div className="listing-arrow blue-arrow">
                      <i className="fas fa-arrow-right"></i>
                    </div>
                  </div>
                </div>
              </Col>
            </Row>
          </div>
        </div>
      </section>

      {/* Te acompañamos en cada paso Section - Enhanced with Animations */}
      <div className="accompaniment-section py-5">
        <div className="accompaniment-bg-shape"></div>
        <Container>
          <h2 className="section-title fw-bold mb-5 text-center">
            <span className="highlight-text">Te acompañamos in cada paso</span>
          </h2>
          <Row className="g-4 features-container">
            <Col xs={12} md={3} className="feature-col">
              <div className="feature-card text-center p-4">
                <div className="feature-icon-wrapper mb-4">
                  <div className="feature-icon">
                    <i className="fas fa-search"></i>
                  </div>
                </div>
                <h5 className="fw-bold mb-3">Búsqueda clara y rápida</h5>
                <p className="text-muted">Pensamos nuestros filtros y mapas para simplificar tu experiencia en nuestro portal.</p>
                <div className="feature-hover-effect"></div>
              </div>
            </Col>
            <Col xs={12} md={3} className="feature-col">
              <div className="feature-card text-center p-4">
                <div className="feature-icon-wrapper mb-4">
                  <div className="feature-icon">
                    <i className="fas fa-user-circle"></i>
                  </div>
                </div>
                <h5 className="fw-bold mb-3">Tienes tu propia sección</h5>
                <p className="text-muted">Accede de forma fácil y segura a los avisos contactados, favoritos, las notas que creaste y más.</p>
                <div className="feature-hover-effect"></div>
              </div>
            </Col>
            <Col xs={12} md={3} className="feature-col">
              <div className="feature-card text-center p-4">
                <div className="feature-icon-wrapper mb-4">
                  <div className="feature-icon">
                    <i className="fas fa-building"></i>
                  </div>
                </div>
                <h5 className="fw-bold mb-3">Variedad de anunciantes</h5>
                <p className="text-muted">Inmobiliarias y dueños directos de todo el país ofrecen las mejores opciones de inmuebles para ti.</p>
                <div className="feature-hover-effect"></div>
              </div>
            </Col>
            <Col xs={12} md={3} className="feature-col">
              <div className="feature-card text-center p-4">
                <div className="feature-icon-wrapper mb-4">
                  <div className="feature-icon">
                    <i className="fas fa-award"></i>
                  </div>
                </div>
                <h5 className="fw-bold mb-3">¡Somos InmoMarket!</h5>
                <p className="text-muted">Somos una pagina confiable para tu primera Casa o Terreno.</p>
                <div className="feature-hover-effect"></div>
              </div>
            </Col>
          </Row>
        </Container>
      </div>

      {/* Enhanced Footer */}
      <footer className="footer-section">
        {/* Footer Top Section */}
        <div className="footer-top">
          <Container>
            <Row className="footer-row">
              <Col lg={4} md={6} className="mb-4 mb-md-0">
                <div className="footer-brand">
                  <h2 className="text-white mb-3">InmoMarket</h2>
                  <p className="footer-desc">
                    La plataforma inmobiliaria que conecta a compradores y
                    vendedores para hacer realidad sus sueños inmobiliarios.
                  </p>
                  <div className="footer-social">
                    <a href="#" className="social-icon"><i className="fab fa-facebook-f"></i></a>
                    <a href="#" className="social-icon"><i className="fab fa-instagram"></i></a>
                    <a href="#" className="social-icon"><i className="fab fa-twitter"></i></a>
                    <a href="#" className="social-icon"><i className="fab fa-linkedin-in"></i></a>
                    <a href="#" className="social-icon"><i className="fab fa-youtube"></i></a>
                  </div>
                </div>
              </Col>

              <Col lg={2} md={6} className="mb-4 mb-lg-0">
                <h5 className="footer-heading">Comprar</h5>
                <ul className="footer-links">
                  <li><a href="#">Departamentos</a></li>
                  <li><a href="#">Casas</a></li>
                  <li><a href="#">Terrenos</a></li>
                </ul>
              </Col>

              <Col lg={2} md={6} className="mb-4 mb-lg-0">
                <h5 className="footer-heading">Vender</h5>
                <ul className="footer-links">
                  <li><a href="#">Publicar Propiedad</a></li>
                  <li><a href="#">Consejos de Venta</a></li>
                  <li><a href="#">Valoración de Inmuebles</a></li>
                  <li><a href="#">Publicaciones Destacadas</a></li>
                </ul>
              </Col>

              <Col lg={4} md={6}>
                <h5 className="footer-heading">Suscríbete</h5>
                <p className="footer-newsletter-text">
                  Recibe las mejores ofertas inmobiliarias en tu correo
                </p>
                <div className="footer-newsletter">
                  <input type="email" placeholder="Tu correo electrónico" className="footer-input" />
                  <button className="footer-subscribe-btn">Suscribirse</button>
                </div>
                <div className="footer-contact mt-4">
                  <div className="d-flex align-items-center mb-2">
                    <i className="fas fa-phone-alt me-2"></i>
                    <span>(01) 555-1234</span>
                  </div>
                  <div className="d-flex align-items-center">
                    <i className="fas fa-envelope me-2"></i>
                    <span>contacto@inmomarket.com</span>
                  </div>
                </div>
              </Col>
            </Row>
          </Container>
        </div>

        {/* Footer Bottom Section */}
        <div className="footer-bottom">
          <Container>
            <Row className="align-items-center">
              <Col md={6} className="text-center text-md-start">
                <p className="mb-md-0">
                  &copy; {new Date().getFullYear()} InmoMarket. Todos los derechos reservados.
                </p>
              </Col>
              <Col md={6} className="text-center text-md-end footer-links-bottom">
                <a href="#">Política de Privacidad</a>
                <a href="#">Términos y Condiciones</a>
                <a href="#">Mapa del Sitio</a>
              </Col>
            </Row>
          </Container>
        </div>
      </footer>
    </div>
  );
};

export default Principal;