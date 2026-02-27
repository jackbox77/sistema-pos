import { getSales } from '../service'

/**
 * Caso de uso: listar ventas por turno y filtros
 * @param {string} shift_id
 * @param {number} [page=1]
 * @param {number} [limit=10]
 * @param {string} [loyal_customer_id]
 * @param {string} [search]
 * @param {number} [min_total]
 * @param {number} [max_total]
 * @returns {Promise<import('../dto/salesListResponse.dto').SalesListResponseDto>}
 */
export async function getSalesUseCase(shift_id, page = 1, limit = 10, loyal_customer_id, search, min_total, max_total) {
  return getSales(shift_id, page, limit, loyal_customer_id, search, min_total, max_total)
}
