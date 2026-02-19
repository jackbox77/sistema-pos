import { deletePaymentMethod } from '../service'

/**
 * Caso de uso: eliminar método de pago (DELETE /payment-methods/:id)
 * @param {string} id
 * @returns {Promise<import('../dto/paymentMethodDeleteResponse.dto').PaymentMethodDeleteResponseDto>}
 */
export async function deletePaymentMethodUseCase(id) {
  return deletePaymentMethod(id)
}
