import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { API_BASE_URL } from '../api/config';
import { saveSession } from '../auth/session';
import AuthShell, { AuthInput, GoogleContinueButton } from './auth/AuthShell';

const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch(`${API_BASE_URL}/authenticate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ usernameOrEmail: username, password }),
      });

      if (!response.ok) {
        throw new Error('Credenciales inválidas');
      }

      const data = await response.json();
      saveSession(data.token, {
        id: data.id,
        name: username,
        rol: data.rol,
        isLoggedIn: true,
      });

      if (data.rol === 'ROLE_MASTER' || data.rol === 'ROLE_ADMIN') {
        navigate('/dashboard');
      } else {
        navigate('/');
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error al iniciar sesión');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthShell
      title="Iniciar sesión"
      subtitle="Ingresa con tu correo o usuario para acceder a InmoMarket."
    >
      <GoogleContinueButton label="Continuar con Google" />
      <div className="auth-divider">
        <span>O entra con tu correo</span>
      </div>

      {error && <div className="auth-alert">{error}</div>}

      <form className="auth-stack" onSubmit={handleSubmit}>
        <AuthInput
          label="Correo o usuario"
          icon="fi-rr-envelope"
          id="email"
          name="email"
          type="text"
          placeholder="ejemplo@correo.com"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          autoComplete="username"
        />
        <AuthInput
          label="Contraseña"
          icon="fi-rr-lock"
          id="password"
          name="password"
          type={showPassword ? 'text' : 'password'}
          placeholder="Tu contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
          trailing={
            <button
              type="button"
              className="auth-eye"
              onClick={() => setShowPassword((visible) => !visible)}
              aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
            >
              <i className={showPassword ? 'fi-rr-eye-crossed' : 'fi-rr-eye'} aria-hidden="true" />
            </button>
          }
        />
        <button type="submit" className="auth-submit" disabled={isLoading}>
          {isLoading ? 'Ingresando...' : 'Iniciar sesión'}
        </button>
      </form>

      <p className="auth-switch">
        ¿No tienes una cuenta? <Link to="/registro">Regístrate aquí</Link>
      </p>
    </AuthShell>
  );
};

export default Login;
