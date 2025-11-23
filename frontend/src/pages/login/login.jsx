import React from 'react';
import { Link } from 'react-router-dom';
import { Undo2 } from 'lucide-react';
import './login.css';

const Login = ({ 
  handleSubmit, 
  email, 
  setEmail, 
  password, 
  setPassword, 
  error, 
  loading 
}) => {
  return (
    <div className="login-page">
      <div className="login-container">
        
        <Link to="/">
          <p className="return-buton">Inicio <Undo2 /></p>
        </Link>

        <h2 className="login-title">Iniciar Sesión</h2>

        {error && (
          <div className="error-message">
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="email" className="form-label">
              Correo Electrónico
            </label>
            <input
              type="email"
              id="email"
              className="form-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="ejemplo@correo.com"
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label">
              Contraseña
            </label>
            <input
              type="password"
              id="password"
              className="form-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Ingresa tu contraseña"
              required
              disabled={loading}
            />
          </div>

          <button 
            type="submit" 
            className={`login-button ${loading ? 'loading' : ''}`}
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner"></span>
                Iniciando Sesión...
              </>
            ) : (
              'Iniciar Sesión'
            )}
          </button>
        </form>

        <div className="login-footer">
          <p>
            ¿No tienes una cuenta?{' '}
            <Link to="/sign-up" className="register-link">
              Regístrate aquí
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;