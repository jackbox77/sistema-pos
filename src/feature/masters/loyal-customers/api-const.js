/**
 * Constantes de API para el maestro Clientes fidelizados
 */

const BASE = '/loyal-customers'

/**
 * Construye query string para GET /loyal-customers con filtros opcionales.
 * @param {{ page?: number, limit?: number, status?: string, document_type?: string, search?: string }} params
 * @returns {string} URL (ej: /loyal-customers?status=active&document_type=CC&search=maria&page=1&limit=10)
 */
function buildLoyalCustomersQuery(params = {}) {
  const q = new URLSearchParams()
  if (params.page != null) q.set('page', String(params.page))
  if (params.limit != null) q.set('limit', String(params.limit))
  if (params.status != null && params.status !== '') q.set('status', String(params.status))
  if (params.document_type != null && String(params.document_type).trim() !== '') q.set('document_type', String(params.document_type).trim())
  if (params.search != null && String(params.search).trim() !== '') q.set('search', String(params.search).trim())
  const query = q.toString()
  return query ? `${BASE}?${query}` : BASE
}

export const CLIENTES_FIDELIZADOS_API = {
  /** GET /loyal-customers?page=1&limit=10 */
  LIST: (page = 1, limit = 10) => `${BASE}?page=${page}&limit=${limit}`,
  /** GET /loyal-customers con filtros (status, document_type, search, page, limit) */
  LIST_FILTERS: buildLoyalCustomersQuery,
  /** GET /loyal-customers - Todos los clientes fidelizados (sin paginación). Para Descargar todo. */
  LIST_ALL: BASE,
  GET: (id) => `${BASE}/${id}`,
  /** POST /loyal-customers */
  CREATE: BASE,
  /** PUT /loyal-customers/:id */
  UPDATE: (id) => `${BASE}/${id}`,
  /** DELETE /loyal-customers/:id */
  DELETE: (id) => `${BASE}/${id}`,
}
