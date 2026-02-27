/**
 * Constantes de API para el maestro Proveedores
 */

const BASE = '/suppliers'

/**
 * Construye query string para GET /suppliers con filtros opcionales.
 * @param {{ page?: number, limit?: number, status?: string, document_type?: string, search?: string, document_number?: string }} params
 * @returns {string} URL (ej: /suppliers?status=active&search=acme&document_number=900&page=1&limit=10)
 */
function buildSuppliersQuery(params = {}) {
  const q = new URLSearchParams()
  if (params.page != null) q.set('page', String(params.page))
  if (params.limit != null) q.set('limit', String(params.limit))
  if (params.status != null && params.status !== '') q.set('status', String(params.status))
  if (params.document_type != null && String(params.document_type).trim() !== '') q.set('document_type', String(params.document_type).trim())
  if (params.search != null && String(params.search).trim() !== '') q.set('search', String(params.search).trim())
  if (params.document_number != null && String(params.document_number).trim() !== '') q.set('document_number', String(params.document_number).trim())
  const query = q.toString()
  return query ? `${BASE}?${query}` : BASE
}

export const PROVEEDORES_API = {
  /** GET /suppliers?page=1&limit=10 */
  LIST: (page = 1, limit = 10) => `${BASE}?page=${page}&limit=${limit}`,
  /** GET /suppliers con filtros (status, document_type, search, page, limit) */
  LIST_FILTERS: buildSuppliersQuery,
  /** GET /suppliers - Todos los proveedores (sin paginación). Para Descargar todo. */
  LIST_ALL: BASE,
  GET: (id) => `${BASE}/${id}`,
  /** POST /suppliers */
  CREATE: BASE,
  /** PUT /suppliers/:id */
  UPDATE: (id) => `${BASE}/${id}`,
  /** DELETE /suppliers/:id */
  DELETE: (id) => `${BASE}/${id}`,
}
