const API_URL = 'http://localhost/reactRB/backend/public/index.php';

const buildUrl = (endpoint) => {
  const url = `${API_URL}?url=${endpoint}`;
  console.log('🔗 URL construida:', url);
  return url;
};

// Configuración para JSON
const fetchConfig = (method, data = null) => {
  const config = {
    method: method,
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  };
  
  if (data) {
    config.body = JSON.stringify(data);
    console.log('📦 Datos enviados (JSON):', data);
  }
  
  return config;
};

// Función para manejar errores de respuesta
const handleResponse = async (response) => {
  console.log('📨 Status de respuesta:', response.status, response.statusText);
  
  const responseText = await response.text();
  console.log('📄 Respuesta cruda:', responseText);
  
  if (responseText.trim().startsWith('<') || responseText.includes('<br />')) {
    console.error('❌ El backend devolvió HTML en lugar de JSON');
    throw new Error('Error del servidor: respuesta en formato incorrecto');
  }
  
  if (!response.ok) {
    try {
      const errorJson = JSON.parse(responseText);
      throw new Error(errorJson.message || `HTTP error! status: ${response.status}`);
    } catch {
      throw new Error(responseText || `HTTP error! status: ${response.status}`);
    }
  }
  
  try {
    const result = JSON.parse(responseText);
    console.log('✅ Respuesta exitosa:', result);
    return result;
  } catch (error) {
    console.error('❌ Error parseando JSON:', error);
    throw new Error('Respuesta del servidor en formato inválido');
  }
};

export const apiService = {
  // ============================================
  // 🔐 AUTENTICACIÓN
  // ============================================
  
  async login(credentials) {
    try {
      console.log('🔐 Intentando login con:', credentials);
      
      const response = await fetch(
        buildUrl('login'), 
        fetchConfig('POST', {
          Correo_electronico: credentials.email,
          Contrasena: credentials.password
        })
      );
      
      return await handleResponse(response);
      
    } catch (error) {
      console.error('💥 Error completo en login:', error);
      throw error;
    }
  },

  async signup(userData) {
    try {
      console.log('👤 Registrando usuario:', userData);
      
      const response = await fetch(
        buildUrl('signup'), 
        fetchConfig('POST', userData)
      );
      return await handleResponse(response);
    } catch (error) {
      console.error('Error en signup:', error);
      throw error;
    }
  },

  async logout() {
    try {
      console.log('🚪 Cerrando sesión...');
      
      const response = await fetch(
        buildUrl('logout'), 
        fetchConfig('POST')
      );
      return await handleResponse(response);
    } catch (error) {
      console.error('Error en logout:', error);
      throw error;
    }
  },

  async checkSession() {
    try {
      console.log('🔍 Verificando sesión...');
      
      const response = await fetch(
        buildUrl('check-session'), 
        fetchConfig('GET')
      );
      return await handleResponse(response);
    } catch (error) {
      console.error('Error verificando sesión:', error);
      throw error;
    }
  },

  // ============================================
  // 🍕 PRODUCTOS
  // ============================================
  
  async getProducts() {
    try {
      console.log('🍕 Obteniendo productos...');
      
      const response = await fetch(
        buildUrl('products'), 
        fetchConfig('GET')
      );
      return await handleResponse(response);
    } catch (error) {
      console.error('Error al obtener productos:', error);
      throw error;
    }
  },

  async createProduct(productData, file = null) {
    try {
      console.log('🆕 Creando producto:', productData);
      console.log('📸 ¿Hay archivo?:', file ? 'SÍ' : 'NO');
      
      let response;
      
      if (file) {
        // ✅ USAR FormData PARA ARCHIVOS
        const formData = new FormData();
        formData.append('Nombre_producto', productData.Nombre_producto);
        formData.append('Precio_producto', productData.Precio_producto.toString());
        formData.append('Tipo_producto', productData.Tipo_producto);
        formData.append('Descripcion', productData.Descripcion || '');
        formData.append('Imagen', productData.Imagen || '');
        formData.append('imagen', file);
        
        console.log('📤 Enviando FormData con archivo');
        
        // DEBUG: Mostrar campos del FormData
        console.log('🔍 Campos del FormData:');
        for (let [key, value] of formData.entries()) {
          if (key === 'imagen') {
            console.log(`   ${key}:`, value.name, `(tipo: ${value.type}, tamaño: ${value.size} bytes)`);
          } else {
            console.log(`   ${key}:`, value);
          }
        }
        
        response = await fetch(buildUrl('products'), {
          method: 'POST',
          body: formData,
          credentials: 'include'
        });
      } else {
        console.log('📤 Enviando JSON sin archivo');
        response = await fetch(
          buildUrl('products'), 
          fetchConfig('POST', productData)
        );
      }
      
      return await handleResponse(response);
    } catch (error) {
      console.error('Error al crear producto:', error);
      throw error;
    }
  },

  async updateProduct(productData, file = null) {
    try {
      console.log('✏️ Actualizando producto:', productData);
      console.log('📸 ¿Hay archivo?:', file ? 'SÍ' : 'NO');
      console.log('🆔 ID del producto:', productData.Id_producto);
      
      let response;
      
      if (file) {
        // ✅ USAR FormData PARA ARCHIVOS - USAR POST EN LUGAR DE PUT
        const formData = new FormData();
        
        formData.append('Id_producto', productData.Id_producto.toString());
        formData.append('Nombre_producto', productData.Nombre_producto);
        formData.append('Precio_producto', productData.Precio_producto.toString());
        formData.append('Tipo_producto', productData.Tipo_producto);
        formData.append('Descripcion', productData.Descripcion || '');
        formData.append('Imagen', productData.Imagen || '');
        formData.append('imagen', file);
        
        console.log('📤 Enviando FormData con los siguientes campos:');
        for (let [key, value] of formData.entries()) {
          if (key === 'imagen') {
            console.log(`   ${key}:`, value.name, `(tipo: ${value.type}, tamaño: ${value.size} bytes)`);
          } else {
            console.log(`   ${key}:`, value);
          }
        }
        
        console.log('🔗 URL de destino:', buildUrl('admin/products'));
        
        // 🔧 CAMBIO: Usar POST en lugar de PUT para FormData
        response = await fetch(buildUrl('admin/products'), {
          method: 'POST', // ✅ CAMBIADO DE PUT A POST
          body: formData,
          credentials: 'include'
        });
      } else {
        console.log('📤 Enviando JSON sin archivo:', productData);
        console.log('🔗 URL de destino:', buildUrl('admin/products'));
        response = await fetch(
          buildUrl('admin/products'), 
          fetchConfig('PUT', productData) // ✅ MANTENER PUT PARA JSON
        );
      }
      
      return await handleResponse(response);
    } catch (error) {
      console.error('Error al actualizar producto:', error);
      throw error;
    }
  },

  async deleteProduct(productId) {
    try {
      console.log('🗑️ Eliminando producto ID:', productId);
      
      const response = await fetch(
        buildUrl(`admin/products/${productId}`), 
        fetchConfig('DELETE')
      );
      return await handleResponse(response);
    } catch (error) {
      console.error('Error al eliminar producto:', error);
      throw error;
    }
  },

  // ============================================
  // 👥 USUARIOS
  // ============================================
  
  async getProfile() {
    try {
      console.log('👤 Obteniendo perfil...');
      
      const response = await fetch(
        buildUrl('profile'), 
        fetchConfig('GET')
      );
      return await handleResponse(response);
    } catch (error) {
      console.error('Error al obtener perfil:', error);
      throw error;
    }
  },

  async updateProfile(userData) {
    try {
      console.log('✏️ Actualizando perfil:', userData);
      
      const response = await fetch(
        buildUrl('profile'), 
        fetchConfig('PUT', userData)
      );
      return await handleResponse(response);
    } catch (error) {
      console.error('Error al actualizar perfil:', error);
      throw error;
    }
  },

  // 👨‍💼 ADMIN - USUARIOS
  async getAllUsers() {
    try {
      console.log('👥 Obteniendo todos los usuarios...');
      
      const response = await fetch(
        buildUrl('users'), 
        fetchConfig('GET')
      );
      return await handleResponse(response);
    } catch (error) {
      console.error('Error al obtener usuarios:', error);
      throw error;
    }
  },

  async updateUserAdmin(userData) {
    try {
      console.log('👨‍💼 Actualizando usuario (admin):', userData);
      
      const response = await fetch(
        buildUrl('admin/users'), 
        fetchConfig('PUT', userData)
      );
      
      return await handleResponse(response);
    } catch (error) {
      console.error('Error al actualizar usuario (admin):', error);
      throw error;
    }
  },

  async deleteUser(userId) {
    try {
      console.log('🗑️ Eliminando usuario ID:', userId);
      
      const response = await fetch(
        buildUrl(`admin/users/${userId}`), 
        fetchConfig('DELETE')
      );
      return await handleResponse(response);
    } catch (error) {
      console.error('Error al eliminar usuario:', error);
      throw error;
    }
  },

  // ============================================
  // 🏢 ESTABLECIMIENTOS
  // ============================================
  
  async getEstablecimientos() {
    try {
      console.log('🏢 Obteniendo establecimientos...');
      
      const response = await fetch(
        buildUrl('admin/establecimientos'), 
        fetchConfig('GET')
      );
      return await handleResponse(response);
    } catch (error) {
      console.error('Error al obtener establecimientos:', error);
      throw error;
    }
  },

  async createEstablecimiento(establecimientoData) {
    try {
      console.log('🆕 Creando establecimiento:', establecimientoData);
      
      const response = await fetch(
        buildUrl('admin/establecimientos'), 
        fetchConfig('POST', establecimientoData)
      );
      return await handleResponse(response);
    } catch (error) {
      console.error('Error al crear establecimiento:', error);
      throw error;
    }
  },

  async updateEstablecimiento(establecimientoData) {
    try {
      console.log('✏️ Actualizando establecimiento:', establecimientoData);
      
      const response = await fetch(
        buildUrl('admin/establecimientos'), 
        fetchConfig('PUT', establecimientoData)
      );
      return await handleResponse(response);
    } catch (error) {
      console.error('Error al actualizar establecimiento:', error);
      throw error;
    }
  },

  async deleteEstablecimiento(establecimientoId) {
    try {
      console.log('🗑️ Eliminando establecimiento ID:', establecimientoId);
      
      const response = await fetch(
        buildUrl(`admin/establecimientos/${establecimientoId}`), 
        fetchConfig('DELETE')
      );
      return await handleResponse(response);
    } catch (error) {
      console.error('Error al eliminar establecimiento:', error);
      throw error;
    }
  },

  // ============================================
  // 🛒 CARRITO Y ÓRDENES
  // ============================================
  
  async createOrder(orderData) {
    try {
      console.log('🛒 Creando orden:', orderData);
      
      const response = await fetch(
        buildUrl('orders'), 
        fetchConfig('POST', orderData)
      );
      return await handleResponse(response);
    } catch (error) {
      console.error('Error al crear orden:', error);
      throw error;
    }
  },

  async getUserOrders() {
    try {
      console.log('📦 Obteniendo órdenes del usuario...');
      
      const response = await fetch(
        buildUrl('orders/user'), 
        fetchConfig('GET')
      );
      return await handleResponse(response);
    } catch (error) {
      console.error('Error al obtener órdenes:', error);
      throw error;
    }
  },

  async getOrderDetails(orderId) {
    try {
      console.log('📋 Obteniendo detalles de orden ID:', orderId);
      
      const response = await fetch(
        buildUrl(`orders/${orderId}`), 
        fetchConfig('GET')
      );
      return await handleResponse(response);
    } catch (error) {
      console.error('Error al obtener detalles de orden:', error);
      throw error;
    }
  },

  // 👨‍💼 ADMIN - ÓRDENES
  async getAllOrders() {
    try {
      console.log('📊 Obteniendo todas las órdenes...');
      
      const response = await fetch(
        buildUrl('orders'), 
        fetchConfig('GET')
      );
      return await handleResponse(response);
    } catch (error) {
      console.error('Error al obtener todas las órdenes:', error);
      throw error;
    }
  },

  // ============================================
  // 🛒 CARRITO TEMPORAL
  // ============================================
  
  async getCart() {
    try {
      console.log('🛒 Obteniendo carrito...');
      
      const response = await fetch(
        buildUrl('cart'), 
        fetchConfig('GET')
      );
      return await handleResponse(response);
    } catch (error) {
      console.error('Error al obtener carrito:', error);
      throw error;
    }
  },

  async addToCart(productData) {
    try {
      console.log('➕ Agregando al carrito:', productData);
      
      const response = await fetch(
        buildUrl('cart/add'), 
        fetchConfig('POST', productData)
      );
      return await handleResponse(response);
    } catch (error) {
      console.error('Error al agregar al carrito:', error);
      throw error;
    }
  },

  // ============================================
  // 📊 DASHBOARD ESTADÍSTICAS
  // ============================================
  
  async getDashboardStats() {
    try {
      console.log('📊 Obteniendo estadísticas del dashboard...');
      
      const [usersResponse, productsResponse, ordersResponse, establishmentsResponse] = await Promise.all([
        this.getAllUsers(),
        this.getProducts(),
        this.getAllOrders(),
        this.getEstablecimientos()
      ]);

      return {
        totalUsers: usersResponse.users?.length || 0,
        totalProducts: productsResponse.products?.length || 0,
        totalOrders: ordersResponse.orders?.length || 0,
        totalEstablishments: establishmentsResponse.establecimientos?.length || 0,
        recentOrders: ordersResponse.orders?.slice(0, 5) || []
      };
    } catch (error) {
      console.error('Error obteniendo estadísticas del dashboard:', error);
      throw error;
    }
  },

  // ============================================
  // 🔧 MÉTODOS DE DIAGNÓSTICO
  // ============================================
  
  async testConnection() {
    try {
      console.log('🧪 Probando conexión con el backend...');
      
      const response = await fetch(
        buildUrl('products'), 
        fetchConfig('GET')
      );
      
      const result = await handleResponse(response);
      console.log('✅ Conexión exitosa:', result);
      return { success: true, message: 'Conexión exitosa' };
    } catch (error) {
      console.error('❌ Error de conexión:', error);
      return { success: false, message: error.message };
    }
  },

  // Verificar estado de administrador
  async checkAdminStatus() {
    try {
      const profile = await this.getProfile();
      const user = profile.user;
      const isAdmin = user.Tipo_usuario === 'administrador';
      
      console.log('🔍 Estado admin:', { user, isAdmin });
      return isAdmin;
    } catch (error) {
      console.error('Error verificando estado de admin:', error);
      return false;
    }
  }
};

export default apiService;