import React, { useState, useEffect } from 'react';
import { CartContext } from './CartContext';
import { apiService } from '../services/api';

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState({
    show: false,
    message: '',
    type: 'success'
  });

  // Mostrar notificación
  const showNotification = (message, type = 'success') => {
    setNotification({
      show: true,
      message,
      type
    });
    
    // Ocultar automáticamente después de 4 segundos
    setTimeout(() => {
      hideNotification();
    }, 4000);
  };

  // Ocultar notificación
  const hideNotification = () => {
    setNotification(prev => ({
      ...prev,
      show: false
    }));
  };

  // Cargar carrito desde localStorage al iniciar
  useEffect(() => {
    const savedCart = localStorage.getItem('restaurante_cart');
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        setCartItems(parsedCart);
        console.log('🛒 Carrito cargado desde localStorage:', parsedCart.length, 'productos');
      } catch (error) {
        console.error('❌ Error cargando carrito:', error);
        setCartItems([]);
      }
    }
  }, []);

  // Guardar carrito en localStorage cuando cambie
  useEffect(() => {
    localStorage.setItem('restaurante_cart', JSON.stringify(cartItems));
    console.log('💾 Carrito guardado en localStorage:', cartItems.length, 'productos');
  }, [cartItems]);

  // Agregar producto al carrito
  const addToCart = (product) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.Id_producto === product.Id_producto);
      
      if (existingItem) {
        // Si ya existe, aumentar cantidad
        const updatedItems = prevItems.map(item =>
          item.Id_producto === product.Id_producto
            ? { ...item, cantidad: item.cantidad + 1 }
            : item
        );
        
        showNotification(
          `¡${product.Nombre_producto} agregado al carrito! (${existingItem.cantidad + 1} unidades)`,
          'success'
        );
        return updatedItems;
      } else {
        // Si no existe, agregar nuevo item
        const newItems = [...prevItems, { ...product, cantidad: 1 }];
        showNotification(`¡${product.Nombre_producto} agregado al carrito!`, 'success');
        return newItems;
      }
    });
  };

  // Remover producto del carrito
  const removeFromCart = (productId) => {
    setCartItems(prevItems => {
      const itemToRemove = prevItems.find(item => item.Id_producto === productId);
      const newItems = prevItems.filter(item => item.Id_producto !== productId);
      
      if (itemToRemove) {
        showNotification(`¡${itemToRemove.Nombre_producto} removido del carrito!`, 'info');
      }
      
      return newItems;
    });
  };

  // Actualizar cantidad de un producto
  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity < 1) {
      removeFromCart(productId);
      return;
    }

    setCartItems(prevItems => {
      const updatedItems = prevItems.map(item =>
        item.Id_producto === productId
          ? { ...item, cantidad: newQuantity }
          : item
      );
      
      const updatedItem = updatedItems.find(item => item.Id_producto === productId);
      if (updatedItem && newQuantity > 0) {
        showNotification(
          `Cantidad de ${updatedItem.Nombre_producto} actualizada a ${newQuantity}`,
          'info'
        );
      }
      
      return updatedItems;
    });
  };

  // Limpiar carrito
  const clearCart = () => {
    if (cartItems.length > 0) {
      showNotification('Carrito vaciado correctamente', 'info');
    }
    setCartItems([]);
  };

  // Calcular total
  const getTotalPrice = () => {
    const total = cartItems.reduce((total, item) => {
      return total + (item.Precio_producto * item.cantidad);
    }, 0);
    return total;
  };

  // Calcular total de items
  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.cantidad, 0);
  };

  // Obtener cantidad de un producto específico
  const getProductQuantity = (productId) => {
    const item = cartItems.find(item => item.Id_producto === productId);
    return item ? item.cantidad : 0;
  };

  // Verificar si un producto está en el carrito
  const isInCart = (productId) => {
    return cartItems.some(item => item.Id_producto === productId);
  };

  // ✅ CREAR ORDEN
  const createOrder = async (orderData) => {
    setLoading(true);
    try {
      console.log('🛒 Creando orden con datos:', orderData);
      
      const response = await apiService.createOrder(orderData);
      
      if (response.success || response.orden_id) {
        // Limpiar carrito después de orden exitosa
        clearCart();
        showNotification(
          response.message || '¡Orden creada exitosamente!',
          'success'
        );
        return { 
          success: true, 
          message: response.message, 
          orden_id: response.orden_id,
          codigo_orden: response.codigo_orden
        };
      } else {
        showNotification(
          response.message || 'Error al crear la orden',
          'error'
        );
        return { 
          success: false, 
          message: response.message 
        };
      }
    } catch (error) {
      console.error('❌ Error creando orden:', error);
      showNotification(
        error.message || 'Error al crear la orden',
        'error'
      );
      return { 
        success: false, 
        message: error.message || 'Error al crear la orden' 
      };
    } finally {
      setLoading(false);
    }
  };

  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getTotalPrice,
    getTotalItems,
    getProductQuantity,
    isInCart,
    createOrder,
    loading,
    notification,
    hideNotification
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};