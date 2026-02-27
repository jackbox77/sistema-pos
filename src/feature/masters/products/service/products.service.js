import { requestWithToken } from '../../../../utils/apiMiddleware'
import { PRODUCTOS_API } from '../api-const'
import { createProductRequest } from '../dto/productRequest.dto'
import { createUpdateVisibilityRequest } from '../dto/updateVisibilityRequest.dto'

/**
 * Lista productos con paginación (GET con token)
 * @param {number} [page=1]
 * @param {number} [limit=10]
 * @returns {Promise<import('../dto/productsResponse.dto').ProductsResponseDto>}
 */
export async function getProducts(page = 1, limit = 10) {
  const url = PRODUCTOS_API.LIST(page, limit)
  const response = await requestWithToken.get(url)
  return response
}

/**
 * Lista productos con filtros (GET /products?category_id=...&status=active&visibility=true&search=cafe&min_price=500&max_price=15000&page=1&limit=10)
 * @param {Object} [params]
 * @param {number} [params.page=1]
 * @param {number} [params.limit=10]
 * @param {string} [params.category_id] - UUID de categoría
 * @param {string} [params.status] - 'active' | 'inactive'
 * @param {boolean} [params.visibility]
 * @param {string} [params.search] - Búsqueda (código/nombre)
 * @param {number} [params.min_price]
 * @param {number} [params.max_price]
 * @param {string} [params.order_by] - 'price' | 'category_id' | 'name'
 * @param {string} [params.sort_order] - 'asc' | 'desc'
 * @returns {Promise<import('../dto/productsResponse.dto').ProductsResponseDto>}
 */
export async function getProductsWithFilters(params = {}) {
  const { page = 1, limit = 10, category_id, status, visibility, search, min_price, max_price, order_by, sort_order } = params
  const url = PRODUCTOS_API.LIST_FILTERS({ page, limit, category_id, status, visibility, search, min_price, max_price, order_by, sort_order })
  const response = await requestWithToken.get(url)
  return response
}

/**
 * Obtiene todos los productos. Intenta GET /products; si falla (404/405), usa listado paginado con límite alto.
 */
export async function getProductsAll() {
  try {
    const response = await requestWithToken.get(PRODUCTOS_API.LIST_ALL)
    return response
  } catch (err) {
    if (err?.status === 404 || err?.status === 405) {
      return requestWithToken.get(PRODUCTOS_API.LIST(1, 10000))
    }
    throw err
  }
}

/**
 * Crea un producto (POST /products con token)
 * @param {Object} params
 * @param {string} params.category_id
 * @param {string} [params.image_url]
 * @param {string} params.code
 * @param {string} params.name
 * @param {string} [params.description]
 * @param {string} [params.sku]
 * @param {string} [params.barcode]
 * @param {number} params.price
 * @param {'active'|'inactive'} [params.status='active']
 * @returns {Promise<import('../dto/productCreateResponse.dto').ProductCreateResponseDto>}
 */
export async function createProduct(params) {
  const body = createProductRequest(params)
  const response = await requestWithToken.post(PRODUCTOS_API.CREATE, body)
  return response
}

/**
 * Actualiza un producto (PUT /products/:id con token)
 * @param {string} id
 * @param {Object} params
 * @param {string} params.category_id
 * @param {string} [params.image_url]
 * @param {string} params.code
 * @param {string} params.name
 * @param {string} [params.description]
 * @param {string} [params.sku]
 * @param {string} [params.barcode]
 * @param {number} params.price
 * @param {'active'|'inactive'} [params.status='active']
 * @returns {Promise<import('../dto/productUpdateResponse.dto').ProductUpdateResponseDto>}
 */
export async function updateProduct(id, params) {
  const body = createProductRequest(params)
  const url = PRODUCTOS_API.UPDATE(id)
  const response = await requestWithToken.put(url, body)
  return response
}

/**
 * Actualiza la visibilidad de un producto (PUT /products/:id/visibility)
 * @param {string} id - ID del producto
 * @param {boolean} visibility - true | false
 * @returns {Promise<import('../dto/updateVisibilityResponse.dto').UpdateVisibilityResponseDto>}
 */
export async function updateProductVisibility(id, visibility) {
  const body = createUpdateVisibilityRequest(visibility)
  const url = PRODUCTOS_API.UPDATE_VISIBILITY(id)
  const response = await requestWithToken.put(url, body)
  return response
}

/**
 * Elimina un producto (DELETE /products/:id con token)
 * @param {string} id
 * @returns {Promise<import('../dto/productDeleteResponse.dto').ProductDeleteResponseDto>}
 */
export async function deleteProduct(id) {
  const url = PRODUCTOS_API.DELETE(id)
  const response = await requestWithToken.delete(url)
  return response
}
