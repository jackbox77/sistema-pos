/**
 * Constantes de API para el maestro Productos
 */

const BASE = '/products'

export const PRODUCTOS_API = {
  /** GET /products?page=1&limit=10 */
  LIST: (page = 1, limit = 10) => `${BASE}?page=${page}&limit=${limit}`,
  GET: (id) => `${BASE}/${id}`,
  /** POST /products */
  CREATE: BASE,
  /** PUT /products/:id */
  UPDATE: (id) => `${BASE}/${id}`,
  /** DELETE /products/:id */
  DELETE: (id) => `${BASE}/${id}`,
}
