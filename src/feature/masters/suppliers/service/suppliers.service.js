import { requestWithToken } from '../../../../utils/apiMiddleware'
import { PROVEEDORES_API } from '../api-const'
import { createSupplierRequest } from '../dto/supplierRequest.dto'

/**
 * Lista proveedores con paginación (GET con token)
 * @param {number} [page=1]
 * @param {number} [limit=10]
 * @returns {Promise<import('../dto/suppliersResponse.dto').SuppliersResponseDto>}
 */
export async function getSuppliers(page = 1, limit = 10) {
  const url = PROVEEDORES_API.LIST(page, limit)
  const response = await requestWithToken.get(url)
  return response
}

/**
 * Crea un proveedor (POST /suppliers con token)
 * @param {Object} params
 * @param {'NIT'|'CC'|'CE'|'PASSPORT'|'OTHER'} params.document_type
 * @param {string} params.document_number
 * @param {string} params.supplier_name
 * @param {string} [params.contact_name]
 * @param {string} [params.contact_phone]
 * @param {'active'|'inactive'} [params.status='active']
 * @returns {Promise<import('../dto/supplierCreateResponse.dto').SupplierCreateResponseDto>}
 */
export async function createSupplier(params) {
  const body = createSupplierRequest(params)
  const response = await requestWithToken.post(PROVEEDORES_API.CREATE, body)
  return response
}

/**
 * Actualiza un proveedor (PUT /suppliers/:id con token)
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
export async function updateSupplier(id, params) {
  const body = createSupplierRequest(params)
  const url = PROVEEDORES_API.UPDATE(id)
  const response = await requestWithToken.put(url, body)
  return response
}

/**
 * Elimina un proveedor (DELETE /suppliers/:id con token)
 * @param {string} id
 * @returns {Promise<import('../dto/supplierDeleteResponse.dto').SupplierDeleteResponseDto>}
 */
export async function deleteSupplier(id) {
  const url = PROVEEDORES_API.DELETE(id)
  const response = await requestWithToken.delete(url)
  return response
}
