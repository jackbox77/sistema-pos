/**
 * Constantes de API para egresos (finance/Discharge)
 */

const BASE = '/expenses'

export const EXPENSES_API = {
  /** GET /expenses?shift_id=:id&search=:search&min_amount=:min&max_amount=:max&page=1&limit=10 */
  LIST: (shift_id, page = 1, limit = 10, search, min_amount, max_amount) => {
    let url = `${BASE}?page=${page}&limit=${limit}`
    if (shift_id) url += `&shift_id=${shift_id}`
    if (search) url += `&search=${encodeURIComponent(search)}`
    if (min_amount !== undefined && min_amount !== null) url += `&min_amount=${min_amount}`
    if (max_amount !== undefined && max_amount !== null) url += `&max_amount=${max_amount}`
    return url
  },
  /** POST /expenses - Crear egreso (body: shift_id, amount, concept, reference) */
  CREATE: BASE,
}
