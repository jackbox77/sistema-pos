/**
 * DTO de respuesta al crear egreso (POST /expenses)
 */

/**
 * Egreso creado
 * @typedef {Object} CreateExpenseDataDto
 * @property {string} id
 * @property {string} company_id
 * @property {string} shift_id
 * @property {number} amount
 * @property {string} concept
 * @property {string} reference
 * @property {string} created_at
 * @property {string} updated_at
 */

/**
 * Respuesta exitosa al crear egreso
 * @typedef {Object} CreateExpenseResponseDto
 * @property {true} success
 * @property {string} message
 * @property {CreateExpenseDataDto} data
 */
