/**
 * Constantes de API para ventas (finance/Sales)
 */

const BASE = '/sales'

export const SALES_API = {
  /** GET /sales?shift_id=:id&loyal_customer_id=:id&search=:search&min_total=:min&max_total=:max&page=1&limit=10 */
  LIST: (shift_id, page = 1, limit = 10, loyal_customer_id, search, min_total, max_total) => {
    let url = `${BASE}?page=${page}&limit=${limit}`
    if (shift_id) url += `&shift_id=${shift_id}`
    if (loyal_customer_id) url += `&loyal_customer_id=${encodeURIComponent(loyal_customer_id)}`
    if (search) url += `&search=${encodeURIComponent(search)}`
    if (min_total !== undefined && min_total !== null) url += `&min_total=${min_total}`
    if (max_total !== undefined && max_total !== null) url += `&max_total=${max_total}`
    return url
  },
}
