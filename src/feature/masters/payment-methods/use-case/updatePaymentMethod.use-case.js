import { updatePaymentMethod } from '../service'

/**
 * Caso de uso: actualizar método de pago (PUT /payment-methods/:id)
 * @param {string} id
 * @param {Object} params
 * @param {string} params.code
 * @param {string} params.method_name
 * @param {string} [params.description]
 * @param {'active'|'inactive'} [params.status='active']
 * @returns {Promise<import('../dto/paymentMethodCreateResponse.dto').PaymentMethodUpdateResponseDto>}
 */
export async function updatePaymentMethodUseCase(id, params) {
  return updatePaymentMethod(id, params)
}
