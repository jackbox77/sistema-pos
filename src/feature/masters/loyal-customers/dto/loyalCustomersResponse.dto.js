/**
 * DTOs de respuesta del listado de clientes fidelizados (GET /loyal-customers)
 */

/**
 * Item de cliente fidelizado en la respuesta
 * @typedef {Object} LoyalCustomerItemDto
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
 * Paginación en la respuesta
 * @typedef {Object} LoyalCustomersPaginationDto
 * @property {number} page
 * @property {number} limit
 * @property {number} total
 * @property {number} total_pages
 */

/**
 * Datos internos de la respuesta (lista + paginación)
 * @typedef {Object} LoyalCustomersDataDto
 * @property {LoyalCustomerItemDto[]} data
 * @property {LoyalCustomersPaginationDto} pagination
 */

/**
 * Respuesta exitosa del listado de clientes fidelizados
 * @typedef {Object} LoyalCustomersResponseDto
 * @property {true} success
 * @property {string} message
 * @property {LoyalCustomersDataDto} data
 */
