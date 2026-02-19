import { createProduct } from '../service'

/**
 * Caso de uso: crear producto (POST /products con token)
 * @param {Object} params
 * @param {string} params.category_id
 * @param {string} params.name
 * @param {string} [params.description]
 * @param {string} [params.sku]
 * @param {string} [params.barcode]
 * @param {number} params.price
 * @param {'active'|'inactive'} [params.status='active']
 * @returns {Promise<import('../dto/productCreateResponse.dto').ProductCreateResponseDto>}
 */
export async function createProductUseCase(params) {
  return createProduct(params)
}
