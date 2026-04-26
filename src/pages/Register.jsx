import { useState } from 'react';
import { useAuthContext } from '../hooks/useAuthContext';
import { useNavigate, Link } from 'react-router-dom';
// CSS eliminado - Register.jsx usa estilos inline o de componentes

/**
 * @component Register
 * @description Página de registro que permite a nuevos usuarios crear una cuenta con nombre, nick,
 *              email y contraseña. Valida que las contraseñas coincidan y tengan mínimo 6 caracteres.
 *              Realiza auto-login después de un registro exitoso.
 *
 * Estado interno:
 * - formData: Objeto con datos del formulario (name, nick, email, password, confirmPassword)
 * - error: String con mensaje de error o vacío
 * - loading: Boolean que indica si se está procesando el registro
 * - showPassword/showConfirmPassword: Booleans para mostrar/ocultar contraseñas
 *
 * @returns {JSX.Element} Formulario de registro con validaciones
 */
export default function Register() {
  const [formData, setFormData] = useState({
    name: '',
    nick: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const { register } = useAuthContext();
  const navigate = useNavigate();
 
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };
 
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
 
    // Validaciones
    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }
 
    if (formData.password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }
 
    setLoading(true);
 
    try {
      const result = await register({
        name: formData.name,
        nick: formData.nick,
        email: formData.email,
        password: formData.password
      });
 
      if (result.success) {
        navigate('/');
      } else {
        setError(result.error || 'Error en el registro');
      }
    } catch (err) {
      setError('Error de conexión');
    } finally {
      setLoading(false);
    }
  };
 
  return (
    <div className="login">
      <div className="login__container">
        <div className="login__card">
          <h1 className="login__title">GameScape</h1>
          <p className="login__subtitle">Crea tu cuenta para empezar</p>
          
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
                placeholder="Tu nombre completo"
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
                placeholder="Tu nick único"
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
                placeholder="tu@email.com"
              />
            </div>
 
            <div className="login__form-group">
              <label htmlFor="password" className="login__label">Contraseña</label>
              <div className="login__password-wrapper">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="login__input login__input--with-icon"
                  required
                  placeholder="Mínimo 6 caracteres"
                />
                <button
                  type="button"
                  className="login__password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                >
                  {showPassword ? "🙈" : "👁️"}
                </button>
              </div>
            </div>
 
            <div className="login__form-group">
              <label htmlFor="confirmPassword" className="login__label">Confirmar Contraseña</label>
              <div className="login__password-wrapper">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="login__input login__input--with-icon"
                  required
                  placeholder="Repite tu contraseña"
                />
                <button
                  type="button"
                  className="login__password-toggle"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  aria-label={showConfirmPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                >
                  {showConfirmPassword ? "🙈" : "👁️"}
                </button>
              </div>
            </div>
 
            {error && <div className="login__error">{error}</div>}
 
            <button 
              type="submit" 
              className="login__button"
              disabled={loading}
            >
              {loading ? 'Creando cuenta...' : 'Crear Cuenta'}
            </button>
          </form>
 
          <div className="login__footer">
            <p>¿Ya tienes cuenta? <Link to="/login" className="login__link">Inicia Sesión</Link></p>
          </div>
        </div>
      </div>
    </div>
  );
}