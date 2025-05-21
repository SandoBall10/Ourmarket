import React, { useState, useEffect, useRef } from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
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
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

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

  return (
    <div className="chat-page">
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
                    className={`contact-item ${
                      selectedContact?.id === contact.id ? 'active' : ''
                    }`}
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
                        className={
                          selectedContact.isOnline ? 'text-success' : 'text-muted'
                        }
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
                      className={`message ${
                        message.senderId === 'currentUser' ? 'sent' : 'received'
                      }`}
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

      <footer className="footer-section">
        <div className="footer-top">
          <Container>
            <Row className="footer-row">
              <Col lg={4} md={6} className="mb-4 mb-md-0">
                <div className="footer-brand">
                  <h2 className="text-white mb-3">InmoMarket</h2>
                  <p className="footer-desc">
                    La plataforma inmobiliaria que conecta a compradores y
                    vendedores para hacer realidad sus sueños inmobiliarios.
                  </p>
                  <div className="footer-social">
                    <a href="#" className="social-icon">
                      <i className="fab fa-facebook-f"></i>
                    </a>
                    <a href="#" className="social-icon">
                      <i className="fab fa-instagram"></i>
                    </a>
                    <a href="#" className="social-icon">
                      <i className="fab fa-twitter"></i>
                    </a>
                    <a href="#" className="social-icon">
                      <i className="fab fa-linkedin-in"></i>
                    </a>
                    <a href="#" className="social-icon">
                      <i className="fab fa-youtube"></i>
                    </a>
                  </div>
                </div>
              </Col>

              <Col lg={2} md={6} className="mb-4 mb-lg-0">
                <h5 className="footer-heading">Comprar</h5>
                <ul className="footer-links">
                  <li><a href="#">Departamentos</a></li>
                  <li><a href="#">Casas</a></li>
                  <li><a href="#">Terrenos</a></li>
                </ul>
              </Col>

              <Col lg={2} md={6} className="mb-4 mb-lg-0">
                <h5 className="footer-heading">Vender</h5>
                <ul className="footer-links">
                  <li><a href="#">Publicar Propiedad</a></li>
                  <li><a href="#">Consejos de Venta</a></li>
                  <li><a href="#">Valoración de Inmuebles</a></li>
                  <li><a href="#">Publicaciones Destacadas</a></li>
                </ul>
              </Col>

              <Col lg={4} md={6}>
                <h5 className="footer-heading">Suscríbete</h5>
                <p className="footer-newsletter-text">
                  Recibe las mejores ofertas inmobiliarias en tu correo
                </p>
                <div className="footer-newsletter">
                  <input type="email" placeholder="Tu correo electrónico" className="footer-input" />
                  <button className="footer-subscribe-btn">Suscribirse</button>
                </div>
                <div className="footer-contact mt-4">
                  <div className="d-flex align-items-center mb-2">
                    <i className="fas fa-phone-alt me-2"></i>
                    <span>(01) 555-1234</span>
                  </div>
                  <div className="d-flex align-items-center">
                    <i className="fas fa-envelope me-2"></i>
                    <span>contacto@inmomarket.com</span>
                  </div>
                </div>
              </Col>
            </Row>
          </Container>
        </div>

        <div className="footer-bottom">
          <Container>
            <Row className="align-items-center">
              <Col md={6} className="text-center text-md-start">
                <p className="mb-md-0">
                  &copy; {new Date().getFullYear()} InmoMarket. Todos los derechos reservados.
                </p>
              </Col>
              <Col md={6} className="text-center text-md-end footer-links-bottom">
                <a href="#">Política de Privacidad</a>
                <a href="#">Términos y Condiciones</a>
                <a href="#">Mapa del Sitio</a>
              </Col>
            </Row>
          </Container>
        </div>
      </footer>
    </div>
  );
};

export default Chats;