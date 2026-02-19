/**
 * DTO de envío para crear/actualizar método de pago (POST /payment-methods, PUT /payment-methods/:id)
 *
 * Ejemplo body:
 * {
 *   "code": "EFECTIVO",
 *   "method_name": "Efectivo - Caja",
 *   "description": "Pago en efectivo en caja",
 *   "status": "inactive"  // "active" | "inactive"
 * }
 *
 * @typedef {Object} PaymentMethodRequestDto
 * @property {string} code
 * @property {string} method_name
 * @property {string} [description]
 * @property {'active'|'inactive'} status
 */

/**
 * Crea el cuerpo de la petición para crear o actualizar método de pago
 * @param {Object} params
 * @param {string} params.code
 * @param {string} params.method_name
 * @param {string} [params.description]
 * @param {'active'|'inactive'} [params.status='active']
 * @returns {PaymentMethodRequestDto}
 */
export function createPaymentMethodRequest(params) {
  return {
    code: params.code ?? '',
    method_name: params.method_name ?? '',
    description: params.description ?? '',
    status: params.status ?? 'active',
  }
}
