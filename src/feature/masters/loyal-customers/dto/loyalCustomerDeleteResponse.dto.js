/**
 * DTO de respuesta al eliminar cliente fidelizado (DELETE /loyal-customers/:id)
 * DELETE no envía body; la respuesta suele ser success + message.
 */

/**
 * Respuesta exitosa al eliminar cliente fidelizado
 * @typedef {Object} LoyalCustomerDeleteResponseDto
 * @property {true} success
 * @property {string} [message]
 */
