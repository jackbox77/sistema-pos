import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff } from 'lucide-react'
import './Auth.css'

const AUTH_IMAGE = 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1200&q=80'

export default function Login() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    navigate('/app')
  }

  return (
    <div className="auth-split">
      <div
        className="auth-split-image"
        style={{ backgroundImage: `url(${AUTH_IMAGE})` }}
        aria-hidden
      />
      <div className="auth-split-form">
        <div className="auth-split-form-inner">
          <h1>Bienvenido</h1>
          <p className="auth-subtitle">Ingresa tus credenciales para continuar</p>
          <form className="auth-form" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="login-email">Correo electrónico</label>
              <div className="auth-field">
                <input
                  id="login-email"
                  type="email"
                  placeholder="correo@ejemplo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                />
              </div>
            </div>
            <div>
              <label htmlFor="login-password">Contraseña</label>
              <div className="auth-field auth-field-has-toggle">
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="auth-password-toggle"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>
            <div style={{ textAlign: 'right', marginTop: '-4px' }}>
              <Link to="/forgot-password" style={{ fontSize: '13px' }}>¿Olvidaste tu contraseña?</Link>
            </div>
            <button type="submit" className="auth-btn">Iniciar sesión</button>
          </form>
          <p className="auth-links">
            ¿No tienes cuenta? <Link to="/registro">Regístrate</Link>
          </p>
          <footer className="auth-footer">
            <p>Al ingresar aceptas nuestros <a href="#terminos">términos y condiciones</a></p>
            <p className="auth-version">V 3.8.0</p>
          </footer>
        </div>
      </div>
    </div>
  )
}
