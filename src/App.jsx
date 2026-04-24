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