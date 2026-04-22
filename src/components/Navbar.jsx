import { Link } from 'react-router-dom';
import { useState } from 'react';
import { useAuthContext } from '../hooks/useAuthContext';
import '../styles/Navbar.css';

export default function Navbar() {
  const { isAuthenticated, logout, user, loading } = useAuthContext();
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  if (loading) {
    return (
      <nav className="navbar">
        <div className="navbar__loading">Cargando...</div>
      </nav>
    );
  }

  return (
    <nav className="navbar">
      <Link to="/" className="navbar__logo">
        <h1>GameScape</h1>
      </Link>
      
      <div className="navbar__center">
        {isAuthenticated && (
          <span className="navbar__welcome">
            Bienvenido, {user?.nick || user?.name}
          </span>
        )}
      </div>

      <div className="navbar__links">
        <Link to="/" className="navbar__link">
          Home
        </Link>
        {isAuthenticated && (
          <Link to="/favorites" className="navbar__link">
            Favorites
          </Link>
        )}
        
        {isAuthenticated && (
          <div className="navbar__profile">
            <div 
              className="navbar__profile-trigger"
              onClick={() => setShowProfileMenu(!showProfileMenu)}
            >
              <div className="navbar__profile-avatar">
                {user?.photoProfile ? (
                  <img src={user.photoProfile} alt="Profile" />
                ) : (
                  <span className="navbar__profile-initial">
                    {user?.nick?.[0]?.toUpperCase() || user?.name?.[0]?.toUpperCase() || 'U'}
                  </span>
                )}
              </div>
              <span className="navbar__profile-name">
                {user?.nick || user?.name}
              </span>
              <span className="navbar__profile-arrow">{'>'}</span>
            </div>
            
            {showProfileMenu && (
              <div className="navbar__profile-menu">
                <Link 
                  to="/profile" 
                  className="navbar__profile-menu-item"
                  onClick={() => setShowProfileMenu(false)}
                >
                  <span>Editar Perfil</span>
                </Link>
                <button 
                  className="navbar__profile-menu-item navbar__profile-menu-item--logout"
                  onClick={() => {
                    logout();
                    setShowProfileMenu(false);
                  }}
                >
                  <span>Cerrar Sesión</span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}