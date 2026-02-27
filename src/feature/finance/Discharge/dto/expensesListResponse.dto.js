/**
 * DTOs de respuesta del listado de egresos (GET /expenses)
 */

/**
 * Paginación
 * @typedef {Object} ExpensesPaginationDto
 * @property {number} page
 * @property {number} limit
 * @property {number} total
 * @property {number} total_pages
 */

/**
 * Datos internos (lista + paginación)
 * @typedef {Object} ExpensesListDataDto
 * @property {Array<*>} data
 * @property {ExpensesPaginationDto} pagination
 */

/**
 * Respuesta exitosa del listado de egresos
 * @typedef {Object} ExpensesListResponseDto
 * @property {true} success
 * @property {string} message
 * @property {ExpensesListDataDto} data
 */
