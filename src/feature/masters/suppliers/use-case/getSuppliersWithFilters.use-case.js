import { getSuppliersWithFilters } from '../service'

/**
 * Caso de uso: obtener listado de proveedores con filtros y paginación.
 * Respuesta: { success, message, data: { data: SupplierItemDto[], pagination } }
 *
 * @param {Object} [filters]
 * @param {number} [filters.page=1]
 * @param {number} [filters.limit=10]
 * @param {string} [filters.status] - 'active' | 'inactive'
 * @param {string} [filters.document_type] - 'NIT' | 'CC' | 'CE' | 'PASSPORT' | 'OTHER'
 * @param {string} [filters.search] - Búsqueda por nombre
 * @param {string} [filters.document_number] - Búsqueda por número de documento
 * @returns {Promise<import('../dto/suppliersResponse.dto').SuppliersResponseDto>}
 */
export async function getSuppliersWithFiltersUseCase(filters = {}) {
  return getSuppliersWithFilters(filters)
}
