/**
 * DTOs de respuesta del listado de productos (GET /products)
 */

/**
 * Item de producto en la respuesta
 * @typedef {Object} ProductItemDto
 * @property {string} id
 * @property {string} company_id
 * @property {string} category_id
 * @property {string} name
 * @property {string} [description]
 * @property {string} [sku]
 * @property {string} [barcode]
 * @property {number} price
 * @property {string} status
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
