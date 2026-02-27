import { getLoyalCustomersWithFilters } from '../service'

/**
 * Caso de uso: obtener listado de clientes fidelizados con filtros y paginación.
 * Respuesta: { success, message, data: { data: LoyalCustomerItemDto[], pagination } }
 *
 * @param {Object} [filters]
 * @param {number} [filters.page=1]
 * @param {number} [filters.limit=10]
 * @param {string} [filters.status] - 'active' | 'inactive'
 * @param {string} [filters.document_type] - 'CC' | 'CE' | 'PASSPORT' | 'OTHER'
 * @param {string} [filters.search] - Búsqueda (nombre, email, documento, etc.)
 * @returns {Promise<import('../dto/loyalCustomersResponse.dto').LoyalCustomersResponseDto>}
 */
export async function getLoyalCustomersWithFiltersUseCase(filters = {}) {
  return getLoyalCustomersWithFilters(filters)
}
