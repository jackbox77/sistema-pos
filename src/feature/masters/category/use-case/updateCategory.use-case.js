import { updateCategory } from '../service'

/**
 * Caso de uso: actualizar categoría (PUT /categories/:id con token)
 * @param {string} id
 * @param {string} code
 * @param {string} name
 * @param {string} [description]
 * @param {'active'|'inactive'} [status='active']
 * @param {string} [image_url]
 * @returns {Promise<import('../dto/categoryUpdateResponse.dto').CategoryUpdateResponseDto>}
 */
export async function updateCategoryUseCase(id, code, name, description = '', status = 'active', image_url = '') {
  return updateCategory(id, code, name, description, status, image_url)
}
