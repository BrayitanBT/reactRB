import { useState, useEffect } from 'react';
import { apiService } from '../../../services/api';
import ModalContainer from '../../../pages/profile/user/modal/ModalContainer';
import UserFormContainer from '../../profile/user/forms/UserFormContainer';
import Notification from '../../../components/Notification/Notification';
import '../admin.css';

export default function UsersManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [error, setError] = useState('');
  const [notification, setNotification] = useState({
    show: false,
    message: '',
    type: 'success'
  });

  useEffect(() => {
    loadUsers();
  }, []);

  const showNotification = (message, type = 'success') => {
    setNotification({
      show: true,
      message,
      type
    });
    setTimeout(() => setNotification(prev => ({ ...prev, show: false })), 4000);
  };

  const hideNotification = () => {
    setNotification(prev => ({ ...prev, show: false }));
  };

  const loadUsers = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await apiService.getAllUsers();
      
      if (response.users) {
        setUsers(response.users);
      } else {
        setError('No se pudieron cargar los usuarios');
      }
    } catch (error) {
      console.error('Error cargando usuarios:', error);
      setError('Error al cargar los usuarios: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = async (userData) => {
    try {
      const response = await apiService.signup(userData);
      if (response.success) {
        await loadUsers();
        setShowCreateModal(false);
        showNotification('Usuario creado exitosamente', 'success');
        return response;
      } else {
        showNotification(response.message, 'error');
        return response;
      }
    } catch (error) {
      console.error('Error creando usuario:', error);
      showNotification('Error al crear el usuario', 'error');
      return { success: false, message: error.message };
    }
  };

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setShowEditModal(true);
  };

  const handleUpdateUser = async (userData) => {
    try {
      const response = await apiService.updateUserAdmin(userData);
      if (response.success) {
        await loadUsers();
        setShowEditModal(false);
        setSelectedUser(null);
        showNotification('Usuario actualizado exitosamente', 'success');
        return response;
      } else {
        showNotification(response.message, 'error');
        return response;
      }
    } catch (error) {
      console.error('Error actualizando usuario:', error);
      showNotification('Error al actualizar el usuario', 'error');
      return { success: false, message: error.message };
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('¿Estás seguro de que quieres eliminar este usuario?')) {
      return;
    }

    try {
      const response = await apiService.deleteUser(userId);
      if (response.success) {
        await loadUsers();
        showNotification('Usuario eliminado exitosamente', 'success');
      } else {
        showNotification(response.message, 'error');
      }
    } catch (error) {
      console.error('Error eliminando usuario:', error);
      showNotification('Error al eliminar el usuario', 'error');
    }
  };

  const getRoleBadge = (role) => {
    const roleClass = role === 'administrador' ? 'role-admin' : 'role-cliente';
    return <span className={`role-badge ${roleClass}`}>{role}</span>;
  };

  if (loading) {
    return (
      <div className="admin-page">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Cargando usuarios...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Notification
        message={notification.message}
        type={notification.type}
        show={notification.show}
        onClose={hideNotification}
      />

      <div className="admin-page">
        <div className="admin-header">
          <h1>Gestión de Usuarios</h1>
          <p>Administra los usuarios del sistema</p>
        </div>

        {error && (
          <div className="error-message">
            {error}
            <button onClick={loadUsers} className="btn-retry">Reintentar</button>
          </div>
        )}

        <div className="admin-actions">
          <button 
            onClick={() => setShowCreateModal(true)}
            className="btn-primary"
          >
            + Crear Usuario
          </button>
          <button onClick={loadUsers} className="btn-secondary">
            🔄 Actualizar
          </button>
        </div>

        <div className="data-table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Email</th>
                <th>Documento</th>
                <th>Teléfono</th>
                <th>Rol</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {users.length > 0 ? (
                users.map(user => (
                  <tr key={user.Id_usuario}>
                    <td>{user.Id_usuario}</td>
                    <td>
                      <div className="user-info">
                        <strong>{user.Nombre} {user.Apellido}</strong>
                      </div>
                    </td>
                    <td>{user.Correo_electronico}</td>
                    <td>{user.Documento || 'N/A'}</td>
                    <td>{user.Telefono || 'N/A'}</td>
                    <td>{getRoleBadge(user.Tipo_usuario)}</td>
                    <td>
                      <div className="action-buttons">
                        <button 
                          onClick={() => handleEditUser(user)}
                          className="btn-edit"
                          title="Editar usuario"
                        >
                          ✏️
                        </button>
                        <button 
                          onClick={() => handleDeleteUser(user.Id_usuario)}
                          className="btn-delete"
                          title="Eliminar usuario"
                          disabled={user.Tipo_usuario === 'administrador'}
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="no-data">
                    No hay usuarios registrados
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {showCreateModal && (
          <ModalContainer
            title="Crear Nuevo Usuario"
            onClose={() => setShowCreateModal(false)}
            size="large"
          >
            <UserFormContainer
              userData={null}
              onSubmit={handleCreateUser}
              onCancel={() => setShowCreateModal(false)}
              isAdmin={true}
              isCreate={true}
            />
          </ModalContainer>
        )}

        {showEditModal && selectedUser && (
          <ModalContainer
            title={`Editar Usuario: ${selectedUser.Nombre} ${selectedUser.Apellido}`}
            onClose={() => {
              setShowEditModal(false);
              setSelectedUser(null);
            }}
            size="large"
          >
            <UserFormContainer
              userData={selectedUser}
              onSubmit={handleUpdateUser}
              onCancel={() => {
                setShowEditModal(false);
                setSelectedUser(null);
              }}
              isAdmin={true}
            />
          </ModalContainer>
        )}
      </div>
    </>
  );
}