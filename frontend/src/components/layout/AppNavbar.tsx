import { Button, Container, Nav, Navbar, NavDropdown } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { clearSession, getSessionUser, isAdminRole } from '../../auth/session';
import '../Principal.css';

type AppNavbarProps = {
  active?: 'buscar' | 'vender' | 'guias';
};

export default function AppNavbar({ active }: AppNavbarProps) {
  const navigate = useNavigate();
  const user = getSessionUser();
  const loggedIn = Boolean(user);
  const displayName = user?.name || user?.username || 'Usuario';

  const handleLogout = () => {
    clearSession();
    navigate('/');
  };

  return (
    <Navbar bg="white" expand="lg" className="w-100 border-bottom">
      <Container fluid className="px-4">
        <Navbar.Brand as={Link} to="/">
          <img
            src="/inmoicon.png"
            alt="InmoMarket"
            height="30"
            className="d-inline-block align-top"
          />
          <span className="fw-bold"> InmoMarket</span>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="app-navbar" />
        <Navbar.Collapse id="app-navbar">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/buscar" className={active === 'buscar' ? 'fw-bold' : ''}>
              Comprar
            </Nav.Link>
            <Nav.Link as={Link} to="/vender" className={active === 'vender' ? 'fw-bold' : ''}>
              Vender
            </Nav.Link>
            <NavDropdown title="Guías" id="guias-dropdown" className={active === 'guias' ? 'fw-bold' : ''}>
              <NavDropdown.Item as={Link} to="/vendedores">Para vendedores</NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/compradores">Para compradores</NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/conocenos">Conócenos</NavDropdown.Item>
            </NavDropdown>
          </Nav>
          <Nav className="ms-auto">
            {loggedIn ? (
              <NavDropdown
                title={
                  <div className="avatar-container">
                    <div className="user-avatar">
                      {displayName.charAt(0).toUpperCase()}
                    </div>
                    <i className="fas fa-chevron-down avatar-arrow"></i>
                  </div>
                }
                id="user-dropdown"
                align="end"
                className="custom-dropdown"
              >
                <NavDropdown.Item as={Link} to="/publicaciones" className="dropdown-item-custom">
                  <span>Mis publicaciones</span>
                </NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/inmuebles" className="dropdown-item-custom">
                  <span>Mis inmuebles</span>
                </NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/favoritos" className="dropdown-item-custom">
                  <span>Favoritos</span>
                </NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/chats" className="dropdown-item-custom">
                  <span>Mis chats</span>
                </NavDropdown.Item>
                {isAdminRole(user?.rol) && (
                  <>
                    <NavDropdown.Divider />
                    <NavDropdown.Item as={Link} to="/dashboard" className="dropdown-item-custom">
                      <span>Dashboard Admin</span>
                    </NavDropdown.Item>
                  </>
                )}
                <NavDropdown.Divider />
                <NavDropdown.Item as={Link} to="/perfil" className="dropdown-item-custom">
                  <span>Mi cuenta</span>
                </NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/compradores" className="dropdown-item-custom">
                  <span>Ayuda</span>
                </NavDropdown.Item>
                <NavDropdown.Item onClick={handleLogout} className="dropdown-item-custom">
                  <span>Cerrar sesión</span>
                </NavDropdown.Item>
              </NavDropdown>
            ) : (
              <Button variant="success" className="btn-ingresar" onClick={() => navigate('/login')}>
                Ingresar
              </Button>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
