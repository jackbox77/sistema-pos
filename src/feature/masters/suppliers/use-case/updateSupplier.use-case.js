import { updateSupplier } from '../service'

/**
 * Caso de uso: actualizar proveedor (PUT /suppliers/:id con token)
 * @param {string} id
 * @param {Object} params
 * @param {'NIT'|'CC'|'CE'|'PASSPORT'|'OTHER'} params.document_type
 * @param {string} params.document_number
 * @param {string} params.supplier_name
 * @param {string} [params.contact_name]
 * @param {string} [params.contact_phone]
 * @param {'active'|'inactive'} [params.status='active']
 * @returns {Promise<import('../dto/supplierUpdateResponse.dto').SupplierUpdateResponseDto>}
 */
export async function updateSupplierUseCase(id, params) {
  return updateSupplier(id, params)
}
