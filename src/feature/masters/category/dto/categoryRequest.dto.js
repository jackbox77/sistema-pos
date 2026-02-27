/**
 * DTO de envío para crear/actualizar categoría
 * @typedef {Object} CategoryRequestDto
 * @property {string} code
 * @property {string} name
 * @property {string} [description]
 * @property {'active'|'inactive'} status
 * @property {string} [image_url]
 */

/**
 * Crea el cuerpo de la petición para crear o actualizar categoría
 * @param {string} code
 * @param {string} name
 * @param {string} [description]
 * @param {'active'|'inactive'} [status='active']
 * @param {string} [image_url]
 * @returns {CategoryRequestDto}
 */
export function createCategoryRequest(code, name, description = '', status = 'active', image_url = '') {
  const body = { code, name, description, status }
  if (image_url && typeof image_url === 'string') body.image_url = image_url
  return body
}
