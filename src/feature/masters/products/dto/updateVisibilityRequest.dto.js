/**
 * DTO de envío PATCH /products/:id/visibility
 * Body: { "visibility": true } | { "visibility": false }
 */

/**
 * @typedef {Object} UpdateVisibilityRequestDto
 * @property {boolean} visibility - true | false
 */

/**
 * Crea el cuerpo para actualizar visibilidad de producto
 * @param {boolean} visibility
 * @returns {UpdateVisibilityRequestDto}
 */
export function createUpdateVisibilityRequest(visibility) {
  return { visibility: Boolean(visibility) }
}
