/**
 * Constantes de API para el maestro Proveedores
 */

const BASE = '/suppliers'

export const PROVEEDORES_API = {
  /** GET /suppliers?page=1&limit=10 */
  LIST: (page = 1, limit = 10) => `${BASE}?page=${page}&limit=${limit}`,
  GET: (id) => `${BASE}/${id}`,
  /** POST /suppliers */
  CREATE: BASE,
  /** PUT /suppliers/:id */
  UPDATE: (id) => `${BASE}/${id}`,
  /** DELETE /suppliers/:id */
  DELETE: (id) => `${BASE}/${id}`,
}
