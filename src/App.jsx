import './index.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import AuthProvider from './context/AuthProvider';
import GameProvider from './context/GameProvider';
import {ThemeProvider} from './context/ThemeProvider';
import NotificationProvider from './context/NotificationProvider';

import Navbar from './components/Navbar/Navbar';

import Home from './pages/Home';
import GameDetail from './pages/GameDetail';
import Favorites from './pages/Favorites';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import Settings from './pages/Settings';

import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';

/**
 * @component App
 * @description Componente principal de la aplicación que configura la estructura de navegación y providers.
 *              Envuelve toda la aplicación con los providers necesarios (Theme, Notification, Auth, Game)
 *              y define las rutas de la aplicación usando React Router.
 *
 * Estructura de Providers (de afuera hacia adentro):
 * - ThemeProvider: Gestiona el tema claro/oscuro
 * - NotificationProvider: Gestiona las notificaciones toast
 * - AuthProvider: Gestiona la autenticación de usuarios
 * - GameProvider: Gestiona el estado de juegos y favoritos
 *
 * Rutas públicas:
 * - /login: Página de inicio de sesión
 * - /register: Página de registro
 * - /: Página principal (Home)
 * - /game/:id: Detalle de un juego específico
 *
 * Rutas protegidas (requieren autenticación):
 * - /profile: Perfil de usuario
 * - /favorites: Lista de juegos favoritos
 * - /settings: Configuración de cuenta
 *
 * @returns {JSX.Element} Aplicación con navegación y providers configurados
 */
function App() {
  return (
    <Router>
      <ThemeProvider>
        <NotificationProvider>
          <AuthProvider>
            <GameProvider>
              <Navbar />

              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                <Route path="/" element={<Home />} />
                <Route path="/game/:id" element={<GameDetail />} />

                <Route
                  path="/profile"
                  element={
                    <ProtectedRoute>
                      <Profile />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/favorites"
                  element={
                    <ProtectedRoute>
                      <Favorites />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/settings"
                  element={
                    <ProtectedRoute>
                      <Settings />
                    </ProtectedRoute>
                  }
                />
              </Routes>
            </GameProvider>
          </AuthProvider>
        </NotificationProvider>
      </ThemeProvider>
    </Router>
  );
}

export default App;