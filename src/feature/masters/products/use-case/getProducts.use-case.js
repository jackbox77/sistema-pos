import { getProducts } from '../service'

/**
 * Caso de uso: obtener listado de productos paginado
 * @param {number} [page=1]
 * @param {number} [limit=10]
 * @returns {Promise<import('../dto/productsResponse.dto').ProductsResponseDto>}
 */
export async function getProductsUseCase(page = 1, limit = 10) {
  return getProducts(page, limit)
}
