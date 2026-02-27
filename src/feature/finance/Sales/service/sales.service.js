import { requestWithToken } from '../../../../utils/apiMiddleware'
import { SALES_API } from '../api-const'

/**
 * Listar ventas por turno: GET /sales?shift_id=:id con token
 * @param {string} shift_id
 * @param {number} [page=1]
 * @param {number} [limit=10]
 * @returns {Promise<import('../dto/salesListResponse.dto').SalesListResponseDto>}
 */
export async function getSales(shift_id, page = 1, limit = 10) {
  const url = SALES_API.LIST(shift_id, page, limit)
  const response = await requestWithToken.get(url)
  return response
}
