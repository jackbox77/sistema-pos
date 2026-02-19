/**
 * DTO de respuesta al actualizar proveedor (PUT /suppliers/:id)
 */

/**
 * Proveedor actualizado en la respuesta
 * @typedef {Object} SupplierUpdateDataDto
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
 * Respuesta exitosa al actualizar proveedor
 * @typedef {Object} SupplierUpdateResponseDto
 * @property {true} success
 * @property {string} message
 * @property {SupplierUpdateDataDto} data
 */
