import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Navbar, Container, Nav, NavDropdown, Button, Modal, Form, Dropdown, Table, Alert } from 'react-bootstrap';
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
  const [showModal, setShowModal] = useState(false);
  const [newAdmin, setNewAdmin] = useState({
    username: '',
    contrasena: '',
    rolId: 2  // Siempre rol 2 (Administrador)
  });
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editAdmin, setEditAdmin] = useState({
    id: 0,
    username: '',
    contrasena: '',
    rolId: 2
  });
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
  const [adminToDelete, setAdminToDelete] = useState<number | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false); // Nuevo estado para eliminar
  const [pendientes, setPendientes] = useState<any[]>([]);
  const [loadingPendientes, setLoadingPendientes] = useState(false);
  const [errorPendientes, setErrorPendientes] = useState<string | null>(null);
  const navigate = useNavigate();

  // Utilidad global para obtener el token correctamente formateado
  const getAuthToken = () => {
    const token = localStorage.getItem('token');
    if (!token) return null;
    return token.startsWith('Bearer ') ? token : `Bearer ${token}`;
  };

  // Verificar permisos y obtener el rol y datos del usuario
  useEffect(() => {
    const checkSession = () => {
      try {
        // Recuperar datos del usuario desde localStorage
        const userStr = localStorage.getItem('user');
        const token = localStorage.getItem('token');

        if (!userStr || !token) {
          console.log('No hay datos de usuario o token en localStorage');
          navigate('/login');
          return;
        }

        const user = JSON.parse(userStr);
        
        // Verificar que tiene rol adecuado
        if (!user.isLoggedIn || (user.rol !== 'ROLE_MASTER' && user.rol !== 'ROLE_ADMIN')) {
          console.log('Usuario sin rol adecuado');
          navigate('/login');
          return;
        }
        
        // NO verificar token aquí - lo haremos solo cuando sea necesario
        setUserRole(user.rol);
        setUser(user);
        
        setUserData({
          nombre: user.name?.split(' ')[0] || 'Usuario',
          apellido: user.name?.split(' ')[1] || '',
          email: user.email || 'email@ejemplo.com',
          telefono: user.telefono || '',
          documento: user.documento || 'DNI',
          identificador: user.identificador || ''
        });
        
        console.log('Sesión de usuario verificada correctamente:', user.rol);
      } catch (error) {
        console.error('Error al procesar datos del usuario:', error);
        // NO redirigir automáticamente aquí
      }
    };

    checkSession();
    
    // Implementamos una verificación periódica pero muy poco frecuente
    const sessionInterval = setInterval(checkSession, 30 * 60 * 1000); // 30 minutos
    
    return () => clearInterval(sessionInterval);
  }, []);

  // Cargar administradores
  useEffect(() => {
    const fetchAdministradores = async () => {
      if (userRole !== 'ROLE_MASTER' && activeSection !== 'administradores') {
        setLoading(false);
        return;
      }

      try {
        const token = localStorage.getItem('token');
        
        if (!token) {
          throw new Error('No hay token de autenticación disponible');
        }
        
        // Asegurar formato correcto del token
        const authToken = token.startsWith('Bearer ') ? token : `Bearer ${token}`;
        
        // Asegurarse de que el token se envía correctamente
        const response = await fetch('http://localhost:8080/api/administradores', {
          method: 'GET',
          headers: {
            'Authorization': authToken,
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

  // Cargar publicaciones pendientes cuando la sección activa es 'pendientes'
  useEffect(() => {
    const fetchPendientes = async () => {
      if (activeSection !== 'pendientes') return;
      setLoadingPendientes(true);
      setErrorPendientes(null);
      try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('No hay token de autenticación disponible');
        const authToken = token.startsWith('Bearer ') ? token : `Bearer ${token}`;
        const response = await fetch('http://localhost:8080/api/publicaciones/pendientes', {
          headers: {
            'Authorization': authToken,
            'Content-Type': 'application/json'
          }
        });
        if (!response.ok) {
          throw new Error('Error al cargar publicaciones pendientes');
        }
        const data = await response.json();
        setPendientes(data);
      } catch (err) {
        setErrorPendientes(err instanceof Error ? err.message : 'Error al cargar publicaciones pendientes');
      } finally {
        setLoadingPendientes(false);
      }
    };
    fetchPendientes();
  }, [activeSection]);

  // Eliminar administrador (solo MASTER)
  const handleDeleteAdmin = async (adminId: number) => {
    if (userRole !== 'ROLE_MASTER') return;
    
    if (window.confirm('¿Está seguro que desea eliminar este administrador?')) {
      try {
        const authToken = getAuthToken();
        if (!authToken) throw new Error('No hay token de autenticación disponible');
        
        const response = await fetch(`http://localhost:8080/api/administradores/${adminId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': authToken,
            'Content-Type': 'application/json'
          }
        });
        
        if (!response.ok) {
          throw new Error('Error al eliminar el administrador');
        }
        
        // Actualizar la lista después de eliminar
        setAdministradores(prevAdmins => prevAdmins.filter(admin => {
          const adminIdKey = admin.idAdmin || admin.id_admin || admin.id || admin.idAdministrador;
          return adminIdKey !== adminId;
        }));
        
        alert('Administrador eliminado correctamente');
      } catch (err) {
        alert(err instanceof Error ? err.message : 'Error al eliminar el administrador');
      }
    }
  };

  // Manejo de cierre de sesión - sin timeouts
  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    navigate('/login');
  };

  // Funciones para el modal de creación de administrador
  const handleCloseModal = () => {
    setShowModal(false);
    setNewAdmin({ username: '', contrasena: '', rolId: 2 });
    setSubmitError(null);
  };

  const handleShowModal = () => {
    setShowModal(true);
    setSubmitError(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewAdmin({
      ...newAdmin,
      [name]: value
    });
  };

  const handleRolChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setNewAdmin({
      ...newAdmin,
      rolId: parseInt(e.target.value)
    });
  };

  // Modifica la función handleSubmit para usar siempre rol 2
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validaciones básicas
    if (!newAdmin.username || !newAdmin.contrasena) {
      setSubmitError("Por favor complete todos los campos.");
      return;
    }

    if (newAdmin.contrasena.length < 8) {
      setSubmitError("La contraseña debe tener al menos 8 caracteres.");
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const authToken = getAuthToken();
      if (!authToken) throw new Error('No hay token de autenticación disponible');
      
      // Usar siempre el rol 2 (Administrador)
      const adminData = {
        username: newAdmin.username,
        contrasena: newAdmin.contrasena,
        rol: {
          idRol: 2  // Siempre usar rol 2 (Administrador)
        }
      };

      console.log("Datos completos a enviar:", JSON.stringify(adminData));

      const response = await fetch('http://localhost:8080/api/administradores', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': authToken
        },
        body: JSON.stringify(adminData)
      });

      if (!response.ok) {
        if (response.status === 403) {
          throw new Error('No tienes permisos para crear administradores.');
        } else {
          const errorData = await response.text();
          throw new Error(errorData || `Error ${response.status}: No se pudo crear el administrador.`);
        }
      }

      // Éxito: cerrar modal y refrescar lista de administradores
      handleCloseModal();
      
      // Refrescar la lista de administradores
      if (activeSection === 'administradores') {
        const updatedResponse = await fetch('http://localhost:8080/api/administradores', {
          method: 'GET',
          headers: {
            'Authorization': authToken,
            'Content-Type': 'application/json'
          }
        });
        
        if (updatedResponse.ok) {
          const data = await updatedResponse.json();
          setAdministradores(data);
        }
      }

      alert('Administrador creado correctamente');
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Error al crear el administrador');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Abrir el modal de edición con los datos del administrador seleccionado
  const handleShowEditModal = (admin: any) => {
    console.log("Datos completos del admin:", admin); // Para depuración
    
    // Extrae correctamente el ID observando todas las propiedades
    let adminId = null;
    if (admin.id_admin) adminId = admin.id_admin; 
    else if (admin.idAdmin) adminId = admin.idAdmin;
    else if (admin.id) adminId = admin.id;
    else if (admin.idAdministrador) adminId = admin.idAdministrador;
    
    if (!adminId) {
      console.error("No se pudo identificar el ID del administrador", admin);
      alert("Error: No se pudo identificar el ID del administrador");
      return;
    }
    
    setEditAdmin({
      id: adminId,
      username: admin.username || admin.nombreCompleto || "",
      contrasena: "",  // Vacío por defecto
      rolId: admin.rol?.idRol || 2
    });
    
    console.log("Datos capturados para edición:", {
      id: adminId,
      username: admin.username || admin.nombreCompleto || "",
      rolId: admin.rol?.idRol || 2
    });
    
    setShowEditModal(true);
  };

  // Cerrar el modal de edición
  const handleCloseEditModal = () => {
    setShowEditModal(false);
  };

  // Manejar cambios en los campos del formulario de edición
  const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditAdmin({
      ...editAdmin,
      [name]: value
    });
  };

  // Enviar los cambios al backend
  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validar datos
    if (!editAdmin.username) {
      alert("El nombre de usuario es obligatorio");
      return;
    }
    
    // Si hay contraseña, validar longitud
    if (editAdmin.contrasena && editAdmin.contrasena.length < 6) {
      alert("La contraseña debe tener al menos 6 caracteres");
      return;
    }
    
    // Validar que el ID exista
    if (!editAdmin.id) {
      alert("Error: No se pudo identificar el administrador a editar");
      return;
    }
    
    setIsEditing(true);
    
    try {
      const authToken = getAuthToken();
      if (!authToken) throw new Error('No hay token de autenticación disponible');
      
      // Actualizar la estructura de datos - ya no incluye el rol
      const updateData: any = {
        username: editAdmin.username
      };
      
      // Solo incluir contraseña si se ha especificado
      if (editAdmin.contrasena && editAdmin.contrasena.trim() !== '') {
        updateData.contrasena = editAdmin.contrasena;
      }
      
      console.log(`Enviando petición a: http://localhost:8080/api/administradores/${editAdmin.id}`);
      console.log("Datos a enviar:", JSON.stringify(updateData)); // Para depuración
      
      const response = await fetch(`http://localhost:8080/api/administradores/${editAdmin.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': authToken
        },
        body: JSON.stringify(updateData)
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error("Error completo:", errorText); // Para depuración
        throw new Error(`Error al actualizar el administrador: ${response.status}`);
      }
      
      // Actualizar la lista de administradores
      const updatedResponse = await fetch('http://localhost:8080/api/administradores', {
        method: 'GET',
        headers: {
          'Authorization': authToken,
          'Content-Type': 'application/json'
        }
      });
      
      if (updatedResponse.ok) {
        const data = await updatedResponse.json();
        setAdministradores(data);
      }
      
      setShowEditModal(false);
      alert('Administrador actualizado correctamente');
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Error al actualizar el administrador');
    } finally {
      setIsEditing(false);
    }
  };

  // Funciones para manejar la confirmación de eliminación
  const handleShowDeleteModal = (adminId: number) => {
    setAdminToDelete(adminId);
    setShowDeleteConfirmModal(true);
  };

  const handleCloseDeleteModal = () => {
    setShowDeleteConfirmModal(false);
    setAdminToDelete(null);
  };

  const confirmDeleteAdmin = async () => {
    if (!adminToDelete) return;
    
    try {
      setIsDeleting(true);
      const authToken = getAuthToken();
      if (!authToken) throw new Error('No hay token de autenticación disponible');
      
      console.log("Eliminando administrador con ID:", adminToDelete);
      
      const response = await fetch(`http://localhost:8080/api/administradores/${adminToDelete}`, {
        method: 'DELETE',
        headers: {
          'Authorization': authToken,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`Error al eliminar: ${response.status}`);
      }
      
      // Actualizar el estado local primero (UI inmediata)
      setAdministradores(prevAdmins => {
        const updatedAdmins = prevAdmins.filter(admin => {
          const adminId = admin.idAdmin || admin.id_admin || admin.id || admin.idAdministrador;
          return adminId !== adminToDelete;
        });
        return updatedAdmins;
      });
      
      // También recargar datos del backend para asegurar sincronización
      const updatedResponse = await fetch('http://localhost:8080/api/administradores', {
        method: 'GET',
        headers: {
          'Authorization': authToken,
          'Content-Type': 'application/json'
        }
      });
      
      if (updatedResponse.ok) {
        const data = await updatedResponse.json();
        setAdministradores(data);
      }
      
      setShowDeleteConfirmModal(false);
      setAdminToDelete(null);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Error al eliminar el administrador');
    } finally {
      setIsDeleting(false);
    }
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
                    onClick={handleShowModal} // Cambiado para mostrar el modal
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
                          <th>Nombre de Usuario</th>
                          <th>Fecha de Creación</th>
                          <th>Última Actualización</th>
                          <th>Acciones</th>
                        </tr>
                      </thead>
                      <tbody>
                        {administradores.length > 0 ? (
                          administradores.map((admin) => (
                            <tr key={admin.idAdmin || admin.id_admin || admin.id || admin.idAdministrador}>
                              <td>{admin.username || admin.nombreCompleto}</td>
                              <td className="date-column">
                                {admin.fechaCreacion || admin.fecha_creacion 
                                  ? new Date(admin.fechaCreacion || admin.fecha_creacion).toLocaleDateString('es-ES', {
                                      day: '2-digit',
                                      month: '2-digit',
                                      year: 'numeric',
                                      hour: '2-digit',
                                      minute: '2-digit'
                                    }) 
                                  : 'N/A'}
                              </td>
                              <td className="date-column">
                                {admin.fechaActualizacion || admin.fecha_actualizacion 
                                  ? new Date(admin.fechaActualizacion || admin.fecha_actualizacion).toLocaleDateString('es-ES', {
                                      day: '2-digit',
                                      month: '2-digit',
                                      year: 'numeric',
                                      hour: '2-digit',
                                      minute: '2-digit'
                                    }) 
                                  : 'N/A'}
                              </td>
                              <td>
                                <button 
                                  className="btn btn-sm btn-outline-primary me-2"
                                  onClick={() => handleShowEditModal(admin)}
                                >
                                  <i className="bi bi-pencil"></i>
                                </button>
                                {userRole === 'ROLE_MASTER' && (
                                  <button 
                                    className="btn btn-sm btn-outline-danger"
                                    onClick={() => handleShowDeleteModal(admin.idAdmin || admin.id || admin.idAdministrador)}
                                  >
                                    <i className="bi bi-trash"></i>
                                  </button>
                                )}
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={4} className="text-center">No hay administradores registrados</td>
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
        
      case 'pendientes':
        return (
          <div className="card shadow">
            <div className="card-header bg-white d-flex justify-content-between align-items-center">
              <h5 className="mb-0">
                <i className="bi bi-hourglass-split me-2"></i>
                Publicaciones Pendientes de Aprobación
              </h5>
            </div>
            <div className="card-body">
              {errorPendientes && <Alert variant="danger">{errorPendientes}</Alert>}
              {loadingPendientes ? (
                <div className="text-center py-4">
                  <div className="spinner-border text-success" role="status">
                    <span className="visually-hidden">Cargando...</span>
                  </div>
                </div>
              ) : (
                <Table striped bordered hover>
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Título</th>
                      <th>Descripción</th>
                      <th>Cliente</th>
                      <th>Estado</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pendientes.length > 0 ? pendientes.map(pub => (
                      <tr key={pub.idPublicacion || pub.id}>
                        <td>{pub.idPublicacion || pub.id}</td>
                        <td>{pub.titulo}</td>
                        <td>{pub.descripcion}</td>
                        <td>{pub.cliente?.email || 'N/A'}</td>
                        <td>
                          <span className="badge bg-warning text-dark">{pub.estado}</span>
                        </td>
                        <td>
                          {/* Aquí podrías agregar botón para aprobar */}
                          {/* <Button size="sm" variant="success">Aprobar</Button> */}
                        </td>
                      </tr>
                    )) : (
                      <tr>
                        <td colSpan={6} className="text-center">No hay publicaciones pendientes</td>
                      </tr>
                    )}
                  </tbody>
                </Table>
              )}
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

  // Renderizar banner de sesión expirada si hay error
  const renderSessionErrorBanner = () => {
    if (error && (error.includes('sesión') || error.includes('token'))) {
      return (
        <div className="alert alert-warning d-flex justify-content-between align-items-center mb-4">
          <div>
            <i className="bi bi-exclamation-triangle-fill me-2"></i>
            {error}
          </div>
          <Button 
            variant="outline-dark" 
            size="sm" 
            onClick={() => navigate('/login')}
          >
            Iniciar sesión nuevamente
          </Button>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="dashboard-main-container">
{/* Barra de Navegación */}
      <Navbar bg="white" expand="lg" className="w-100 border-bottom">
        <Container fluid className="px-4">
          <Navbar.Brand href="#">
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
                  {/* Botón de Inicio */}
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
                      // Cerrar el dropdown
                      document.body.click();
                      // Cambiar a la sección de notificaciones en Perfil
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

      {/* CONTENIDO DEL DASHBOARD */}
      <div className="dashboard-container">
        {/* Sidebar con fondo blanco */}
        <div className="dashboard-sidebar">
          <div className="sidebar-header">
            <h3>
              <i className="bi bi-gear-fill"></i>
              <span>Panel de Control</span>
            </h3>
            <div className="user-role">{userRole === 'ROLE_MASTER' ? 'Master' : 'Administrador'}</div>
          </div>

          <ul className="sidebar-menu">
            <li className={activeSection === 'dashboard' ? 'active' : ''}>
              <a href="#" onClick={() => setActiveSection('dashboard')}>
                <i className="bi bi-speedometer2"></i>
                <span>Dashboard</span>
              </a>
            </li>
            <li className={activeSection === 'administradores' ? 'active' : ''}>
              <a href="#" onClick={() => setActiveSection('administradores')}>
                <i className="bi bi-people-fill"></i>
                <span>Administradores</span>
              </a>
            </li>
            <li className={activeSection === 'pendientes' ? 'active' : ''}>
              <a href="#" onClick={() => setActiveSection('pendientes')}>
                <i className="bi bi-hourglass-split"></i>
                <span>Pendientes de aprobación</span>
              </a>
            </li>
            <li>
              <a href="#" onClick={handleLogout}>
                <i className="bi bi-box-arrow-right"></i>
                <span>Cerrar Sesión</span>
              </a>
            </li>
          </ul>
        </div>
        
        {/* Contenido principal existente */}
        <div className="dashboard-content">
          {renderSessionErrorBanner()}
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

      {/* Modal para crear nuevo administrador */}
      <Modal show={showModal} onHide={handleCloseModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>
            <i className="bi bi-person-plus-fill me-2 text-success"></i>
            Crear Nuevo Administrador
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {submitError && (
            <div className="alert alert-danger">{submitError}</div>
          )}
          
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Nombre de Usuario</Form.Label>
              <div className="input-group">
                <span className="input-group-text bg-success text-white">
                  <i className="bi bi-person"></i>
                </span>
                <Form.Control
                  type="text"
                  name="username"
                  value={newAdmin.username}
                  onChange={handleInputChange}
                  placeholder="Nombre de usuario"
                  required
                />
              </div>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Contraseña</Form.Label>
              <div className="input-group">
                <span className="input-group-text bg-success text-white">
                  <i className="bi bi-lock"></i>
                </span>
                <Form.Control
                  type="password"
                  name="contrasena"
                  value={newAdmin.contrasena}
                  onChange={handleInputChange}
                  placeholder="Contraseña"
                  required
                />
              </div>
              <Form.Text className="text-muted">
                La contraseña debe tener al menos 8 caracteres.
              </Form.Text>
            </Form.Group>

            {/* Reemplaza el selector de rol con un campo estático */}
            <Form.Group className="mb-3">
              <Form.Label>Rol</Form.Label>
              <div className="input-group">
                <span className="input-group-text bg-success text-white">
                  <i className="bi bi-shield"></i>
                </span>
                <Form.Control
                  type="text"
                  value="Administrador (Rol 2)"
                  disabled
                  className="bg-light"
                />
              </div>
              <Form.Text className="text-muted">
                Los nuevos usuarios se crean con rol de Administrador por defecto.
              </Form.Text>
            </Form.Group>

            <div className="d-flex justify-content-end mt-4">
              <Button 
                variant="outline-secondary" 
                onClick={handleCloseModal}
                className="me-2"
                disabled={isSubmitting}
              >
                Cancelar
              </Button>
              <Button 
                variant="success" 
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Creando...
                  </>
                ) : (
                  'Crear Administrador'
                )}
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Modal para editar administrador */}
      <Modal show={showEditModal} onHide={handleCloseEditModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>
            <i className="bi bi-pencil-square me-2 text-primary"></i>
            Editar Administrador
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleEditSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Nombre de Usuario</Form.Label>
              <div className="input-group">
                <span className="input-group-text bg-primary text-white">
                  <i className="bi bi-person"></i>
                </span>
                <Form.Control
                  type="text"
                  name="username"
                  value={editAdmin.username}
                  onChange={handleEditInputChange}
                  placeholder="Nombre de usuario"
                  required
                />
              </div>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Contraseña</Form.Label>
              <div className="input-group">
                <span className="input-group-text bg-primary text-white">
                  <i className="bi bi-lock"></i>
                </span>
                <Form.Control
                  type="password"
                  name="contrasena"
                  value={editAdmin.contrasena}
                  onChange={handleEditInputChange}
                  placeholder="Contraseña Actual o Nueva"
                />
              </div>
            </Form.Group>

            <div className="d-flex justify-content-end mt-4">
              <Button 
                variant="outline-secondary" 
                onClick={handleCloseEditModal}
                className="me-2"
                disabled={isEditing}
              >
                Cancelar
              </Button>
              <Button 
                variant="primary" 
                type="submit"
                disabled={isEditing}
              >
                {isEditing ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Guardando...
                  </>
                ) : (
                  'Guardar Cambios'
                )}
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Modal de confirmación para eliminar */}
      <Modal show={showDeleteConfirmModal} onHide={handleCloseDeleteModal} centered>
        <Modal.Header closeButton className="bg-danger text-white">
          <Modal.Title>
            <i className="bi bi-exclamation-triangle-fill me-2"></i>
            Confirmar Eliminación
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p className="mb-1">¿Está seguro que desea eliminar este administrador?</p>
          <p className="text-danger mb-0"><strong>Esta acción no se puede deshacer.</strong></p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-secondary" onClick={handleCloseDeleteModal}>
            Cancelar
          </Button>
          <Button 
            variant="danger" 
            onClick={confirmDeleteAdmin}
            disabled={isDeleting}
          >
            {isDeleting ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Eliminando...
              </>
            ) : (
              'Eliminar'
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Dashboard;