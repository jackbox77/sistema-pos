/**
 * DTOs de respuesta del listado de categorías
 * (GET /categories o GET /categories?status=active&visibility=true&search=cat&page=1&limit=10)
 *
 * Respuesta ejemplo:
 * {
 *   "success": true,
 *   "message": "Categories retrieved successfully",
 *   "data": {
 *     "data": [ { "id", "company_id", "code", "name", "description", "status", "visibility", "created_at", "updated_at", "product_count" } ],
 *     "pagination": { "page": 1, "limit": 10, "total": 4, "total_pages": 1 }
 *   }
 * }
 */

/**
 * Item de categoría en la respuesta (GET /categories)
 * @typedef {Object} CategoryItemDto
 * @property {string} id
 * @property {string} company_id
 * @property {string} code
 * @property {string} name
 * @property {string} [description]
 * @property {string} status
 * @property {boolean} visibility
 * @property {string} created_at
 * @property {string} updated_at
 * @property {number} product_count
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
