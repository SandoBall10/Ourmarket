import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button, Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import './Vender.css';
import AOS from 'aos';
import 'aos/dist/aos.css';

const Vender: React.FC = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [operationType, setOperationType] = useState<string>('venta');
  const [propertyType, setPropertyType] = useState<string>('');
  const [propertySubtype, setPropertySubtype] = useState<string>('');
  const [userName, setUserName] = useState<string>('');

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

  // Continuar al siguiente paso
  const handleContinue = () => {
    handleStepChange(currentStep + 1);
  };

  // Guardar y salir
  const handleSaveAndExit = () => {
    // Lógica para guardar el progreso
    navigate('/mis-publicaciones');
  };

  return (
    <div className="vender-page">
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
          </Col>
          
          {/* Contenido principal */}
          <Col md={9}>
            <div className="main-content" data-aos="fade-up">
              <h2 className="greeting-text">¡Hola {userName}, empecemos a crear tu aviso!</h2>
              
              {currentStep === 1 && (
                <div className="step-content" data-aos="fade-in">
                  <h3 className="mb-4">Cuéntanos, ¿qué quieres publicar?</h3>
                  
                  <Form.Group className="mb-4">
                    <Form.Label><i className="bi bi-tags me-2"></i>Tipo de operación</Form.Label>
                    <div className="operation-type-buttons">
                      <Button 
                        variant={operationType === 'venta' ? 'success' : 'outline-secondary'}
                        className="operation-btn"
                        onClick={() => setOperationType('venta')}
                      >
                        <i className="bi bi-cash-coin me-2"></i>Venta
                      </Button>
                      <Button 
                        variant={operationType === 'alquiler' ? 'success' : 'outline-secondary'}
                        className="operation-btn"
                        onClick={() => setOperationType('alquiler')}
                      >
                        <i className="bi bi-calendar-date me-2"></i>Alquiler
                      </Button>
                      <Button 
                        variant={operationType === 'temporada' ? 'success' : 'outline-secondary'}
                        className="operation-btn"
                        onClick={() => setOperationType('temporada')}
                      >
                        <i className="bi bi-sun me-2"></i>Temporada
                      </Button>
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
                          <option value="local">Local comercial</option>
                          <option value="oficina">Oficina</option>
                        </Form.Select>
                      </Form.Group>
                    </Col>
                    
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label><i className="bi bi-building-add me-2"></i>Subtipo de inmueble</Form.Label>
                        <Form.Select 
                          value={propertySubtype}
                          onChange={(e) => setPropertySubtype(e.target.value)}
                          disabled={!propertyType}
                        >
                          <option value="">Selecciona...</option>
                          {propertyType === 'casa' && (
                            <>
                              <option value="casa_standard">Casa estándar</option>
                              <option value="casa_campo">Casa de campo</option>
                              <option value="casa_playa">Casa de playa</option>
                              <option value="duplex">Dúplex</option>
                            </>
                          )}
                          {propertyType === 'departamento' && (
                            <>
                              <option value="depto_standard">Departamento estándar</option>
                              <option value="penthouse">Penthouse</option>
                              <option value="loft">Loft</option>
                            </>
                          )}
                        </Form.Select>
                      </Form.Group>
                    </Col>
                  </Row>
                </div>
              )}
              
              {currentStep === 2 && (
                <div className="step-content" data-aos="fade-in">
                  <h3>Cuéntanos más sobre la ubicación</h3>
                  {/* Contenido del paso 2 */}
                </div>
              )}
              
              {currentStep === 3 && (
                <div className="step-content" data-aos="fade-in">
                  <h3>Características de la propiedad</h3>
                  {/* Contenido del paso 3 */}
                </div>
              )}
              
              {currentStep === 4 && (
                <div className="step-content" data-aos="fade-in">
                  <h3>Añade fotos y videos de tu propiedad</h3>
                  {/* Contenido del paso 4 */}
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
                
                <Button 
                  variant="success"
                  onClick={handleContinue}
                  className="continue-btn"
                  disabled={currentStep === 4}
                >
                  Continuar
                  <i className="bi bi-arrow-right ms-2"></i>
                </Button>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Vender;