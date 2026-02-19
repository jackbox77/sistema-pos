/**
 * DTO de respuesta al crear impuesto (POST /taxes)
 */

/**
 * Impuesto creado en la respuesta
 * @typedef {Object} TaxCreateDataDto
 * @property {string} id
 * @property {string} company_id
 * @property {string} code
 * @property {string} name
 * @property {number} percentage
 * @property {string} [description]
 * @property {string} status
 * @property {string} created_at
 * @property {string} updated_at
 */

/**
 * Respuesta exitosa al crear impuesto
 * @typedef {Object} TaxCreateResponseDto
 * @property {true} success
 * @property {string} message
 * @property {TaxCreateDataDto} data
 */
