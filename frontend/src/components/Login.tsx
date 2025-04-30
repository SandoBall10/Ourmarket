import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Login.css';

const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Simulación de inicio de sesión
    setTimeout(() => {
      if (username === 'admin' && password === 'admin') {
        setError('');
        navigate('/'); // Redirige al componente Principal
      } else {
        setError('Usuario o contraseña incorrectos');
      }
      setIsLoading(false);
    }, 1000); // Simula una espera de 1 segundo
  };

  return (
    <div className="login-container">
      <div className="card login-card shadow-lg p-4">
        <div className="text-center mb-4">
          <i className="fas fa-user-circle fa-4x text-primary mb-3"></i>
          <h2 className="mt-2">Iniciar Sesión</h2>
          <p className="text-muted">Ingresa a tu cuenta y accede a los avisos que contactaste, tus favoritos, las búsquedas guardadas ¡y más!</p>
        </div>

        {error && (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
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
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Cargando...
              </>
            ) : (
              'Iniciar Sesión'
            )}
          </button>
        </form>

        <div className="text-center mt-3">
          <p className="text-green">
            ¿No tienes una cuenta?{' '}
            <a href="/register" className="register-link">Regístrate aquí</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;