import { useState } from 'react'
import { Link } from 'react-router-dom'
import './Auth.css'

const AUTH_IMAGE = 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1200&q=80'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [enviado, setEnviado] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    setEnviado(true)
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
          <h1>Recuperar contraseña</h1>
          <p className="auth-subtitle">
            {enviado
              ? 'Revisa tu correo. Te enviamos un enlace para restablecer tu contraseña.'
              : 'Ingresa tu correo y te enviaremos un enlace para restablecer tu contraseña.'}
          </p>
          {!enviado ? (
            <form className="auth-form" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="forgot-email">Correo electrónico</label>
                <div className="auth-field">
                  <input
                    id="forgot-email"
                    type="email"
                    placeholder="correo@ejemplo.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoComplete="email"
                  />
                </div>
              </div>
              <button type="submit" className="auth-btn">Enviar enlace</button>
            </form>
          ) : null}
          <p className="auth-links">
            <Link to="/">Volver a iniciar sesión</Link>
          </p>
          <footer className="auth-footer">
            <p>Al usar el servicio aceptas nuestros <a href="#terminos">términos y condiciones</a></p>
            <p className="auth-version">V 3.8.0</p>
          </footer>
        </div>
      </div>
    </div>
  )
}
