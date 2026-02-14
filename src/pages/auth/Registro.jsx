import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff } from 'lucide-react'
import './Auth.css'

const AUTH_IMAGE = 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1200&q=80'

export default function Registro() {
  const navigate = useNavigate()
  const [nombre, setNombre] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmarPassword, setConfirmarPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (password !== confirmarPassword) return
    navigate('/')
  }

  const passwordsMatch = !confirmarPassword || password === confirmarPassword

  return (
    <div className="auth-split">
      <div
        className="auth-split-image"
        style={{ backgroundImage: `url(${AUTH_IMAGE})` }}
        aria-hidden
      />
      <div className="auth-split-form">
        <div className="auth-split-form-inner">
          <h1>Crear cuenta</h1>
          <p className="auth-subtitle">Completa el formulario para registrarte en el sistema</p>
          <form className="auth-form" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="reg-nombre">Nombre completo</label>
              <div className="auth-field">
                <input id="reg-nombre" type="text" placeholder="Tu nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} required autoComplete="name" />
              </div>
            </div>
            <div>
              <label htmlFor="reg-email">Correo electrónico</label>
              <div className="auth-field">
                <input id="reg-email" type="email" placeholder="correo@ejemplo.com" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="email" />
              </div>
            </div>
            <div>
              <label htmlFor="reg-password">Contraseña</label>
              <div className="auth-field auth-field-has-toggle">
                <input
                  id="reg-password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Mínimo 6 caracteres"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  autoComplete="new-password"
                />
                <button type="button" className="auth-password-toggle" onClick={() => setShowPassword((v) => !v)} aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'} tabIndex={-1}>
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>
            <div>
              <label htmlFor="reg-confirm">Confirmar contraseña</label>
              <div className="auth-field auth-field-has-toggle">
                <input
                  id="reg-confirm"
                  type={showConfirm ? 'text' : 'password'}
                  placeholder="Repite tu contraseña"
                  value={confirmarPassword}
                  onChange={(e) => setConfirmarPassword(e.target.value)}
                  required
                  minLength={6}
                  autoComplete="new-password"
                  className={confirmarPassword && !passwordsMatch ? 'invalid' : ''}
                />
                <button type="button" className="auth-password-toggle" onClick={() => setShowConfirm((v) => !v)} aria-label={showConfirm ? 'Ocultar contraseña' : 'Mostrar contraseña'} tabIndex={-1}>
                  {showConfirm ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {confirmarPassword && !passwordsMatch && <p className="auth-field-error">Las contraseñas no coinciden</p>}
            </div>
            <button type="submit" className="auth-btn" disabled={!passwordsMatch || !confirmarPassword}>
              Registrarme
            </button>
          </form>
          <p className="auth-links">
            ¿Ya tienes cuenta? <Link to="/">Iniciar sesión</Link>
          </p>
          <footer className="auth-footer">
            <p>Al registrarte aceptas nuestros <a href="#terminos">términos y condiciones</a></p>
            <p className="auth-version">V 3.8.0</p>
          </footer>
        </div>
      </div>
    </div>
  )
}
