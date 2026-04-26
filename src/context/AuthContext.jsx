/**
 * @file AuthContext.jsx
 * @description Define el contexto de autenticación que contiene el valor por defecto del contexto.
 *              Este archivo solo exporta el contexto creado con createContext. La implementación
 *              del provider está en AuthProvider.jsx.
 * @module Context
 * @see AuthProvider.jsx para la implementación del provider
 */

import { createContext } from 'react';

export const AuthContext = createContext({
  user: null,
  login: () => {},
  register: () => {},
  updateProfile: () => {},
  deleteAccount: () => {},
  addToSearchHistory: () => {},
  getSearchHistory: () => [],
  clearSearchHistory: () => {},
  logout: () => {},
  isAuthenticated: false,
  loading: true
});