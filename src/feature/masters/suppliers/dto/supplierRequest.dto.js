/**
 * DTO de envío para crear/actualizar proveedor
 * @typedef {Object} SupplierRequestDto
 * @property {'NIT'|'CC'|'CE'|'PASSPORT'|'OTHER'} document_type
 * @property {string} document_number
 * @property {string} supplier_name
 * @property {string} [contact_name]
 * @property {string} [contact_phone]
 * @property {'active'|'inactive'} status
 */

/**
 * Crea el cuerpo de la petición para crear o actualizar proveedor
 * @param {Object} params
 * @param {'NIT'|'CC'|'CE'|'PASSPORT'|'OTHER'} params.document_type
 * @param {string} params.document_number
 * @param {string} params.supplier_name
 * @param {string} [params.contact_name]
 * @param {string} [params.contact_phone]
 * @param {'active'|'inactive'} [params.status='active']
 * @returns {SupplierRequestDto}
 */
export function createSupplierRequest({
  document_type,
  document_number,
  supplier_name,
  contact_name = '',
  contact_phone = '',
  status = 'active',
}) {
  return {
    document_type,
    document_number,
    supplier_name,
    contact_name,
    contact_phone,
    status,
  }
}
