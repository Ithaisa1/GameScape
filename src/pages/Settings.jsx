import { useState, useEffect } from 'react';
import { useAuthContext } from '../hooks/useAuthContext';
import { useTheme } from '../context/ThemeProvider';
import { useNavigate } from 'react-router-dom';
// CSS eliminado - Settings.jsx usa estilos inline o de componentes

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
      <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
        <div style={{ width: '100%', maxWidth: '500px' }}>
          <div style={{ background: 'rgba(255, 255, 255, 0.95)', borderRadius: '20px', padding: '3rem', boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)', backdropFilter: 'blur(10px)' }}>
            <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#333', marginBottom: '1rem', textAlign: 'center' }}>Configuracion</h1>
            <p style={{ color: '#666', marginBottom: '2rem', textAlign: 'center' }}>Debes iniciar sesion para acceder a la configuracion</p>
            <button 
              style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: '#fff', border: 'none', padding: '1rem 2rem', borderRadius: '10px', fontSize: '1.1rem', fontWeight: '600', cursor: 'pointer', transition: 'all 0.3s ease', boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)', width: '100%' }}
              onClick={() => navigate('/login')}
            >
              Iniciar Sesion
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Colores dinámicos según tema
  const isDarkTheme = theme === 'dark';
  const bgColors = {
    dark: 'linear-gradient(135deg, #0F1115 0%, #171A21 50%, #222734 100%)',
    light: 'linear-gradient(135deg, #F8F9FA 0%, #FFFFFF 50%, #E9ECEF 100%)'
  };
  const cardColors = {
    dark: 'rgba(34, 39, 52, 0.95)',
    light: 'rgba(255, 255, 255, 0.95)'
  };
  const textColors = {
    dark: '#FFFFFF',
    light: '#212529'
  };
  const secondaryTextColors = {
    dark: '#B8BDC9',
    light: '#495057'
  };
  const sectionBgColors = {
    dark: '#171A21',
    light: '#F8F9FA'
  };
  const borderColors = {
    dark: '#2A2F3A',
    light: '#DEE2E6'
  };
  const primaryColors = {
    dark: '#5B8CFF',
    light: '#0066CC'
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: bgColors[isDarkTheme ? 'dark' : 'light'], 
      padding: '2rem',
      transition: 'all 0.3s ease'
    }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <div style={{ 
          background: cardColors[isDarkTheme ? 'dark' : 'light'], 
          borderRadius: '20px', 
          padding: '3rem', 
          boxShadow: isDarkTheme 
            ? '0 20px 40px rgba(0, 0, 0, 0.5)' 
            : '0 20px 40px rgba(0, 0, 0, 0.1)', 
          backdropFilter: 'blur(10px)',
          border: isDarkTheme ? '1px solid #2A2F3A' : '1px solid #DEE2E6',
          transition: 'all 0.3s ease'
        }}>
          <h1 style={{ 
            fontSize: '2.5rem', 
            fontWeight: 'bold', 
            color: textColors[isDarkTheme ? 'dark' : 'light'], 
            marginBottom: '1rem', 
            textAlign: 'center',
            background: `linear-gradient(45deg, ${primaryColors[isDarkTheme ? 'dark' : 'light']}, ${isDarkTheme ? '#A78BFA' : '#6366F1'})`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>Configuracion</h1>
          <p style={{ 
            color: secondaryTextColors[isDarkTheme ? 'dark' : 'light'], 
            marginBottom: '2rem', 
            textAlign: 'center' 
          }}>Gestiona tus preferencias de cuenta</p>
          
          {error && <div style={{ 
            background: isDarkTheme ? '#fee' : '#fee', 
            color: '#c33', 
            padding: '1rem', 
            borderRadius: '10px', 
            marginBottom: '1rem', 
            border: '1px solid #fcc' 
          }}>{error}</div>}
          {success && <div style={{ 
            background: isDarkTheme ? '#efe' : '#efe', 
            color: '#393', 
            padding: '1rem', 
            borderRadius: '10px', 
            marginBottom: '1rem', 
            border: '1px solid #cfc' 
          }}>{success}</div>}
          
          <form style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }} onSubmit={(e) => { e.preventDefault(); handleSaveSettings(); }}>
            
            <div style={{ 
              background: sectionBgColors[isDarkTheme ? 'dark' : 'light'], 
              borderRadius: '15px', 
              padding: '2rem', 
              border: `1px solid ${borderColors[isDarkTheme ? 'dark' : 'light']}`,
              transition: 'all 0.3s ease'
            }}>
              <h2 style={{ 
                fontSize: '1.5rem', 
                fontWeight: 'bold', 
                color: textColors[isDarkTheme ? 'dark' : 'light'], 
                marginBottom: '1.5rem' 
              }}>Preferencias de Notificaciones</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <label style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '0.75rem', 
                  cursor: 'pointer', 
                  color: textColors[isDarkTheme ? 'dark' : 'light'] 
                }}>
                  <input
                    type="checkbox"
                    checked={settings.notifications.favorites}
                    onChange={(e) => handleSettingChange('notifications', 'favorites', e.target.checked)}
                    style={{ width: '1.2rem', height: '1.2rem', cursor: 'pointer' }}
                  />
                  <span>Notificaciones de favoritos</span>
                </label>
                <label style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '0.75rem', 
                  cursor: 'pointer', 
                  color: textColors[isDarkTheme ? 'dark' : 'light'] 
                }}>
                  <input
                    type="checkbox"
                    checked={settings.notifications.newGames}
                    onChange={(e) => handleSettingChange('notifications', 'newGames', e.target.checked)}
                    style={{ width: '1.2rem', height: '1.2rem', cursor: 'pointer' }}
                  />
                  <span>Nuevos juegos</span>
                </label>
                <label style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '0.75rem', 
                  cursor: 'pointer', 
                  color: textColors[isDarkTheme ? 'dark' : 'light'] 
                }}>
                  <input
                    type="checkbox"
                    checked={settings.notifications.priceDrops}
                    onChange={(e) => handleSettingChange('notifications', 'priceDrops', e.target.checked)}
                    style={{ width: '1.2rem', height: '1.2rem', cursor: 'pointer' }}
                  />
                  <span>Bajadas de precio</span>
                </label>
                <label style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '0.75rem', 
                  cursor: 'pointer', 
                  color: textColors[isDarkTheme ? 'dark' : 'light'] 
                }}>
                  <input
                    type="checkbox"
                    checked={settings.notifications.reviews}
                    onChange={(e) => handleSettingChange('notifications', 'reviews', e.target.checked)}
                    style={{ width: '1.2rem', height: '1.2rem', cursor: 'pointer' }}
                  />
                  <span>Respuestas a reseñas</span>
                </label>
                <label style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '0.75rem', 
                  cursor: 'pointer', 
                  color: textColors[isDarkTheme ? 'dark' : 'light'] 
                }}>
                  <input
                    type="checkbox"
                    checked={settings.notifications.recommendations}
                    onChange={(e) => handleSettingChange('notifications', 'recommendations', e.target.checked)}
                    style={{ width: '1.2rem', height: '1.2rem', cursor: 'pointer' }}
                  />
                  <span>Recomendaciones personalizadas</span>
                </label>
              </div>
            </div>

            <div style={{ 
              background: sectionBgColors[isDarkTheme ? 'dark' : 'light'], 
              borderRadius: '15px', 
              padding: '2rem', 
              border: `1px solid ${borderColors[isDarkTheme ? 'dark' : 'light']}`,
              transition: 'all 0.3s ease'
            }}>
              <h2 style={{ 
                fontSize: '1.5rem', 
                fontWeight: 'bold', 
                color: textColors[isDarkTheme ? 'dark' : 'light'], 
                marginBottom: '1.5rem' 
              }}>Configuracion de Privacidad</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <label style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '0.75rem', 
                  cursor: 'pointer', 
                  color: textColors[isDarkTheme ? 'dark' : 'light'] 
                }}>
                  <input
                    type="checkbox"
                    checked={settings.privacy.profilePublic}
                    onChange={(e) => handleSettingChange('privacy', 'profilePublic', e.target.checked)}
                    style={{ width: '1.2rem', height: '1.2rem', cursor: 'pointer' }}
                  />
                  <span>Perfil publico</span>
                </label>
                <label style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '0.75rem', 
                  cursor: 'pointer', 
                  color: textColors[isDarkTheme ? 'dark' : 'light'] 
                }}>
                  <input
                    type="checkbox"
                    checked={settings.privacy.showReviews}
                    onChange={(e) => handleSettingChange('privacy', 'showReviews', e.target.checked)}
                    style={{ width: '1.2rem', height: '1.2rem', cursor: 'pointer' }}
                  />
                  <span>Mostrar mis reseñas publicamente</span>
                </label>
                <label style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '0.75rem', 
                  cursor: 'pointer', 
                  color: textColors[isDarkTheme ? 'dark' : 'light'] 
                }}>
                  <input
                    type="checkbox"
                    checked={settings.privacy.showFavorites}
                    onChange={(e) => handleSettingChange('privacy', 'showFavorites', e.target.checked)}
                    style={{ width: '1.2rem', height: '1.2rem', cursor: 'pointer' }}
                  />
                  <span>Mostrar mis favoritos publicamente</span>
                </label>
                <label style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '0.75rem', 
                  cursor: 'pointer', 
                  color: textColors[isDarkTheme ? 'dark' : 'light'] 
                }}>
                  <input
                    type="checkbox"
                    checked={settings.privacy.showSearchHistory}
                    onChange={(e) => handleSettingChange('privacy', 'showSearchHistory', e.target.checked)}
                    style={{ width: '1.2rem', height: '1.2rem', cursor: 'pointer' }}
                  />
                  <span>Mostrar historial de busquedas</span>
                </label>
              </div>
            </div>

            <div style={{ 
              background: sectionBgColors[isDarkTheme ? 'dark' : 'light'], 
              borderRadius: '15px', 
              padding: '2rem', 
              border: `1px solid ${borderColors[isDarkTheme ? 'dark' : 'light']}`,
              transition: 'all 0.3s ease'
            }}>
              <h2 style={{ 
                fontSize: '1.5rem', 
                fontWeight: 'bold', 
                color: textColors[isDarkTheme ? 'dark' : 'light'], 
                marginBottom: '1.5rem' 
              }}>Opciones de Tema</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '1rem', 
                  padding: '1rem', 
                  background: isDarkTheme ? '#222734' : '#FFFFFF', 
                  borderRadius: '10px', 
                  border: `1px solid ${borderColors[isDarkTheme ? 'dark' : 'light']}` 
                }}>
                  <span style={{ color: textColors[isDarkTheme ? 'dark' : 'light'] }}>Tema actual: </span>
                  <strong style={{ color: textColors[isDarkTheme ? 'dark' : 'light'] }}>{theme === 'light' ? 'Claro' : 'Oscuro'}</strong>
                  <button
                    type="button"
                    style={{ 
                      background: `linear-gradient(135deg, ${primaryColors[isDarkTheme ? 'dark' : 'light']} 0%, ${isDarkTheme ? '#A78BFA' : '#6366F1'} 100%)`, 
                      color: '#fff', 
                      border: 'none', 
                      padding: '0.5rem 1rem', 
                      borderRadius: '8px', 
                      fontSize: '0.9rem', 
                      cursor: 'pointer', 
                      transition: 'all 0.3s ease' 
                    }}
                    onClick={toggleTheme}
                  >
                    Cambiar tema
                  </button>
                </div>
                
                <label style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '0.75rem', 
                  cursor: 'pointer', 
                  color: textColors[isDarkTheme ? 'dark' : 'light'] 
                }}>
                  <input
                    type="checkbox"
                    checked={settings.theme.autoSwitch}
                    onChange={(e) => handleSettingChange('theme', 'autoSwitch', e.target.checked)}
                    style={{ width: '1.2rem', height: '1.2rem', cursor: 'pointer' }}
                  />
                  <span>Cambio automatico de tema</span>
                </label>
                
                {settings.theme.autoSwitch && (
                  <div style={{ 
                    display: 'flex', 
                    gap: '1rem', 
                    padding: '1rem', 
                    background: isDarkTheme ? '#222734' : '#FFFFFF', 
                    borderRadius: '10px', 
                    border: `1px solid ${borderColors[isDarkTheme ? 'dark' : 'light']}` 
                  }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      <label style={{ color: textColors[isDarkTheme ? 'dark' : 'light'], fontSize: '0.9rem' }}>Desde:</label>
                      <input
                        type="time"
                        value={settings.theme.startHour}
                        onChange={(e) => handleSettingChange('theme', 'startHour', e.target.value)}
                        style={{ 
                          padding: '0.5rem', 
                          border: `1px solid ${borderColors[isDarkTheme ? 'dark' : 'light']}`, 
                          borderRadius: '5px', 
                          fontSize: '0.9rem',
                          background: isDarkTheme ? '#171A21' : '#FFFFFF',
                          color: textColors[isDarkTheme ? 'dark' : 'light']
                        }}
                      />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      <label style={{ color: textColors[isDarkTheme ? 'dark' : 'light'], fontSize: '0.9rem' }}>Hasta:</label>
                      <input
                        type="time"
                        value={settings.theme.endHour}
                        onChange={(e) => handleSettingChange('theme', 'endHour', e.target.value)}
                        style={{ 
                          padding: '0.5rem', 
                          border: `1px solid ${borderColors[isDarkTheme ? 'dark' : 'light']}`, 
                          borderRadius: '5px', 
                          fontSize: '0.9rem',
                          background: isDarkTheme ? '#171A21' : '#FFFFFF',
                          color: textColors[isDarkTheme ? 'dark' : 'light']
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div style={{ 
              background: sectionBgColors[isDarkTheme ? 'dark' : 'light'], 
              borderRadius: '15px', 
              padding: '2rem', 
              border: `1px solid ${borderColors[isDarkTheme ? 'dark' : 'light']}`,
              transition: 'all 0.3s ease'
            }}>
              <h2 style={{ 
                fontSize: '1.5rem', 
                fontWeight: 'bold', 
                color: textColors[isDarkTheme ? 'dark' : 'light'], 
                marginBottom: '1.5rem' 
              }}>Configuracion de Cuenta</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <label style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '0.75rem', 
                  cursor: 'pointer', 
                  color: textColors[isDarkTheme ? 'dark' : 'light'] 
                }}>
                  <input
                    type="checkbox"
                    checked={settings.account.emailNotifications}
                    onChange={(e) => handleSettingChange('account', 'emailNotifications', e.target.checked)}
                    style={{ width: '1.2rem', height: '1.2rem', cursor: 'pointer' }}
                  />
                  <span>Notificaciones por email</span>
                </label>
                <label style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '0.75rem', 
                  cursor: 'pointer', 
                  color: textColors[isDarkTheme ? 'dark' : 'light'] 
                }}>
                  <input
                    type="checkbox"
                    checked={settings.account.pushNotifications}
                    onChange={(e) => handleSettingChange('account', 'pushNotifications', e.target.checked)}
                    style={{ width: '1.2rem', height: '1.2rem', cursor: 'pointer' }}
                  />
                  <span>Notificaciones push</span>
                </label>
                <label style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '0.75rem', 
                  cursor: 'pointer', 
                  color: textColors[isDarkTheme ? 'dark' : 'light'] 
                }}>
                  <input
                    type="checkbox"
                    checked={settings.account.weeklyDigest}
                    onChange={(e) => handleSettingChange('account', 'weeklyDigest', e.target.checked)}
                    style={{ width: '1.2rem', height: '1.2rem', cursor: 'pointer' }}
                  />
                  <span>Resumen semanal</span>
                </label>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button 
                type="submit" 
                style={{ 
                  background: `linear-gradient(135deg, ${primaryColors[isDarkTheme ? 'dark' : 'light']} 0%, ${isDarkTheme ? '#A78BFA' : '#6366F1'} 100%)`, 
                  color: '#fff', 
                  border: 'none', 
                  padding: '1rem 2rem', 
                  borderRadius: '10px', 
                  fontSize: '1.1rem', 
                  fontWeight: '600', 
                  cursor: 'pointer', 
                  transition: 'all 0.3s ease', 
                  boxShadow: isDarkTheme 
                    ? '0 4px 15px rgba(91, 140, 255, 0.4)' 
                    : '0 4px 15px rgba(0, 102, 204, 0.4)' 
                }}
                disabled={loading}
              >
                {loading ? 'Guardando...' : 'Guardar Configuracion'}
              </button>
              
              <button 
                type="button"
                style={{ 
                  background: '#6c757d', 
                  color: '#fff', 
                  border: 'none', 
                  padding: '1rem 2rem', 
                  borderRadius: '10px', 
                  fontSize: '1.1rem', 
                  fontWeight: '600', 
                  cursor: 'pointer', 
                  transition: 'all 0.3s ease' 
                }}
                onClick={handleResetSettings}
              >
                Restablecer Valores
              </button>
            </div>

            <div style={{ 
              background: isDarkTheme ? '#2a1f1f' : '#fff5f5', 
              borderRadius: '15px', 
              padding: '2rem', 
              border: isDarkTheme ? '1px solid #8b0000' : '1px solid #fed7d7',
              transition: 'all 0.3s ease'
            }}>
              <h3 style={{ color: '#c33', marginBottom: '1rem' }}>Opciones Peligrosas</h3>
              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                <button 
                  type="button"
                  style={{ 
                    background: '#e74c3c', 
                    color: '#fff', 
                    border: 'none', 
                    padding: '0.75rem 1.5rem', 
                    borderRadius: '8px', 
                    fontSize: '0.9rem', 
                    cursor: 'pointer', 
                    transition: 'all 0.3s ease' 
                  }}
                  onClick={logout}
                >
                  Cerrar Sesion
                </button>
                <button 
                  type="button"
                  style={{ 
                    background: '#e74c3c', 
                    color: '#fff', 
                    border: 'none', 
                    padding: '0.75rem 1.5rem', 
                    borderRadius: '8px', 
                    fontSize: '0.9rem', 
                    cursor: 'pointer', 
                    transition: 'all 0.3s ease' 
                  }}
                  onClick={handleDeleteAccount}
                >
                  Eliminar Cuenta
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}