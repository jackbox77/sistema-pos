import { requestWithToken } from '../../../utils/apiMiddleware'
import { POS_API } from '../api-const'

/**
 * Obtener categorías con productos: GET /categories/with-products con token
 * @returns {Promise<import('../dto/categoriesWithProductsResponse.dto').CategoriesWithProductsResponseDto>}
 */
export async function getCategoriesWithProducts() {
  const response = await requestWithToken.get(POS_API.CATEGORIES_WITH_PRODUCTS)
  return response
}
