import { requestWithToken } from '../../../../utils/apiMiddleware'
import { METODOS_PAGO_API } from '../api-const'
import { createPaymentMethodRequest } from '../dto/paymentMethodRequest.dto'

/**
 * Lista métodos de pago (GET /payment-methods con token)
 * @param {number} [page=1]
 * @param {number} [limit=10]
 * @returns {Promise<import('../dto/paymentMethodsResponse.dto').PaymentMethodsResponseDto>}
 */
export async function getPaymentMethods(page = 1, limit = 10) {
  const url = `${METODOS_PAGO_API.LIST}?page=${page}&limit=${limit}`
  const response = await requestWithToken.get(url)
  return response
}

/**
 * Crea un método de pago (POST /payment-methods con token)
 * @param {Object} params
 * @param {string} params.code
 * @param {string} params.method_name
 * @param {string} [params.description]
 * @param {'active'|'inactive'} [params.status='active']
 * @returns {Promise<import('../dto/paymentMethodCreateResponse.dto').PaymentMethodCreateResponseDto>}
 */
export async function createPaymentMethod(params) {
  const body = createPaymentMethodRequest(params)
  const response = await requestWithToken.post(METODOS_PAGO_API.CREATE, body)
  return response
}

/**
 * Actualiza un método de pago (PUT /payment-methods/:id con token)
 * @param {string} id
 * @param {Object} params
 * @param {string} params.code
 * @param {string} params.method_name
 * @param {string} [params.description]
 * @param {'active'|'inactive'} [params.status='active']
 * @returns {Promise<import('../dto/paymentMethodCreateResponse.dto').PaymentMethodUpdateResponseDto>}
 */
export async function updatePaymentMethod(id, params) {
  const body = createPaymentMethodRequest(params)
  const url = METODOS_PAGO_API.UPDATE(id)
  const response = await requestWithToken.put(url, body)
  return response
}

/**
 * Elimina un método de pago (DELETE /payment-methods/:id con token)
 * @param {string} id
 * @returns {Promise<import('../dto/paymentMethodDeleteResponse.dto').PaymentMethodDeleteResponseDto>}
 */
export async function deletePaymentMethod(id) {
  const url = METODOS_PAGO_API.DELETE(id)
  const response = await requestWithToken.delete(url)
  return response
}
