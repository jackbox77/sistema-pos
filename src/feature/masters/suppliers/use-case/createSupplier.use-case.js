import { createSupplier } from '../service'

/**
 * Caso de uso: crear proveedor (POST /suppliers con token)
 * @param {Object} params
 * @param {'NIT'|'CC'|'CE'|'PASSPORT'|'OTHER'} params.document_type
 * @param {string} params.document_number
 * @param {string} params.supplier_name
 * @param {string} [params.contact_name]
 * @param {string} [params.contact_phone]
 * @param {'active'|'inactive'} [params.status='active']
 * @returns {Promise<import('../dto/supplierCreateResponse.dto').SupplierCreateResponseDto>}
 */
export async function createSupplierUseCase(params) {
  return createSupplier(params)
}
