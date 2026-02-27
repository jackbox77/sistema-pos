import { getExpenses } from '../service'

/**
 * Caso de uso: listar egresos por turno y filtros
 * @param {string} shift_id
 * @param {number} [page=1]
 * @param {number} [limit=10]
 * @param {string} [search]
 * @param {number} [min_amount]
 * @param {number} [max_amount]
 * @returns {Promise<import('../dto/expensesListResponse.dto').ExpensesListResponseDto>}
 */
export async function getExpensesUseCase(shift_id, page = 1, limit = 10, search, min_amount, max_amount) {
  return getExpenses(shift_id, page, limit, search, min_amount, max_amount)
}
