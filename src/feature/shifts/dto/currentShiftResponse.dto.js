/**
 * DTOs de respuesta del turno actual (GET /shifts/current)
 */

/**
 * Datos del turno (misma estructura que start shift)
 * @typedef {Object} CurrentShiftDataDto
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
 * Respuesta exitosa del turno actual
 * @typedef {Object} CurrentShiftResponseDto
 * @property {true} success
 * @property {string} message
 * @property {CurrentShiftDataDto} data
 */
