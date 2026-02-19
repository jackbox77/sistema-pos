import { requestWithToken } from '../../../../utils/apiMiddleware'
import { PRODUCTOS_API } from '../api-const'
import { createProductRequest } from '../dto/productRequest.dto'

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
 * Crea un producto (POST /products con token)
 * @param {Object} params
 * @param {string} params.category_id
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
 * Elimina un producto (DELETE /products/:id con token)
 * @param {string} id
 * @returns {Promise<import('../dto/productDeleteResponse.dto').ProductDeleteResponseDto>}
 */
export async function deleteProduct(id) {
  const url = PRODUCTOS_API.DELETE(id)
  const response = await requestWithToken.delete(url)
  return response
}
