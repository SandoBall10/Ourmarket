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
        // Crear objeto de usuario y guardarlo en localStorage
        const userData = {
          name: 'Admin', // Nombre que será usado para mostrar la inicial
          username: username
        };
        
        // Guardar en localStorage para persistir entre sesiones
        localStorage.setItem('user', JSON.stringify(userData));
        
        setError('');
        navigate('/'); // Redirige al componente Principal
      } else {
        setError('Usuario o contraseña incorrectos');
      }
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="login-page">
        <div className="login-left">
          <h1 className="login-title">Bienvenido a InmoMarket</h1>
          <p className="login-description">
            Encuentra, compra y vende propiedades de forma rápida y segura.
          </p>
          <img
            src="https://via.placeholder.com/400x300" // Reemplaza con una imagen adecuada
            alt="InmoMarket"
            className="login-image"
          />
        </div>
        <div className="login-right">
          <div className="login-card">
            <h2 className="text-center">Iniciar Sesión</h2>
            <form onSubmit={handleSubmit}>
              {error && (
                <div className="alert alert-danger" role="alert">
                  {error}
                </div>
              )}
              <div className="mb-3">
                <label htmlFor="username" className="form-label">
                  Correo Electrónico
                </label>
                <div className="input-group">
                  <span className="input-group-text">
                    <i className="fas fa-envelope"></i>
                  </span>
                  <input
                    type="text"
                    className="form-control"
                    id="username"
                    placeholder="Ingresa tu correo"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="mb-3">
                <label htmlFor="password" className="form-label">
                  Contraseña
                </label>
                <div className="input-group">
                  <span className="input-group-text">
                    <i className="fas fa-lock"></i>
                  </span>
                  <input
                    type="password"
                    className="form-control"
                    id="password"
                    placeholder="Ingresa tu contraseña"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>
              <button
                type="submit"
                className={`btn btn-primary w-100 ${isLoading ? 'disabled' : ''}`}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <span
                      className="spinner-border spinner-border-sm me-2"
                      role="status"
                      aria-hidden="true"
                    ></span>
                    Cargando...
                  </>
                ) : (
                  'Iniciar Sesión'
                )}
              </button>
            </form>
            <div className="text-center mt-3">
              <p>
                ¿No tienes una cuenta?{' '}
                <Link to="/registro" className="register-link">
                  Regístrate aquí
                </Link>
              </p>
            </div>
          </div>
        </div>
    </div>
  );
};

export default Login;