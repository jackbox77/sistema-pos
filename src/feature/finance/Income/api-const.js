/**
 * Constantes de API para ingresos (finance/Income)
 */

const BASE = '/incomes'

export const INCOMES_API = {
  /** GET /incomes?shift_id=:id&page=1&limit=10 - Listar ingresos por turno */
  LIST: (shift_id, page = 1, limit = 10) => `${BASE}?shift_id=${shift_id}&page=${page}&limit=${limit}`,
  /** POST /incomes - Crear ingreso (body: shift_id, amount, concept, reference) */
  CREATE: BASE,
}
