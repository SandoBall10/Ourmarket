import { Link } from 'react-router-dom';
import type { InputHTMLAttributes, SelectHTMLAttributes } from 'react';
import './Auth.css';

type AuthShellProps = {
  title: string;
  subtitle: string;
  children: React.ReactNode;
};

const GoogleIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
  </svg>
);

export function GoogleContinueButton({ label }: { label: string }) {
  return (
    <button type="button" className="auth-google">
      <GoogleIcon />
      <span>{label}</span>
    </button>
  );
}

type AuthInputProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  icon: string;
  invalid?: boolean;
  error?: string;
  trailing?: React.ReactNode;
};

export function AuthInput({ label, icon, invalid, error, trailing, id, ...inputProps }: AuthInputProps) {
  const inputId = id || inputProps.name;
  return (
    <label className="auth-field" htmlFor={inputId}>
      <span>{label}</span>
      <div className={`auth-control${invalid ? ' is-invalid' : ''}${trailing ? ' has-trailing' : ''}`}>
        <i className={`${icon} auth-leading`} aria-hidden="true" />
        <input id={inputId} {...inputProps} />
        {trailing}
      </div>
      {error ? <span className="auth-error">{error}</span> : null}
    </label>
  );
}

type AuthSelectProps = SelectHTMLAttributes<HTMLSelectElement> & {
  label: string;
  invalid?: boolean;
  error?: string;
  options: Array<{ value: string; label: string }>;
};

export function AuthSelect({ label, invalid, error, options, id, ...selectProps }: AuthSelectProps) {
  const selectId = id || selectProps.name;
  return (
    <label className="auth-field" htmlFor={selectId}>
      <span>{label}</span>
      <div className={`auth-control${invalid ? ' is-invalid' : ''}`}>
        <select id={selectId} {...selectProps}>
          {options.map((option) => (
            <option key={option.value || option.label} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <i className="fi-rr-angle-small-down auth-chevron" aria-hidden="true" />
      </div>
      {error ? <span className="auth-error">{error}</span> : null}
    </label>
  );
}

export default function AuthShell({ title, subtitle, children }: AuthShellProps) {
  return (
    <div className="auth-page">
      <aside className="auth-visual">
        <div className="auth-visual__photo" />
        <div className="auth-visual__overlay" />
        <div className="auth-visual__tint" />
        <div className="auth-visual__content">
          <div>
            <Link to="/" className="auth-back">
              <i className="fi-rr-angle-left" aria-hidden="true" />
              Volver al portal
            </Link>
            <div className="auth-brand-row">
              <div className="auth-brand-mark">
                <i className="fi-rr-building" aria-hidden="true" />
              </div>
              <span className="auth-brand-name">InmoMarket</span>
            </div>
            <h1>
              Tu próximo hogar
              <br />
              <span>empieza aquí.</span>
            </h1>
            <p>
              Únete a la red inmobiliaria más segura del país. Compra, alquila y vende propiedades verificadas.
            </p>
          </div>
          <div className="auth-proof">
            <div className="auth-proof__users">
              <div className="auth-proof__avatars">
                {[11, 12, 13].map((id) => (
                  <img
                    key={id}
                    src={`https://i.pravatar.cc/100?img=${id}`}
                    alt=""
                  />
                ))}
              </div>
              <div>
                <strong>+10,000 usuarios</strong>
                <span>ya confían en nosotros</span>
              </div>
            </div>
            <div className="auth-proof__secure">
              <i className="fi-rr-shield-check" aria-hidden="true" />
              Operaciones 100% seguras y verificadas
            </div>
          </div>
        </div>
      </aside>

      <section className="auth-form-side">
        <div className="auth-form-wrap">
          <div className="auth-mobile-logo">
            <div className="auth-brand-mark">
              <i className="fi-rr-building" aria-hidden="true" />
            </div>
            <span>InmoMarket</span>
          </div>
          <div className="auth-form-header">
            <h2>{title}</h2>
            <p>{subtitle}</p>
          </div>
          {children}
          <p className="auth-credit">
            Iconos de{' '}
            <a href="https://www.flaticon.es/iconos-de-interfaz" target="_blank" rel="noreferrer">
              Flaticon Uicons
            </a>
          </p>
        </div>
      </section>
    </div>
  );
}
