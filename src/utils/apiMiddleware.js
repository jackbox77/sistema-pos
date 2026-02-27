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
 * Devuelve un mensaje de error específico en español según el error de red o del navegador.
 * Así el usuario ve la causa real (sin conexión, timeout, CORS, etc.) en lugar de un mensaje genérico.
 * @param {Error} err
 * @returns {string}
 */
function getSpecificNetworkErrorMessage(err) {
  const msg = (err?.message ?? '').toLowerCase()
  const name = (err?.name ?? '').toLowerCase()

  if (name === 'aborterror' || msg.includes('aborted') || msg.includes('timeout')) {
    return 'La solicitud tardó demasiado. Compruebe su conexión e intente de nuevo.'
  }
  if (
    msg.includes('failed to fetch') ||
    msg.includes('load failed') ||
    msg.includes('networkerror') ||
    msg.includes('network request failed') ||
    msg.includes('err_internet_disconnected') ||
    msg.includes('err_connection_refused') ||
    msg.includes('err_connection_reset') ||
    msg.includes('err_connection_timed_out') ||
    msg.includes('err_name_not_resolved') ||
    msg.includes('err_network_changed')
  ) {
    return 'Sin conexión a internet o el servidor no responde. Compruebe su red e intente de nuevo.'
  }
  if (msg.includes('cors') || msg.includes('cross-origin')) {
    return 'El servidor no permite la conexión desde esta aplicación. Contacte al administrador.'
  }
  if (msg.includes('json') && msg.includes('parse')) {
    return 'La respuesta del servidor no es válida. Intente de nuevo más tarde.'
  }

  return err?.message ? `Error de red: ${err.message}` : 'Error de conexión. Intente de nuevo.'
}

/**
 * Mensaje específico para respuestas HTTP con error (4xx/5xx).
 * Prioriza el mensaje que devuelve la API; si no hay, uno según el código.
 */
function getSpecificHttpErrorMessage(status, data) {
  const serverMsg = data?.message ?? data?.error ?? data?.msg
  if (serverMsg && typeof serverMsg === 'string') return serverMsg

  switch (status) {
    case 400:
      return 'Datos incorrectos. Revise el formulario e intente de nuevo.'
    case 401:
      return 'Sesión expirada o no autorizado. Inicie sesión de nuevo.'
    case 403:
      return 'No tiene permiso para realizar esta acción.'
    case 404:
      return 'Recurso no encontrado.'
    case 409:
      return 'Conflicto: el recurso ya existe o fue modificado.'
    case 422:
      return data?.errors ? `Error de validación: ${JSON.stringify(data.errors)}` : 'Los datos enviados no son válidos.'
    case 405:
      return 'Método no permitido (405). El servidor no acepta esta acción. Intente de nuevo.'
    case 429:
      return 'Demasiadas solicitudes. Espere un momento e intente de nuevo.'
    case 500:
      return 'Error interno del servidor. Intente más tarde.'
    case 502:
    case 503:
      return 'Servicio no disponible. Intente de nuevo en unos minutos.'
    default:
      return `Error del servidor (${status}). Intente de nuevo.`
  }
}

/**
 * Ejecuta fetch y devuelve JSON o lanza error con mensaje específico (red o servidor).
 * @param {string} url
 * @param {RequestInit} init
 * @returns {Promise<any>}
 */
async function doFetch(url, init) {
  let res
  try {
    res = await fetch(url, init)
  } catch (err) {
    const specificMessage = getSpecificNetworkErrorMessage(err)
    const e = new Error(specificMessage)
    e.cause = err
    e.isNetworkError = true
    throw e
  }

  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    const specificMessage = getSpecificHttpErrorMessage(res.status, data)
    const err = new Error(specificMessage)
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
