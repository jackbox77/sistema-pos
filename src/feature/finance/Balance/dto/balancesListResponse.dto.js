/**
 * DTOs de respuesta del listado de balances (GET /balances)
 */

/**
 * Paginación
 * @typedef {Object} BalancesPaginationDto
 * @property {number} page
 * @property {number} limit
 * @property {number} total
 * @property {number} total_pages
 */

/**
 * Datos internos (lista + paginación)
 * @typedef {Object} BalancesListDataDto
 * @property {Array<*>} data
 * @property {BalancesPaginationDto} pagination
 */

/**
 * Respuesta exitosa del listado de balances
 * @typedef {Object} BalancesListResponseDto
 * @property {true} success
 * @property {string} message
 * @property {BalancesListDataDto} data
 */
