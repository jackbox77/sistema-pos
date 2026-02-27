/**
 * Constantes de API para el balance del turno (finance/Balance)
 */

const BASE = '/balances'

export const BALANCE_API = {
  /** GET /balances?page=1&limit=10 - Listar balances por turno */
  LIST: (page = 1, limit = 10) => `${BASE}?page=${page}&limit=${limit}`,
  /** GET /balances/:id_shift - Balance del turno */
  GET: (id_shift) => `${BASE}/${id_shift}`,
}
