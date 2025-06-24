import React, { useState, useEffect, useRef } from 'react';
import { Container, Row, Col, Form, Button, Navbar, Nav, NavDropdown } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';
import './Chats.css';

interface Message {
  id: string;
  senderId: string;
  text: string;
  timestamp: Date;
  isRead: boolean;
}

interface Contact {
  id: string;
  name: string;
  lastMessage: string;
  unreadCount: number;
  isOnline: boolean;
  avatar?: string;
}

const Chats: React.FC = () => {
  const navigate = useNavigate();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Simulación de autenticación
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(true);
  const [user, setUser] = useState<{ name: string }>({ name: 'Usuario' });

  useEffect(() => {
    AOS.init({ duration: 800, once: false });
    setContacts([
      {
        id: '1',
        name: 'Juan Pérez',
        lastMessage: '¿Está disponible la casa?',
        unreadCount: 2,
        isOnline: true,
      },
    ]);
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedContact) return;

    const newMsg: Message = {
      id: Date.now().toString(),
      senderId: 'currentUser',
      text: newMessage,
      timestamp: new Date(),
      isRead: false,
    };

    setMessages((prevMessages) => [...prevMessages, newMsg]);
    setNewMessage('');
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUser({ name: '' });
    navigate('/login');
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
              {/* Menú Mis Publicaciones */}
              <div className="nav-item mega-dropdown">
                <Nav.Link
                  as={Link}
                  to="/publicaciones"
                  className="nav-link-text"
                  id="comprar-dropdown"
                >
                  Mis Publicaciones <i className="fas fa-chevron-down fa-xs"></i>
                </Nav.Link>
                <div className="mega-menu-wrapper">
                </div>
              </div>

              {/* Menú Favoritos */}
              <div className="nav-item mega-dropdown">
                <Nav.Link
                  as={Link}
                  to="/mis-favoritos"
                  className="nav-link-text active"
                  id="favoritos-dropdown"
                >
                  Favoritos <i className="fas fa-chevron-down fa-xs"></i>
                </Nav.Link>
                <div className="mega-menu-wrapper">
                </div>
              </div>

              {/* Menú Mis Chats */}
              <div className="nav-item mega-dropdown">
                <Nav.Link
                  as={Link}
                  to="/chats"
                  className="nav-link-text"
                  id="chats-dropdown"
                >
                  Mis Chats <i className="fas fa-chevron-down fa-xs"></i>
                </Nav.Link>
                <div className="mega-menu-wrapper">
                </div>
              </div>

              {/* Menú Historial*/}
              <div className="nav-item mega-dropdown">

                <div className="mega-menu-wrapper">
                </div>
              </div>
            </Nav>
            <Nav className="ms-auto">
              {/* Notificaciones */}
              <Nav.Link href="#" className="me-2">
                <span className="nav-link-text">Notificaciones <i className="far fa-bell"></i></span>
              </Nav.Link>
              {/* Ingresar o Avatar de Usuario */}
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
                  <NavDropdown.Item as={Link} to="/perfil" className="dropdown-item-custom">
                    <div className="icon-wrapper"><i className="far fa-user"></i></div>
                    <span>Mi cuenta</span>
                  </NavDropdown.Item>
                  <NavDropdown.Item
                    onClick={() => {
                      document.body.click();
                      navigate('/perfil', { state: { activeSection: 'notificaciones' } });
                    }}
                    className="dropdown-item-custom"
                  >
                    <div className="icon-wrapper"><i className="fas fa-cog"></i></div>
                    <span>Ajustes de notificaciones</span>
                  </NavDropdown.Item>
                  <NavDropdown.Divider />
                  <NavDropdown.Item as={Link} to="/compradores" className="dropdown-item-custom">
                    <div className="icon-wrapper"><i className="far fa-question-circle"></i></div>
                    <span>Ayuda</span>
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
                      key={message.id}
                      className={`message ${message.senderId === 'currentUser' ? 'sent' : 'received'}`}
                      data-aos="fade-up"
                    >
                      <div className="message-content">
                        <p>{message.text}</p>
                        <small className="message-time">
                          {message.timestamp.toLocaleTimeString()}
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