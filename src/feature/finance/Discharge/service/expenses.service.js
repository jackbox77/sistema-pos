import { requestWithToken } from '../../../../utils/apiMiddleware'
import { EXPENSES_API } from '../api-const'

/**
 * Listar egresos por turno: GET /expenses?shift_id=:id con token
 * @param {string} shift_id
 * @param {number} [page=1]
 * @param {number} [limit=10]
 * @returns {Promise<import('../dto/expensesListResponse.dto').ExpensesListResponseDto>}
 */
export async function getExpenses(shift_id, page = 1, limit = 10) {
  const url = EXPENSES_API.LIST(shift_id, page, limit)
  const response = await requestWithToken.get(url)
  return response
}

/**
 * Crear egreso: POST /expenses con body { shift_id, amount, concept, reference }
 * @param {import('../dto/createExpenseRequest.dto').CreateExpenseRequestDto} body
 * @returns {Promise<import('../dto/createExpenseResponse.dto').CreateExpenseResponseDto>}
 */
export async function createExpense(body) {
  const response = await requestWithToken.post(EXPENSES_API.CREATE, body)
  return response
}
