/**
 * @file useNotifications.jsx
 * @description Hook personalizado para acceder al contexto de notificaciones.
 *              Proporciona una forma segura de acceder al NotificationContext con validación de error.
 *              Nota: Este hook está duplicado en NotificationProvider.jsx (exportado desde allí).
 * @module Hooks
 */

import { useContext } from 'react';
import { NotificationContext } from '../context/NotificationProvider';

/**
 * @hook useNotifications
 * @description Hook personalizado para acceder al contexto de notificaciones. Valida que el hook
 *              se use dentro de un NotificationProvider y lanza un error si no es así.
 * @returns {Object} Objeto con el contexto de notificaciones (notifications, showNotification, clearNotification, etc.)
 * @throws {Error} Si se usa fuera de un NotificationProvider
 * @example
 * const { showNotification, clearAllNotifications } = useNotifications();
 */
export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};
