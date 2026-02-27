import { getExpenses } from '../service'

/**
 * Caso de uso: listar egresos por turno (GET /expenses?shift_id=:id con token)
 * @param {string} shift_id
 * @param {number} [page=1]
 * @param {number} [limit=10]
 * @returns {Promise<import('../dto/expensesListResponse.dto').ExpensesListResponseDto>}
 */
export async function getExpensesUseCase(shift_id, page = 1, limit = 10) {
  return getExpenses(shift_id, page, limit)
}
