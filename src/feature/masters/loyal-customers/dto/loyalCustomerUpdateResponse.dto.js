/**
 * DTO de respuesta al actualizar cliente fidelizado (PUT /loyal-customers/:id)
 */

/**
 * Cliente fidelizado actualizado en la respuesta
 * @typedef {Object} LoyalCustomerUpdateDataDto
 * @property {string} id
 * @property {string} company_id
 * @property {string} document_type
 * @property {string} document_number
 * @property {string} full_name
 * @property {string} [email]
 * @property {string} [phone]
 * @property {string} [birth_date]
 * @property {string} status
 * @property {string} created_at
 * @property {string} updated_at
 */

/**
 * Respuesta exitosa al actualizar cliente fidelizado
 * @typedef {Object} LoyalCustomerUpdateResponseDto
 * @property {true} success
 * @property {string} message
 * @property {LoyalCustomerUpdateDataDto} data
 */
