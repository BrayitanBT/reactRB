import { useEffect, useState } from "react";
import { useAuth } from "../../../hooks/useAuth";
import { apiService } from "../../../services/api";
import Profile from "./Profile";
import ModalContainer from "../user/modal/ModalContainer";
import UserFormContainer from "../user/forms/UserFormContainer";
import OrderDetailsModal from "../user/modal/OrderDetailsModal";

export default function ProfileContainer() {
  const { user, logout } = useAuth();
  const [usuario, setUsuario] = useState(null);
  const [userOrders, setUserOrders] = useState([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showOrderDetails, setShowOrderDetails] = useState(false);
  const [orderDetails, setOrderDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) {
      loadProfile();
      loadUserOrders();
    }
  }, [user]);

  const loadProfile = async () => {
    try {
      setLoading(true);
      setError('');
      console.log('📋 Cargando perfil del usuario...');
      
      const response = await apiService.getProfile();
      console.log('✅ Respuesta del perfil:', response);
      
      if (response && response.user) {
        const userData = response.user;
        console.log('👤 Datos del usuario recibidos:', userData);
        
        setUsuario({
          id: userData['Id usuario'] || userData.Id_usuario,
          nombre: `${userData.Nombre || ''} ${userData.Apellido || ''}`.trim(),
          email: userData['Correo electronico'] || userData.Correo_electronico,
          rol: userData['Tipo usuario'] || userData.Tipo_usuario,
          telefono: userData.Telefono,
          documento: userData.Documento,
          ...userData
        });
      } else {
        const errorMsg = response?.message || 'No se pudieron cargar los datos del perfil';
        setError(errorMsg);
        console.error('❌ Error en respuesta:', errorMsg);
      }
    } catch (error) {
      console.error('💥 Error cargando perfil:', error);
      setError('Error al cargar el perfil: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const loadUserOrders = async () => {
    try {
      setLoadingOrders(true);
      console.log('📦 Cargando órdenes del usuario...');
      
      const response = await apiService.getUserOrders();
      console.log('✅ Órdenes del usuario:', response);
      
      if (response.success && response.orders) {
        setUserOrders(response.orders);
      } else {
        console.warn('⚠️ No se pudieron cargar las órdenes:', response.message);
        setUserOrders([]); // Asegurar que sea un array vacío
      }
    } catch (error) {
      console.error('❌ Error cargando órdenes:', error);
      setUserOrders([]); // Asegurar que sea un array vacío en caso de error
    } finally {
      setLoadingOrders(false);
    }
  };

  const handleViewOrderDetails = async (order) => {
    try {
      console.log('👁️ Obteniendo detalles de orden:', order.Id_orden);
      
      const response = await apiService.getOrderDetails(order.Id_orden);
      console.log('📋 Detalles de orden:', response);
      
      if (response.success) {
        setOrderDetails(response);
        setShowOrderDetails(true);
      } else {
        alert(response.message || 'Error al cargar los detalles de la orden');
      }
    } catch (error) {
      console.error('❌ Error cargando detalles de orden:', error);
      alert('Error al cargar los detalles de la orden: ' + error.message);
    }
  };

  const handleEditProfile = () => {
    setShowEditModal(true);
  };

  const handleUpdateUser = async (userData) => {
    try {
      console.log('✏️ Actualizando usuario:', userData);
      
      const response = await apiService.updateUser(userData);
      console.log('✅ Respuesta de actualización:', response);
      
      if (response.success) {
        await loadProfile();
        setShowEditModal(false);
        return response;
      } else {
        return { 
          success: false, 
          message: response.message || 'Error al actualizar el usuario' 
        };
      }
    } catch (error) {
      console.error('💥 Error actualizando usuario:', error);
      return { 
        success: false, 
        message: error.message || 'Error de conexión al actualizar' 
      };
    }
  };

  const cerrarSesion = async () => {
    try {
      console.log('🚪 Cerrando sesión...');
      await apiService.logout();
      await logout();
      window.location.href = "/";
    } catch (error) {
      console.error('Error en logout:', error);
      window.location.href = "/";
    }
  };

  const handleCloseOrderDetails = () => {
    setShowOrderDetails(false);
    setOrderDetails(null);
  };

  if (loading) {
    return (
      <div className="profile-page">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Cargando datos del usuario...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="profile-page">
        <div className="error-container">
          <h3>Error</h3>
          <p>{error}</p>
          <button onClick={loadProfile} className="btn-primary">
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  if (!user || !usuario) {
    return (
      <div className="profile-page">
        <div className="error-container">
          <h3>No autenticado</h3>
          <p>No hay usuario autenticado</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Profile 
        usuario={usuario} 
        cerrarSesion={cerrarSesion}
        onEditProfile={handleEditProfile}
        userOrders={userOrders}
        loadingOrders={loadingOrders}
        onViewOrderDetails={handleViewOrderDetails}
      />
      
      {showEditModal && (
        <ModalContainer
          title="Editar Perfil"
          onClose={() => setShowEditModal(false)}
        >
          <UserFormContainer
            userData={usuario}
            onSubmit={handleUpdateUser}
            onCancel={() => setShowEditModal(false)}
          />
        </ModalContainer>
      )}

      {/* Modal de detalles de orden */}
      {showOrderDetails && (
        <OrderDetailsModal
          orderDetails={orderDetails}
          onClose={handleCloseOrderDetails}
        />
      )}
    </>
  );
}