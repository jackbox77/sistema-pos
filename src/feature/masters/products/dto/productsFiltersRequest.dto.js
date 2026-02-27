/**
 * Parámetros de consulta para GET /products con filtros (query string).
 * Ej: ?category_id=...&status=active&visibility=true&search=cafe&min_price=500&max_price=15000&page=1&limit=10
 *
 * @typedef {Object} ProductsFiltersRequestDto
 * @property {number} [page=1]
 * @property {number} [limit=10]
 * @property {string} [category_id] - UUID de categoría
 * @property {string} [status] - 'active' | 'inactive'
 * @property {boolean} [visibility] - true | false
 * @property {string} [search] - Búsqueda por código o nombre
 * @property {number} [min_price]
 * @property {number} [max_price]
 */
