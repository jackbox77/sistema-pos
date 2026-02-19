/**
 * DTOs de respuesta del listado de proveedores (GET /suppliers)
 */

/**
 * Item de proveedor en la respuesta
 * @typedef {Object} SupplierItemDto
 * @property {string} id
 * @property {string} company_id
 * @property {string} document_type
 * @property {string} document_number
 * @property {string} supplier_name
 * @property {string} [contact_name]
 * @property {string} [contact_phone]
 * @property {string} status
 * @property {string} created_at
 * @property {string} updated_at
 */

/**
 * Paginación en la respuesta
 * @typedef {Object} SuppliersPaginationDto
 * @property {number} page
 * @property {number} limit
 * @property {number} total
 * @property {number} total_pages
 */

/**
 * Datos internos de la respuesta (lista + paginación)
 * @typedef {Object} SuppliersDataDto
 * @property {SupplierItemDto[]} data
 * @property {SuppliersPaginationDto} pagination
 */

/**
 * Respuesta exitosa del listado de proveedores
 * @typedef {Object} SuppliersResponseDto
 * @property {true} success
 * @property {string} message
 * @property {SuppliersDataDto} data
 */
