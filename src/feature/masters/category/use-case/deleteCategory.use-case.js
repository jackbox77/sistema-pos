import { deleteCategory } from '../service'

/**
 * Caso de uso: eliminar categoría (DELETE /categories/:id con token)
 * @param {string} id
 * @returns {Promise<import('../dto/categoryDeleteResponse.dto').CategoryDeleteResponseDto>}
 */
export async function deleteCategoryUseCase(id) {
  return deleteCategory(id)
}
