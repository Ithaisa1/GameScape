import { useState, useEffect } from 'react';
import { AuthContext } from './AuthContext';
import { useNotifications } from './NotificationProvider';

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

  // Login con verificación de usuario existente
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

  // Registro de nuevo usuario
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

  // Actualizar perfil
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

  // Agregar búsqueda al historial
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

  // Obtener historial de búsquedas
  const getSearchHistory = () => {
    if (!user) return [];
    return user.searchHistory || [];
  };

  // Limpiar historial de búsquedas
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

  // Eliminar cuenta
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

  // Logout
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