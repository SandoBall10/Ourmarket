import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './Registro.css';

const Registro: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [documentType, setDocumentType] = useState('DNI');
  const [documentNumber, setDocumentNumber] = useState('');
  const [phone, setPhone] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [acceptDataUsage, setAcceptDataUsage] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!acceptTerms || !acceptDataUsage) {
      alert('Debes aceptar los términos y condiciones y el uso de datos.');
      return;
    }

    setIsLoading(true);
    try {
      // Crear objeto con el formato esperado por el backend
      const cliente = {
        nombreCompleto: name,
        email: email,
        contrasena: password,
        telefono: phone,
        tipoDocumento: documentType === 'DNI' ? 'DNI' : 'CARNET_EXTRANJERIA',
        numeroDocumento: documentNumber,
      };

      const response = await fetch('http://localhost:8080/api/clientes/registrar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(cliente),
      });

      console.log('Respuesta del servidor:', response.status);
      
      if (!response.ok) {
        let errorMessage = 'Error en el registro. Por favor, intenta nuevamente.';
        try {
          const contentType = response.headers.get('content-type');
          if (contentType && contentType.includes('application/json')) {
            const errorData = await response.json();
            console.error('Datos del error:', errorData);
            errorMessage = errorData.message || errorMessage;
          } else {
            const text = await response.text();
            console.error('Respuesta de error:', text);
            errorMessage = text || errorMessage;
          }
        } catch (e) {
          // Si falla el parseo, usa el mensaje por defecto
        }
        throw new Error(errorMessage);
      }

      alert('¡Registro exitoso!');
      navigate('/login');
    } catch (error: any) {
      alert(error.message || 'Error en el registro. Por favor, intenta nuevamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="registro-container">
      <div className="card registro-card shadow-lg p-4">
        <div className="back-button d-flex align-items-center mb-4">
          <Link to="/login" className="text-decoration-none text-dark">
            <i className="bi bi-arrow-left me-2"></i>
            <span>Volver al login</span>
          </Link>
        </div>

        <h2 className="registro-title text-center">
          <i className="bi bi-person-plus-fill me-2"></i>
          Crear nueva cuenta
        </h2>

        <form onSubmit={handleSubmit} className="row g-3">
          {/* Email */}
          <div className="col-md-6">
            <label htmlFor="email" className="form-label">Correo Electrónico</label>
            <div className="input-group">
              <span className="input-group-text">
                <i className="bi bi-envelope-fill"></i>
              </span>
              <input
                type="email"
                className="form-control"
                id="email"
                placeholder="correo@ejemplo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Password */}
          <div className="col-md-6">
            <label htmlFor="password" className="form-label">Contraseña</label>
            <div className="input-group">
              <span className="input-group-text">
                <i className="bi bi-lock-fill"></i>
              </span>
              <input
                type="password"
                className="form-control"
                id="password"
                placeholder="********"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Name */}
          <div className="col-md-6">
            <label htmlFor="name" className="form-label">Nombre Completo</label>
            <div className="input-group">
              <span className="input-group-text">
                <i className="bi bi-person-fill"></i>
              </span>
              <input
                type="text"
                className="form-control"
                id="name"
                placeholder="Tu nombre completo"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Phone */}
          <div className="col-md-6">
            <label htmlFor="phone" className="form-label">Teléfono</label>
            <div className="input-group">
              <span className="input-group-text">
                <i className="bi bi-telephone-fill"></i>
              </span>
              <input
                type="tel"
                className="form-control"
                id="phone"
                placeholder="123456789"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Document Type */}
          <div className="col-md-6">
            <label htmlFor="documentType" className="form-label">Tipo de Documento</label>
            <div className="input-group">
              <span className="input-group-text">
                <i className="bi bi-card-text"></i>
              </span>
              <select
                className="form-select"
                id="documentType"
                value={documentType}
                onChange={(e) => setDocumentType(e.target.value)}
                required
              >
                <option value="DNI">DNI</option>
                <option value="Carnet de Extranjería">Carnet de Extranjería</option>
              </select>
            </div>
          </div>

          {/* Document Number */}
          <div className="col-md-6">
            <label htmlFor="documentNumber" className="form-label">Número de Documento</label>
            <div className="input-group">
              <span className="input-group-text">
                <i className="bi bi-hash"></i>
              </span>
              <input
                type="text"
                className="form-control"
                id="documentNumber"
                placeholder={`Número de ${documentType}`}
                value={documentNumber}
                onChange={(e) => setDocumentNumber(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Terms and Conditions */}
          <div className="col-12 mt-4">
            <div className="form-check mb-3">
              <input
                className="form-check-input"
                type="checkbox"
                id="acceptTerms"
                checked={acceptTerms}
                onChange={(e) => setAcceptTerms(e.target.checked)}
              />
              <label className="form-check-label" htmlFor="acceptTerms">
                <i className="bi bi-shield-check me-2"></i>
                Acepto los Términos y Condiciones
              </label>
            </div>

            <div className="form-check mb-4">
              <input
                className="form-check-input"
                type="checkbox"
                id="acceptDataUsage"
                checked={acceptDataUsage}
                onChange={(e) => setAcceptDataUsage(e.target.checked)}
              />
              <label className="form-check-label" htmlFor="acceptDataUsage">
                <i className="bi bi-shield-lock me-2"></i>
                Autorizo el uso de mis datos personales
              </label>
            </div>

            <button 
              type="submit" 
              className="btn btn-primary w-100"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  Procesando...
                </>
              ) : (
                <>
                  <i className="bi bi-person-plus-fill me-2"></i>
                  Crear cuenta
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Registro;