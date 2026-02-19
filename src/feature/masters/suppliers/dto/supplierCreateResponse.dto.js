/**
 * DTO de respuesta al crear proveedor (POST /suppliers)
 */

/**
 * Proveedor creado en la respuesta
 * @typedef {Object} SupplierCreateDataDto
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
 * Respuesta exitosa al crear proveedor
 * @typedef {Object} SupplierCreateResponseDto
 * @property {true} success
 * @property {string} message
 * @property {SupplierCreateDataDto} data
 */
