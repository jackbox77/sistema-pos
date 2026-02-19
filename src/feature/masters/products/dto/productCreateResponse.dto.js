/**
 * DTO de respuesta al crear producto (POST /products)
 */

/**
 * Producto creado en la respuesta
 * @typedef {Object} ProductCreateDataDto
 * @property {string} id
 * @property {string} company_id
 * @property {string} category_id
 * @property {string} name
 * @property {string} [description]
 * @property {string} [sku]
 * @property {string} [barcode]
 * @property {number} price
 * @property {string} status
 * @property {string} created_at
 * @property {string} updated_at
 */

/**
 * Respuesta exitosa al crear producto
 * @typedef {Object} ProductCreateResponseDto
 * @property {true} success
 * @property {string} message
 * @property {ProductCreateDataDto} data
 */
