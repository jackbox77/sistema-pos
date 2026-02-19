/**
 * DTO de respuesta al crear cliente fidelizado (POST /loyal-customers)
 */

/**
 * Cliente fidelizado creado en la respuesta
 * @typedef {Object} LoyalCustomerCreateDataDto
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
 * Respuesta exitosa al crear cliente fidelizado
 * @typedef {Object} LoyalCustomerCreateResponseDto
 * @property {true} success
 * @property {string} message
 * @property {LoyalCustomerCreateDataDto} data
 */
