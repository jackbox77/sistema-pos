/**
 * Constantes de API para el maestro Clientes fidelizados
 */

const BASE = '/loyal-customers'

export const CLIENTES_FIDELIZADOS_API = {
  /** GET /loyal-customers?page=1&limit=10 */
  LIST: (page = 1, limit = 10) => `${BASE}?page=${page}&limit=${limit}`,
  GET: (id) => `${BASE}/${id}`,
  /** POST /loyal-customers */
  CREATE: BASE,
  /** PUT /loyal-customers/:id */
  UPDATE: (id) => `${BASE}/${id}`,
  /** DELETE /loyal-customers/:id */
  DELETE: (id) => `${BASE}/${id}`,
}
