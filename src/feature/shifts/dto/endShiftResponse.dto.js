/**
 * DTOs de respuesta al cerrar turno (POST /shifts/end)
 */

/**
 * Datos del turno cerrado en la respuesta
 * @typedef {Object} EndShiftDataDto
 * @property {string} id
 * @property {string} company_id
 * @property {string} name
 * @property {string} start_at - ISO 8601
 * @property {string} end_at - ISO 8601
 * @property {string} opened_by_user_id
 * @property {string} closed_by_user_id
 * @property {string} created_at
 * @property {string} updated_at
 */

/**
 * Respuesta exitosa al cerrar turno
 * @typedef {Object} EndShiftResponseDto
 * @property {true} success
 * @property {string} message
 * @property {EndShiftDataDto} data
 */
