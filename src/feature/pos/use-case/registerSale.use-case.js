import { registerSale } from '../service'

/**
 * Caso de uso: registrar venta (POST /sales/register)
 * @param {import('../dto/registerSaleRequest.dto').RegisterSaleRequestDto} body - { shift_id, loyal_customer_id?, items }
 * @returns {Promise<import('../dto/registerSaleResponse.dto').RegisterSaleResponseDto>}
 */
export async function registerSaleUseCase(body) {
  return registerSale(body)
}
