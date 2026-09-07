import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../../api/config';
import AuthShell, { AuthInput, AuthSelect, GoogleContinueButton } from '../auth/AuthShell';

const SuccessNotification = ({ onClose }: { onClose: () => void }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 2000);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="success-notification">
      <div className="success-content">
        <div className="icon-container">
          <svg className="checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
            <circle className="checkmark-circle" cx="26" cy="26" r="25" fill="none" />
            <path className="checkmark-check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8" />
          </svg>
        </div>
        <h3>¡Registro exitoso!</h3>
      </div>
    </div>
  );
};

const Registro: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState('');
  const [documentType, setDocumentType] = useState('DNI');
  const [documentNumber, setDocumentNumber] = useState('');
  const [phone, setPhone] = useState('');
  const [fechaNacimiento, setFechaNacimiento] = useState('');
  const [genero, setGenero] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccessNotification, setShowSuccessNotification] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [errors, setErrors] = useState({
    email: '',
    password: '',
    name: '',
    documentNumber: '',
    phone: '',
    fechaNacimiento: '',
    genero: '',
    terms: ''
  });

  const navigate = useNavigate();

  const shownError = (field: keyof typeof errors) =>
    formSubmitted ? errors[field] : '';

  const validatePassword = (value: string) => {
    if (!value) return 'Completa este campo';
    if (value.length < 8) return 'La contraseña es insegura: debe tener al menos 8 caracteres';
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(value)) {
      return 'Contraseña insegura: utiliza caracteres especiales (!@#$%^&*)';
    }
    if (!/\d/.test(value)) return 'Contraseña insegura: incluye al menos un número';
    if (!/[A-Z]/.test(value) || !/[a-z]/.test(value)) {
      return 'Contraseña insegura: combina letras mayúsculas y minúsculas';
    }
    return '';
  };

  const validateEmail = (value: string) => {
    if (!value.trim()) return 'Completa este campo';
    if (!/\S+@\S+\.\S+/.test(value)) return 'Formato de correo electrónico inválido';
    const allowedDomains = ['gmail.com', 'hotmail.com', 'utp.edu.pe'];
    const domain = value.split('@')[1]?.toLowerCase();
    if (!domain || !allowedDomains.includes(domain)) {
      return 'Formato de correo electrónico inválido';
    }
    return '';
  };

  const validatePhoneNumber = (value: string) => {
    if (!value.trim()) return 'Completa este campo';
    const cleanPhone = value.replace(/\D/g, '');
    if (cleanPhone.length !== 9) {
      return 'El número telefónico debe tener exactamente 9 dígitos';
    }
    return '';
  };

  const validateDocumentNumber = (type: string, value: string) => {
    if (!value.trim()) return 'Completa este campo';
    if (type === 'DNI') {
      const cleanNumber = value.replace(/\D/g, '');
      if (cleanNumber.length !== 8) {
        return 'El DNI debe tener exactamente 8 dígitos';
      }
    } else if (type === 'CARNET_EXTRANJERIA') {
      if (value.length < 9 || value.length > 12) {
        return 'El Carnet de Extranjería debe tener entre 9 y 12 caracteres';
      }
      if (!/^[A-Za-z0-9]{9,12}$/.test(value)) {
        return 'El Carnet de Extranjería debe tener caracteres alfanuméricos válidos';
      }
    }
    return '';
  };

  const calculateAge = (birthDate: string): number => {
    const today = new Date();
    const birthDateObj = new Date(birthDate);
    let age = today.getFullYear() - birthDateObj.getFullYear();
    const monthDiff = today.getMonth() - birthDateObj.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDateObj.getDate())) {
      age--;
    }
    return age;
  };

  const validateBirthDate = (birthDate: string): string => {
    if (!birthDate) return 'Completa este campo';
    try {
      const birthDateObj = new Date(birthDate);
      if (isNaN(birthDateObj.getTime())) {
        return 'La fecha de nacimiento no es válida';
      }
      if (calculateAge(birthDate) < 18) {
        return 'Fecha de nacimiento incorrecta: debes ser mayor de edad (18 años o más)';
      }
      return '';
    } catch {
      return 'La fecha de nacimiento no es válida';
    }
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = {
      email: '',
      password: '',
      name: '',
      documentNumber: '',
      phone: '',
      fechaNacimiento: '',
      genero: '',
      terms: ''
    };

    const emailError = validateEmail(email);
    if (emailError) {
      newErrors.email = emailError;
      isValid = false;
    }

    const passwordError = validatePassword(password);
    if (passwordError) {
      newErrors.password = passwordError;
      isValid = false;
    }

    if (!name.trim()) {
      newErrors.name = 'Completa este campo';
      isValid = false;
    }

    const documentError = validateDocumentNumber(documentType, documentNumber);
    if (documentError) {
      newErrors.documentNumber = documentError;
      isValid = false;
    }

    const phoneError = validatePhoneNumber(phone);
    if (phoneError) {
      newErrors.phone = phoneError;
      isValid = false;
    }

    const birthDateError = validateBirthDate(fechaNacimiento);
    if (birthDateError) {
      newErrors.fechaNacimiento = birthDateError;
      isValid = false;
    }

    if (!genero) {
      newErrors.genero = 'Selecciona una opción';
      isValid = false;
    }

    if (!acceptTerms) {
      newErrors.terms = 'Debes aceptar los términos y condiciones';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormSubmitted(true);
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    try {
      const fechaPartes = fechaNacimiento.split('/');
      let fechaFormateada = fechaNacimiento;
      if (fechaPartes.length === 3) {
        fechaFormateada = `${fechaPartes[2]}-${fechaPartes[1]}-${fechaPartes[0]}`;
      }

      const cliente = {
        nombreCompleto: name,
        email,
        contrasena: password,
        telefono: phone,
        tipoDocumento: documentType,
        numeroDocumento: documentNumber,
        fechaNacimiento: fechaFormateada,
        genero,
        id_rol: 3,
        fechaRegistro: new Date().toISOString()
      };

      const response = await fetch(API_BASE_URL + '/api/clientes/registrar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(cliente),
      });

      if (!response.ok) {
        let errorMessage = 'Error en el registro. Por favor, intenta nuevamente.';
        try {
          const contentType = response.headers.get('content-type');
          if (contentType && contentType.includes('application/json')) {
            const errorData = await response.json();
            errorMessage = errorData.message || errorMessage;
          } else {
            const text = await response.text();
            errorMessage = text || errorMessage;
          }
        } catch {
          // keep default message
        }
        throw new Error(errorMessage);
      }

      setShowSuccessNotification(true);
    } catch (error: unknown) {
      const message = error instanceof Error
        ? error.message
        : 'Error en el registro. Por favor, intenta nuevamente.';
      alert(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseNotification = () => {
    setShowSuccessNotification(false);
    navigate('/login');
  };

  const getPasswordStrength = () => {
    if (!password) return null;
    let strength = 0;
    if (password.length >= 8) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[a-z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;
    if (strength < 3) return { text: 'Débil', color: '#dc2626', width: '33%' };
    if (strength < 5) return { text: 'Media', color: '#d97706', width: '66%' };
    return { text: 'Fuerte', color: '#1a6b54', width: '100%' };
  };

  const strength = getPasswordStrength();

  return (
    <>
      {showSuccessNotification && (
        <SuccessNotification onClose={handleCloseNotification} />
      )}
      <AuthShell
        title="Crear una cuenta"
        subtitle="Ingresa tus datos para acceder a las mejores ofertas del mercado inmobiliario."
      >
        <GoogleContinueButton label="Continuar con Google" />
        <div className="auth-divider">
          <span>O regístrate con tu correo</span>
        </div>

        <form className="auth-stack" onSubmit={handleSubmit} noValidate>
          <div className="auth-row auth-row--2">
            <AuthInput
              label="Nombre completo"
              icon="fi-rr-user"
              name="fullName"
              placeholder="Juan Pérez"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoComplete="name"
              invalid={Boolean(shownError('name'))}
              error={shownError('name')}
            />
            <AuthInput
              label="Teléfono"
              icon="fi-rr-phone-call"
              type="tel"
              name="phone"
              placeholder="999 888 777"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              autoComplete="tel"
              invalid={Boolean(shownError('phone'))}
              error={shownError('phone')}
            />
          </div>

          <AuthInput
            label="Correo electrónico"
            icon="fi-rr-envelope"
            type="email"
            name="email"
            placeholder="ejemplo@correo.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            invalid={Boolean(shownError('email'))}
            error={shownError('email')}
          />

          <div>
            <AuthInput
              label="Contraseña"
              icon="fi-rr-lock"
              type={showPassword ? 'text' : 'password'}
              name="password"
              placeholder="Mínimo 8 caracteres"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="new-password"
              invalid={Boolean(shownError('password'))}
              error={shownError('password')}
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
            {strength && (
              <div className="auth-strength">
                <div className="auth-strength__bar">
                  <div
                    className="auth-strength__fill"
                    style={{ width: strength.width, backgroundColor: strength.color }}
                  />
                </div>
                <small style={{ color: strength.color }}>{`Contraseña: ${strength.text}`}</small>
              </div>
            )}
          </div>

          <div className="auth-row--doc">
            <AuthSelect
              label="Documento"
              name="docType"
              value={documentType}
              onChange={(e) => setDocumentType(e.target.value)}
              options={[
                { value: 'DNI', label: 'DNI' },
                { value: 'CARNET_EXTRANJERIA', label: 'CE' },
              ]}
            />
            <AuthInput
              label="Número"
              icon="fi-rr-credit-card"
              name="docNumber"
              placeholder="8 dígitos"
              value={documentNumber}
              onChange={(e) => setDocumentNumber(e.target.value)}
              invalid={Boolean(shownError('documentNumber'))}
              error={shownError('documentNumber')}
            />
          </div>

          <div className="auth-row auth-row--2">
            <AuthInput
              label="Fecha de nacimiento"
              icon="fi-rr-calendar"
              type="date"
              name="birthDate"
              value={fechaNacimiento}
              onChange={(e) => setFechaNacimiento(e.target.value)}
              invalid={Boolean(shownError('fechaNacimiento'))}
              error={shownError('fechaNacimiento')}
            />
            <AuthSelect
              label="Género"
              name="gender"
              value={genero}
              onChange={(e) => setGenero(e.target.value)}
              invalid={Boolean(shownError('genero'))}
              error={shownError('genero')}
              options={[
                { value: '', label: 'Selecciona tu género' },
                { value: 'Masculino', label: 'Masculino' },
                { value: 'Femenino', label: 'Femenino' },
                { value: 'Otro', label: 'Otro' },
                { value: 'Prefiero no decirlo', label: 'Prefiero no decirlo' },
              ]}
            />
          </div>

          <label className="auth-check" htmlFor="acceptTerms">
            <input
              type="checkbox"
              id="acceptTerms"
              checked={acceptTerms}
              onChange={(e) => setAcceptTerms(e.target.checked)}
            />
            <span>
              He leído y acepto los{' '}
              <a href="#terminos" onClick={(e) => e.preventDefault()}>Términos del Servicio</a>
              {' '}y la{' '}
              <a href="#privacidad" onClick={(e) => e.preventDefault()}>Política de Privacidad</a>.
            </span>
          </label>
          {shownError('terms') ? <span className="auth-error">{shownError('terms')}</span> : null}

          <button type="submit" className="auth-submit" disabled={isLoading}>
            {isLoading ? 'Procesando...' : 'Crear cuenta'}
          </button>
        </form>

        <p className="auth-switch">
          ¿Ya eres miembro? <Link to="/login">Inicia sesión aquí</Link>
        </p>
      </AuthShell>
    </>
  );
};

export default Registro;
