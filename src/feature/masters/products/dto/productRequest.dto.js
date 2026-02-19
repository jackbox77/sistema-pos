/**
 * DTO de envío para crear/actualizar producto
 * @typedef {Object} ProductRequestDto
 * @property {string} category_id
 * @property {string} name
 * @property {string} [description]
 * @property {string} [sku]
 * @property {string} [barcode]
 * @property {number} price
 * @property {'active'|'inactive'} status
 */

/**
 * Crea el cuerpo de la petición para crear producto
 * @param {Object} params
 * @param {string} params.category_id
 * @param {string} params.name
 * @param {string} [params.description]
 * @param {string} [params.sku]
 * @param {string} [params.barcode]
 * @param {number} params.price
 * @param {'active'|'inactive'} [params.status='active']
 * @returns {ProductRequestDto}
 */
export function createProductRequest({ category_id, name, description = '', sku = '', barcode = '', price, status = 'active' }) {
  return {
    category_id,
    name,
    description,
    sku,
    barcode,
    price,
    status,
  }
}
