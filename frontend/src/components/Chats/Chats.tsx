import React, { useState, useEffect, useRef } from 'react';
import { Container, Row, Col, Form, Button, Navbar, Nav, NavDropdown } from 'react-bootstrap';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';
import axios from 'axios';
import './Chats.css';

interface Message {
  id_mensaje: number;
  contenido: string;
  fecha_envio: string;
  tipo_mensaje: string;
  id_cliente: number;
  id_inmueble: number;
  isFromCurrentUser?: boolean;
}

interface Contact {
  id: string;
  name: string;
  lastMessage: string;
  unreadCount: number;
  isOnline: boolean;
  avatar?: string;
  publicacionId?: number;
  publicacionTitulo?: string;
  propietarioId?: number;
}

interface User {
  id: number;
  name: string;
}

const Chats: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Estados para autenticación
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);

  // Interface for publicación
  interface Publicacion {
    id: number;
    titulo: string;
    idInmueble?: number;
    // Add other relevant fields if needed
  }

  // Estados para la publicación actual
  const [currentPublicacion, setCurrentPublicacion] = useState<Publicacion | null>(null);

  useEffect(() => {
    AOS.init({ duration: 800, once: false });
    
    // Cargar datos de usuario
    const userData = localStorage.getItem('user');
    if (userData) {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      setIsLoggedIn(true);
    }

    // Verificar si se viene desde una publicación
    if (location.state?.publicacion) {
      setCurrentPublicacion(location.state.publicacion);
      crearContactoPublicacion();
    } else {
      cargarContactos();
    }
  }, [location.state]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Cargar mensajes cuando se selecciona un contacto
    if (selectedContact && location.state?.inmuebleId) {
      cargarMensajesPublicacion(location.state.inmuebleId);
    }
  }, [selectedContact, location.state?.inmuebleId]);

  useEffect(() => {
    // Check if coming from a publication contact
    if (location.state) {
      const { publicacionId, inmuebleId, propietarioId, publicacionTitulo } = location.state;
      createInitialChat(publicacionId, inmuebleId, propietarioId, publicacionTitulo);
    }
  }, [location.state]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const crearContactoPublicacion = () => {
    if (location.state?.publicacion && location.state?.propietarioId) {
      const pub = location.state.publicacion;
      const nuevoContacto: Contact = {
        id: `propietario_${location.state.propietarioId}`,
        name: `Propietario de ${pub.titulo}`,
        lastMessage: location.state.mensajeCreado ? 
          `Hola, estoy interesado en tu propiedad "${pub.titulo}". ¿Podrías darme más información?` :
          'Sin mensajes',
        unreadCount: 0,
        isOnline: false,
        publicacionId: pub.id,
        publicacionTitulo: pub.titulo,
        propietarioId: location.state.propietarioId
      };
      
      setContacts([nuevoContacto]);
      setSelectedContact(nuevoContacto);
      
      // Cargar mensajes usando el ID del inmueble
      if (location.state.inmuebleId) {
        cargarMensajesPublicacion(location.state.inmuebleId);
      }
    }
  };

  const cargarContactos = async () => {
    try {
      // Por ahora mantenemos contactos simulados para conversaciones existentes
      // En el futuro podrías cargar conversaciones reales desde el backend
      const contactosSimulados: Contact[] = [
        {
          id: '1',
          name: 'Juan Pérez',
          lastMessage: '¿Está disponible la casa?',
          unreadCount: 2,
          isOnline: true,
        },
      ];
      
      setContacts(contactosSimulados);
    } catch (error) {
      console.error('Error al cargar contactos:', error);
    }
  };

  const cargarMensajesPublicacion = async (inmuebleId: number) => {
    try {
      const token = localStorage.getItem('token');
      const authToken = token && token.startsWith('Bearer ') ? token : `Bearer ${token}`;
      
      console.log('Cargando mensajes para inmueble:', inmuebleId);
      
      const response = await axios.get(`http://localhost:8080/api/mensajes/inmueble/${inmuebleId}`, {
        headers: {
          'Authorization': authToken
        }
      });

      console.log('Mensajes recibidos:', response.data);

      const mensajesConUsuario = response.data.map((msg: Message) => ({
        ...msg,
        isFromCurrentUser: user ? msg.id_cliente === user.id : false
      }));

      setMessages(mensajesConUsuario);
    } catch (error) {
      console.error('Error al cargar mensajes:', error);
      setMessages([]);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedContact || !user) return;

    try {
      const token = localStorage.getItem('token');
      const authToken = token && token.startsWith('Bearer ') ? token : `Bearer ${token}`;
      
      const mensajeData = {
        contenido: newMessage,
        tipo_mensaje: 'texto',
        id_cliente: user.id, // El usuario actual envía el mensaje
        id_inmueble: location.state?.inmuebleId || currentPublicacion?.idInmueble || currentPublicacion?.id
      };

      console.log('Enviando nuevo mensaje:', mensajeData);

      const response = await axios.post('http://localhost:8080/api/mensajes/crear', mensajeData, {
        headers: {
          'Authorization': authToken,
          'Content-Type': 'application/json'
        }
      });

      console.log('Mensaje enviado exitosamente:', response.data);

      // Agregar el mensaje a la lista local
      const nuevoMensaje: Message = {
        id_mensaje: response.data.id_mensaje || Date.now(),
        contenido: newMessage,
        fecha_envio: new Date().toISOString(),
        tipo_mensaje: 'texto',
        id_cliente: user.id,
        id_inmueble: mensajeData.id_inmueble || 0,
        isFromCurrentUser: true
      };

      setMessages(prevMessages => [...prevMessages, nuevoMensaje]);
      setNewMessage('');
      
      // Actualizar el último mensaje del contacto
      setContacts(prevContacts => 
        prevContacts.map(contact => 
          contact.id === selectedContact.id 
            ? { ...contact, lastMessage: newMessage }
            : contact
        )
      );
    } catch (error) {
      console.error('Error al enviar mensaje:', error);
    }
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

  const createInitialChat = async (publicacionId: number, inmuebleId: number, propietarioId: number, titulo: string) => {
    try {
      const token = localStorage.getItem('token');
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      
      // Create initial message
      const initialMessage = `Hola, estoy interesado en tu publicación: ${titulo}`;
      
      await axios.post('http://localhost:8080/api/mensajes/crear', {
        contenido: initialMessage,
        tipo_mensaje: 'texto',
        id_cliente: user.id,
        id_inmueble: inmuebleId
      }, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      // Create contact and load messages
      const newContact: Contact = {
        id: propietarioId.toString(),
        name: `Propietario - ${titulo}`,
        lastMessage: initialMessage,
        unreadCount: 0,
        isOnline: false,
        publicacionId,
        publicacionTitulo: titulo,
        propietarioId
      };
      
      setSelectedContact(newContact);
      cargarMensajesPublicacion(inmuebleId);
      
      // Clear navigation state
      window.history.replaceState({}, document.title);
      
    } catch (error) {
      console.error('Error creating initial chat:', error);
    }
  };

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
                  <NavDropdown.Item as={Link} to="/inmuebles" className="dropdown-item-custom">
                    <div className="icon-wrapper"><i className="bi-house-door-fill"></i></div>
                    <span>Mis inmuebles</span>
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
                  <NavDropdown.Item as={Link} to="/perfil" className="dropdown-item-custom">
                    <div className="icon-wrapper"><i className="far fa-user"></i></div>
                    <span>Mi cuenta</span>
                  </NavDropdown.Item>
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

      {/* CHAT */}
      <Container fluid className="chat-wrapper">
        <Row className="h-100">
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
            <div className="contacts-list">
              {contacts
                .filter((contact) =>
                  contact.name.toLowerCase().includes(searchQuery.toLowerCase())
                )
                .map((contact) => (
                  <div
                    key={contact.id}
                    className={`contact-item ${selectedContact?.id === contact.id ? 'active' : ''}`}
                    onClick={() => setSelectedContact(contact)}
                    data-aos="fade-up"
                  >
                    <div className="contact-avatar">
                      {contact.isOnline && <span className="online-indicator"></span>}
                      <div className="avatar-text">{contact.name[0]}</div>
                    </div>
                    <div className="contact-info">
                      <h6 className="contact-name">{contact.name}</h6>
                      <p className="last-message">{contact.lastMessage}</p>
                      {contact.publicacionTitulo && (
                        <small className="text-muted">📍 {contact.publicacionTitulo}</small>
                      )}
                    </div>
                    {contact.unreadCount > 0 && (
                      <span className="unread-badge">{contact.unreadCount}</span>
                    )}
                  </div>
                ))}
            </div>
          </Col>

          <Col md={8} lg={9} className="chat-main" data-aos="fade-left">
            {selectedContact ? (
              <>
                <div className="chat-header">
                  <div className="selected-contact">
                    <div className="contact-avatar">
                      <div className="avatar-text">{selectedContact.name[0]}</div>
                    </div>
                    <div className="contact-info">
                      <h5>{selectedContact.name}</h5>
                      {selectedContact.publicacionTitulo && (
                        <small className="text-info">
                          Conversación sobre: {selectedContact.publicacionTitulo}
                        </small>
                      )}
                      <br />
                      <small
                        className={selectedContact.isOnline ? 'text-success' : 'text-muted'}
                      >
                        {selectedContact.isOnline ? 'En línea' : 'Desconectado'}
                      </small>
                    </div>
                  </div>
                </div>

                <div className="messages-container">
                  {messages.map((message) => (
                    <div
                      key={message.id_mensaje}
                      className={`message ${message.isFromCurrentUser ? 'sent' : 'received'}`}
                      data-aos="fade-up"
                    >
                      <div className="message-content">
                        <p>{message.contenido}</p>
                        <small className="message-time">
                          {formatMessageTime(message.fecha_envio)}
                        </small>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>

                <Form onSubmit={handleSendMessage} className="message-form">
                  <Form.Group className="message-input d-flex">
                    <Form.Control
                      type="text"
                      placeholder="Escribe un mensaje..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                    />
                    <Button type="submit" className="send-button">
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