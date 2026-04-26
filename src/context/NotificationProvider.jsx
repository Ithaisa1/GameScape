import React, { createContext, useContext, useState } from 'react';

export const NotificationContext = createContext(null);

/**
 * @function useNotifications
 * @description Hook personalizado para acceder al contexto de notificaciones
 * @returns {Object} Objeto con notifications, showNotification, clearNotification y clearAllNotifications
 * @throws {Error} Si se usa fuera de NotificationProvider
 */
export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

/**
 * @component NotificationProvider
 * @description Proveedor de contexto para el sistema de notificaciones toast.
 *              Gestiona un array de notificaciones con auto-dismiss después de 2.5 segundos.
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children - Componentes hijos que tendrán acceso al contexto de notificaciones
 *
 * @returns {JSX.Element} Provider de NotificationContext con el estado y funciones de notificaciones
 *
 * @context
 * - notifications: Array de notificaciones activas
 * - showNotification: Función para mostrar una nueva notificación
 * - clearNotification: Función para eliminar una notificación específica
 * - clearAllNotifications: Función para eliminar todas las notificaciones
 */
export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  /**
   * @function showNotification
   * @description Muestra una notificación toast que se auto-descarta después de 2.5 segundos
   * @param {string} message - Mensaje de la notificación
   * @param {string} type - Tipo de notificación ('info', 'success', 'error', 'warning')
   */
  const showNotification = (message, type = 'info') => {
    const id = Date.now();
    const newNotification = {
      id,
      message,
      type,
      timestamp: new Date()
    };
    
    setNotifications(prev => [...prev, newNotification]);
    
    // Auto-dismiss después de 5 segundos
    setTimeout(() => {
      setNotifications(prev => prev.filter(notification => notification.id !== id));
    }, 2500);
  };

  /**
   * @function clearNotification
   * @description Elimina una notificación específica por su ID
   * @param {number} id - ID de la notificación a eliminar
   */
  const clearNotification = (id) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };

  /**
   * @function clearAllNotifications
   * @description Elimina todas las notificaciones activas
   */
  const clearAllNotifications = () => {
    setNotifications([]);
  };

  const value = {
    notifications,
    showNotification,
    clearNotification,
    clearAllNotifications
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

export default NotificationProvider;
