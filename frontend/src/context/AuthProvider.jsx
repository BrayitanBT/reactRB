import React, { useState, useEffect } from 'react';
import { AuthContext } from './AuthContext';
import { apiService } from '../services/api';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🔍 VERIFICAR SESIÓN AL CARGAR
  useEffect(() => {
    checkSession();
  }, []);

  const checkSession = async () => {
    try {
      const response = await apiService.checkSession();
      
      if (response.authenticated && response.user) {
        setUser(response.user);
        localStorage.setItem('user', JSON.stringify(response.user));
      } else {
        setUser(null);
        localStorage.removeItem('user');
      }
    } catch (error) {
      console.error('Error verificando sesión:', error);
      setUser(null);
      localStorage.removeItem('user');
    } finally {
      setLoading(false);
    }
  };

  // 📝 REGISTRO - CORREGIDO
  const signup = async (userData) => {
    try {
      const response = await apiService.signup(userData);
      
      if (response.user) {
        setUser(response.user);
        localStorage.setItem('user', JSON.stringify(response.user));
        return { success: true, message: response.message };
      } else {
        return { success: false, message: response.message };
      }
    } catch (error) {
      console.error('Error en signup:', error); // ← AHORA SÍ SE USA EL ERROR
      return { success: false, message: error.message || 'Error de conexión' };
    }
  };

  // 🔐 LOGIN - CORREGIDO
  const login = async (email, password) => {
    try {
      const response = await apiService.login({
        email: email,
        password: password
      });

      console.log('🔐 Respuesta login en AuthProvider:', response);

      if (response.user) {
        setUser(response.user);
        localStorage.setItem('user', JSON.stringify(response.user));
        return { success: true, message: response.message, user: response.user };
      } else {
        return { success: false, message: response.message };
      }
    } catch (error) {
      console.error('💥 Error en login AuthProvider:', error);
      return { success: false, message: error.message || 'Error de conexión' };
    }
  };

  // 🚪 LOGOUT - CORREGIDO
  const logout = async () => {
    try {
      await apiService.logout();
    } catch (error) {
      console.error('Error en logout:', error);
    } finally {
      setUser(null);
      localStorage.removeItem('user');
    }
  };

  // 🔍 Verificar si es admin
  const isAdmin = () => {
    return user?.Tipo_usuario === 'administrador';
  };

  // 🔄 Actualizar usuario
  const updateUser = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const value = {
    user,
    signup,
    login,
    logout,
    isAdmin,
    loading,
    updateUser,
    checkSession
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};