import { Button, Container, Nav, Navbar, NavDropdown } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { clearSession, getSessionUser, isAdminRole } from '../../auth/session';
import '../Principal.css';

type AppNavbarProps = { active?: 'buscar' | 'vender' | 'guias' };

export default function AppNavbar({ active }: AppNavbarProps) {
  const navigate = useNavigate();
  const user = getSessionUser();
  const loggedIn = Boolean(user);
  const displayName = user?.name || user?.username || 'Usuario';

  const handleLogout = () => {
    clearSession();
    navigate('/');
  };

  const accountMenu = loggedIn ? (
    <NavDropdown
      title={<span className="navbar-account"><i className="fa-regular fa-user" /><span>{displayName}</span></span>}
      id="user-dropdown"
      align="end"
      className="account-dropdown"
    >
      <NavDropdown.Item as={Link} to="/publicaciones">Mis publicaciones</NavDropdown.Item>
      <NavDropdown.Item as={Link} to="/inmuebles">Mis inmuebles</NavDropdown.Item>
      <NavDropdown.Item as={Link} to="/favoritos">Favoritos</NavDropdown.Item>
      <NavDropdown.Item as={Link} to="/chats">Mis chats</NavDropdown.Item>
      {isAdminRole(user?.rol) && <NavDropdown.Item as={Link} to="/dashboard">Dashboard Admin</NavDropdown.Item>}
      <NavDropdown.Divider />
      <NavDropdown.Item as={Link} to="/perfil">Mi cuenta</NavDropdown.Item>
      <NavDropdown.Item onClick={handleLogout}>Cerrar sesión</NavDropdown.Item>
    </NavDropdown>
  ) : (
    <Nav.Link as={Link} to="/login" className="navbar-user" aria-label="Ir a iniciar sesión">
      <i className="fa-regular fa-user" />
    </Nav.Link>
  );

  return (
    <Navbar expand="lg" className="inmo-navbar" sticky="top">
      <Container className="navbar-shell">
        <Navbar.Brand as={Link} to="/" className="inmo-brand">
          <i className="fa-solid fa-house-chimney brand-mark" aria-hidden="true" />
          <span>InmoMarket</span>
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="app-navbar" aria-label="Abrir navegación" />
        <Navbar.Collapse id="app-navbar">
          <Nav className="navbar-main-links">
            <Nav.Link as={Link} to="/buscar" className={active === 'buscar' ? 'active' : ''}>Comprar</Nav.Link>
            <Nav.Link as={Link} to="/vender" className={active === 'vender' ? 'active' : ''}>Vender</Nav.Link>
            <NavDropdown title="Guías" id="guias-dropdown" className={active === 'guias' ? 'active' : ''}>
              <NavDropdown.Item as={Link} to="/vendedores">Para vendedores</NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/compradores">Para compradores</NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/conocenos">Conócenos</NavDropdown.Item>
            </NavDropdown>
          </Nav>

          <Nav className="navbar-actions">
            <Nav.Link as={Link} to={loggedIn ? '/favoritos' : '/login'} className="navbar-favorites">
              <i className="fa-regular fa-heart" /> <span>Favoritos</span>
            </Nav.Link>
            {accountMenu}
            {!loggedIn && <Button className="navbar-login" onClick={() => navigate('/login')}>Ingresar</Button>}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
