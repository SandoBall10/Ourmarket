import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Registro.css';

// Componente para la notificación de éxito
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
        <div className="check-icon">
          <div className="icon-container">
            <svg className="checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
              <circle className="checkmark-circle" cx="26" cy="26" r="25" fill="none" />
              <path className="checkmark-check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8" />
            </svg>
          </div>
        </div>
        <h3>¡Registro exitoso!</h3>
      </div>
    </div>
  );
};

const Registro: React.FC = () => {
  // Estados existentes
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [documentType, setDocumentType] = useState('DNI');
  const [documentNumber, setDocumentNumber] = useState('');
  const [phone, setPhone] = useState('');
  const [fechaNacimiento, setFechaNacimiento] = useState('');
  const [genero, setGenero] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [acceptDataUsage, setAcceptDataUsage] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccessNotification, setShowSuccessNotification] = useState(false);
  
  // Estados para los errores de validación
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

  // Función para validar la fortaleza de la contraseña
  const validatePassword = (password: string) => {
    if (!password) return 'Completa este campo';
    if (password.length < 8) return 'La contraseña es insegura: debe tener al menos 8 caracteres';
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) 
      return 'Contraseña insegura: utiliza caracteres especiales (!@#$%^&*)';
    if (!/\d/.test(password)) 
      return 'Contraseña insegura: incluye al menos un número';
    if (!/[A-Z]/.test(password) || !/[a-z]/.test(password))
      return 'Contraseña insegura: combina letras mayúsculas y minúsculas';
    
    return ''; 
  };
  
  // Añade esta función para validar dominios de correo específicos
  const validateEmail = (email: string) => {
    if (!email.trim()) return 'Completa este campo';
    if (!/\S+@\S+\.\S+/.test(email)) return 'Formato de correo electrónico inválido';
    const allowedDomains = ['gmail.com', 'hotmail.com', 'utp.edu.pe'];
    const domain = email.split('@')[1]?.toLowerCase();
    
    if (!domain || !allowedDomains.includes(domain)) {
      return 'Formato de correo electrónico inválido';
    }
    
    return ''; 
  };

  // Función para validar el número telefónico
  const validatePhoneNumber = (phone: string) => {
    if (!phone.trim()) return 'Completa este campo';
    const cleanPhone = phone.replace(/\D/g, '');
    if (cleanPhone.length !== 9) {
      return 'El número telefónico debe tener exactamente 9 dígitos';
    }
    
    return ''; 
  };

  // Función para validar el número de documento según su tipo
  const validateDocumentNumber = (documentType: string, documentNumber: string) => {
    if (!documentNumber.trim()) return 'Completa este campo';
    
    if (documentType === 'DNI') {
      const cleanNumber = documentNumber.replace(/\D/g, '');
      if (cleanNumber.length !== 8) {
        return 'El DNI debe tener exactamente 8 dígitos';
      }
    } else if (documentType === 'CARNET_EXTRANJERIA') {
      if (documentNumber.length < 9 || documentNumber.length > 12) {
        return 'El Carnet de Extranjería debe tener entre 9 y 12 caracteres';
      }
      if (!/^[A-Za-z0-9]{9,12}$/.test(documentNumber)) {
        return 'El Carnet de Extranjería debe tener caracteres alfanuméricos válidos';
      }
    }
    
    return ''; 
  };

  // Función para calcular la edad a partir de una fecha de nacimiento
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
      const age = calculateAge(birthDate);
      if (age < 18) {
        return 'Fecha de nacimiento incorrecta: debes ser mayor de edad (18 años o más)';
      }
      return '';
    } catch (e) {
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

    // Validar correo electrónico con la nueva función
    const emailError = validateEmail(email);
    if (emailError) {
      newErrors.email = emailError;
      isValid = false;
    }

    // Validar contraseña con la función existente
    const passwordError = validatePassword(password);
    if (passwordError) {
      newErrors.password = passwordError;
      isValid = false;
    }

    // Validar nombre completo
    if (!name.trim()) {
      newErrors.name = 'Completa este campo';
      isValid = false;
    }

    // Validar número de documento
    const documentError = validateDocumentNumber(documentType, documentNumber);
    if (documentError) {
      newErrors.documentNumber = documentError;
      isValid = false;
    }

    // Validar teléfono
    const phoneError = validatePhoneNumber(phone);
    if (phoneError) {
      newErrors.phone = phoneError;
      isValid = false;
    }

    // Validar fecha de nacimiento
    const birthDateError = validateBirthDate(fechaNacimiento);
    if (birthDateError) {
      newErrors.fechaNacimiento = birthDateError;
      isValid = false;
    }

    // Validar género
    if (!genero) {
      newErrors.genero = 'Selecciona una opción';
      isValid = false;
    }

    // Validar términos y condiciones
    if (!acceptTerms || !acceptDataUsage) {
      newErrors.terms = 'Debes aceptar los términos y condiciones';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Marcar el formulario como enviado para mostrar todos los errores
    setFormSubmitted(true);
    
    // Validar el formulario antes de enviar
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    try {
      // Formatear la fecha correctamente (YYYY-MM-DD)
      const fechaPartes = fechaNacimiento.split('/');
      let fechaFormateada = fechaNacimiento;
      if (fechaPartes.length === 3) {
        // Si viene en formato DD/MM/YYYY, convertir a YYYY-MM-DD
        fechaFormateada = `${fechaPartes[2]}-${fechaPartes[1]}-${fechaPartes[0]}`;
      }
      
      // Crear objeto con el formato exacto que espera la base de datos
      const cliente = {
        nombreCompleto: name,
        email: email,
        contrasena: password,
        telefono: phone,
        tipoDocumento: documentType, // Envía el valor directamente, que ya debe ser "DNI" o "CARNET_EXTRANJERIA"
        numeroDocumento: documentNumber,
        fechaNacimiento: fechaFormateada,
        genero: genero,
        id_rol: 3,
        fechaRegistro: new Date().toISOString()
      };

      console.log("Enviando datos:", cliente);

      const response = await fetch('http://localhost:8080/api/clientes/registrar', {
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
            console.error('Datos del error:', errorData);
            errorMessage = errorData.message || errorMessage;
          } else {
            const text = await response.text();
            console.error('Respuesta de error:', text);
            errorMessage = text || errorMessage;
          }
        } catch (e) {
          console.error('Error al procesar la respuesta:', e);
        }
        throw new Error(errorMessage);
      }

      // Mostrar notificación en lugar de alerta
      setShowSuccessNotification(true);
      
      // La redirección se manejará automáticamente después de 5 segundos
    } catch (error: any) {
      alert(error.message || 'Error en el registro. Por favor, intenta nuevamente.');
    } finally {
      setIsLoading(false);
    }
  };

  // Función para cerrar la notificación y redirigir
  const handleCloseNotification = () => {
    setShowSuccessNotification(false);
    navigate('/login');
  };

  // Estilos para los mensajes de error
  const errorStyle = {
    color: 'red',
    fontSize: '0.875rem',
    marginTop: '0.25rem',
    display: 'block'
  };

  // Estilos para campos con error
  const getInputStyle = (fieldName: string) => {
    return formSubmitted && errors[fieldName as keyof typeof errors] 
      ? { border: '1px solid red' } 
      : {};
  };

  // Función para mostrar indicador de seguridad de la contraseña en tiempo real
  const getPasswordStrength = () => {
    if (!password) return null;
    
    let strength = 0;
    if (password.length >= 8) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[a-z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;
    
    if (strength < 3) return { text: 'Débil', color: '#ff4d4d' };
    if (strength < 5) return { text: 'Media', color: '#ffa64d' };
    return { text: 'Fuerte', color: '#40bf40' };
  };

  // Componente de indicador visual de seguridad de contraseña
  const PasswordStrengthIndicator = () => {
    if (!password) return null;
    
    const strength = getPasswordStrength();
    if (!strength) return null;
    
    const barStyle = {
      width: '100%',
      height: '5px',
      backgroundColor: '#e0e0e0',
      marginTop: '5px',
      borderRadius: '2px'
    };
    
    const fillStyle = {
      width: strength.text === 'Débil' ? '33%' : strength.text === 'Media' ? '66%' : '100%',
      height: '100%',
      backgroundColor: strength.color,
      borderRadius: '2px',
      transition: 'width 0.3s ease'
    };
    
    return (
      <div className="mt-2">
        <div style={barStyle}>
          <div style={fillStyle}></div>
        </div>
        <small style={{ color: strength.color }}>{`Contraseña: ${strength.text}`}</small>
      </div>
    );
  };

  // Componente para mostrar mensaje de error
  const ErrorMessage = ({ message }: { message: string }) => {
    if (!formSubmitted || !message) return null;
    return <div style={errorStyle}>{message}</div>;
  };

  return (
    <div className="registro-container">
      {showSuccessNotification && (
        <SuccessNotification onClose={handleCloseNotification} />
      )}
      
      <div className="card registro-card shadow-lg p-4">
        <h2 className="registro-title text-center">Crear nueva cuenta</h2>
        
        <form onSubmit={handleSubmit} noValidate>
          <div className="row g-3">
            {/* Correo Electrónico */}
            <div className="col-md-6">
              <label htmlFor="email" className="form-label">Correo Electrónico</label>
              <div className="input-group">
                <span className="input-group-text">
                  <i className="bi bi-envelope"></i>
                </span>
                <input
                  type="email"
                  className="form-control"
                  id="email"
                  placeholder="ejemplo@correo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={getInputStyle('email')}
                />
              </div>
              <ErrorMessage message={errors.email} />
            </div>
            
            {/* Contraseña */}
            <div className="col-md-6">
              <label htmlFor="password" className="form-label">Contraseña</label>
              <div className="input-group">
                <span className="input-group-text">
                  <i className="bi bi-lock"></i>
                </span>
                <input
                  type="password"
                  className="form-control"
                  id="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={getInputStyle('password')}
                />
              </div>
              <PasswordStrengthIndicator />
              <ErrorMessage message={errors.password} />
            </div>
            
            {/* Nombre Completo */}
            <div className="col-md-6">
              <label htmlFor="name" className="form-label">Nombre Completo</label>
              <div className="input-group">
                <span className="input-group-text">
                  <i className="bi bi-person"></i>
                </span>
                <input
                  type="text"
                  className="form-control"
                  id="name"
                  placeholder="Nombre y Apellidos"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  style={getInputStyle('name')}
                />
              </div>
              <ErrorMessage message={errors.name} />
            </div>
            
            {/* Teléfono */}
            <div className="col-md-6">
              <label htmlFor="phone" className="form-label">Teléfono</label>
              <div className="input-group">
                <span className="input-group-text">
                  <i className="bi bi-telephone"></i>
                </span>
                <input
                  type="tel"
                  className="form-control"
                  id="phone"
                  placeholder="Número de teléfono"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  style={getInputStyle('phone')}
                />
              </div>
              <ErrorMessage message={errors.phone} />
            </div>
            
            {/* Tipo de Documento */}
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
                >
                  <option value="DNI">DNI</option>
                  <option value="CARNET_EXTRANJERIA">Carnet de Extranjería</option>
                </select>
              </div>
            </div>
            
            {/* Número de Documento */}
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
                  style={getInputStyle('documentNumber')}
                />
              </div>
              <ErrorMessage message={errors.documentNumber} />
            </div>

            {/* Fecha de Nacimiento */}
            <div className="col-md-6">
              <label htmlFor="fechaNacimiento" className="form-label">Fecha de Nacimiento</label>
              <div className="input-group">
                <span className="input-group-text">
                  <i className="bi bi-calendar"></i>
                </span>
                <input
                  type="date"
                  className="form-control"
                  id="fechaNacimiento"
                  value={fechaNacimiento}
                  onChange={(e) => setFechaNacimiento(e.target.value)}
                  style={getInputStyle('fechaNacimiento')}
                />
              </div>
              <ErrorMessage message={errors.fechaNacimiento} />
            </div>

            {/* Género */}
            <div className="col-md-6">
              <label htmlFor="genero" className="form-label">Género</label>
              <div className="input-group">
                <span className="input-group-text">
                  <i className="bi bi-gender-ambiguous"></i>
                </span>
                <select
                  className="form-select"
                  id="genero"
                  value={genero}
                  onChange={(e) => setGenero(e.target.value)}
                  style={getInputStyle('genero')}
                >
                  <option value="">Selecciona tu género</option>
                  <option value="Masculino">Masculino</option>
                  <option value="Femenino">Femenino</option>
                </select>
              </div>
              <ErrorMessage message={errors.genero} />
            </div>

            {/* Términos y Condiciones */}
            <div className="col-12 mt-4">
              <div className="form-check mb-3">
                <input 
                  type="checkbox" 
                  className="form-check-input"
                  id="acceptTerms" 
                  checked={acceptTerms}
                  onChange={(e) => setAcceptTerms(e.target.checked)}
                  style={formSubmitted && errors.terms ? { borderColor: 'red' } : {}}
                />
                <label className="form-check-label" htmlFor="acceptTerms">
                  <i className="bi bi-shield-check me-2"></i>
                  Acepto los Términos y Condiciones
                </label>
              </div>
              
              <div className="form-check mb-3">
                <input 
                  type="checkbox" 
                  className="form-check-input"
                  id="acceptDataUsage" 
                  checked={acceptDataUsage}
                  onChange={(e) => setAcceptDataUsage(e.target.checked)}
                  style={formSubmitted && errors.terms ? { borderColor: 'red' } : {}}
                />
                <label className="form-check-label" htmlFor="acceptDataUsage">
                  <i className="bi bi-lock-fill me-2"></i>
                  Autorizo el uso de mis datos personales
                </label>
              </div>
              {formSubmitted && errors.terms && <div style={errorStyle}>{errors.terms}</div>}
            </div>

            {/* Botón de Registro */}
            <div className="col-12 mt-4">
              <button 
                type="submit" 
                className="btn btn-primary w-100 py-2"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Procesando...
                  </>
                ) : 'Registrarme'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Registro;