import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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

  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!acceptTerms || !acceptDataUsage) {
      alert('Debes aceptar los términos y condiciones y el uso de datos.');
      return;
    }
    alert('¡Registro exitoso!');
    navigate('/login'); // Redirige al login después del registro
  };

  return (
    <div className="registro-container d-flex justify-content-center align-items-center vh-100">
      <div className="card registro-card shadow-lg p-5">
        <div className="d-flex align-items-center mb-4">
          <i
            className="fas fa-arrow-left me-2 text-primary"
            style={{ cursor: 'pointer' }}
            onClick={() => navigate('/login')}
          ></i>
          <h6 className="m-0">Atrás</h6>
        </div>
        {/* Nuevo encabezado debajo de "Atrás" */}
        <h3 className="text-center mb-4">Ingresa los datos para crear tu perfil</h3>
        <form onSubmit={handleSubmit}>
          <div className="row">
            <div className="col-md-6 mb-3">
              <label htmlFor="email" className="form-label">Correo Electrónico</label>
              <div className="input-group">
                <span className="input-group-text">
                  <i className="fas fa-envelope"></i>
                </span>
                <input
                  type="email"
                  className="form-control"
                  id="email"
                  placeholder="Ingresa tu correo"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="col-md-6 mb-3">
              <label htmlFor="password" className="form-label">Contraseña</label>
              <div className="input-group">
                <span className="input-group-text">
                  <i className="fas fa-lock"></i>
                </span>
                <input
                  type="password"
                  className="form-control"
                  id="password"
                  placeholder="Crea una contraseña"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="col-md-6 mb-3">
              <label htmlFor="name" className="form-label">Nombre</label>
              <div className="input-group">
                <span className="input-group-text">
                  <i className="fas fa-user"></i>
                </span>
                <input
                  type="text"
                  className="form-control"
                  id="name"
                  placeholder="Ingresa tu nombre"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="col-md-6 mb-3">
              <label htmlFor="phone" className="form-label">Teléfono</label>
              <div className="input-group">
                <span className="input-group-text">
                  <i className="fas fa-phone"></i>
                </span>
                <input
                  type="tel"
                  className="form-control"
                  id="phone"
                  placeholder="Ingresa tu número de teléfono"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="col-md-6 mb-3">
              <label htmlFor="documentType" className="form-label">Tipo de Documento</label>
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
            <div className="col-md-6 mb-3">
              <label htmlFor="documentNumber" className="form-label">Número de Documento</label>
              <div className="input-group">
                <span className="input-group-text">
                  <i className="fas fa-id-card"></i>
                </span>
                <input
                  type="text"
                  className="form-control"
                  id="documentNumber"
                  placeholder={`Ingresa tu ${documentType}`}
                  value={documentNumber}
                  onChange={(e) => setDocumentNumber(e.target.value)}
                  required
                />
              </div>
            </div>
          </div>
          <div className="form-check mb-2">
            <input
              className="form-check-input"
              type="checkbox"
              id="acceptTerms"
              checked={acceptTerms}
              onChange={(e) => setAcceptTerms(e.target.checked)}
            />
            <label className="form-check-label" htmlFor="acceptTerms">
              Acepto los Términos y Condiciones de Uso y las Politicas de Privacidad.
            </label>
          </div>
          <div className="form-check mb-3">
            <input
              className="form-check-input"
              type="checkbox"
              id="acceptDataUsage"
              checked={acceptDataUsage}
              onChange={(e) => setAcceptDataUsage(e.target.checked)}
            />
            <label className="form-check-label" htmlFor="acceptDataUsage">
              Autorizo el uso de mi información para fines adicionales
            </label>
          </div>
          <button type="submit" className="btn btn-primary w-100 mb-3">Registrarse</button>
        </form>
      </div>
    </div>
  );
};

export default Registro;