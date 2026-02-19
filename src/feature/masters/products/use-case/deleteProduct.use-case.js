import { deleteProduct } from '../service'

/**
 * Caso de uso: eliminar producto (DELETE /products/:id con token)
 * @param {string} id
 * @returns {Promise<import('../dto/productDeleteResponse.dto').ProductDeleteResponseDto>}
 */
export async function deleteProductUseCase(id) {
  return deleteProduct(id)
}
