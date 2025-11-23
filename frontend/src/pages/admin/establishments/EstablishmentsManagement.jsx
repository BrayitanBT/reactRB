import { useState, useEffect } from 'react';
import { apiService } from '../../../services/api';
import ModalContainer from '../../../pages/profile/user/modal/ModalContainer';
import Notification from '../../../components/Notification/Notification';
import '../admin.css';

export default function EstablishmentsManagement() {
  const [establishments, setEstablishments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedEstablishment, setSelectedEstablishment] = useState(null);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    Nombre_sede: '',
    Ciudad: '',
    Tipo_de_mesa: '',
    Responsable: '',
    Mesero: ''
  });
  const [notification, setNotification] = useState({
    show: false,
    message: '',
    type: 'success'
  });

  useEffect(() => {
    loadEstablishments();
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

  const loadEstablishments = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await apiService.getEstablecimientos();
      
      if (response.establecimientos) {
        setEstablishments(response.establecimientos);
        showNotification('Establecimientos cargados exitosamente', 'success');
      } else {
        setError('No se pudieron cargar los establecimientos');
      }
    } catch (error) {
      console.error('Error cargando establecimientos:', error);
      setError('Error al cargar los establecimientos: ' + error.message);
      showNotification('Error al cargar los establecimientos', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateEstablishment = async (establishmentData) => {
    try {
      const response = await apiService.createEstablecimiento(establishmentData);
      if (response.success) {
        await loadEstablishments();
        setShowCreateModal(false);
        resetForm();
        showNotification('Establecimiento creado exitosamente', 'success');
        return response;
      } else {
        showNotification(response.message, 'error');
        return response;
      }
    } catch (error) {
      console.error('Error creando establecimiento:', error);
      showNotification('Error al crear el establecimiento', 'error');
      return { success: false, message: error.message };
    }
  };

  const handleEditEstablishment = (establishment) => {
    setSelectedEstablishment(establishment);
    setFormData({
      Nombre_sede: establishment.Nombre_sede,
      Ciudad: establishment.Ciudad,
      Tipo_de_mesa: establishment.Tipo_de_mesa,
      Responsable: establishment.Responsable,
      Mesero: establishment.Mesero
    });
    setShowEditModal(true);
  };

  const handleUpdateEstablishment = async () => {
    try {
      const establishmentData = {
        Id_Establecimiento: selectedEstablishment.Id_Establecimiento,
        ...formData
      };

      const response = await apiService.updateEstablecimiento(establishmentData);
      if (response.success) {
        await loadEstablishments();
        setShowEditModal(false);
        setSelectedEstablishment(null);
        resetForm();
        showNotification('Establecimiento actualizado exitosamente', 'success');
        return response;
      } else {
        showNotification(response.message, 'error');
        return response;
      }
    } catch (error) {
      console.error('Error actualizando establecimiento:', error);
      showNotification('Error al actualizar el establecimiento', 'error');
      return { success: false, message: error.message };
    }
  };

  const handleDeleteEstablishment = async (establishmentId) => {
    if (!window.confirm('¿Estás seguro de que quieres eliminar este establecimiento?')) {
      return;
    }

    try {
      const response = await apiService.deleteEstablecimiento(establishmentId);
      if (response.success) {
        await loadEstablishments();
        showNotification('Establecimiento eliminado exitosamente', 'success');
      } else {
        showNotification(response.message, 'error');
      }
    } catch (error) {
      console.error('Error eliminando establecimiento:', error);
      showNotification('Error al eliminar el establecimiento', 'error');
    }
  };

  const resetForm = () => {
    setFormData({
      Nombre_sede: '',
      Ciudad: '',
      Tipo_de_mesa: '',
      Responsable: '',
      Mesero: ''
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (loading) {
    return (
      <div className="admin-page">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Cargando establecimientos...</p>
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
          <h1>Gestión de Establecimientos</h1>
          <p>Administra las sucursales del restaurante</p>
        </div>

        {error && (
          <div className="error-message">
            {error}
            <button onClick={loadEstablishments} className="btn-retry">Reintentar</button>
          </div>
        )}

        <div className="admin-actions">
          <button 
            onClick={() => setShowCreateModal(true)}
            className="btn-primary"
          >
            + Crear Establecimiento
          </button>
          <button onClick={loadEstablishments} className="btn-secondary">
            🔄 Actualizar
          </button>
        </div>

        <div className="data-table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre Sede</th>
                <th>Ciudad</th>
                <th>Tipo de Mesa</th>
                <th>Responsable</th>
                <th>Mesero</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {establishments.length > 0 ? (
                establishments.map(establishment => (
                  <tr key={establishment.Id_Establecimiento}>
                    <td>{establishment.Id_Establecimiento}</td>
                    <td>
                      <strong>{establishment.Nombre_sede}</strong>
                    </td>
                    <td>{establishment.Ciudad}</td>
                    <td>{establishment.Tipo_de_mesa || 'N/A'}</td>
                    <td>{establishment.Responsable || 'N/A'}</td>
                    <td>{establishment.Mesero || 'N/A'}</td>
                    <td>
                      <div className="action-buttons">
                        <button 
                          onClick={() => handleEditEstablishment(establishment)}
                          className="btn-edit"
                          title="Editar establecimiento"
                        >
                          ✏️
                        </button>
                        <button 
                          onClick={() => handleDeleteEstablishment(establishment.Id_Establecimiento)}
                          className="btn-delete"
                          title="Eliminar establecimiento"
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
                    No hay establecimientos registrados
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {showCreateModal && (
          <ModalContainer
            title="Crear Nuevo Establecimiento"
            onClose={() => setShowCreateModal(false)}
            size="medium"
          >
            <div className="establishment-form">
              <div className="form-grid">
                <div className="form-group">
                  <label htmlFor="Nombre_sede">Nombre Sede *</label>
                  <input
                    type="text"
                    id="Nombre_sede"
                    name="Nombre_sede"
                    value={formData.Nombre_sede}
                    onChange={handleInputChange}
                    placeholder="Nombre de la sede"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="Ciudad">Ciudad *</label>
                  <input
                    type="text"
                    id="Ciudad"
                    name="Ciudad"
                    value={formData.Ciudad}
                    onChange={handleInputChange}
                    placeholder="Ciudad"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="Tipo_de_mesa">Tipo de Mesa</label>
                  <input
                    type="text"
                    id="Tipo_de_mesa"
                    name="Tipo_de_mesa"
                    value={formData.Tipo_de_mesa}
                    onChange={handleInputChange}
                    placeholder="Ej: Redonda, Cuadrada"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="Responsable">Responsable</label>
                  <input
                    type="text"
                    id="Responsable"
                    name="Responsable"
                    value={formData.Responsable}
                    onChange={handleInputChange}
                    placeholder="Nombre del responsable"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="Mesero">Mesero</label>
                  <input
                    type="text"
                    id="Mesero"
                    name="Mesero"
                    value={formData.Mesero}
                    onChange={handleInputChange}
                    placeholder="Nombre del mesero"
                  />
                </div>
              </div>

              <div className="form-actions">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="btn-secondary"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={() => handleCreateEstablishment(formData)}
                  className="btn-primary"
                >
                  Crear Establecimiento
                </button>
              </div>
            </div>
          </ModalContainer>
        )}

        {showEditModal && selectedEstablishment && (
          <ModalContainer
            title={`Editar Establecimiento: ${selectedEstablishment.Nombre_sede}`}
            onClose={() => {
              setShowEditModal(false);
              setSelectedEstablishment(null);
              resetForm();
            }}
            size="medium"
          >
            <div className="establishment-form">
              <div className="form-grid">
                <div className="form-group">
                  <label htmlFor="edit_Nombre_sede">Nombre Sede *</label>
                  <input
                    type="text"
                    id="edit_Nombre_sede"
                    name="Nombre_sede"
                    value={formData.Nombre_sede}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="edit_Ciudad">Ciudad *</label>
                  <input
                    type="text"
                    id="edit_Ciudad"
                    name="Ciudad"
                    value={formData.Ciudad}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="edit_Tipo_de_mesa">Tipo de Mesa</label>
                  <input
                    type="text"
                    id="edit_Tipo_de_mesa"
                    name="Tipo_de_mesa"
                    value={formData.Tipo_de_mesa}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="edit_Responsable">Responsable</label>
                  <input
                    type="text"
                    id="edit_Responsable"
                    name="Responsable"
                    value={formData.Responsable}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="edit_Mesero">Mesero</label>
                  <input
                    type="text"
                    id="edit_Mesero"
                    name="Mesero"
                    value={formData.Mesero}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="form-actions">
                <button
                  type="button"
                  onClick={() => {
                    setShowEditModal(false);
                    setSelectedEstablishment(null);
                    resetForm();
                  }}
                  className="btn-secondary"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleUpdateEstablishment}
                  className="btn-primary"
                >
                  Guardar Cambios
                </button>
              </div>
            </div>
          </ModalContainer>
        )}
      </div>
    </>
  );
}