import { getPaymentMethods } from '../service'

/**
 * Caso de uso: listar métodos de pago (GET /payment-methods)
 * @param {number} [page=1]
 * @param {number} [limit=10]
 * @returns {Promise<import('../dto/paymentMethodsResponse.dto').PaymentMethodsResponseDto>}
 */
export async function getPaymentMethodsUseCase(page = 1, limit = 10) {
  return getPaymentMethods(page, limit)
}
