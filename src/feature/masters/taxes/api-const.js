/**
 * Constantes de API para el maestro Impuestos
 */

const BASE = '/taxes'

export const IMPUESTOS_API = {
  /** GET /taxes?page=1&limit=10 */
  LIST: (page = 1, limit = 10) => `${BASE}?page=${page}&limit=${limit}`,
  GET: (id) => `${BASE}/${id}`,
  /** POST /taxes */
  CREATE: BASE,
  /** PUT /taxes/:id */
  UPDATE: (id) => `${BASE}/${id}`,
  /** DELETE /taxes/:id */
  DELETE: (id) => `${BASE}/${id}`,
}
