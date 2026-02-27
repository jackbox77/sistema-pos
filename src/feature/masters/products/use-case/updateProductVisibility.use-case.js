import { updateProductVisibility } from '../service'

/**
 * Caso de uso: actualizar visibilidad de un producto (PATCH /products/:id/visibility)
 * @param {string} id - ID del producto
 * @param {boolean} visibility - true | false
 * @returns {Promise<import('../dto/updateVisibilityResponse.dto').UpdateVisibilityResponseDto>}
 */
export async function updateProductVisibilityUseCase(id, visibility) {
  return updateProductVisibility(id, visibility)
}
