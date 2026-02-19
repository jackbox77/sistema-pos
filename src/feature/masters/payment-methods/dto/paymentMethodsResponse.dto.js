/**
 * DTO de respuesta del listado de métodos de pago (GET /payment-methods)
 * Estructura típica: { success, message, data: { data: PaymentMethodItemDto[], pagination } }
 */

/**
 * @typedef {Object} PaymentMethodsResponseDto
 * @property {boolean} success
 * @property {string} [message]
 * @property {Object} [data]
 * @property {Array} [data.data]
 * @property {Object} [data.pagination]
 */
