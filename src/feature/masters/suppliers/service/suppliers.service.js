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
 * Lista proveedores con filtros (GET /suppliers?status=active&document_type=NIT&search=acme&page=1&limit=10)
 * @param {Object} [params]
 * @param {number} [params.page=1]
 * @param {number} [params.limit=10]
 * @param {string} [params.status] - 'active' | 'inactive'
 * @param {string} [params.document_type] - Ej: 'NIT', 'CC', 'CE', 'PASSPORT', 'OTHER'
 * @param {string} [params.search] - Búsqueda por nombre
 * @param {string} [params.document_number] - Búsqueda por número de documento
 * @returns {Promise<import('../dto/suppliersResponse.dto').SuppliersResponseDto>}
 */
export async function getSuppliersWithFilters(params = {}) {
  const { page = 1, limit = 10, status, document_type, search, document_number } = params
  const url = PROVEEDORES_API.LIST_FILTERS({ page, limit, status, document_type, search, document_number })
  const response = await requestWithToken.get(url)
  return response
}

/**
 * Obtiene todos los proveedores. Intenta GET /suppliers; si falla (404/405), usa listado paginado con límite alto.
 */
export async function getSuppliersAll() {
  try {
    const response = await requestWithToken.get(PROVEEDORES_API.LIST_ALL)
    return response
  } catch (err) {
    if (err?.status === 404 || err?.status === 405) {
      return requestWithToken.get(PROVEEDORES_API.LIST(1, 10000))
    }
    throw err
  }
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
