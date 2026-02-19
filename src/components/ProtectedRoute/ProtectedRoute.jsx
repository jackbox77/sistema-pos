import { Navigate, useLocation } from 'react-router-dom'

const TOKEN_STORAGE_KEY = 'token'

/**
 * Protege rutas: si no hay token en localStorage, redirige a login.
 * Usa la misma clave 'token' que apiMiddleware y Login.
 */
export default function ProtectedRoute({ children }) {
  const location = useLocation()
  const token = typeof localStorage !== 'undefined' ? localStorage.getItem(TOKEN_STORAGE_KEY) : null

  if (!token) {
    return <Navigate to="/" state={{ from: location }} replace />
  }

  return children
}
