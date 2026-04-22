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