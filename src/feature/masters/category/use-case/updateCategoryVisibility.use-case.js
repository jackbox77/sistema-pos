import { updateCategoryVisibility } from '../service'

/**
 * Caso de uso: actualizar visibilidad de una categoría (PATCH /categories/:id/visibility)
 * @param {string} id - ID de la categoría
 * @param {boolean} visibility - true | false
 * @returns {Promise<import('../dto/updateVisibilityResponse.dto').UpdateVisibilityResponseDto>}
 */
export async function updateCategoryVisibilityUseCase(id, visibility) {
  return updateCategoryVisibility(id, visibility)
}
