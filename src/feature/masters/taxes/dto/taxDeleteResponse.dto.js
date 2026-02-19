/**
 * DTO de respuesta al eliminar impuesto (DELETE /taxes/:id)
 * DELETE no envía body; la respuesta suele ser success + message.
 */

/**
 * Respuesta exitosa al eliminar impuesto
 * @typedef {Object} TaxDeleteResponseDto
 * @property {true} success
 * @property {string} [message]
 */
