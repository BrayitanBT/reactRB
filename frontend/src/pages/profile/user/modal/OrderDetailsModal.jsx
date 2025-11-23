import React from 'react';
import './OrderDetailsModal.css';

const OrderDetailsModal = ({ orderDetails, onClose }) => {
  // Verificar que orderDetails existe y tiene la estructura correcta
  if (!orderDetails || !orderDetails.orden) {
    return (
      <div className="modal-overlay">
        <div className="order-details-modal">
          <div className="modal-header">
            <h2>Error</h2>
            <button onClick={onClose} className="close-button">×</button>
          </div>
          <div className="modal-content">
            <p>No se pudieron cargar los detalles de la orden.</p>
          </div>
          <div className="modal-actions">
            <button onClick={onClose} className="btn-primary">
              Cerrar
            </button>
          </div>
        </div>
      </div>
    );
  }

  const { orden, productos } = orderDetails;

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('es-ES');
  };

  return (
    <div className="modal-overlay">
      <div className="order-details-modal">
        <div className="modal-header">
          <h2>📋 Detalles de Orden #{orden.Codigo_orden}</h2>
          <button onClick={onClose} className="close-button">×</button>
        </div>

        <div className="modal-content">
          {/* Información de la orden */}
          <div className="order-info-section">
            <h3>Información de la Orden</h3>
            <div className="info-grid">
              <div className="info-item">
                <strong>Cliente:</strong>
                <span>{orden.Nombre} {orden.Apellido}</span>
              </div>
              <div className="info-item">
                <strong>Fecha:</strong>
                <span>{formatDate(orden.Fecha_orden)}</span>
              </div>
              <div className="info-item">
                <strong>Hora:</strong>
                <span>{orden.Hora_orden}</span>
              </div>
              <div className="info-item">
                <strong>Método de Pago:</strong>
                <span>{orden.Tipo_pago}</span>
              </div>
              <div className="info-item">
                <strong>Total:</strong>
                <span>${orden.Cantidad_pago?.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Productos */}
          <div className="products-section">
            <h3>Productos ({productos ? productos.length : 0})</h3>
            {productos && productos.length > 0 ? (
              <div className="products-list">
                {productos.map((producto, index) => (
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
            ) : (
              <p>No hay productos en esta orden.</p>
            )}
          </div>

          {/* Total */}
          <div className="order-total-section">
            <div className="order-total">
              <strong>Total General: ${orden.Cantidad_pago?.toLocaleString()}</strong>
            </div>
          </div>
        </div>

        <div className="modal-actions">
          <button onClick={onClose} className="btn-primary">
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsModal;