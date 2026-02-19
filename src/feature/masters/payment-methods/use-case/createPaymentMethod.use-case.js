import { createPaymentMethod } from '../service'

/**
 * Caso de uso: crear método de pago (POST /payment-methods)
 * @param {Object} params
 * @param {string} params.code
 * @param {string} params.method_name
 * @param {string} [params.description]
 * @param {'active'|'inactive'} [params.status='active']
 * @returns {Promise<import('../dto/paymentMethodCreateResponse.dto').PaymentMethodCreateResponseDto>}
 */
export async function createPaymentMethodUseCase(params) {
  return createPaymentMethod(params)
}
