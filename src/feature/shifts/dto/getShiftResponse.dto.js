/**
 * DTOs de respuesta al obtener un turno por ID (GET /shifts/:id)
 */

/**
 * Datos del turno
 * @typedef {Object} ShiftDataDto
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
 * Respuesta exitosa al obtener un turno
 * @typedef {Object} GetShiftResponseDto
 * @property {true} success
 * @property {string} message
 * @property {ShiftDataDto} data
 */
