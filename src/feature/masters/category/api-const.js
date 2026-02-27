/**
 * Constantes de API para el maestro Categorías
 */

const BASE = '/categories'

/**
 * Construye query string para GET /categories con filtros opcionales.
 * @param {{ page?: number, limit?: number, status?: string, visibility?: boolean, search?: string }} params
 * @returns {string} URL con query (ej: /categories?status=active&visibility=true&search=cat&page=1&limit=10)
 */
function buildCategoriesQuery(params = {}) {
  const q = new URLSearchParams()
  if (params.page != null) q.set('page', String(params.page))
  if (params.limit != null) q.set('limit', String(params.limit))
  if (params.status != null && params.status !== '') q.set('status', String(params.status))
  if (params.visibility !== undefined && params.visibility !== null) q.set('visibility', String(params.visibility))
  if (params.search != null && String(params.search).trim() !== '') q.set('search', String(params.search).trim())
  const query = q.toString()
  return query ? `${BASE}?${query}` : BASE
}

export const CATEGORIAS_API = {
  /** GET /categories?page=1&limit=10 */
  LIST: (page = 1, limit = 10) => `${BASE}?page=${page}&limit=${limit}`,
  /** GET /categories?status=active&visibility=true&search=cat&page=1&limit=10 - Listado con filtros */
  LIST_FILTERS: buildCategoriesQuery,
  /** GET /categories - Todas las categorías (sin paginación). Para Descargar todo. */
  LIST_ALL: BASE,
  GET: (id) => `${BASE}/${id}`,
  /** POST /categories */
  CREATE: BASE,
  /** PUT /categories/:id */
  UPDATE: (id) => `${BASE}/${id}`,
  /** PUT /categories/:id/visibility - Actualizar visibilidad (body: { visibility: true|false }) */
  UPDATE_VISIBILITY: (id) => `${BASE}/${id}/visibility`,
  /** DELETE /categories/:id */
  DELETE: (id) => `${BASE}/${id}`,
}
