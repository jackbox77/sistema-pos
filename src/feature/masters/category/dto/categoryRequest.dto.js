/**
 * DTO de envío para crear/actualizar categoría
 * @typedef {Object} CategoryRequestDto
 * @property {string} name
 * @property {string} [description]
 * @property {'active'|'inactive'} status
 */

/**
 * Crea el cuerpo de la petición para crear o actualizar categoría
 * @param {string} name
 * @param {string} [description]
 * @param {'active'|'inactive'} [status='active']
 * @returns {CategoryRequestDto}
 */
export function createCategoryRequest(name, description = '', status = 'active') {
  return {
    name,
    description,
    status,
  }
}
