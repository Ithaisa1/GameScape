import { useState } from 'react';
import { useAuthContext } from '../hooks/useAuthContext';
import { useNavigate, Link } from 'react-router-dom';
import '../styles/Login.css';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { login } = useAuthContext();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await login(email, password);
      if (result.success) {
        navigate('/');
      } else {
        setError(result.error || 'Error en el login');
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
          <p className="login__subtitle">Inicia sesión para continuar</p>
          
          <form onSubmit={handleSubmit} className="login__form">
            <div className="login__form-group">
              <label htmlFor="email" className="login__label">Email</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="login__input login__input--with-icon"
                  required
                  placeholder="••••••••"
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

            {error && <div className="login__error">{error}</div>}

            <button 
              type="submit" 
              className="login__button"
              disabled={loading}
            >
              {loading ? 'Cargando...' : 'Iniciar Sesión'}
            </button>
          </form>

          <div className="login__footer">
            <p>¿No tienes cuenta? <Link to="/register" className="login__link">Regístrate</Link></p>
          </div>
        </div>
      </div>
    </div>
  );
}