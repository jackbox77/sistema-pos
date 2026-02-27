/**
 * Constantes de API para ventas (finance/Sales)
 */

const BASE = '/sales'

export const SALES_API = {
  /** GET /sales?shift_id=:id&page=1&limit=10 - Listar ventas por turno */
  LIST: (shift_id, page = 1, limit = 10) => `${BASE}?shift_id=${shift_id}&page=${page}&limit=${limit}`,
}
