/**
 * DTOs de respuesta del listado de clientes fidelizados
 * (GET /loyal-customers o GET /loyal-customers con filtros: status, document_type, search, page, limit)
 *
 * Respuesta ejemplo:
 * {
 *   "success": true,
 *   "message": "Loyal customers retrieved successfully",
 *   "data": {
 *     "data": [ { "id", "company_id", "document_type", "document_number", "full_name", "email", "phone", "birth_date", "status", "created_at", "updated_at", "ventas_asociadas" } ],
 *     "pagination": { "page": 1, "limit": 10, "total": 1, "total_pages": 1 }
 *   }
 * }
 */

/**
 * Item de cliente fidelizado en la respuesta (GET /loyal-customers)
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
 * @property {number} ventas_asociadas
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
