import { Link } from 'react-router-dom';
import { useState } from 'react';
import { useAuthContext } from '../../hooks/useAuthContext';
import styles from './Navbar.module.css';
import { useTheme } from '../../context/ThemeProvider';

export default function Navbar() {
  const { isAuthenticated, logout, user, loading } = useAuthContext();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const { theme, toggleTheme } = useTheme();
  if (loading) {
    return (
      <nav className={styles.navbar}>
        <div className={styles.navbarLoading}>Cargando...</div>
      </nav>
    );
  }

  return (
    <nav className={styles.navbar}>
      <Link to="/" className={styles.navbarLogo}>
        <h1>GameScape</h1>
      </Link>
      
      <div className={styles.navbarCenter}>
        {isAuthenticated && (
          <span className={styles.navbarWelcome}>
            Bienvenido, {user?.nick || user?.name}
          </span>
        )}
      </div>

      <div className={styles.navbarLinks}>
        <Link to="/" className={styles.navbarLink}>
          Home
        </Link>
        {isAuthenticated && (
          <Link to="/favorites" className={styles.navbarLink}>
            Favorites
          </Link>
        )}

        <button onClick={toggleTheme} className={styles.navbarThemeToggle} aria-label='Cambiar tema'>
          {theme === 'dark' ? '🌙' : '☀️'}
        </button>
      </div>
      
      {isAuthenticated && (
        <div className={styles.navbarProfile}>
          <div 
            className={styles.navbarProfileTrigger}
            onClick={() => setShowProfileMenu(!showProfileMenu)}
          >
            <div className={styles.navbarProfileAvatar}>
              {user?.photoProfile ? (
                <img src={user.photoProfile} alt="Profile" />
              ) : (
                <span className={styles.navbarProfileInitial}>
                  {user?.nick?.[0]?.toUpperCase() || user?.name?.[0]?.toUpperCase() || 'U'}
                </span>
              )}
            </div>
            <span className={styles.navbarProfileName}>
              {user?.nick || user?.name}
            </span>
            <span className={styles.navbarProfileArrow}>{'>'}</span>
          </div>
          {showProfileMenu && (
            <div className={styles.navbarProfileMenu}>
              <Link 
                to="/profile" 
                className={styles.navbarProfileMenuItem}
                onClick={() => setShowProfileMenu(false)}
              >
                <span>Editar Perfil</span>
              </Link>
              <Link 
                to="/settings" 
                className={styles.navbarProfileMenuItem}
                onClick={() => setShowProfileMenu(false)}
              >
                <span>⚙️ Configuración</span>
              </Link>
              <button 
                className={`${styles.navbarProfileMenuItem} ${styles.navbarProfileMenuItemLogout}`}
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
    </nav>
  );
}