/**
 * Constantes de API para API Keys
 */

const BASE = '/api-keys'

export const API_KEYS_API = {
  /** GET /api-keys?page=1&limit=10 */
  LIST: (page = 1, limit = 10) => `${BASE}?page=${page}&limit=${limit}`,
  /** PUT /api-keys */
  CREATE: BASE,
  /** PUT /api-keys/:id */
  UPDATE: (id) => `${BASE}/${id}`,
  /** POST /api-keys/regenerate (si aplica) */
  REGENERATE: `${BASE}/regenerate`,
}
