/**
 * Parámetros de consulta para GET /suppliers con filtros (query string).
 * Ej: ?status=active&document_type=NIT&search=acme&page=1&limit=10
 *
 * @typedef {Object} SuppliersFiltersRequestDto
 * @property {number} [page=1]
 * @property {number} [limit=10]
 * @property {string} [status] - 'active' | 'inactive'
 * @property {string} [document_type] - 'NIT' | 'CC' | 'CE' | 'PASSPORT' | 'OTHER'
 * @property {string} [search] - Búsqueda por nombre, documento, contacto, etc.
 */
