/**
 * DTO de respuesta al actualizar categoría (PUT/PATCH /categories/:id)
 */

/**
 * Categoría actualizada en la respuesta
 * @typedef {Object} CategoryUpdateDataDto
 * @property {string} id
 * @property {string} company_id
 * @property {string} name
 * @property {string} [description]
 * @property {string} status
 * @property {string} created_at
 * @property {string} updated_at
 */

/**
 * Respuesta exitosa al actualizar categoría
 * @typedef {Object} CategoryUpdateResponseDto
 * @property {true} success
 * @property {string} message
 * @property {CategoryUpdateDataDto} data
 */
