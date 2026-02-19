/**
 * DTO de respuesta al eliminar producto (DELETE /products/:id)
 * DELETE no envía body; la respuesta suele ser success + message.
 */

/**
 * Respuesta exitosa al eliminar producto
 * @typedef {Object} ProductDeleteResponseDto
 * @property {true} success
 * @property {string} [message]
 */
