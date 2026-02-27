/**
 * DTOs de respuesta del listado de productos
 * (GET /products o GET /products con filtros: category_id, status, visibility, search, min_price, max_price, page, limit)
 *
 * Respuesta ejemplo:
 * {
 *   "success": true,
 *   "message": "Products retrieved successfully",
 *   "data": {
 *     "data": [ { "id", "company_id", "category_id", "code", "name", ... } ],
 *     "pagination": { "page": 1, "limit": 10, "total": 1, "total_pages": 1 }
 *   }
 * }
 */

/**
 * Item de producto en la respuesta (GET /products)
 * @typedef {Object} ProductItemDto
 * @property {string} id
 * @property {string} company_id
 * @property {string} category_id
 * @property {string} code
 * @property {string} name
 * @property {string} [description]
 * @property {string} [image_url]
 * @property {string} [sku]
 * @property {string} [barcode]
 * @property {number} price
 * @property {string} status
 * @property {boolean} visibility
 * @property {string} created_at
 * @property {string} updated_at
 */

/**
 * Paginación en la respuesta
 * @typedef {Object} ProductsPaginationDto
 * @property {number} page
 * @property {number} limit
 * @property {number} total
 * @property {number} total_pages
 */

/**
 * Datos internos de la respuesta (lista + paginación)
 * @typedef {Object} ProductsDataDto
 * @property {ProductItemDto[]} data
 * @property {ProductsPaginationDto} pagination
 */

/**
 * Respuesta exitosa del listado de productos
 * @typedef {Object} ProductsResponseDto
 * @property {true} success
 * @property {string} message
 * @property {ProductsDataDto} data
 */
