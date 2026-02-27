/**
 * DTO de respuesta al crear ingreso (POST /incomes)
 */

/**
 * Ingreso creado
 * @typedef {Object} CreateIncomeDataDto
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
 * Respuesta exitosa al crear ingreso
 * @typedef {Object} CreateIncomeResponseDto
 * @property {true} success
 * @property {string} message
 * @property {CreateIncomeDataDto} data
 */
