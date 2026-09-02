import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Container, Row, Col, Form, Button, Navbar, Nav, NavDropdown, Alert, Spinner } from 'react-bootstrap';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';
import axios from 'axios';
import './Chats.css';

// Interfaces
interface User {
  id: number;
  name: string;
  email?: string;
}

interface Message {
  idMensaje: number;
  contenido: string;
  fechaEnvio: string;
  tipoMensaje: string;
  idCliente: number;
  nombreCliente?: string;
  idInmueble: number;
  isFromCurrentUser?: boolean;
}

interface Contact {
  id: string;
  name: string;
  lastMessage: string;
  timestamp: string;
  avatar: string;
  unreadCount: number;
  isOnline: boolean;
  publicacion?: {
    id: number;
    titulo: string;
    idInmueble: number;
  };
}

interface Conversacion {
  idInmueble: number;
  tituloPublicacion: string;
  propietarioNombre: string;
  clienteNombre: string;
  ultimoMensaje?: Message;
  totalMensajes: number;
  fechaUltimoMensaje: string;
}

const Chats: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Estados para autenticación
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);

  // Inicialización
  useEffect(() => {
    AOS.init({ duration: 800, once: false });
    
    // Cargar datos de usuario
    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        setIsLoggedIn(true);
        console.log('Usuario cargado:', parsedUser);
      } catch (error) {
        console.error('Error parsing user data:', error);
        navigate('/login');
      }
    } else {
      navigate('/login');
    }
  }, [navigate]);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Handle navigation from publication contact
  useEffect(() => {
    if (location.state && user) {
      const { publicacionId, inmuebleId, propietarioId, publicacionTitulo } = location.state;
      
      console.log('Estado de navegación recibido:', location.state);
      
      if (publicacionId && inmuebleId && publicacionTitulo) {
        console.log('🚀 Iniciando creación de chat desde publicación');
        createInitialChat(publicacionId, inmuebleId, propietarioId || 1, publicacionTitulo);
      } else {
        console.log('❌ Faltan datos en el state:', { publicacionId, inmuebleId, publicacionTitulo });
        setError('Error: Faltan datos para crear el chat');
      }
    } else if (user && !location.state) {
      console.log('🔄 Cargando conversaciones existentes');
      cargarConversacionesExistentes();
    }
  }, [location.state, user]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // 🔥 FUNCIÓN: Crear chat inicial desde publicación
  const createInitialChat = useCallback(async (publicacionId: number, inmuebleId: number, propietarioId: number, titulo: string) => {
    console.log('=== CREANDO CHAT INICIAL ===');
    console.log('Parámetros recibidos:', { publicacionId, inmuebleId, propietarioId, titulo });
    
    setLoading(true);
    setError(null);
    
    try {
      const token = localStorage.getItem('token');
      if (!token || !user) {
        console.error('❌ No hay token o usuario disponible');
        setError('Error: No se pudo autenticar al usuario');
        navigate('/login');
        return;
      }

      // Validar inmuebleId
      if (!inmuebleId || inmuebleId === undefined || inmuebleId === null) {
        console.error('❌ inmuebleId es inválido:', inmuebleId);
        setError('Error: No se pudo obtener el ID del inmueble');
        return;
      }
      
      // Limitar título
      const tituloCorto = titulo.length > 50 ? titulo.substring(0, 50) + '...' : titulo;
      
      // Crear mensaje inicial
      const initialMessage = `Hola, estoy interesado en tu publicación: ${tituloCorto}`;
      
      console.log('📤 Enviando mensaje inicial:', {
        contenido: initialMessage,
        tipoMensaje: 'pregunta',
        inmuebleId: Number(inmuebleId)
      });
      
      const authToken = token.startsWith('Bearer ') ? token : `Bearer ${token}`;
      
      const response = await axios.post('http://localhost:8080/api/mensajes/crear', {
        contenido: initialMessage,
        tipoMensaje: 'pregunta',
        inmuebleId: Number(inmuebleId)
      }, {
        headers: {
          'Authorization': authToken,
          'Content-Type': 'application/json'
        }
      });
      
      console.log('✅ Mensaje inicial creado exitosamente:', response.data);
      setSuccess('Chat creado exitosamente');
      
      // Crear contacto
      const newContact: Contact = {
        id: inmuebleId.toString(),
        name: `Conversación - ${tituloCorto}`,
        lastMessage: initialMessage,
        timestamp: new Date().toISOString(),
        avatar: tituloCorto.charAt(0).toUpperCase(),
        unreadCount: 0,
        isOnline: false,
        publicacion: {
          id: publicacionId,
          titulo: tituloCorto,
          idInmueble: inmuebleId
        }
      };
      
      console.log('📋 Contacto creado:', newContact);
      
      setSelectedContact(newContact);
      setContacts([newContact]);
      
      // Cargar mensajes después de un breve delay
      setTimeout(() => {
        console.log('🔄 Cargando mensajes del inmueble:', inmuebleId);
        cargarMensajes(Number(inmuebleId));
      }, 1000);
      
      // Limpiar state de navegación
      window.history.replaceState({}, document.title);
      
    } catch (error) {
      console.error('❌ Error creating initial chat:', error);
      
      if (axios.isAxiosError(error)) {
        console.error('Status:', error.response?.status);
        console.error('Data:', error.response?.data);
        
        if (error.response?.status === 403) {
          setError('Error: No tienes permisos para crear mensajes');
        } else if (error.response?.status === 400) {
          setError('Error: Datos inválidos para crear el mensaje');
        } else {
          setError('Error al crear el chat inicial');
        }
      } else {
        setError('Error de conexión al crear el chat');
      }
      
      // Crear contacto de fallback sin mensaje inicial
      const tituloCorto = titulo.length > 50 ? titulo.substring(0, 50) + '...' : titulo;
      const fallbackContact: Contact = {
        id: inmuebleId?.toString() || 'unknown',
        name: `Conversación - ${tituloCorto}`,
        lastMessage: 'Chat iniciado',
        timestamp: new Date().toISOString(),
        avatar: tituloCorto.charAt(0).toUpperCase(),
        unreadCount: 0,
        isOnline: false,
        publicacion: {
          id: publicacionId,
          titulo: tituloCorto,
          idInmueble: inmuebleId
        }
      };
      
      setSelectedContact(fallbackContact);
      setContacts([fallbackContact]);
    } finally {
      setLoading(false);
    }
  }, [user, navigate]);

  // 🔥 FUNCIÓN: Cargar conversaciones existentes
  const cargarConversacionesExistentes = useCallback(async () => {
    if (!user) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const token = localStorage.getItem('token');
      const authToken = token?.startsWith('Bearer ') ? token : `Bearer ${token}`;
      
      console.log('🔄 Cargando conversaciones existentes para usuario:', user.id);
      
      const response = await axios.get('http://localhost:8080/api/mensajes/conversaciones', {
        headers: {
          'Authorization': authToken
        }
      });
      
      console.log('📥 Conversaciones recibidas:', response.data);
      
      if (!response.data || response.data.length === 0) {
        console.log('ℹ️ No hay conversaciones existentes');
        setContacts([]);
        return;
      }
      
      // Convertir conversaciones a contacts
      const contactsFromConversaciones: Contact[] = response.data.map((conv: Conversacion) => {
        const tituloCorto = conv.tituloPublicacion.length > 50 
          ? conv.tituloPublicacion.substring(0, 50) + '...'
          : conv.tituloPublicacion;
        
        return {
          id: conv.idInmueble.toString(),
          name: `Conversación - ${tituloCorto}`,
          lastMessage: conv.ultimoMensaje?.contenido || 'Sin mensajes',
          timestamp: conv.fechaUltimoMensaje,
          avatar: tituloCorto.charAt(0).toUpperCase(),
          unreadCount: 0,
          isOnline: false,
          publicacion: {
            id: 0,
            titulo: tituloCorto,
            idInmueble: conv.idInmueble
          }
        };
      });
      
      console.log('📋 Contacts creados:', contactsFromConversaciones);
      setContacts(contactsFromConversaciones);
      
      // Seleccionar el primer contacto automáticamente
      if (contactsFromConversaciones.length > 0 && !selectedContact) {
        const primerContacto = contactsFromConversaciones[0];
        setSelectedContact(primerContacto);
        cargarMensajes(primerContacto.publicacion!.idInmueble);
      }
      
    } catch (error) {
      console.error('❌ Error al cargar conversaciones:', error);
      if (axios.isAxiosError(error) && error.response?.status === 403) {
        console.log('ℹ️ Usuario sin conversaciones - esto es normal');
        setContacts([]);
      } else {
        setError('Error al cargar conversaciones');
      }
    } finally {
      setLoading(false);
    }
  }, [user, selectedContact]);

  // 🔥 FUNCIÓN: Cargar mensajes de un inmueble
  const cargarMensajes = async (inmuebleId: number) => {
    console.log('🔄 Cargando mensajes para inmueble:', inmuebleId);
    
    try {
      const token = localStorage.getItem('token');
      const authToken = token?.startsWith('Bearer ') ? token : `Bearer ${token}`;
      
      const response = await axios.get<Message[]>(`http://localhost:8080/api/mensajes/inmueble/${inmuebleId}`, {
        headers: {
          'Authorization': authToken
        }
      });

      console.log('📥 Mensajes recibidos:', response.data);

      // Mapear mensajes con información de usuario
      const mensajesConUsuario = response.data.map((msg) => ({
        idMensaje: msg.idMensaje,
        contenido: msg.contenido,
        fechaEnvio: msg.fechaEnvio,
        tipoMensaje: msg.tipoMensaje,
        idCliente: msg.idCliente,
        nombreCliente: msg.nombreCliente,
        idInmueble: msg.idInmueble,
        isFromCurrentUser: user ? msg.idCliente === user.id : false
      }));

      setMessages(mensajesConUsuario);
      console.log('✅ Mensajes cargados correctamente');
    } catch (error) {
      console.error('❌ Error al cargar mensajes:', error);
      setMessages([]);
      setError('Error al cargar mensajes');
    }
  };

  // 🔥 FUNCIÓN: Enviar mensaje
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedContact || !user) return;

    const inmuebleId = selectedContact.publicacion?.idInmueble;
    if (!inmuebleId) {
      setError('No se pudo identificar el inmueble');
      return;
    }

    console.log('📤 Enviando mensaje:', newMessage);

    try {
      const token = localStorage.getItem('token');
      const authToken = token?.startsWith('Bearer ') ? token : `Bearer ${token}`;
      
      const mensajeData = {
        contenido: newMessage,
        tipoMensaje: 'respuesta',
        inmuebleId: Number(inmuebleId)
      };

      const response = await axios.post('http://localhost:8080/api/mensajes/crear', mensajeData, {
        headers: {
          'Authorization': authToken,
          'Content-Type': 'application/json'
        }
      });

      console.log('✅ Mensaje enviado exitosamente:', response.data);

      // Crear mensaje local
      const nuevoMensaje: Message = {
        idMensaje: response.data.idMensaje || Date.now(),
        contenido: newMessage,
        fechaEnvio: new Date().toISOString(),
        tipoMensaje: 'respuesta',
        idCliente: user.id,
        nombreCliente: user.name,
        idInmueble: inmuebleId,
        isFromCurrentUser: true
      };

      setMessages(prevMessages => [...prevMessages, nuevoMensaje]);
      setNewMessage('');
      
      // Actualizar último mensaje del contacto
      setContacts(prevContacts => 
        prevContacts.map(contact => 
          contact.id === selectedContact.id 
            ? { 
                ...contact, 
                lastMessage: newMessage,
                timestamp: new Date().toISOString()
              }
            : contact
        )
      );
      
      setError(null);
      setSuccess('Mensaje enviado correctamente');
      
      // Limpiar success message después de 3 segundos
      setTimeout(() => setSuccess(null), 3000);
    } catch (error) {
      console.error('❌ Error al enviar mensaje:', error);
      setError('Error al enviar el mensaje');
    }
  };

  // 🔥 FUNCIÓN: Manejar selección de contacto
  const handleContactSelect = (contact: Contact) => {
    console.log('📋 Contacto seleccionado:', contact);
    setSelectedContact(contact);
    if (contact.publicacion?.idInmueble) {
      cargarMensajes(contact.publicacion.idInmueble);
    }
    setError(null);
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    setUser(null);
    navigate('/login');
  };

  const formatMessageTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('es-ES', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  // Filtrar contactos por búsqueda
  const filteredContacts = contacts.filter((contact) =>
    contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    contact.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="chat-page">
      {/* NAVBAR */}
      <Navbar bg="white" expand="lg" className="w-100 border-bottom">
        <Container fluid className="px-4">
          <Navbar.Brand as={Link} to="/">
            <img
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTm6ETphfVq-SfJmeaX42jYRIUxikXCNQvu56BxSPdkWxgHO2KAov9MXLWJRZWjbBgwOR4&usqp=CAU"
              alt="InmoMarket"
              height="30"
              className="d-inline-block align-top"
            />
            <span className="fw-bold"> InmoMarket</span>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="navbar-nav" />
          <Navbar.Collapse id="navbar-nav">
            <Nav className="me-auto">
              <Nav.Link as={Link} to="/publicaciones" className="nav-link-text">
                Mis Publicaciones
              </Nav.Link>
              <Nav.Link as={Link} to="/favoritos" className="nav-link-text">
                Favoritos
              </Nav.Link>
              <Nav.Link as={Link} to="/chats" className="nav-link-text active">
                Mis Chats
              </Nav.Link>
            </Nav>
            <Nav className="ms-auto">
              <Nav.Link href="#" className="me-2">
                <span className="nav-link-text">Notificaciones <i className="far fa-bell"></i></span>
              </Nav.Link>
              {isLoggedIn && user ? (
                <NavDropdown
                  title={
                    <div className="avatar-container">
                      <div className="user-avatar">
                        {user.name?.charAt(0).toUpperCase() || 'U'}
                      </div>
                      <i className="fas fa-chevron-down avatar-arrow"></i>
                    </div>
                  }
                  id="user-dropdown"
                  align="end"
                  className="custom-dropdown"
                >
                  <NavDropdown.Item as={Link} to="/" className="dropdown-item-custom">
                    <div className="icon-wrapper"><i className="fas fa-home"></i></div>
                    <span>Inicio</span>
                  </NavDropdown.Item>
                  <NavDropdown.Divider />
                  <NavDropdown.Item as={Link} to="/publicaciones" className="dropdown-item-custom">
                    <div className="icon-wrapper"><i className="far fa-file-alt"></i></div>
                    <span>Mis publicaciones</span>
                  </NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="/favoritos" className="dropdown-item-custom">
                    <div className="icon-wrapper"><i className="far fa-heart"></i></div>
                    <span>Favoritos</span>
                  </NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="/chats" className="dropdown-item-custom">
                    <div className="icon-wrapper"><i className="far fa-comments"></i></div>
                    <span>Mis chats</span>
                  </NavDropdown.Item>
                  <NavDropdown.Divider />
                  <NavDropdown.Item onClick={handleLogout} className="dropdown-item-custom">
                    <div className="icon-wrapper"><i className="fas fa-sign-out-alt"></i></div>
                    <span>Cerrar sesión</span>
                  </NavDropdown.Item>
                </NavDropdown>
              ) : (
                <Nav.Link href="#">
                  <Button
                    variant="success"
                    className="btn-ingresar"
                    onClick={() => navigate('/login')}
                  >
                    Ingresar
                  </Button>
                </Nav.Link>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* CHAT CONTAINER */}
      <Container fluid className="chat-wrapper">
        <Row className="h-100">
          {/* SIDEBAR DE CONTACTOS */}
          <Col md={4} lg={3} className="chat-sidebar" data-aos="fade-right">
            <div className="search-container">
              <Form.Control
                type="text"
                placeholder="Buscar conversación..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />
            </div>
            
            {/* MOSTRAR LOADING */}
            {loading && (
              <div className="text-center p-3">
                <Spinner animation="border" size="sm" />
                <p className="mt-2 mb-0">Cargando conversaciones...</p>
              </div>
            )}
            
            {/* LISTA DE CONTACTOS */}
            <div className="contacts-list">
              {filteredContacts.length === 0 && !loading ? (
                <div className="no-conversations p-3 text-center text-muted">
                  <i className="bi bi-chat-dots fs-1 mb-2"></i>
                  <p>No hay conversaciones aún</p>
                  <small>Contacta a un propietario desde una publicación para empezar a chatear</small>
                </div>
              ) : (
                filteredContacts.map((contact) => (
                  <div
                    key={contact.id}
                    className={`contact-item ${selectedContact?.id === contact.id ? 'active' : ''}`}
                    onClick={() => handleContactSelect(contact)}
                    data-aos="fade-up"
                  >
                    <div className="contact-avatar">
                      {contact.isOnline && <span className="online-indicator"></span>}
                      <div className="avatar-text">{contact.avatar}</div>
                    </div>
                    <div className="contact-info">
                      <h6 className="contact-name">{contact.name}</h6>
                      <p className="contact-last-message">{contact.lastMessage}</p>
                      {contact.publicacion?.titulo && (
                        <small className="text-muted">📍 {contact.publicacion.titulo}</small>
                      )}
                    </div>
                    {contact.unreadCount > 0 && (
                      <span className="unread-badge">{contact.unreadCount}</span>
                    )}
                  </div>
                ))
              )}
            </div>
          </Col>

          {/* ÁREA PRINCIPAL DEL CHAT */}
          <Col md={8} lg={9} className="chat-main" data-aos="fade-left">
            {selectedContact ? (
              <>
                {/* HEADER DEL CHAT */}
                <div className="chat-header">
                  <div className="selected-contact">
                    <div className="contact-avatar">
                      <div className="avatar-text">{selectedContact.avatar}</div>
                    </div>
                    <div className="contact-info">
                      <h6>{selectedContact.name}</h6>
                      {selectedContact.publicacion?.titulo && (
                        <small className="text-info">
                          Conversación sobre: {selectedContact.publicacion.titulo}
                        </small>
                      )}
                      <br />
                      <small className={selectedContact.isOnline ? 'text-success' : 'text-muted'}>
                        {selectedContact.isOnline ? 'En línea' : 'Desconectado'}
                      </small>
                    </div>
                  </div>
                </div>

                {/* MOSTRAR ALERTAS */}
                {error && (
                  <Alert variant="danger" className="mx-3" dismissible onClose={() => setError(null)}>
                    {error}
                  </Alert>
                )}
                {success && (
                  <Alert variant="success" className="mx-3" dismissible onClose={() => setSuccess(null)}>
                    {success}
                  </Alert>
                )}

                {/* CONTENEDOR DE MENSAJES */}
                <div className="messages-container">
                  {messages.length === 0 ? (
                    <div className="no-messages text-center text-muted p-4">
                      <i className="bi bi-chat-text fs-1 mb-2"></i>
                      <p>No hay mensajes en esta conversación</p>
                      <small>Envía el primer mensaje para comenzar</small>
                    </div>
                  ) : (
                    messages.map((message) => (
                      <div
                        key={message.idMensaje}
                        className={`message ${message.isFromCurrentUser ? 'sent' : 'received'}`}
                        data-aos="fade-up"
                      >
                        <div className="message-content">
                          <p>{message.contenido}</p>
                          <small className="message-time">
                            {formatMessageTime(message.fechaEnvio)}
                          </small>
                          {!message.isFromCurrentUser && message.nombreCliente && (
                            <small className="message-sender d-block text-muted">
                              {message.nombreCliente}
                            </small>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* FORMULARIO DE ENVÍO DE MENSAJES */}
                <Form onSubmit={handleSendMessage} className="message-form">
                  <Form.Group className="message-input d-flex">
                    <Form.Control
                      type="text"
                      placeholder="Escribe un mensaje..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      disabled={!selectedContact}
                    />
                    <Button 
                      type="submit" 
                      className="send-button"
                      disabled={!newMessage.trim() || !selectedContact}
                    >
                      <i className="bi bi-send-fill"></i>
                    </Button>
                  </Form.Group>
                </Form>
              </>
            ) : (
              <div className="no-chat-selected" data-aos="fade-in">
                <i className="bi bi-chat-dots"></i>
                <p>Selecciona una conversación para comenzar</p>
              </div>
            )}
          </Col>
        </Row>
      </Container>

      {/* FOOTER */}
      <footer className="footer-section">
        <Container fluid>
          <p className="text-center mb-0">
            © {new Date().getFullYear()} InmoMarket. Todos los derechos reservados.
          </p>
        </Container>
      </footer>
    </div>
  );
};

export default Chats;
