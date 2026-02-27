/**
 * DTO de envío PATCH /categories/:id/visibility
 * Body: { "visibility": true } | { "visibility": false }
 */

/**
 * @typedef {Object} UpdateVisibilityRequestDto
 * @property {boolean} visibility - true | false
 */

/**
 * Crea el cuerpo para actualizar visibilidad de categoría
 * @param {boolean} visibility
 * @returns {UpdateVisibilityRequestDto}
 */
export function createUpdateVisibilityRequest(visibility) {
  return { visibility: Boolean(visibility) }
}
