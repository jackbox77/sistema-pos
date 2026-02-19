/**
 * DTOs de respuesta del listado de categorías (GET /categories)
 */

/**
 * Item de categoría en la respuesta
 * @typedef {Object} CategoryItemDto
 * @property {string} id
 * @property {string} company_id
 * @property {string} name
 * @property {string} [description]
 * @property {string} status
 * @property {string} created_at
 * @property {string} updated_at
 */

/**
 * Paginación en la respuesta
 * @typedef {Object} CategoriesPaginationDto
 * @property {number} page
 * @property {number} limit
 * @property {number} total
 * @property {number} total_pages
 */

/**
 * Datos internos de la respuesta (lista + paginación)
 * @typedef {Object} CategoriesDataDto
 * @property {CategoryItemDto[]} data
 * @property {CategoriesPaginationDto} pagination
 */

/**
 * Respuesta exitosa del listado de categorías
 * @typedef {Object} CategoriesResponseDto
 * @property {true} success
 * @property {string} message
 * @property {CategoriesDataDto} data
 */
