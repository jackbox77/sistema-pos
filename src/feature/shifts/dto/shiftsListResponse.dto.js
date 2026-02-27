/**
 * DTOs de respuesta del listado de turnos (GET /shifts)
 */

/**
 * Item de turno en el listado
 * @typedef {Object} ShiftItemDto
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
 * Paginación
 * @typedef {Object} ShiftsPaginationDto
 * @property {number} page
 * @property {number} limit
 * @property {number} total
 * @property {number} total_pages
 */

/**
 * Datos internos (lista + paginación)
 * @typedef {Object} ShiftsListDataDto
 * @property {ShiftItemDto[]} data
 * @property {ShiftsPaginationDto} pagination
 */

/**
 * Respuesta exitosa del listado de turnos
 * @typedef {Object} ShiftsListResponseDto
 * @property {true} success
 * @property {string} message
 * @property {ShiftsListDataDto} data
 */
