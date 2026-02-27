import { getCategoriesWithProducts } from '../service'

/**
 * Caso de uso: obtener categorías con productos (GET /categories/with-products)
 * @returns {Promise<import('../dto/categoriesWithProductsResponse.dto').CategoriesWithProductsResponseDto>}
 */
export async function getCategoriesWithProductsUseCase() {
  return getCategoriesWithProducts()
}
