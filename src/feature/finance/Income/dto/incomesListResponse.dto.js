/**
 * DTOs de respuesta del listado de ingresos (GET /incomes)
 */

/**
 * Paginación
 * @typedef {Object} IncomesPaginationDto
 * @property {number} page
 * @property {number} limit
 * @property {number} total
 * @property {number} total_pages
 */

/**
 * Datos internos (lista + paginación)
 * @typedef {Object} IncomesListDataDto
 * @property {Array<*>} data
 * @property {IncomesPaginationDto} pagination
 */

/**
 * Respuesta exitosa del listado de ingresos
 * @typedef {Object} IncomesListResponseDto
 * @property {true} success
 * @property {string} message
 * @property {IncomesListDataDto} data
 */
