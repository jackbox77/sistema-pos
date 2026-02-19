/**
 * DTO de respuesta al eliminar método de pago (DELETE /payment-methods/:id)
 * DELETE no envía body.
 *
 * Éxito: { "success": true, "message": "..." }
 * Error: { "success": false, "message": "", "error": "Invalid id" }
 */

/**
 * Respuesta al eliminar método de pago
 * @typedef {Object} PaymentMethodDeleteResponseDto
 * @property {boolean} success
 * @property {string} [message]
 * @property {string} [error]
 */
