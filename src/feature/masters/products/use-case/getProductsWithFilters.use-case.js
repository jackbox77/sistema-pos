import { getProductsWithFilters } from '../service'

/**
 * Caso de uso: obtener listado de productos con filtros y paginación.
 * Respuesta: { success, message, data: { data: ProductItemDto[], pagination } }
 *
 * @param {Object} [filters]
 * @param {number} [filters.page=1]
 * @param {number} [filters.limit=10]
 * @param {string} [filters.category_id] - UUID de categoría
 * @param {string} [filters.status] - 'active' | 'inactive'
 * @param {boolean} [filters.visibility]
 * @param {string} [filters.search] - Búsqueda (código/nombre)
 * @param {number} [filters.min_price]
 * @param {number} [filters.max_price]
 * @param {string} [filters.order_by] - 'price' | 'category_id' | 'name'
 * @param {string} [filters.sort_order] - 'asc' | 'desc'
 * @returns {Promise<import('../dto/productsResponse.dto').ProductsResponseDto>}
 */
export async function getProductsWithFiltersUseCase(filters = {}) {
  return getProductsWithFilters(filters)
}
