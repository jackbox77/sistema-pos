import { requestWithToken } from '../../../../utils/apiMiddleware'
import { CLIENTES_FIDELIZADOS_API } from '../api-const'
import { createLoyalCustomerRequest } from '../dto/loyalCustomerRequest.dto'

/**
 * Lista clientes fidelizados con paginación (GET con token)
 * @param {number} [page=1]
 * @param {number} [limit=10]
 * @returns {Promise<import('../dto/loyalCustomersResponse.dto').LoyalCustomersResponseDto>}
 */
export async function getLoyalCustomers(page = 1, limit = 10) {
  const url = CLIENTES_FIDELIZADOS_API.LIST(page, limit)
  const response = await requestWithToken.get(url)
  return response
}

/**
 * Lista clientes fidelizados con filtros (GET /loyal-customers?status=active&document_type=CC&search=maria&page=1&limit=10)
 * @param {Object} [params]
 * @param {number} [params.page=1]
 * @param {number} [params.limit=10]
 * @param {string} [params.status] - 'active' | 'inactive'
 * @param {string} [params.document_type] - Ej: 'CC', 'CE', 'PASSPORT', 'OTHER'
 * @param {string} [params.search] - Búsqueda (nombre, email, documento, etc.)
 * @returns {Promise<import('../dto/loyalCustomersResponse.dto').LoyalCustomersResponseDto>}
 */
export async function getLoyalCustomersWithFilters(params = {}) {
  const { page = 1, limit = 10, status, document_type, search } = params
  const url = CLIENTES_FIDELIZADOS_API.LIST_FILTERS({ page, limit, status, document_type, search })
  const response = await requestWithToken.get(url)
  return response
}

/**
 * Obtiene todos los clientes fidelizados. Intenta GET /loyal-customers; si falla (404/405), usa listado paginado con límite alto.
 */
export async function getLoyalCustomersAll() {
  try {
    const response = await requestWithToken.get(CLIENTES_FIDELIZADOS_API.LIST_ALL)
    return response
  } catch (err) {
    if (err?.status === 404 || err?.status === 405) {
      return requestWithToken.get(CLIENTES_FIDELIZADOS_API.LIST(1, 10000))
    }
    throw err
  }
}

/**
 * Crea un cliente fidelizado (POST /loyal-customers con token)
 * @param {Object} params
 * @param {'CC'|'CE'|'PASSPORT'|'OTHER'} params.document_type
 * @param {string} params.document_number
 * @param {string} params.full_name
 * @param {string} [params.email]
 * @param {string} [params.phone]
 * @param {string} [params.birth_date]
 * @param {'active'|'inactive'} [params.status='active']
 * @returns {Promise<import('../dto/loyalCustomerCreateResponse.dto').LoyalCustomerCreateResponseDto>}
 */
export async function createLoyalCustomer(params) {
  const body = createLoyalCustomerRequest(params)
  const response = await requestWithToken.post(CLIENTES_FIDELIZADOS_API.CREATE, body)
  return response
}

/**
 * Actualiza un cliente fidelizado (PUT /loyal-customers/:id con token)
 * @param {string} id
 * @param {Object} params
 * @param {'CC'|'CE'|'PASSPORT'|'OTHER'} params.document_type
 * @param {string} params.document_number
 * @param {string} params.full_name
 * @param {string} [params.email]
 * @param {string} [params.phone]
 * @param {string} [params.birth_date]
 * @param {'active'|'inactive'} [params.status='active']
 * @returns {Promise<import('../dto/loyalCustomerUpdateResponse.dto').LoyalCustomerUpdateResponseDto>}
 */
export async function updateLoyalCustomer(id, params) {
  const body = createLoyalCustomerRequest(params)
  const url = CLIENTES_FIDELIZADOS_API.UPDATE(id)
  const response = await requestWithToken.put(url, body)
  return response
}

/**
 * Elimina un cliente fidelizado (DELETE /loyal-customers/:id con token)
 * @param {string} id
 * @returns {Promise<import('../dto/loyalCustomerDeleteResponse.dto').LoyalCustomerDeleteResponseDto>}
 */
export async function deleteLoyalCustomer(id) {
  const url = CLIENTES_FIDELIZADOS_API.DELETE(id)
  const response = await requestWithToken.delete(url)
  return response
}
