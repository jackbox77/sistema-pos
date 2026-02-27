/**
 * DTO de respuesta al crear categoría (POST /categories)
 */

/**
 * Categoría creada en la respuesta
 * @typedef {Object} CategoryCreateDataDto
 * @property {string} id
 * @property {string} company_id
 * @property {string} code
 * @property {string} name
 * @property {string} [description]
 * @property {string} status
 * @property {string} created_at
 * @property {string} updated_at
 * @property {number} product_count
 */

/**
 * Respuesta exitosa al crear categoría
 * @typedef {Object} CategoryCreateResponseDto
 * @property {true} success
 * @property {string} message
 * @property {CategoryCreateDataDto} data
 */
