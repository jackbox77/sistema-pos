/**
 * DTOs de respuesta del listado de ventas (GET /sales)
 */

/**
 * Paginación
 * @typedef {Object} SalesPaginationDto
 * @property {number} page
 * @property {number} limit
 * @property {number} total
 * @property {number} total_pages
 */

/**
 * Datos internos (lista + paginación)
 * @typedef {Object} SalesListDataDto
 * @property {Array<*>} data
 * @property {SalesPaginationDto} pagination
 */

/**
 * Respuesta exitosa del listado de ventas
 * @typedef {Object} SalesListResponseDto
 * @property {true} success
 * @property {string} message
 * @property {SalesListDataDto} data
 */
