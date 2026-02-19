/**
 * DTOs de respuesta del listado de impuestos (GET /taxes)
 */

/**
 * Item de impuesto en la respuesta
 * @typedef {Object} TaxItemDto
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
 * Paginación en la respuesta
 * @typedef {Object} TaxesPaginationDto
 * @property {number} page
 * @property {number} limit
 * @property {number} total
 * @property {number} total_pages
 */

/**
 * Datos internos de la respuesta (lista + paginación)
 * @typedef {Object} TaxesDataDto
 * @property {TaxItemDto[]} data
 * @property {TaxesPaginationDto} pagination
 */

/**
 * Respuesta exitosa del listado de impuestos
 * @typedef {Object} TaxesResponseDto
 * @property {true} success
 * @property {string} message
 * @property {TaxesDataDto} data
 */
