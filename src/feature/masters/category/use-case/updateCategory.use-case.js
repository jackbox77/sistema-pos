import { updateCategory } from '../service'

/**
 * Caso de uso: actualizar categoría (PUT /categories/:id con token)
 * @param {string} id
 * @param {string} name
 * @param {string} [description]
 * @param {'active'|'inactive'} [status='active']
 * @returns {Promise<import('../dto/categoryUpdateResponse.dto').CategoryUpdateResponseDto>}
 */
export async function updateCategoryUseCase(id, name, description = '', status = 'active') {
  return updateCategory(id, name, description, status)
}
