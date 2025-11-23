import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthProvider";
import { CartProvider } from "./context/CartProvider";
import { ProductProvider } from "./context/ProductProvider";
import { useAuth } from "./hooks/useAuth";
import { useCart } from "./hooks/useCart"; // Importar useCart
import CartContainer from './pages/cart/CartContainer';
import Notification from './components/Notification/Notification'; // Importar Notification

// Components
import Home from "./pages/home/home";
import Menu from "./pages/menu/Menu";
import Sede from "./pages/sedes/Sedes";
import ProfileContainer from "./pages/profile/user/profileContainer";
import SignUpContainer from "./pages/signUp/signUpContainer";
import Sobre from "./pages/sobre/Sobre";
import LoginContainer from "./pages/login/loginContainer";

// Admin Components
import AdminDashboard from "./pages/admin/AdminDashboard";
import UsersManagement from "./pages/admin/users/UsersManagement";
import ProductsManagement from "./pages/admin/products/ProductsManagement";
import OrdersManagement from "./pages/admin/orders/OrdersManagement";
import EstablishmentsManagement from "./pages/admin/establishments/EstablishmentsManagement";

// Componente para rutas protegidas
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Cargando...</p>
      </div>
    );
  }
  
  return user ? children : <Navigate to="/log-in" />;
};

// Componente para rutas de admin
const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Verificando permisos...</p>
      </div>
    );
  }
  
  // ✅ CORREGIDO: Usar 'administrador' según tu backend
  const isAdmin = user?.Tipo_usuario === 'administrador' || 
                 user?.rol === 'administrador';
  
  console.log('🔐 Verificación admin:', { 
    user, 
    Tipo_usuario: user?.Tipo_usuario, 
    rol: user?.rol, 
    isAdmin 
  });
  
  if (!user) {
    console.log('❌ No hay usuario logueado');
    return <Navigate to="/log-in" />;
  }
  
  if (!isAdmin) {
    console.log('❌ Acceso denegado - No es administrador');
    return <Navigate to="/" />;
  }
  
  console.log('✅ Acceso concedido - Es administrador');
  return children;
};

// Componente wrapper para la notificación global del carrito
const CartNotificationWrapper = ({ children }) => {
  const { notification, hideNotification } = useCart();
  
  return (
    <>
      {children}
      <Notification
        message={notification.message}
        type={notification.type}
        show={notification.show}
        onClose={hideNotification}
      />
    </>
  );
};

// Componente principal de la aplicación
function AppContent() {
  return (
    <BrowserRouter>
      {/* Notificación global del carrito */}
      <CartNotificationWrapper>
        <Routes>
          {/* Rutas públicas */}
          <Route path="/log-in" element={<LoginContainer />} />
          <Route path="/sign-up" element={<SignUpContainer />} />
          <Route path="/menu" element={<Menu />} />
          <Route path="/sede" element={<Sede />} />
          <Route path="/" element={<Home />} />
          <Route path="/nosotros" element={<Sobre />} />
          
          {/* Rutas protegidas (requieren login) */}
          <Route path="/profile" element={
            <ProtectedRoute>
              <ProfileContainer />
            </ProtectedRoute>
          } />
          
          <Route path="/cart" element={
            <ProtectedRoute>
              <CartContainer />
            </ProtectedRoute>
          } />
          
          {/* Rutas de Administrador */}
          <Route path="/admin" element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          } />
          
          <Route path="/admin/usuarios" element={
            <AdminRoute>
              <UsersManagement />
            </AdminRoute>
          } />
          
          <Route path="/admin/productos" element={
            <AdminRoute>
              <ProductsManagement />
            </AdminRoute>
          } />
          
          <Route path="/admin/ordenes" element={
            <AdminRoute>
              <OrdersManagement />
            </AdminRoute>
          } />
          
          <Route path="/admin/establecimientos" element={
            <AdminRoute>
              <EstablishmentsManagement />
            </AdminRoute>
          } />
          
          {/* Redirección por defecto */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </CartNotificationWrapper>
    </BrowserRouter>
  );
}

// Componente principal de la app con todos los providers
function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <ProductProvider>
          <AppContent />
        </ProductProvider>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;