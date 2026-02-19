/**
 * Constantes de API para el módulo de autenticación
 */

const AUTH_BASE = '/auth'

export const AUTH_API = {
  LOGIN: `${AUTH_BASE}/login`,
  REGISTER: `${AUTH_BASE}/register`,
  LOGOUT: `${AUTH_BASE}/logout`,
  REFRESH: `${AUTH_BASE}/refresh`,
  FORGOT_PASSWORD: `${AUTH_BASE}/forgot-password`,
  RESET_PASSWORD: `${AUTH_BASE}/reset-password`,
  ME: `${AUTH_BASE}/me`,
}
