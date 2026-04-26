import React, { useState, useEffect } from 'react';
import { AuthContext } from './AuthContext';
import { useNotifications } from './NotificationProvider';

/**
 * @component AuthProvider
 * @description Proveedor de contexto para la autenticación de usuarios. Gestiona el estado de autenticación,
 *              login, registro, actualización de perfil, historial de búsquedas y eliminación de cuenta.
 *              Utiliza localStorage para persistir los datos de usuarios y sesiones.
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children - Componentes hijos que tendrán acceso al contexto de autenticación
 *
 * @returns {JSX.Element} Provider de AuthContext con el estado y funciones de autenticación
 *
 * @context
 * - user: Datos del usuario autenticado o null
 * - login: Función para iniciar sesión
 * - register: Función para registrar nuevo usuario
 * - updateProfile: Función para actualizar datos del perfil
 * - deleteAccount: Función para eliminar cuenta
 * - addToSearchHistory: Función para agregar búsqueda al historial
 * - getSearchHistory: Función para obtener historial de búsquedas
 * - clearSearchHistory: Función para limpiar historial de búsquedas
 * - logout: Función para cerrar sesión
 * - isAuthenticated: Boolean que indica si hay usuario autenticado
 * - loading: Boolean que indica si se está cargando la sesión
 */
export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const { showNotification } = useNotifications();

  // Cargar usuario desde localStorage al iniciar
  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('userData');
    
    if (token && userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
      } catch (error) {
        console.error('Error parsing user data:', error);
        localStorage.removeItem('userData');
        localStorage.removeItem('token');
      }
    }
    setLoading(false);
  }, []);

  /**
   * @function login
   * @description Inicia sesión de un usuario verificando email y contraseña contra localStorage
   * @param {string} email - Email del usuario
   * @param {string} password - Contraseña del usuario
   * @returns {Promise<{success: boolean, error?: string}>} Objeto con resultado del login
   */
  const login = async (email, password) => {
    try {
      // Buscar usuario en localStorage
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const existingUser = users.find(u => u.email === email && u.password === password);
      
      if (existingUser) {
        setUser(existingUser);
        localStorage.setItem('token', `token-${existingUser.email}`);
        localStorage.setItem('userData', JSON.stringify(existingUser));
        showNotification(`¡Bienvenido de nuevo, ${existingUser.name || existingUser.nick}!`, 'success');
        return { success: true };
      } else {
        showNotification('Email o contraseña incorrectos', 'error');
        return { success: false, error: 'Email o contraseña incorrectos' };
      }
    } catch (error) {
      showNotification('Error al iniciar sesión', 'error');
      return { success: false, error: 'Error al iniciar sesión' };
    }
  };

  /**
   * @function register
   * @description Registra un nuevo usuario verificando que email y nick no existan previamente
   * @param {Object} userData - Datos del nuevo usuario
   * @param {string} userData.name - Nombre del usuario
   * @param {string} userData.nick - Nickname único del usuario
   * @param {string} userData.email - Email del usuario
   * @param {string} userData.password - Contraseña del usuario
   * @param {string} [userData.photoProfile] - URL de foto de perfil (opcional)
   * @returns {Promise<{success: boolean, error?: string}>} Objeto con resultado del registro
   */
  const register = async (userData) => {
    try {
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      
      // Verificar si el email ya existe
      if (users.find(u => u.email === userData.email)) {
        showNotification('El email ya está registrado', 'error');
        return { success: false, error: 'El email ya está registrado' };
      }
      
      // Verificar si el nick ya existe
      if (users.find(u => u.nick === userData.nick)) {
        showNotification('El nick ya está en uso', 'error');
        return { success: false, error: 'El nick ya está en uso' };
      }
      
      // Crear nuevo usuario
      const newUser = {
        id: Date.now().toString(),
        name: userData.name,
        nick: userData.nick,
        email: userData.email,
        password: userData.password, // En producción esto debería estar hasheado
        photoProfile: userData.photoProfile || null,
        favorites: [],
        searchHistory: [],
        createdAt: new Date().toISOString()
      };
      
      users.push(newUser);
      localStorage.setItem('users', JSON.stringify(users));
      
      // Auto-login después del registro
      setUser(newUser);
      localStorage.setItem('token', `token-${newUser.email}`);
      localStorage.setItem('userData', JSON.stringify(newUser));
      
      showNotification(`¡Bienvenido a GameScape, ${newUser.name || newUser.nick}!`, 'success');
      return { success: true };
    } catch (error) {
      showNotification('Error al registrar usuario', 'error');
      return { success: false, error: 'Error al registrar usuario' };
    }
  };

  /**
   * @function updateProfile
   * @description Actualiza los datos del perfil del usuario autenticado
   * @param {Object} updates - Campos a actualizar del perfil
   * @returns {Promise<{success: boolean, error?: string}>} Objeto con resultado de la actualización
   */
  const updateProfile = async (updates) => {
    try {
      if (!user) return { success: false, error: 'Usuario no autenticado' };
      
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const userIndex = users.findIndex(u => u.id === user.id);
      
      if (userIndex === -1) {
        return { success: false, error: 'Usuario no encontrado' };
      }
      
      // Actualizar datos del usuario
      const updatedUser = { ...users[userIndex], ...updates };
      users[userIndex] = updatedUser;
      
      localStorage.setItem('users', JSON.stringify(users));
      localStorage.setItem('userData', JSON.stringify(updatedUser));
      setUser(updatedUser);
      
      return { success: true };
    } catch (error) {
      return { success: false, error: 'Error al actualizar perfil' };
    }
  };

  /**
   * @function addToSearchHistory
   * @description Agrega una búsqueda al historial del usuario, evitando duplicados y manteniendo máximo 20 búsquedas
   * @param {string} searchQuery - Texto de la búsqueda a agregar
   */
  const addToSearchHistory = (searchQuery) => {
    if (!user || !searchQuery || searchQuery.trim() === '') return;
    
    try {
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const userIndex = users.findIndex(u => u.id === user.id);
      
      if (userIndex === -1) return;
      
      const currentUser = users[userIndex];
      const searchHistory = currentUser.searchHistory || [];
      
      // Evitar duplicados y mantener orden cronológico inverso (m reciente primero)
      const filteredHistory = searchHistory.filter(item => item.query !== searchQuery.trim());
      const newHistory = [
        { 
          query: searchQuery.trim(), 
          timestamp: new Date().toISOString(),
          id: Date.now().toString()
        }, 
        ...filteredHistory
      ].slice(0, 20); // Mantener máximo 20 búsquedas
      
      const updatedUser = {
        ...currentUser,
        searchHistory: newHistory
      };
      
      users[userIndex] = updatedUser;
      localStorage.setItem('users', JSON.stringify(users));
      localStorage.setItem('userData', JSON.stringify(updatedUser));
      setUser(updatedUser);
    } catch (error) {
      console.error('Error al agregar búsqueda al historial:', error);
    }
  };

  /**
   * @function getSearchHistory
   * @description Retorna el historial de búsquedas del usuario actual
   * @returns {Array<{query: string, timestamp: string, id: string}>} Array de búsquedas ordenadas por fecha (más reciente primero)
   */
  const getSearchHistory = () => {
    if (!user) return [];
    return user.searchHistory || [];
  };

  /**
   * @function clearSearchHistory
   * @description Elimina todo el historial de búsquedas del usuario actual
   */
  const clearSearchHistory = () => {
    if (!user) return;
    
    try {
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const userIndex = users.findIndex(u => u.id === user.id);
      
      if (userIndex === -1) return;
      
      const updatedUser = {
        ...users[userIndex],
        searchHistory: []
      };
      
      users[userIndex] = updatedUser;
      localStorage.setItem('users', JSON.stringify(users));
      localStorage.setItem('userData', JSON.stringify(updatedUser));
      setUser(updatedUser);
    } catch (error) {
      console.error('Error al limpiar historial de búsquedas:', error);
    }
  };

  /**
   * @function deleteAccount
   * @description Elimina permanentemente la cuenta del usuario y todos sus datos
   * @returns {Promise<{success: boolean, error?: string}>} Objeto con resultado de la eliminación
   */
  const deleteAccount = async () => {
    try {
      if (!user) return { success: false, error: 'Usuario no autenticado' };
      
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const updatedUsers = users.filter(u => u.id !== user.id);
      
      localStorage.setItem('users', JSON.stringify(updatedUsers));
      
      // Limpiar sesión
      setUser(null);
      localStorage.removeItem('token');
      localStorage.removeItem('userData');
      
      return { success: true };
    } catch (error) {
      return { success: false, error: 'Error al eliminar cuenta' };
    }
  };

  /**
   * @function logout
   * @description Cierra la sesión del usuario actual y limpia localStorage
   */
  const logout = () => {
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('userData');
  };

  const value = {
    user,
    login,
    register,
    updateProfile,
    deleteAccount,
    addToSearchHistory,
    getSearchHistory,
    clearSearchHistory,
    logout,
    isAuthenticated: !!user,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}