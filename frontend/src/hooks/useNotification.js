import { useState, useCallback } from 'react';

export const useNotification = () => {
  const [notification, setNotification] = useState({
    show: false,
    message: '',
    type: 'success'
  });

  const showNotification = useCallback((message, type = 'success') => {
    setNotification({
      show: true,
      message,
      type
    });

    // Auto-ocultar después de 4 segundos
    setTimeout(() => {
      setNotification(prev => ({ ...prev, show: false }));
    }, 4000);
  }, []);

  const hideNotification = useCallback(() => {
    setNotification(prev => ({ ...prev, show: false }));
  }, []);

  return {
    notification,
    showNotification,
    hideNotification
  };
};