/**
 * Constantes de API para egresos (finance/Discharge)
 */

const BASE = '/expenses'

export const EXPENSES_API = {
  /** GET /expenses?shift_id=:id&page=1&limit=10 - Listar egresos por turno */
  LIST: (shift_id, page = 1, limit = 10) => `${BASE}?shift_id=${shift_id}&page=${page}&limit=${limit}`,
  /** POST /expenses - Crear egreso (body: shift_id, amount, concept, reference) */
  CREATE: BASE,
}
