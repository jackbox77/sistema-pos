/**
 * Middleware para consumir APIs: uno sin token (público) y otro con token (autenticado).
 * Reutilizables en todos los servicios.
 */

/** URL base del API (se puede sobreescribir con VITE_API_URL en .env) */
export const API_BASE_URL = 'https://apipos.apptrialhub.com/'

const BASE_URL =
  typeof import.meta !== 'undefined' && import.meta.env?.VITE_API_URL
    ? import.meta.env.VITE_API_URL
    : typeof import.meta !== 'undefined' && import.meta.env?.DEV
      ? '/api'
      : API_BASE_URL

const DEFAULT_HEADERS = {
  'Content-Type': 'application/json',
  Accept: 'application/json',
}

/**
 * Obtiene el token de acceso (localStorage por defecto).
 * @param {string} [storageKey='token'] - Clave donde se guarda el token
 * @returns {string|null}
 */
function getStoredToken(storageKey = 'token') {
  try {
    return localStorage.getItem(storageKey)
  } catch {
    return null
  }
}

/**
 * Construye la URL completa y los headers por defecto.
 * @param {string} path - Ruta relativa (ej: '/auth/login')
 * @param {RequestInit} [options]
 * @returns {{ url: string, init: RequestInit }}
 */
function buildRequest(path, options = {}) {
  const url = path.startsWith('http') ? path : `${BASE_URL.replace(/\/$/, '')}${path.startsWith('/') ? path : `/${path}`}`
  const headers = { ...DEFAULT_HEADERS, ...(options.headers || {}) }
  return { url, init: { ...options, headers } }
}

/**
 * Normaliza body: si es objeto plano y Content-Type es JSON, stringifica.
 */
function normalizeBody(init) {
  if (!init.body) return
  if (typeof init.body === 'string') return
  if (init.body instanceof FormData) {
    const { 'Content-Type': _, ...rest } = init.headers
    init.headers = rest
    return
  }
  if (typeof init.body === 'object' && init.headers['Content-Type'] === 'application/json') {
    init.body = JSON.stringify(init.body)
  }
}

/**
 * Ejecuta fetch y devuelve JSON o lanza error con mensaje del servidor.
 * @param {string} url
 * @param {RequestInit} init
 * @returns {Promise<any>}
 */
async function doFetch(url, init) {
  const res = await fetch(url, init)
  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    const err = new Error(data?.message || data?.error || `Error ${res.status}`)
    err.status = res.status
    err.data = data
    throw err
  }
  return data
}

/**
 * Cliente para consumir APIs SIN token (login, registro, endpoints públicos).
 * @param {string} path - Ruta (ej: '/auth/login')
 * @param {RequestInit} [options] - method, body, headers, etc.
 * @returns {Promise<any>}
 *
 * @example
 * import { apiWithoutToken } from '@/utils/apiMiddleware'
 * const data = await apiWithoutToken('/auth/login', { method: 'POST', body: { email, password } })
 */
export async function apiWithoutToken(path, options = {}) {
  const { url, init } = buildRequest(path, options)
  normalizeBody(init)
  return doFetch(url, init)
}

/**
 * Cliente para consumir APIs CON token (Authorization: Bearer).
 * Añade el token desde localStorage (clave por defecto: 'token').
 * @param {string} path - Ruta (ej: '/users/me')
 * @param {RequestInit} [options]
 * @param {string} [tokenKey='token'] - Clave en localStorage del token
 * @returns {Promise<any>}
 *
 * @example
 * import { apiWithToken } from '@/utils/apiMiddleware'
 * const user = await apiWithToken('/auth/me')
 * await apiWithToken('/pedidos', { method: 'POST', body: pedido })
 */
export async function apiWithToken(path, options = {}, tokenKey = 'token') {
  const token = getStoredToken(tokenKey)
  const headers = { ...(options.headers || {}) }
  if (token) headers.Authorization = `Bearer ${token}`

  const { url, init } = buildRequest(path, { ...options, headers })
  normalizeBody(init)
  return doFetch(url, init)
}

/**
 * Helpers por método (opcional) para no repetir method en cada llamada.
 */
export const requestWithoutToken = {
  get: (path, options = {}) => apiWithoutToken(path, { ...options, method: 'GET' }),
  post: (path, body, options = {}) => apiWithoutToken(path, { ...options, method: 'POST', body: body != null ? JSON.stringify(body) : undefined }),
  put: (path, body, options = {}) => apiWithoutToken(path, { ...options, method: 'PUT', body: body != null ? JSON.stringify(body) : undefined }),
  patch: (path, body, options = {}) => apiWithoutToken(path, { ...options, method: 'PATCH', body: body != null ? JSON.stringify(body) : undefined }),
  delete: (path, options = {}) => apiWithoutToken(path, { ...options, method: 'DELETE' }),
}

export const requestWithToken = {
  get: (path, options = {}, tokenKey = 'token') => apiWithToken(path, { ...options, method: 'GET' }, tokenKey),
  post: (path, body, options = {}, tokenKey = 'token') => apiWithToken(path, { ...options, method: 'POST', body: body != null ? JSON.stringify(body) : undefined }, tokenKey),
  put: (path, body, options = {}, tokenKey = 'token') => apiWithToken(path, { ...options, method: 'PUT', body: body != null ? JSON.stringify(body) : undefined }, tokenKey),
  patch: (path, body, options = {}, tokenKey = 'token') => apiWithToken(path, { ...options, method: 'PATCH', body: body != null ? JSON.stringify(body) : undefined }, tokenKey),
  delete: (path, options = {}, tokenKey = 'token') => apiWithToken(path, { ...options, method: 'DELETE' }, tokenKey),
}
