import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom'; // Importa Link
import './Login.css';
// Removed unused import for Registro

const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    setTimeout(() => {
      if (username === 'admin' && password === 'admin') {
        setError('');
        
        // Guardar información del usuario en localStorage
        localStorage.setItem('user', JSON.stringify({
          name: username,
          isLoggedIn: true,
          avatarLetter: username.charAt(0).toUpperCase()
        }));
        
        navigate('/'); // Redirige al componente Principal
      } else {
        setError('Usuario o contraseña incorrectos');
      }
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-left">
          {/* Añadir el botón de volver al inicio en la parte superior del panel verde */}
          <div className="back-link-container-green">
            <Link to="/" className="back-link-green">
              <i className="bi bi-arrow-left me-2"></i>
              <span>Volver al inicio</span>
            </Link>
          </div>
          
          <h1 className="login-title">Bienvenido a InmoMarket</h1>
          <p className="login-description">
            Encuentra, compra y vende propiedades de forma rápida y segura.
          </p>
          <img
            src="/path-to-your-image.jpg"
            alt="InmoMarket"
            className="login-image"
          />
        </div>
        <div className="login-right">
          <div className="login-card">
            
            <h2 className="text-center mb-4">Iniciar Sesión</h2>
            {error && <div className="alert alert-danger">{error}</div>}
            
            <form onSubmit={handleSubmit}>
              <div className="form-floating mb-3">
                <i className="bi bi-envelope input-icon"></i>
                <input
                  type="text"
                  className="form-control"
                  id="email"
                  placeholder="nombre@ejemplo.com"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
                <label htmlFor="email">Correo electrónico</label>
              </div>
              <div className="form-floating mb-3">
                <i className="bi bi-lock input-icon"></i>
                <input
                  type="password"
                  className="form-control"
                  id="password"
                  placeholder="Contraseña"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <label htmlFor="password">Contraseña</label>
              </div>
              <button type="submit" className="btn btn-primary w-100" disabled={isLoading}>
                {isLoading ? (
                  <span>
                    <i className="bi bi-arrow-repeat loading-spinner"></i> Cargando...
                  </span>
                ) : (
                  'Iniciar Sesión'
                )}
              </button>
              <p className="text-center mt-3">
                ¿No tienes una cuenta?{' '}
                <Link to="/registro" className="register-link">
                  Regístrate aquí
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;