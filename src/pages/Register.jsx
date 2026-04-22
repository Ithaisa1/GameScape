import { useState } from 'react';
import { useAuthContext } from '../hooks/useAuthContext';
import { useNavigate, Link } from 'react-router-dom';
import '../styles/Login.css'; // Reutilizamos los mismos estilos
 
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
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="login__input"
                required
                placeholder="Mínimo 6 caracteres"
              />
            </div>
 
            <div className="login__form-group">
              <label htmlFor="confirmPassword" className="login__label">Confirmar Contraseña</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="login__input"
                required
                placeholder="Repite tu contraseña"
              />
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