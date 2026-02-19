/**
 * DTO de respuesta al actualizar impuesto (PUT /taxes/:id)
 */

/**
 * Impuesto actualizado en la respuesta
 * @typedef {Object} TaxUpdateDataDto
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
 * Respuesta exitosa al actualizar impuesto
 * @typedef {Object} TaxUpdateResponseDto
 * @property {true} success
 * @property {string} message
 * @property {TaxUpdateDataDto} data
 */
