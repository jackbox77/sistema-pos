import { requestWithToken } from '../../../../utils/apiMiddleware'
import { CATEGORIAS_API } from '../api-const'
import { createCategoryRequest } from '../dto/categoryRequest.dto'
import { createUpdateVisibilityRequest } from '../dto/updateVisibilityRequest.dto'

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
 * Lista categorías con filtros (GET /categories?status=active&visibility=true&search=cat&page=1&limit=10)
 * @param {Object} [params]
 * @param {number} [params.page=1]
 * @param {number} [params.limit=10]
 * @param {string} [params.status] - Ej: 'active' | 'inactive'
 * @param {boolean} [params.visibility]
 * @param {string} [params.search] - Búsqueda por código/nombre
 * @returns {Promise<import('../dto/categoriesResponse.dto').CategoriesResponseDto>}
 */
export async function getCategoriesWithFilters(params = {}) {
  const { page = 1, limit = 10, status, visibility, search } = params
  const url = CATEGORIAS_API.LIST_FILTERS({ page, limit, status, visibility, search })
  const response = await requestWithToken.get(url)
  return response
}

/**
 * Obtiene todas las categorías. Intenta GET /categories; si falla (ej. 404), usa listado paginado con límite alto.
 * @returns {Promise<import('../dto/categoriesResponse.dto').CategoriesResponseDto>}
 */
export async function getCategoriesAll() {
  try {
    const response = await requestWithToken.get(CATEGORIAS_API.LIST_ALL)
    return response
  } catch (err) {
    if (err?.status === 404 || err?.status === 405) {
      const fallback = await requestWithToken.get(CATEGORIAS_API.LIST(1, 10000))
      return fallback
    }
    throw err
  }
}

/**
 * Crea una categoría (POST /categories con token)
 * @param {string} code
 * @param {string} name
 * @param {string} [description]
 * @param {'active'|'inactive'} [status='active']
 * @param {string} [image_url]
 * @returns {Promise<import('../dto/categoryCreateResponse.dto').CategoryCreateResponseDto>}
 */
export async function createCategory(code, name, description = '', status = 'active', image_url = '') {
  const body = createCategoryRequest(code, name, description, status, image_url)
  const response = await requestWithToken.post(CATEGORIAS_API.CREATE, body)
  return response
}

/**
 * Actualiza una categoría (PUT /categories/:id con token)
 * @param {string} id
 * @param {string} code
 * @param {string} name
 * @param {string} [description]
 * @param {'active'|'inactive'} [status='active']
 * @param {string} [image_url]
 * @returns {Promise<import('../dto/categoryUpdateResponse.dto').CategoryUpdateResponseDto>}
 */
export async function updateCategory(id, code, name, description = '', status = 'active', image_url = '') {
  const body = createCategoryRequest(code, name, description, status, image_url)
  const url = CATEGORIAS_API.UPDATE(id)
  const response = await requestWithToken.put(url, body)
  return response
}

/**
 * Actualiza la visibilidad de una categoría (PUT /categories/:id/visibility)
 * @param {string} id - ID de la categoría
 * @param {boolean} visibility - true | false
 * @returns {Promise<import('../dto/updateVisibilityResponse.dto').UpdateVisibilityResponseDto>}
 */
export async function updateCategoryVisibility(id, visibility) {
  const body = createUpdateVisibilityRequest(visibility)
  const url = CATEGORIAS_API.UPDATE_VISIBILITY(id)
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
