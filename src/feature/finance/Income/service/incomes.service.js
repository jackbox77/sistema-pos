import { requestWithToken } from '../../../../utils/apiMiddleware'
import { INCOMES_API } from '../api-const'

/**
 * Listar ingresos por turno con filtros
 * @param {string} shift_id
 * @param {number} [page=1]
 * @param {number} [limit=10]
 * @param {string} [search]
 * @param {number} [min_amount]
 * @param {number} [max_amount]
 * @returns {Promise<import('../dto/incomesListResponse.dto').IncomesListResponseDto>}
 */
export async function getIncomes(shift_id, page = 1, limit = 10, search, min_amount, max_amount) {
  const url = INCOMES_API.LIST(shift_id, page, limit, search, min_amount, max_amount)
  const response = await requestWithToken.get(url)
  return response
}

/**
 * Crear ingreso: POST /incomes con body { shift_id, amount, concept, reference }
 * @param {import('../dto/createIncomeRequest.dto').CreateIncomeRequestDto} body
 * @returns {Promise<import('../dto/createIncomeResponse.dto').CreateIncomeResponseDto>}
 */
export async function createIncome(body) {
  const response = await requestWithToken.post(INCOMES_API.CREATE, body)
  return response
}
