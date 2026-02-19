/**
 * Constantes de API para el maestro Categorías
 */

const BASE = '/categories'

export const CATEGORIAS_API = {
  /** GET /categories?page=1&limit=10 */
  LIST: (page = 1, limit = 10) => `${BASE}?page=${page}&limit=${limit}`,
  GET: (id) => `${BASE}/${id}`,
  /** POST /categories */
  CREATE: BASE,
  /** PUT /categories/:id */
  UPDATE: (id) => `${BASE}/${id}`,
  /** DELETE /categories/:id */
  DELETE: (id) => `${BASE}/${id}`,
}
