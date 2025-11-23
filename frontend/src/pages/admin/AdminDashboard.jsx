import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { apiService } from '../../services/api';
import './admin.css';
import Header from "../../components/header/header.jsx";
import Footer from "../../components/footer/footer.jsx";


export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProducts: 0,
    totalOrders: 0,
    totalEstablishments: 0,
    recentOrders: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError('');
      
      const [usersResponse, productsResponse, ordersResponse, establishmentsResponse] = await Promise.all([
        apiService.getAllUsers(),
        apiService.getProducts(),
        apiService.getAllOrders(),
        apiService.getEstablecimientos()
      ]);

      setStats({
        totalUsers: usersResponse.users?.length || 0,
        totalProducts: productsResponse.products?.length || 0,
        totalOrders: ordersResponse.orders?.length || 0,
        totalEstablishments: establishmentsResponse.establecimientos?.length || 0,
        recentOrders: ordersResponse.orders?.slice(0, 5) || []
      });
    } catch (error) {
      console.error('Error cargando dashboard:', error);
      setError('Error al cargar el dashboard: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('es-ES');
  };

  if (loading) {
    return (
      <div className="admin-page">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Cargando dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-page">
        <div className="error-container">
          <h3>Error</h3>
          <p>{error}</p>
          <button onClick={loadDashboardData} className="btn-primary">
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-page">
    <Header/>
      <div className="admin-header">
        <h1>Panel de Administración</h1>
        <p>Gestión completa del restaurante</p>
      </div>

      <div className="stats-grid">
        <Link to="/admin/usuarios" className="stat-card">
          <div className="stat-icon">👥</div>
          <div className="stat-info">
            <h3>{stats.totalUsers}</h3>
            <p>Usuarios</p>
          </div>
        </Link>

        <Link to="/admin/productos" className="stat-card">
          <div className="stat-icon">🍕</div>
          <div className="stat-info">
            <h3>{stats.totalProducts}</h3>
            <p>Productos</p>
          </div>
        </Link>

        <Link to="/admin/ordenes" className="stat-card">
          <div className="stat-icon">📦</div>
          <div className="stat-info">
            <h3>{stats.totalOrders}</h3>
            <p>Órdenes</p>
          </div>
        </Link>

        <Link to="/admin/establecimientos" className="stat-card">
          <div className="stat-icon">🏢</div>
          <div className="stat-info">
            <h3>{stats.totalEstablishments}</h3>
            <p>Establecimientos</p>
          </div>
        </Link>
      </div>

      <div className="quick-actions">
        <h2>Acciones Rápidas</h2>
        <div className="actions-grid">
          <Link to="/admin/usuarios" className="action-card">
            <div className="action-icon">👥</div>
            <h4>Gestionar Usuarios</h4>
            <p>Ver, editar y eliminar usuarios del sistema</p>
          </Link>

          <Link to="/admin/productos" className="action-card">
            <div className="action-icon">🍕</div>
            <h4>Gestionar Productos</h4>
            <p>Agregar y modificar productos del menú</p>
          </Link>

          <Link to="/admin/ordenes" className="action-card">
            <div className="action-icon">📋</div>
            <h4>Ver Órdenes</h4>
            <p>Revisar todas las órdenes del sistema</p>
          </Link>

          <Link to="/admin/establecimientos" className="action-card">
            <div className="action-icon">🏢</div>
            <h4>Gestionar Sucursales</h4>
            <p>Administrar establecimientos</p>
          </Link>
        </div>
      </div>

      <div className="recent-orders">
        <h2>Órdenes Recientes</h2>
        {stats.recentOrders.length > 0 ? (
          <div className="orders-list">
            {stats.recentOrders.map(order => (
              <div key={order.Id_orden} className="order-item">
                <div className="order-info">
                  <strong>Orden #{order.Codigo_orden}</strong>
                  <span>Cliente: {order.Nombre} {order.Apellido}</span>
                  <span>Total: ${order.Cantidad_pago?.toLocaleString()}</span>
                </div>
                <div className="order-date">
                  {formatDate(order.Fecha_orden)} {order.Hora_orden}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="no-data">No hay órdenes recientes</p>
        )}
        {stats.recentOrders.length > 0 && (
          <div className="view-all">
            <Link to="/admin/ordenes" className="btn-secondary">
              Ver Todas las Órdenes
            </Link>
          </div>
        )}
      </div>
    <Footer/>
    </div>
  );
}