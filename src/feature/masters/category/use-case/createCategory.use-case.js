import { createCategory } from '../service'

/**
 * Caso de uso: crear categoría (POST /categories con token)
 * @param {string} code
 * @param {string} name
 * @param {string} [description]
 * @param {'active'|'inactive'} [status='active']
 * @param {string} [image_url]
 * @returns {Promise<import('../dto/categoryCreateResponse.dto').CategoryCreateResponseDto>}
 */
export async function createCategoryUseCase(code, name, description = '', status = 'active', image_url = '') {
  return createCategory(code, name, description, status, image_url)
}
