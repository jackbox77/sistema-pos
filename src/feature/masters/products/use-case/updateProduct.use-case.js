import { updateProduct } from '../service'

/**
 * Caso de uso: actualizar producto (PUT /products/:id con token)
 * @param {string} id
 * @param {Object} params
 * @param {string} params.category_id
 * @param {string} params.name
 * @param {string} [params.description]
 * @param {string} [params.sku]
 * @param {string} [params.barcode]
 * @param {number} params.price
 * @param {'active'|'inactive'} [params.status='active']
 * @returns {Promise<import('../dto/productUpdateResponse.dto').ProductUpdateResponseDto>}
 */
export async function updateProductUseCase(id, params) {
  return updateProduct(id, params)
}
