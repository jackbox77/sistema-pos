import { requestWithToken } from '../../../../utils/apiMiddleware'
import { CATEGORIAS_API } from '../api-const'
import { createCategoryRequest } from '../dto/categoryRequest.dto'

/**
 * Lista categorías con paginación (GET con token)
 * @param {number} [page=1]
 * @param {number} [limit=10]
 * @returns {Promise<import('../dto/categoriesResponse.dto').CategoriesResponseDto>}
 */
export async function getCategories(page = 1, limit = 10) {
  const url = CATEGORIAS_API.LIST(page, limit)
  const response = await requestWithToken.get(url)
  return response
}

/**
 * Crea una categoría (POST /categories con token)
 * @param {string} name
 * @param {string} [description]
 * @param {'active'|'inactive'} [status='active']
 * @returns {Promise<import('../dto/categoryCreateResponse.dto').CategoryCreateResponseDto>}
 */
export async function createCategory(name, description = '', status = 'active') {
  const body = createCategoryRequest(name, description, status)
  const response = await requestWithToken.post(CATEGORIAS_API.CREATE, body)
  return response
}

/**
 * Actualiza una categoría (PUT /categories/:id con token)
 * @param {string} id
 * @param {string} name
 * @param {string} [description]
 * @param {'active'|'inactive'} [status='active']
 * @returns {Promise<import('../dto/categoryUpdateResponse.dto').CategoryUpdateResponseDto>}
 */
export async function updateCategory(id, name, description = '', status = 'active') {
  const body = createCategoryRequest(name, description, status)
  const url = CATEGORIAS_API.UPDATE(id)
  const response = await requestWithToken.put(url, body)
  return response
}

/**
 * Elimina una categoría (DELETE /categories/:id con token)
 * @param {string} id
 * @returns {Promise<import('../dto/categoryDeleteResponse.dto').CategoryDeleteResponseDto>}
 */
export async function deleteCategory(id) {
  const url = CATEGORIAS_API.DELETE(id)
  const response = await requestWithToken.delete(url)
  return response
}
