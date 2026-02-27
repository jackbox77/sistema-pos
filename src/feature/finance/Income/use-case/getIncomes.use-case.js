import { getIncomes } from '../service'

/**
 * Caso de uso: listar ingresos por turno (GET /incomes?shift_id=:id con token)
 * @param {string} shift_id
 * @param {number} [page=1]
 * @param {number} [limit=10]
 * @returns {Promise<import('../dto/incomesListResponse.dto').IncomesListResponseDto>}
 */
export async function getIncomesUseCase(shift_id, page = 1, limit = 10) {
  return getIncomes(shift_id, page, limit)
}
