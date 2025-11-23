import './profile.css';
import Header from "../../../components/header/header.jsx";
import Footer from "../../../components/footer/footer.jsx";
import { Link } from 'react-router-dom';

export default function Profile({ 
  usuario, 
  cerrarSesion, 
  onEditProfile, 
  isAdmin = false,
  userOrders = [], // NUEVO: Órdenes del usuario
  loadingOrders = false, // NUEVO: Estado de carga de órdenes
  onViewOrderDetails // NUEVO: Función para ver detalles de orden
}) {
  // Estado de carga si no hay usuario
  if (!usuario) {
    return (
      <div className="profile-page">
        <Header />
        <div className="profile-container">
          <div className="profile-card">
            <div className="loading-text">Cargando datos del usuario...</div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const inicial = usuario.nombre ? usuario.nombre.charAt(0).toUpperCase() : 'U';
  const esAdministrador = usuario.rol === 'administrador' || usuario.Tipo_usuario === 'administrador';

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('es-ES');
  };

  const getPaymentBadge = (paymentType) => {
    const typeClass = paymentType === 'Tarjeta' ? 'payment-card' : 'payment-cash';
    return <span className={`payment-badge ${typeClass}`}>{paymentType || 'Efectivo'}</span>;
  };

  return (
    <div className="profile-page">
      <Header />
      
      <div className="profile-container">
        {/* Tarjeta de información del usuario */}
        <div className="profile-card">
          {/* Header del perfil */}
          <div className="profile-header">
            <div className="profile-avatar">
              {inicial}
            </div>
            <h1 className="profile-title">
              {isAdmin && usuario.id !== 'current' ? 'Editar Usuario' : 'Mi Perfil'}
            </h1>
            <p className="profile-subtitle">
              {isAdmin && usuario.id !== 'current' ? 'Información del usuario' : 'Información de tu cuenta'}
            </p>
          </div>

          {/* Información del usuario */}
          <div className="profile-info">
            <div className="profile-field">
              <div className="field-icon">#</div>
              <div className="field-content">
                <div className="field-label">ID</div>
                <div className="field-value">{usuario.id}</div>
              </div>
            </div>

            <div className="profile-field">
              <div className="field-icon">👤</div>
              <div className="field-content">
                <div className="field-label">Nombre</div>
                <div className="field-value">{usuario.nombre}</div>
              </div>
            </div>

            <div className="profile-field">
              <div className="field-icon">📧</div>
              <div className="field-content">
                <div className="field-label">Email</div>
                <div className="field-value">{usuario.email}</div>
              </div>
            </div>

            <div className="profile-field">
              <div className="field-icon">🎯</div>
              <div className="field-content">
                <div className="field-label">Rol</div>
                <div className="field-value">
                  <span className={`role-badge role-${usuario.rol?.toLowerCase()}`}>
                    {usuario.rol}
                  </span>
                </div>
              </div>
            </div>

            {/* Campos adicionales de la base de datos */}
            {usuario.documento && (
              <div className="profile-field">
                <div className="field-icon">📄</div>
                <div className="field-content">
                  <div className="field-label">Documento</div>
                  <div className="field-value">{usuario.documento}</div>
                </div>
              </div>
            )}

            {usuario.telefono && (
              <div className="profile-field">
                <div className="field-icon">📞</div>
                <div className="field-content">
                  <div className="field-label">Teléfono</div>
                  <div className="field-value">{usuario.telefono}</div>
                </div>
              </div>
            )}

            {usuario.direccion && (
              <div className="profile-field">
                <div className="field-icon">📍</div>
                <div className="field-content">
                  <div className="field-label">Dirección</div>
                  <div className="field-value">{usuario.direccion}</div>
                </div>
              </div>
            )}

            {usuario.fecha_registro && (
              <div className="profile-field">
                <div className="field-icon">📅</div>
                <div className="field-content">
                  <div className="field-label">Fecha de Registro</div>
                  <div className="field-value">{usuario.fecha_registro}</div>
                </div>
              </div>
            )}
          </div>

          {/* Estadísticas rápidas */}
          <div className="profile-stats">
            <div className="stat-item">
              <div className="stat-number">{userOrders.length}</div>
              <div className="stat-label">Órdenes Totales</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">
                ${userOrders.reduce((total, order) => total + (order.Cantidad_pago || 0), 0).toLocaleString()}
              </div>
              <div className="stat-label">Total Gastado</div>
            </div>
          </div>

          {/* Acciones */}
          <div className="profile-actions">
            {/* Botón de editar - aparece siempre */}
            <button 
              onClick={onEditProfile} 
              className="edit-button"
              aria-label="Editar perfil"
            >
              <span className="button-icon">✏️</span>
              Editar Perfil
            </button>
            
            {/* Botón de admin - solo para administradores */}
            {esAdministrador && (
              <Link to="/admin" className="admin-button">
                <span className="button-icon">👨‍💼</span>
                Panel Admin
              </Link>
            )}
            
            {/* Cerrar sesión solo para el usuario actual */}
            {!isAdmin || usuario.id === 'current' ? (
              <button 
                onClick={cerrarSesion} 
                className="logout-button"
                aria-label="Cerrar sesión"
              >
                <span className="button-icon">🚪</span>
                Cerrar Sesión
              </button>
            ) : null}
          </div>
        </div>

        {/* NUEVA SECCIÓN: Historial de Órdenes */}
        <div className="orders-section">
          <div className="section-header">
            <h2>📦 Mis Órdenes</h2>
            <p>Historial de tus pedidos recientes</p>
          </div>

          {loadingOrders ? (
            <div className="loading-orders">
              <div className="loading-spinner small"></div>
              <p>Cargando órdenes...</p>
            </div>
          ) : userOrders.length > 0 ? (
            <div className="orders-list">
              {userOrders.map((order) => (
                <div key={order.Id_orden} className="order-card">
                  <div className="order-header">
                    <div className="order-info">
                      <h3>Orden #{order.Codigo_orden}</h3>
                      <div className="order-meta">
                        <span className="order-date">
                          📅 {formatDate(order.Fecha_orden)} a las {order.Hora_orden}
                        </span>
                        <span className="order-payment">
                          {getPaymentBadge(order.Tipo_pago)}
                        </span>
                      </div>
                    </div>
                    <div className="order-total">
                      <strong>${order.Cantidad_pago?.toLocaleString()}</strong>
                    </div>
                  </div>
                  
                  <div className="order-actions">
                    <button 
                      onClick={() => onViewOrderDetails && onViewOrderDetails(order)}
                      className="btn-view-order"
                    >
                      👁️ Ver Detalles
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="no-orders">
              <div className="no-orders-icon">🛒</div>
              <h3>No tienes órdenes aún</h3>
              <p>Realiza tu primer pedido y aparecerá aquí</p>
              <Link to="/menu" className="browse-menu-btn">
                Explorar Menú
              </Link>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}