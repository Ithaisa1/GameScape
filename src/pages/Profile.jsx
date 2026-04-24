import { useState, useEffect } from 'react';
import { useAuthContext } from '../hooks/useAuthContext';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeProvider';
// CSS eliminado - Profile.jsx usa estilos inline o de componentes

export default function Profile() {
  const { user, updateProfile, logout, deleteAccount } = useAuthContext();
  const navigate = useNavigate();
  const { theme } = useTheme();
  
  const [formData, setFormData] = useState({
    name: user?.name || '',
    nick: user?.nick || '',
    email: user?.email || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });
  
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validaciones
    if (formData.newPassword && formData.newPassword !== formData.confirmPassword) {
      setError('Las contraseñas nuevas no coinciden');
      return;
    }

    if (formData.newPassword && formData.newPassword.length < 6) {
      setError('La nueva contraseña debe tener al menos 6 caracteres');
      return;
    }

    setLoading(true);

    try {
      const updates = {
        name: formData.name,
        nick: formData.nick,
        email: formData.email
      };

      // Solo actualizar contraseña si se proporciona
      if (formData.newPassword) {
        updates.password = formData.newPassword;
      }

      const result = await updateProfile(updates);

      if (result.success) {
        setSuccess('Perfil actualizado correctamente');
        // Limpiar campos de contraseña
        setFormData(prev => ({
          ...prev,
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        }));
      } else {
        setError(result.error || 'Error al actualizar perfil');
      }
    } catch (err) {
      setError('Error de conexión');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    setLoading(true);
    
    try {
      const result = await deleteAccount();
      
      if (result.success) {
        // Cuenta eliminada exitosamente, redirigir al home
        navigate('/');
      } else {
        setError(result.error || 'Error al eliminar cuenta');
      }
    } catch (err) {
      setError('Error al eliminar cuenta');
    } finally {
      setLoading(false);
      setShowDeleteConfirm(false);
    }
  };

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
  const inputBgColors = {
    dark: '#171A21',
    light: '#FFFFFF'
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
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      padding: '2rem',
      transition: 'all 0.3s ease'
    }}>
      <div style={{ width: '100%', maxWidth: '500px' }}>
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
          }}>Mi Perfil</h1>
          <p style={{ 
            color: secondaryTextColors[isDarkTheme ? 'dark' : 'light'], 
            marginBottom: '2rem', 
            textAlign: 'center' 
          }}>Gestiona tu información personal</p>
          
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div>
              <label htmlFor="name" style={{ 
                display: 'block', 
                marginBottom: '0.5rem', 
                color: textColors[isDarkTheme ? 'dark' : 'light'], 
                fontWeight: '500' 
              }}>Nombre Completo</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                style={{ 
                  width: '100%', 
                  padding: '1rem', 
                  border: `2px solid ${borderColors[isDarkTheme ? 'dark' : 'light']}`, 
                  borderRadius: '10px', 
                  fontSize: '1rem', 
                  transition: 'all 0.3s ease', 
                  background: inputBgColors[isDarkTheme ? 'dark' : 'light'],
                  color: textColors[isDarkTheme ? 'dark' : 'light']
                }}
                required
              />
            </div>

            <div>
              <label htmlFor="nick" style={{ 
                display: 'block', 
                marginBottom: '0.5rem', 
                color: textColors[isDarkTheme ? 'dark' : 'light'], 
                fontWeight: '500' 
              }}>Nick/Apodo</label>
              <input
                type="text"
                id="nick"
                name="nick"
                value={formData.nick}
                onChange={handleChange}
                style={{ 
                  width: '100%', 
                  padding: '1rem', 
                  border: `2px solid ${borderColors[isDarkTheme ? 'dark' : 'light']}`, 
                  borderRadius: '10px', 
                  fontSize: '1rem', 
                  transition: 'all 0.3s ease', 
                  background: inputBgColors[isDarkTheme ? 'dark' : 'light'],
                  color: textColors[isDarkTheme ? 'dark' : 'light']
                }}
                required
              />
            </div>

            <div>
              <label htmlFor="email" style={{ 
                display: 'block', 
                marginBottom: '0.5rem', 
                color: textColors[isDarkTheme ? 'dark' : 'light'], 
                fontWeight: '500' 
              }}>Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                style={{ 
                  width: '100%', 
                  padding: '1rem', 
                  border: `2px solid ${borderColors[isDarkTheme ? 'dark' : 'light']}`, 
                  borderRadius: '10px', 
                  fontSize: '1rem', 
                  transition: 'all 0.3s ease', 
                  background: inputBgColors[isDarkTheme ? 'dark' : 'light'],
                  color: textColors[isDarkTheme ? 'dark' : 'light']
                }}
                required
              />
            </div>

            <div>
              <label htmlFor="currentPassword" style={{ 
                display: 'block', 
                marginBottom: '0.5rem', 
                color: textColors[isDarkTheme ? 'dark' : 'light'], 
                fontWeight: '500' 
              }}>Contraseña Actual (requerida para cambiar contraseña)</label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPasswords.current ? 'text' : 'password'}
                  id="currentPassword"
                  name="currentPassword"
                  value={formData.currentPassword}
                  onChange={handleChange}
                  style={{ 
                    width: '100%', 
                    padding: '1rem', 
                    paddingRight: '3rem', 
                    border: `2px solid ${borderColors[isDarkTheme ? 'dark' : 'light']}`, 
                    borderRadius: '10px', 
                    fontSize: '1rem', 
                    transition: 'all 0.3s ease', 
                    background: inputBgColors[isDarkTheme ? 'dark' : 'light'],
                    color: textColors[isDarkTheme ? 'dark' : 'light']
                  }}
                  placeholder="Ingresa tu contraseña actual"
                />
                <button
                  type="button"
                  style={{ 
                    position: 'absolute', 
                    right: '1rem', 
                    top: '50%', 
                    transform: 'translateY(-50%)', 
                    background: 'none', 
                    border: 'none', 
                    fontSize: '1.2rem', 
                    cursor: 'pointer',
                    color: secondaryTextColors[isDarkTheme ? 'dark' : 'light']
                  }}
                  onClick={() => togglePasswordVisibility('current')}
                  aria-label={showPasswords.current ? "Ocultar contraseña" : "Mostrar contraseña"}
                >
                  {showPasswords.current ? "🙈" : "👁️"}
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="newPassword" style={{ 
                display: 'block', 
                marginBottom: '0.5rem', 
                color: textColors[isDarkTheme ? 'dark' : 'light'], 
                fontWeight: '500' 
              }}>Nueva Contraseña (opcional)</label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPasswords.new ? 'text' : 'password'}
                  id="newPassword"
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleChange}
                  style={{ 
                    width: '100%', 
                    padding: '1rem', 
                    paddingRight: '3rem', 
                    border: `2px solid ${borderColors[isDarkTheme ? 'dark' : 'light']}`, 
                    borderRadius: '10px', 
                    fontSize: '1rem', 
                    transition: 'all 0.3s ease', 
                    background: inputBgColors[isDarkTheme ? 'dark' : 'light'],
                    color: textColors[isDarkTheme ? 'dark' : 'light']
                  }}
                  placeholder="Dejar en blanco para no cambiar"
                />
                <button
                  type="button"
                  style={{ 
                    position: 'absolute', 
                    right: '1rem', 
                    top: '50%', 
                    transform: 'translateY(-50%)', 
                    background: 'none', 
                    border: 'none', 
                    fontSize: '1.2rem', 
                    cursor: 'pointer',
                    color: secondaryTextColors[isDarkTheme ? 'dark' : 'light']
                  }}
                  onClick={() => togglePasswordVisibility('new')}
                >
                  {showPasswords.new ? '👁️' : '👁️‍🗨️'}
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="confirmPassword" style={{ 
                display: 'block', 
                marginBottom: '0.5rem', 
                color: textColors[isDarkTheme ? 'dark' : 'light'], 
                fontWeight: '500' 
              }}>Confirmar Nueva Contraseña</label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPasswords.confirm ? 'text' : 'password'}
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  style={{ 
                    width: '100%', 
                    padding: '1rem', 
                    paddingRight: '3rem', 
                    border: `2px solid ${borderColors[isDarkTheme ? 'dark' : 'light']}`, 
                    borderRadius: '10px', 
                    fontSize: '1rem', 
                    transition: 'all 0.3s ease', 
                    background: inputBgColors[isDarkTheme ? 'dark' : 'light'],
                    color: textColors[isDarkTheme ? 'dark' : 'light']
                  }}
                  placeholder="Repite tu nueva contraseña"
                />
                <button
                  type="button"
                  style={{ 
                    position: 'absolute', 
                    right: '1rem', 
                    top: '50%', 
                    transform: 'translateY(-50%)', 
                    background: 'none', 
                    border: 'none', 
                    fontSize: '1.2rem', 
                    cursor: 'pointer',
                    color: secondaryTextColors[isDarkTheme ? 'dark' : 'light']
                  }}
                  onClick={() => togglePasswordVisibility('confirm')}
                >
                  {showPasswords.confirm ? '👁️' : '👁️‍🗨️'}
                </button>
              </div>
            </div>

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
              {loading ? 'Actualizando...' : 'Actualizar Perfil'}
            </button>
          </form>

          <div style={{ marginTop: '2rem', textAlign: 'center' }}>
            <button 
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
              onClick={() => setShowDeleteConfirm(true)}
            >
              Eliminar Cuenta
            </button>
          </div>

          {showDeleteConfirm && (
            <div style={{ position: 'fixed', top: '0', left: '0', right: '0', bottom: '0', background: 'rgba(0, 0, 0, 0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: '1000' }}>
              <div style={{ 
                background: cardColors[isDarkTheme ? 'dark' : 'light'], 
                borderRadius: '15px', 
                padding: '2rem', 
                maxWidth: '500px', 
                width: '90%', 
                maxHeight: '80vh', 
                overflowY: 'auto',
                border: isDarkTheme ? '1px solid #2A2F3A' : '1px solid #DEE2E6'
              }}>
                <h3 style={{ color: textColors[isDarkTheme ? 'dark' : 'light'], marginBottom: '1rem' }}>¿Estás seguro?</h3>
                <p style={{ color: secondaryTextColors[isDarkTheme ? 'dark' : 'light'], marginBottom: '1rem' }}>Eliminar tu cuenta borrará permanentemente:</p>
                <ul style={{ color: secondaryTextColors[isDarkTheme ? 'dark' : 'light'], marginBottom: '1rem', paddingLeft: '1.5rem' }}>
                  <li>Tu perfil y datos personales</li>
                  <li>Tu lista de favoritos</li>
                  <li>Tu historial de búsquedas</li>
                </ul>
                <p style={{ color: secondaryTextColors[isDarkTheme ? 'dark' : 'light'], marginBottom: '1.5rem' }}>Esta acción no se puede deshacer.</p>
                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                  <button 
                    style={{ 
                      background: '#6c757d', 
                      color: '#fff', 
                      border: 'none', 
                      padding: '0.75rem 1.5rem', 
                      borderRadius: '8px', 
                      fontSize: '0.9rem', 
                      cursor: 'pointer', 
                      transition: 'all 0.3s ease' 
                    }}
                    onClick={() => setShowDeleteConfirm(false)}
                  >
                    Cancelar
                  </button>
                  <button 
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
                    disabled={loading}
                  >
                    {loading ? 'Eliminando...' : 'Eliminar Cuenta'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}