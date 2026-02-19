import { getCategories } from '../service'

/**
 * Caso de uso: obtener listado de categorías paginado
 * @param {number} [page=1]
 * @param {number} [limit=10]
 * @returns {Promise<import('../dto/categoriesResponse.dto').CategoriesResponseDto>}
 */
export async function getCategoriesUseCase(page = 1, limit = 10) {
  return getCategories(page, limit)
}
