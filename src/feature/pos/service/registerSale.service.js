import { requestWithToken } from '../../../utils/apiMiddleware'
import { POS_API } from '../api-const'

/**
 * Registrar venta: POST /sales/register con body { shift_id, loyal_customer_id?, items }
 * @param {import('../dto/registerSaleRequest.dto').RegisterSaleRequestDto} body
 * @returns {Promise<import('../dto/registerSaleResponse.dto').RegisterSaleResponseDto>}
 */
export async function registerSale(body) {
  const response = await requestWithToken.post(POS_API.REGISTER_SALE, body)
  return response
}
