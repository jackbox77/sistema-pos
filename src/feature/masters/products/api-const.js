/**
 * Constantes de API para el maestro Productos
 */

const BASE = '/products'

/**
 * Construye query string para GET /products con filtros opcionales.
 * @param {Object} params
 * @param {number} [params.page]
 * @param {number} [params.limit]
 * @param {string} [params.category_id] - UUID de categoría
 * @param {string} [params.status] - 'active' | 'inactive'
 * @param {boolean} [params.visibility]
 * @param {string} [params.search]
 * @param {number} [params.min_price]
 * @param {number} [params.max_price]
 * @param {string} [params.order_by] - 'price' | 'category_id' | 'name'
 * @param {string} [params.sort_order] - 'asc' | 'desc'
 * @returns {string} URL (ej: /products?order_by=price&sort_order=asc&page=1&limit=10)
 */
function buildProductsQuery(params = {}) {
  const q = new URLSearchParams()
  if (params.page != null) q.set('page', String(params.page))
  if (params.limit != null) q.set('limit', String(params.limit))
  if (params.category_id != null && String(params.category_id).trim() !== '') q.set('category_id', String(params.category_id).trim())
  if (params.status != null && params.status !== '') q.set('status', String(params.status))
  if (params.visibility !== undefined && params.visibility !== null) q.set('visibility', String(params.visibility))
  if (params.search != null && String(params.search).trim() !== '') q.set('search', String(params.search).trim())
  if (params.min_price != null && params.min_price !== '') q.set('min_price', String(params.min_price))
  if (params.max_price != null && params.max_price !== '') q.set('max_price', String(params.max_price))
  if (params.order_by != null && String(params.order_by).trim() !== '') q.set('order_by', String(params.order_by).trim())
  if (params.sort_order != null && (params.sort_order === 'asc' || params.sort_order === 'desc')) q.set('sort_order', params.sort_order)
  const query = q.toString()
  return query ? `${BASE}?${query}` : BASE
}

export const PRODUCTOS_API = {
  /** GET /products?page=1&limit=10 */
  LIST: (page = 1, limit = 10) => `${BASE}?page=${page}&limit=${limit}`,
  /** GET /products con filtros (category_id, status, visibility, search, min_price, max_price, page, limit) */
  LIST_FILTERS: buildProductsQuery,
  /** GET /products - Todos los productos (sin paginación). Para Descargar todo. */
  LIST_ALL: BASE,
  GET: (id) => `${BASE}/${id}`,
  /** POST /products */
  CREATE: BASE,
  /** PUT /products/:id */
  UPDATE: (id) => `${BASE}/${id}`,
  /** PUT /products/:id/visibility - Actualizar visibilidad (body: { visibility: true|false }) */
  UPDATE_VISIBILITY: (id) => `${BASE}/${id}/visibility`,
  /** DELETE /products/:id */
  DELETE: (id) => `${BASE}/${id}`,
}
