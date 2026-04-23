import { useState, useEffect } from 'react';
import { useAuthContext } from '../hooks/useAuthContext';
import { useTheme } from '../context/ThemeProvider';
import { useNavigate } from 'react-router-dom';
import '../styles/Settings.css';

export default function Settings() {
  const { user, logout } = useAuthContext();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  
  const [settings, setSettings] = useState({
    notifications: {
      favorites: true,
      newGames: false,
      priceDrops: false,
      reviews: true,
      recommendations: true
    },
    privacy: {
      profilePublic: true,
      showReviews: true,
      showFavorites: false,
      showSearchHistory: false
    },
    theme: {
      autoSwitch: false,
      startHour: '08:00',
      endHour: '20:00'
    },
    account: {
      emailNotifications: true,
      pushNotifications: false,
      weeklyDigest: false
    }
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const savedSettings = localStorage.getItem(`userSettings_${user?.id}`);
    if (savedSettings) {
      try {
        setSettings(JSON.parse(savedSettings));
      } catch (error) {
        console.error('Error loading settings:', error);
      }
    }
  }, [user]);

  const handleSettingChange = (category, key, value) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: value
      }
    }));
  };

  const handleSaveSettings = async () => {
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      localStorage.setItem(`userSettings_${user.id}`, JSON.stringify(settings));
      
      if (settings.theme.autoSwitch) {
        const currentHour = new Date().getHours();
        const startHour = parseInt(settings.theme.startHour.split(':')[0]);
        const endHour = parseInt(settings.theme.endHour.split(':')[0]);
        
        const shouldBeLight = currentHour >= startHour && currentHour < endHour;
        const currentTheme = theme === 'light';
        
        if (shouldBeLight !== currentTheme) {
          toggleTheme();
        }
      }

      setSuccess('Configuracion guardada correctamente');
      setTimeout(() => setSuccess(''), 3000);
      
    } catch (error) {
      console.error('Error saving settings:', error);
      setError('Error al guardar la configuracion');
    } finally {
      setLoading(false);
    }
  };

  const handleResetSettings = () => {
    if (!confirm('Estas seguro de que quieres restablecer toda la configuracion a los valores predeterminados?')) {
      return;
    }

    const defaultSettings = {
      notifications: {
        favorites: true,
        newGames: false,
        priceDrops: false,
        reviews: true,
        recommendations: true
      },
      privacy: {
        profilePublic: true,
        showReviews: true,
        showFavorites: false,
        showSearchHistory: false
      },
      theme: {
        autoSwitch: false,
        startHour: '08:00',
        endHour: '20:00'
      },
      account: {
        emailNotifications: true,
        pushNotifications: false,
        weeklyDigest: false
      }
    };

    setSettings(defaultSettings);
    setSuccess('Configuracion restablecida a los valores predeterminados');
    setTimeout(() => setSuccess(''), 3000);
  };

  const handleDeleteAccount = () => {
    if (!confirm('Estas seguro de que quieres eliminar tu cuenta? Esta accion no se puede deshacer y eliminara permanentemente todos tus datos.')) {
      return;
    }
    
    navigate('/profile');
  };

  if (!user) {
    return (
      <div className="settings-container">
        <div className="settings-card">
          <h1 className="settings-title">Configuracion</h1>
          <p className="settings-subtitle">Debes iniciar sesion para acceder a la configuracion</p>
          <button 
            className="settings__button"
            onClick={() => navigate('/login')}
          >
            Iniciar Sesion
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="settings-container">
      <div className="settings-card">
        <h1 className="settings-title">Configuracion</h1>
        <p className="settings-subtitle">Gestiona tus preferencias de cuenta</p>
        
        {error && <div className="settings__error">{error}</div>}
        {success && <div className="settings__success">{success}</div>}
        
        <form className="settings-form" onSubmit={(e) => { e.preventDefault(); handleSaveSettings(); }}>
            
            <div className="settings__section">
              <h2 className="settings__section-title">Preferencias de Notificaciones</h2>
              <div className="settings__group">
                <label className="settings__checkbox-label">
                  <input
                    type="checkbox"
                    checked={settings.notifications.favorites}
                    onChange={(e) => handleSettingChange('notifications', 'favorites', e.target.checked)}
                    className="settings__checkbox"
                  />
                  <span>Notificaciones de favoritos</span>
                </label>
                <label className="settings__checkbox-label">
                  <input
                    type="checkbox"
                    checked={settings.notifications.newGames}
                    onChange={(e) => handleSettingChange('notifications', 'newGames', e.target.checked)}
                    className="settings__checkbox"
                  />
                  <span>Nuevos juegos</span>
                </label>
                <label className="settings__checkbox-label">
                  <input
                    type="checkbox"
                    checked={settings.notifications.priceDrops}
                    onChange={(e) => handleSettingChange('notifications', 'priceDrops', e.target.checked)}
                    className="settings__checkbox"
                  />
                  <span>Bajadas de precio</span>
                </label>
                <label className="settings__checkbox-label">
                  <input
                    type="checkbox"
                    checked={settings.notifications.reviews}
                    onChange={(e) => handleSettingChange('notifications', 'reviews', e.target.checked)}
                    className="settings__checkbox"
                  />
                  <span>Respuestas a reseñas</span>
                </label>
                <label className="settings__checkbox-label">
                  <input
                    type="checkbox"
                    checked={settings.notifications.recommendations}
                    onChange={(e) => handleSettingChange('notifications', 'recommendations', e.target.checked)}
                    className="settings__checkbox"
                  />
                  <span>Recomendaciones personalizadas</span>
                </label>
              </div>
            </div>

            <div className="settings__section">
              <h2 className="settings__section-title">Configuracion de Privacidad</h2>
              <div className="settings__group">
                <label className="settings__checkbox-label">
                  <input
                    type="checkbox"
                    checked={settings.privacy.profilePublic}
                    onChange={(e) => handleSettingChange('privacy', 'profilePublic', e.target.checked)}
                    className="settings__checkbox"
                  />
                  <span>Perfil publico</span>
                </label>
                <label className="settings__checkbox-label">
                  <input
                    type="checkbox"
                    checked={settings.privacy.showReviews}
                    onChange={(e) => handleSettingChange('privacy', 'showReviews', e.target.checked)}
                    className="settings__checkbox"
                  />
                  <span>Mostrar mis reseñas publicamente</span>
                </label>
                <label className="settings__checkbox-label">
                  <input
                    type="checkbox"
                    checked={settings.privacy.showFavorites}
                    onChange={(e) => handleSettingChange('privacy', 'showFavorites', e.target.checked)}
                    className="settings__checkbox"
                  />
                  <span>Mostrar mis favoritos publicamente</span>
                </label>
                <label className="settings__checkbox-label">
                  <input
                    type="checkbox"
                    checked={settings.privacy.showSearchHistory}
                    onChange={(e) => handleSettingChange('privacy', 'showSearchHistory', e.target.checked)}
                    className="settings__checkbox"
                  />
                  <span>Mostrar historial de busquedas</span>
                </label>
              </div>
            </div>

            <div className="settings__section">
              <h2 className="settings__section-title">Opciones de Tema</h2>
              <div className="settings__group">
                <div className="settings__theme-current">
                  <span>Tema actual: </span>
                  <strong>{theme === 'light' ? 'Claro' : 'Oscuro'}</strong>
                  <button
                    type="button"
                    className="settings__theme-toggle"
                    onClick={toggleTheme}
                  >
                    Cambiar tema
                  </button>
                </div>
                
                <label className="settings__checkbox-label">
                  <input
                    type="checkbox"
                    checked={settings.theme.autoSwitch}
                    onChange={(e) => handleSettingChange('theme', 'autoSwitch', e.target.checked)}
                    className="settings__checkbox"
                  />
                  <span>Cambio automatico de tema</span>
                </label>
                
                {settings.theme.autoSwitch && (
                  <div className="settings__time-range">
                    <div className="settings__time-input">
                      <label>Desde:</label>
                      <input
                        type="time"
                        value={settings.theme.startHour}
                        onChange={(e) => handleSettingChange('theme', 'startHour', e.target.value)}
                        className="settings__time-input-field"
                      />
                    </div>
                    <div className="settings__time-input">
                      <label>Hasta:</label>
                      <input
                        type="time"
                        value={settings.theme.endHour}
                        onChange={(e) => handleSettingChange('theme', 'endHour', e.target.value)}
                        className="settings__time-input-field"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="settings__section">
              <h2 className="settings__section-title">Configuracion de Cuenta</h2>
              <div className="settings__group">
                <label className="settings__checkbox-label">
                  <input
                    type="checkbox"
                    checked={settings.account.emailNotifications}
                    onChange={(e) => handleSettingChange('account', 'emailNotifications', e.target.checked)}
                    className="settings__checkbox"
                  />
                  <span>Notificaciones por email</span>
                </label>
                <label className="settings__checkbox-label">
                  <input
                    type="checkbox"
                    checked={settings.account.pushNotifications}
                    onChange={(e) => handleSettingChange('account', 'pushNotifications', e.target.checked)}
                    className="settings__checkbox"
                  />
                  <span>Notificaciones push</span>
                </label>
                <label className="settings__checkbox-label">
                  <input
                    type="checkbox"
                    checked={settings.account.weeklyDigest}
                    onChange={(e) => handleSettingChange('account', 'weeklyDigest', e.target.checked)}
                    className="settings__checkbox"
                  />
                  <span>Resumen semanal</span>
                </label>
              </div>
            </div>

            <div className="settings__actions">
              <button 
                type="submit" 
                className="settings__button"
                disabled={loading}
              >
                {loading ? 'Guardando...' : 'Guardar Configuracion'}
              </button>
              
              <button 
                type="button"
                className="settings__secondary-btn"
                onClick={handleResetSettings}
              >
                Restablecer Valores
              </button>
            </div>

            <div className="settings__danger-section">
              <h3 className="settings__danger-title">Opciones Peligrosas</h3>
              <div className="settings__danger-actions">
                <button 
                  type="button"
                  className="settings__danger-btn"
                  onClick={logout}
                >
                  Cerrar Sesion
                </button>
                <button 
                  type="button"
                  className="settings__danger-btn"
                  onClick={handleDeleteAccount}
                >
                  Eliminar Cuenta
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    );
  }

