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
 * Turno dentro del balance
 * @typedef {Object} BalanceShiftDto
 * @property {string} id
 * @property {string} company_id
 * @property {string} name
 * @property {string} start_at
 * @property {string|null} end_at
 * @property {string} opened_by_user_id
 * @property {string|null} closed_by_user_id
 * @property {string} created_at
 * @property {string} updated_at
 */

/**
 * Item dentro de la lista de balances
 * @typedef {Object} BalanceItemDto
 * @property {BalanceShiftDto} shift
 * @property {number} total_ingresos
 * @property {number} total_egresos
 * @property {number} total_ventas
 */

/**
 * Datos internos (lista + paginación)
 * @typedef {Object} BalancesListDataDto
 * @property {BalanceItemDto[]} data
 * @property {BalancesPaginationDto} pagination
 */

/**
 * Respuesta exitosa del listado de balances
 * @typedef {Object} BalancesListResponseDto
 * @property {true} success
 * @property {string} message
 * @property {BalancesListDataDto} data
 */
