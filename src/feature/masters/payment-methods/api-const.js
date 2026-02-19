/**
 * Constantes de API para el maestro Métodos de pago
 */

const BASE = '/payment-methods'

export const METODOS_PAGO_API = {
  /** GET /payment-methods */
  LIST: BASE,
  /** GET /payment-methods/:id */
  GET: (id) => `${BASE}/${id}`,
  /** POST /payment-methods */
  CREATE: BASE,
  /** PUT /payment-methods/:id */
  UPDATE: (id) => `${BASE}/${id}`,
  /** DELETE /payment-methods/:id */
  DELETE: (id) => `${BASE}/${id}`,
}
