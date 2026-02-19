import { createCategory } from '../service'

/**
 * Caso de uso: crear categoría (POST /categories con token)
 * @param {string} name
 * @param {string} [description]
 * @param {'active'|'inactive'} [status='active']
 * @returns {Promise<import('../dto/categoryCreateResponse.dto').CategoryCreateResponseDto>}
 */
export async function createCategoryUseCase(name, description = '', status = 'active') {
  return createCategory(name, description, status)
}
