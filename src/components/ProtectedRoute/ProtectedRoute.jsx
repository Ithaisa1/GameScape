import { useAuthContext } from '../../hooks/useAuthContext';
import React from 'react';
import { Navigate } from 'react-router-dom';

/**
 * @component ProtectedRoute
 * @description Componente wrapper que protege rutas que requieren autenticación.
 *              Muestra un loader mientras se verifica la autenticación y redirige
 *              a /login si el usuario no está autenticado.
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children - Componentes hijos a renderizar si el usuario está autenticado
 *
 * @returns {JSX.Element} Loader, redirección a login, o componentes hijos según estado de autenticación
 */
export default function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuthContext();

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        background: '#0F1115',
        color: '#ffffff',
        fontSize: '1.2rem'
      }}>
        Cargando...
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}