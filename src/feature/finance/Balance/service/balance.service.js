import { requestWithToken } from '../../../../utils/apiMiddleware'
import { BALANCE_API } from '../api-const'

/**
 * Listar balances: GET /balances?page=1&limit=10 con token
 * @param {number} [page=1]
 * @param {number} [limit=10]
 * @returns {Promise<import('../dto/balancesListResponse.dto').BalancesListResponseDto>}
 */
export async function getBalances(page = 1, limit = 10) {
  const url = BALANCE_API.LIST(page, limit)
  const response = await requestWithToken.get(url)
  return response
}

/**
 * Obtener balance del turno: GET /balances/:id_shift con token
 * @param {string} id_shift
 * @returns {Promise<import('../dto/balanceResponse.dto').BalanceResponseDto>}
 */
export async function getBalance(id_shift) {
  const url = BALANCE_API.GET(id_shift)
  const response = await requestWithToken.get(url)
  return response
}
