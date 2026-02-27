/**
 * Parámetros de consulta para GET /categories con filtros (query string).
 * No es un body; se envían como query: ?status=active&visibility=true&search=cat&page=1&limit=10
 *
 * @typedef {Object} CategoriesFiltersRequestDto
 * @property {number} [page=1]
 * @property {number} [limit=10]
 * @property {string} [status] - 'active' | 'inactive'
 * @property {boolean} [visibility] - true | false
 * @property {string} [search] - Búsqueda por código o nombre
 */
