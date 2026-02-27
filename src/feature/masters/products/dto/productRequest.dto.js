/**
 * DTO de envío para crear/actualizar producto (POST/PUT /products)
 * @typedef {Object} ProductRequestDto
 * @property {string} category_id
 * @property {string} [image_url]
 * @property {string} code
 * @property {string} name
 * @property {string} [description]
 * @property {string} [sku]
 * @property {string} [barcode]
 * @property {number} price
 * @property {'active'|'inactive'} status
 */

/**
 * Crea el cuerpo de la petición para crear/actualizar producto
 * @param {Object} params
 * @param {string} params.category_id
 * @param {string} [params.image_url]
 * @param {string} params.code
 * @param {string} params.name
 * @param {string} [params.description]
 * @param {string} [params.sku]
 * @param {string} [params.barcode]
 * @param {number} params.price
 * @param {'active'|'inactive'} [params.status='active']
 * @returns {ProductRequestDto}
 */
export function createProductRequest({ category_id, image_url = '', code, name, description = '', sku = '', barcode = '', price, status = 'active' }) {
  return {
    category_id,
    image_url: image_url || undefined,
    code,
    name,
    description,
    sku,
    barcode,
    price,
    status,
  }
}
