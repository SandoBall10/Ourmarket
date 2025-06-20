import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Navbar, Container, Nav, NavDropdown, Button } from 'react-bootstrap';
import './Dashboard.css';

const Dashboard: React.FC = () => {
  const [administradores, setAdministradores] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string>('');
  const [userData, setUserData] = useState({
    nombre: '',
    apellido: '',
    email: '',
    telefono: '',
    documento: '',
    identificador: ''
  });
  const [activeSection, setActiveSection] = useState('perfil');
  const [isLoggedIn, setIsLoggedIn] = useState(true); // Siempre true en el dashboard
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();

  // Verificar permisos y obtener el rol y datos del usuario
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (!user.isLoggedIn || (user.rol !== 'ROLE_MASTER' && user.rol !== 'ROLE_ADMIN')) {
      navigate('/login');
      return;
    }
    setUserRole(user.rol);
    setUser(user); // Establecer el usuario para el NavDropdown
    
    // Aquí deberías obtener los datos completos del usuario de la API
    setUserData({
      nombre: user.name?.split(' ')[0] || 'Usuario',
      apellido: user.name?.split(' ')[1] || '',
      email: user.email || 'email@ejemplo.com',
      telefono: user.telefono || '',
      documento: user.documento || 'DNI',
      identificador: user.identificador || ''
    });
  }, [navigate]);

  // Cargar administradores
  useEffect(() => {
    const fetchAdministradores = async () => {
      if (userRole !== 'ROLE_MASTER' && activeSection !== 'administradores') {
        setLoading(false);
        return;
      }

      try {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        
        // Asegurarse de que el token se envía correctamente
        const response = await fetch('http://localhost:8080/api/administradores', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${user.token}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (!response.ok) {
          if (response.status === 403) {
            throw new Error('No tienes permisos para acceder a estos datos. Solo disponible para usuarios Master.');
          } else {
            throw new Error(`Error al cargar los administradores: ${response.status}`);
          }
        }
        
        const data = await response.json();
        setAdministradores(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error al cargar datos');
      } finally {
        setLoading(false);
      }
    };

    if (userRole && activeSection === 'administradores') {
      fetchAdministradores();
    }
  }, [userRole, activeSection]);

  // Eliminar administrador (solo MASTER)
  const handleDeleteAdmin = async (adminId: number) => {
    if (userRole !== 'ROLE_MASTER') return;
    
    if (window.confirm('¿Está seguro que desea eliminar este administrador?')) {
      try {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        
        const response = await fetch(`http://localhost:8080/api/administradores/${adminId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${user.token}`
          }
        });
        
        if (!response.ok) {
          throw new Error('Error al eliminar el administrador');
        }
        
        // Actualizar la lista después de eliminar
        setAdministradores(prevAdmins => prevAdmins.filter(admin => 
          admin.id !== adminId && admin.idAdministrador !== adminId
        ));
        
        alert('Administrador eliminado correctamente');
      } catch (err) {
        alert(err instanceof Error ? err.message : 'Error al eliminar el administrador');
      }
    }
  };

  // Manejo de cierre de sesión
  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  // Renderiza la sección correspondiente según activeSection
  const renderContent = () => {
    switch (activeSection) {
      
      case 'administradores':
        return (
          <div className="admin-management-section">
            <div className="card shadow">
              <div className="card-header bg-white d-flex justify-content-between align-items-center">
                <h5 className="mb-0">
                  <i className="bi bi-people-fill me-2"></i>
                  Administradores del Sistema
                </h5>
                
                {userRole === 'ROLE_MASTER' && (
                  <button 
                    className="btn btn-success" 
                    onClick={() => navigate('/dashboard/crear-administrador')}
                  >
                    <i className="bi bi-person-plus-fill me-2"></i>
                    Crear Nuevo Administrador
                  </button>
                )}
              </div>
              
              <div className="card-body">
                {error && <div className="alert alert-danger">{error}</div>}
                
                {loading ? (
                  <div className="text-center py-4">
                    <div className="spinner-border text-success" role="status">
                      <span className="visually-hidden">Cargando...</span>
                    </div>
                  </div>
                ) : (
                  <div className="table-responsive">
                    <table className="table table-hover">
                      <thead>
                        <tr>
                          <th>Nombre</th>
                          <th>Email</th>
                          <th>Teléfono</th>
                          <th>Fecha Registro</th>
                          <th>Acciones</th>
                        </tr>
                      </thead>
                      <tbody>
                        {administradores.length > 0 ? (
                          administradores.map((admin) => (
                            <tr key={admin.id || admin.idAdministrador}>
                              <td>{admin.nombreCompleto || admin.username}</td>
                              <td>{admin.email}</td>
                              <td>{admin.telefono || 'N/A'}</td>
                              <td>{admin.fechaRegistro ? new Date(admin.fechaRegistro).toLocaleDateString() : 'N/A'}</td>
                              <td>
                                <button className="btn btn-sm btn-outline-primary me-2">
                                  <i className="bi bi-pencil"></i>
                                </button>
                                {userRole === 'ROLE_MASTER' && (
                                  <button 
                                    className="btn btn-sm btn-outline-danger"
                                    onClick={() => handleDeleteAdmin(admin.id || admin.idAdministrador)}
                                  >
                                    <i className="bi bi-trash"></i>
                                  </button>
                                )}
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={5} className="text-center">No hay administradores registrados</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
        
      case 'dashboard':
      default:
        return (
          <>
            <div className="row mb-4">
              <div className="col-md-4">
                <div className="card stat-card">
                  <div className="card-body">
                    <div className="stat-icon bg-success">
                      <i className="bi bi-house-fill"></i>
                    </div>
                    <h5 className="stat-title">Propiedades</h5>
                    <h3 className="stat-value">245</h3>
                    <p className="stat-desc">Total de propiedades</p>
                  </div>
                </div>
              </div>
              <div className="col-md-4">
                <div className="card stat-card">
                  <div className="card-body">
                    <div className="stat-icon bg-success">
                      <i className="bi bi-graph-up"></i>
                    </div>
                    <h5 className="stat-title">Ventas</h5>
                    <h3 className="stat-value">84</h3>
                    <p className="stat-desc">Propiedades vendidas</p>
                  </div>
                </div>
              </div>
              <div className="col-md-4">
                <div className="card stat-card">
                  <div className="card-body">
                    <div className="stat-icon bg-success">
                      <i className="bi bi-people-fill"></i>
                    </div>
                    <h5 className="stat-title">Usuarios</h5>
                    <h3 className="stat-value">1,250</h3>
                    <p className="stat-desc">Clientes registrados</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="card shadow">
              <div className="card-header bg-white">
                <h5 className="mb-0">Actividad Reciente</h5>
              </div>
              <div className="card-body">
                <ul className="activity-list">
                  <li className="activity-item">
                    
                  </li>
                 
                </ul>
              </div>
            </div>
          </>
        );
    }
  };

  return (
    <div className="dashboard-main-container">
      {/* NAVBAR */}
      <Navbar bg="white" expand="lg" className="w-100 border-bottom dashboard-navbar">
        <Container fluid className="px-4">
          <Navbar.Brand as={Link} to="/">
            <img
              src="/logo.png"
              alt="InmoMarket"
              height="30"
              className="d-inline-block align-top"
            />
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
              {/* Avatar de Usuario */}
              {user && (
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
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* CONTENIDO DEL DASHBOARD */}
      <div className="dashboard-container">
        {/* Sidebar existente */}
        <div className="dashboard-sidebar">
          {/* Código existente del sidebar... */}
          <div className="sidebar-header">
            <h3>
              <i className="bi bi-gear me-2"></i>
              Panel de Control
            </h3>
            <p className="user-role">{userRole === 'ROLE_MASTER' ? 'Master' : 'Administrador'}</p>
          </div>
          
          <ul className="sidebar-menu">
            {/* Código existente del menú lateral... */}
            
            <li className={activeSection === 'dashboard' ? 'active' : ''} 
                onClick={() => setActiveSection('dashboard')}>
              <a href="#dashboard">
                <i className="bi bi-speedometer2"></i> Dashboard
              </a>
            </li>
            
            {/* Sección Administradores - Solo visible para rol MASTER */}
            {(userRole === 'ROLE_MASTER') && (
              <li className={activeSection === 'administradores' ? 'active' : ''} 
                  onClick={() => setActiveSection('administradores')}>
                <a href="#administradores">
                  <i className="bi bi-person-badge"></i> Administradores
                </a>
              </li>
            )}
            
            <li>
              <Link to="/">
                <i className="bi bi-house-door"></i> Ir al Sitio Web
              </Link>
            </li>
            
            <li onClick={handleLogout}>
              <a href="#logout">
                <i className="bi bi-box-arrow-right"></i> Cerrar Sesión
              </a>
            </li>
          </ul>
        </div>
        
        {/* Contenido principal existente */}
        <div className="dashboard-content">
          {/* Código existente del contenido... */}
          <div className="dashboard-header">
            <h2>
              {activeSection === 'dashboard' && 'Dashboard Principal'}
              {activeSection === 'propiedades' && 'Gestión de Propiedades'}
              {activeSection === 'clientes' && 'Gestión de Clientes'}
              {activeSection === 'administradores' && 'Gestión de Administradores'}
            </h2>
            <div className="user-info">
              <span>{userData.nombre} {userData.apellido}</span>
              <span className="badge bg-success ms-2">{userRole === 'ROLE_MASTER' ? 'Master' : 'Admin'}</span>
            </div>
          </div>
          
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;