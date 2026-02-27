import { getIncomes } from '../service'

/**
 * Caso de uso: listar ingresos por turno y filtros
 * @param {string} shift_id
 * @param {number} [page=1]
 * @param {number} [limit=10]
 * @param {string} [search]
 * @param {number} [min_amount]
 * @param {number} [max_amount]
 * @returns {Promise<import('../dto/incomesListResponse.dto').IncomesListResponseDto>}
 */
export async function getIncomesUseCase(shift_id, page = 1, limit = 10, search, min_amount, max_amount) {
  return getIncomes(shift_id, page, limit, search, min_amount, max_amount)
}
