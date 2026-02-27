import { getCategoriesWithFilters } from '../service'

/**
 * Caso de uso: obtener listado de categorías con filtros y paginación.
 * Respuesta: { success, message, data: { data: CategoryItemDto[], pagination } }
 *
 * @param {Object} [filters]
 * @param {number} [filters.page=1]
 * @param {number} [filters.limit=10]
 * @param {string} [filters.status] - 'active' | 'inactive'
 * @param {boolean} [filters.visibility]
 * @param {string} [filters.search] - Búsqueda (código/nombre)
 * @returns {Promise<import('../dto/categoriesResponse.dto').CategoriesResponseDto>}
 */
export async function getCategoriesWithFiltersUseCase(filters = {}) {
  return getCategoriesWithFilters(filters)
}
