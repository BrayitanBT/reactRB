import { useState, useEffect } from 'react';
import { apiService } from '../../../services/api';
import ModalContainer from '../../../pages/profile/user/modal/ModalContainer';
import Notification from '../../../components/Notification/Notification';
import '../admin.css';

export default function OrdersManagement() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [orderDetails, setOrderDetails] = useState(null);
  const [error, setError] = useState('');
  const [notification, setNotification] = useState({
    show: false,
    message: '',
    type: 'success'
  });

  useEffect(() => {
    loadOrders();
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

  const loadOrders = async () => {
    try {
      setLoading(true);
      setError('');
      console.log('🔄 Cargando órdenes...');
      
      const response = await apiService.getAllOrders();
      console.log('📦 Respuesta de órdenes:', response);
      
      if (response.success && response.orders) {
        setOrders(response.orders);
        showNotification(`Órdenes cargadas: ${response.orders.length} encontradas`, 'success');
      } else {
        setError(response.message || 'No se pudieron cargar las órdenes');
        showNotification(response.message || 'Error al cargar órdenes', 'error');
      }
    } catch (error) {
      console.error('❌ Error cargando órdenes:', error);
      setError('Error al cargar las órdenes: ' + error.message);
      showNotification('Error al cargar las órdenes', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = async (order) => {
    try {
      setSelectedOrder(order);
      console.log('👁️ Obteniendo detalles de orden:', order.Id_orden);
      
      const response = await apiService.getOrderDetails(order.Id_orden);
      console.log('📋 Detalles de orden:', response);
      
      if (response.success) {
        setOrderDetails(response);
        setShowDetailsModal(true);
      } else {
        showNotification(response.message || 'Error al cargar detalles', 'error');
      }
    } catch (error) {
      console.error('❌ Error cargando detalles de orden:', error);
      showNotification('Error al cargar los detalles de la orden', 'error');
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('es-ES');
  };

  const getPaymentBadge = (paymentType) => {
    const typeClass = paymentType === 'Tarjeta' ? 'payment-card' : 'payment-cash';
    return <span className={`payment-badge ${typeClass}`}>{paymentType || 'Efectivo'}</span>;
  };

  if (loading) {
    return (
      <div className="admin-page">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Cargando órdenes...</p>
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
          <h1>Gestión de Órdenes</h1>
          <p>Administra todas las órdenes del sistema</p>
        </div>

        {error && (
          <div className="error-message">
            {error}
            <button onClick={loadOrders} className="btn-retry">Reintentar</button>
          </div>
        )}

        <div className="admin-actions">
          <button onClick={loadOrders} className="btn-secondary">
            🔄 Actualizar
          </button>
        </div>

        <div className="data-table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Código</th>
                <th>Cliente</th>
                <th>Email</th>
                <th>Fecha</th>
                <th>Hora</th>
                <th>Total</th>
                <th>Pago</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {orders.length > 0 ? (
                orders.map(order => (
                  <tr key={order.Id_orden}>
                    <td>{order.Id_orden}</td>
                    <td>
                      <strong>#{order.Codigo_orden}</strong>
                    </td>
                    <td>
                      <div className="user-info">
                        <strong>{order.Nombre} {order.Apellido}</strong>
                        <small>ID: {order.Id_usuario}</small>
                      </div>
                    </td>
                    <td>
                      <small>{order.Correo_electronico}</small>
                    </td>
                    <td>{formatDate(order.Fecha_orden)}</td>
                    <td>{order.Hora_orden}</td>
                    <td>
                      <strong className="price-total">
                        ${order.Cantidad_pago ? order.Cantidad_pago.toLocaleString() : '0'}
                      </strong>
                    </td>
                    <td>{getPaymentBadge(order.Tipo_pago)}</td>
                    <td>
                      <div className="action-buttons">
                        <button 
                          onClick={() => handleViewDetails(order)}
                          className="btn-view"
                          title="Ver detalles"
                        >
                          👁️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="9" className="no-data">
                    No hay órdenes registradas
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {showDetailsModal && orderDetails && (
          <ModalContainer
            title={`Detalles de Orden #${orderDetails.orden.Codigo_orden}`}
            onClose={() => {
              setShowDetailsModal(false);
              setSelectedOrder(null);
              setOrderDetails(null);
            }}
            size="large"
          >
            <div className="order-details-modal">
              {selectedOrder && (
                <div className="selected-order-badge">
                  <small>Orden ID: {selectedOrder.Id_orden}</small>
                </div>
              )}
              
              <div className="order-info-section">
                <h3>📋 Información de la Orden</h3>
                <div className="info-grid">
                  <div className="info-item">
                    <strong>Cliente:</strong>
                    <span>{orderDetails.orden.Nombre} {orderDetails.orden.Apellido}</span>
                  </div>
                  <div className="info-item">
                    <strong>Email:</strong>
                    <span>{orderDetails.orden.Correo_electronico}</span>
                  </div>
                  <div className="info-item">
                    <strong>Teléfono:</strong>
                    <span>{orderDetails.orden.Telefono || 'N/A'}</span>
                  </div>
                  <div className="info-item">
                    <strong>Fecha:</strong>
                    <span>{formatDate(orderDetails.orden.Fecha_orden)}</span>
                  </div>
                  <div className="info-item">
                    <strong>Hora:</strong>
                    <span>{orderDetails.orden.Hora_orden}</span>
                  </div>
                  <div className="info-item">
                    <strong>Método de Pago:</strong>
                    <span>{orderDetails.orden.Tipo_pago}</span>
                  </div>
                </div>
              </div>

              <div className="products-section">
                <h3>🛒 Productos ({orderDetails.productos.length})</h3>
                <div className="products-list">
                  {orderDetails.productos.map((producto, index) => (
                    <div key={index} className="product-item">
                      <div className="product-info">
                        <strong>{producto.Nombre_producto}</strong>
                        <span>Tipo: {producto.Tipo_producto}</span>
                        <span>Cantidad: {producto.cantidad || 1}</span>
                        <span>Precio unitario: ${producto.Precio_producto?.toLocaleString()}</span>
                      </div>
                      <div className="product-total">
                        ${((producto.Precio_producto || 0) * (producto.cantidad || 1))?.toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="order-total-section">
                <div className="order-total">
                  <strong>💰 Total General: ${orderDetails.orden.Cantidad_pago?.toLocaleString()}</strong>
                </div>
              </div>
            </div>
          </ModalContainer>
        )}
      </div>
    </>
  );
}