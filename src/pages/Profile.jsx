import { useState } from 'react';
import { useAuthContext } from '../hooks/useAuthContext';
import { useNavigate } from 'react-router-dom';
import '../styles/Login.css'; // Reutilizamos estilos

export default function Profile() {
  const { user, updateProfile, logout, deleteAccount } = useAuthContext();
  const navigate = useNavigate();
  
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

  return (
    <div className="login">
      <div className="login__container">
        <div className="login__card">
          <h1 className="login__title">Mi Perfil</h1>
          <p className="login__subtitle">Gestiona tu información personal</p>
          
          <form onSubmit={handleSubmit} className="login__form">
            <div className="login__form-group">
              <label htmlFor="name" className="login__label">Nombre Completo</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="login__input"
                required
              />
            </div>

            <div className="login__form-group">
              <label htmlFor="nick" className="login__label">Nick/Apodo</label>
              <input
                type="text"
                id="nick"
                name="nick"
                value={formData.nick}
                onChange={handleChange}
                className="login__input"
                required
              />
            </div>

            <div className="login__form-group">
              <label htmlFor="email" className="login__label">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="login__input"
                required
              />
            </div>

            <div className="login__form-group">
              <label htmlFor="newPassword" className="login__label">Nueva Contraseña (opcional)</label>
              <div className="login__password-wrapper">
                <input
                  type={showPasswords.new ? 'text' : 'password'}
                  id="newPassword"
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleChange}
                  className="login__input"
                  placeholder="Dejar en blanco para no cambiar"
                />
                <button
                  type="button"
                  className="login__password-toggle"
                  onClick={() => togglePasswordVisibility('new')}
                >
                  {showPasswords.new ? '👁️' : '👁️‍🗨️'}
                </button>
              </div>
            </div>

            <div className="login__form-group">
              <label htmlFor="confirmPassword" className="login__label">Confirmar Nueva Contraseña</label>
              <div className="login__password-wrapper">
                <input
                  type={showPasswords.confirm ? 'text' : 'password'}
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="login__input"
                  placeholder="Repite tu nueva contraseña"
                />
                <button
                  type="button"
                  className="login__password-toggle"
                  onClick={() => togglePasswordVisibility('confirm')}
                >
                  {showPasswords.confirm ? '👁️' : '👁️‍🗨️'}
                </button>
              </div>
            </div>

            {error && <div className="login__error">{error}</div>}
            {success && <div className="login__success">{success}</div>}

            <button 
              type="submit" 
              className="login__button"
              disabled={loading}
            >
              {loading ? 'Actualizando...' : 'Actualizar Perfil'}
            </button>
          </form>

          <div className="login__footer">
            <button 
              className="login__danger-btn"
              onClick={() => setShowDeleteConfirm(true)}
            >
              Eliminar Cuenta
            </button>
          </div>

          {showDeleteConfirm && (
            <div className="login__confirm-modal">
              <div className="login__confirm-content">
                <h3>¿Estás seguro?</h3>
                <p>Eliminar tu cuenta borrará permanentemente:</p>
                <ul>
                  <li>Tu perfil y datos personales</li>
                  <li>Tu lista de favoritos</li>
                  <li>Tu historial de búsquedas</li>
                </ul>
                <p>Esta acción no se puede deshacer.</p>
                <div className="login__confirm-buttons">
                  <button 
                    className="login__cancel-btn"
                    onClick={() => setShowDeleteConfirm(false)}
                  >
                    Cancelar
                  </button>
                  <button 
                    className="login__danger-btn"
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