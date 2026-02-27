/**
 * DTOs de respuesta del balance del turno (GET /balances/:id_shift)
 */

/**
 * Turno en el balance
 * @typedef {Object} BalanceShiftDto
 * @property {string} id
 * @property {string} company_id
 * @property {string} name
 * @property {string} start_at - ISO 8601
 * @property {string|null} end_at
 * @property {string} opened_by_user_id
 * @property {string|null} closed_by_user_id
 * @property {string} created_at
 * @property {string} updated_at
 */

/**
 * Datos del balance
 * @typedef {Object} BalanceDataDto
 * @property {BalanceShiftDto} shift
 * @property {number} total_ingresos
 * @property {number} total_egresos
 * @property {number} total_ventas
 */

/**
 * Respuesta exitosa del balance del turno
 * @typedef {Object} BalanceResponseDto
 * @property {true} success
 * @property {string} message
 * @property {BalanceDataDto} data
 */
