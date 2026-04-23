import './index.css';
import NotificationProvider from './context/NotificationProvider';
import { useNotifications } from './context/NotificationProvider';
import ToastNotification from './components/ToastNotification';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AuthProvider from './context/AuthProvider';
import GameProvider from './context/GameProvider';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import GameDetail from './pages/GameDetail';
import Favorites from './pages/Favorites';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import ProtectedRoute from './components/ProtectedRoute';
import './index.css';
import { ThemeProvider } from './context/ThemeProvider';

function AppContent() {
  const { notifications, clearNotification } = useNotifications();

  return (
    <Router>
      <div className="app">
        <Navbar />
        <main className="main">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/" element={<Home />} />
            <Route path="/game/:id" element={<GameDetail />} />
            <Route path="/profile" element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } />
            <Route path="/favorites" element={
              <ProtectedRoute>
                <Favorites />
              </ProtectedRoute>
            } />
            <Route path="/settings" element={
              <ProtectedRoute>
                <Settings />
              </ProtectedRoute>
            } />
          </Routes>
        </main>
        
        {/* Renderizar notificaciones */}
        <div className="notifications-container">
          {notifications.map(notification => (
            <ToastNotification
              key={notification.id}
              notification={notification}
              onClose={clearNotification}
            />
          ))}
        </div>
      </div>
    </Router>
  );
}

function App() {
  return (
    <ThemeProvider>
      <NotificationProvider>
        <AuthProvider>
          <GameProvider>
            <AppContent />
          </GameProvider>
        </AuthProvider>
      </NotificationProvider>
    </ThemeProvider>
  );
}

export default App;