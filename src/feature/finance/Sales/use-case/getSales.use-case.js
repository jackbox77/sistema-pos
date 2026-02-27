import { getSales } from '../service'

/**
 * Caso de uso: listar ventas por turno (GET /sales?shift_id=:id con token)
 * @param {string} shift_id
 * @param {number} [page=1]
 * @param {number} [limit=10]
 * @returns {Promise<import('../dto/salesListResponse.dto').SalesListResponseDto>}
 */
export async function getSalesUseCase(shift_id, page = 1, limit = 10) {
  return getSales(shift_id, page, limit)
}
