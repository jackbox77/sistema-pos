/**
 * Parámetros de consulta para GET /loyal-customers con filtros (query string).
 * Ej: ?status=active&document_type=CC&search=maria&page=1&limit=10
 *
 * @typedef {Object} LoyalCustomersFiltersRequestDto
 * @property {number} [page=1]
 * @property {number} [limit=10]
 * @property {string} [status] - 'active' | 'inactive'
 * @property {string} [document_type] - 'CC' | 'CE' | 'PASSPORT' | 'OTHER'
 * @property {string} [search] - Búsqueda por nombre, email, documento, etc.
 */
