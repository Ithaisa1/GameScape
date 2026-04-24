import React, { useEffect } from 'react';
import styles from './ToastNotification.module.css';

const ToastNotification = ({ notification, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(notification.id);
    }, 5000);

    return () => clearTimeout(timer);
  }, [notification.id, onClose]);

  const getIcon = () => {
    switch (notification.type) {
      case 'success':
        return '✅';
      case 'error':
        return '❌';
      case 'warning':
        return '⚠️';
      case 'info':
      default:
        return 'ℹ️';
    }
  };

  const handleClose = () => {
    onClose(notification.id);
  };

  return (
    <div className={`${styles.toastNotification} ${styles[`toastNotification${notification.type.charAt(0).toUpperCase() + notification.type.slice(1)}`]}`}>
      <div className={styles.toastNotificationContent}>
        <span className={styles.toastNotificationIcon}>
          {getIcon()}
        </span>
        <span className={styles.toastNotificationMessage}>
          {notification.message}
        </span>
        <button 
          className={styles.toastNotificationClose}
          onClick={handleClose}
          aria-label="Cerrar notificación"
        >
          X
        </button>
      </div>
    </div>
  );
};

export default ToastNotification;
