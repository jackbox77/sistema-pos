/**
 * DTO de respuesta al actualizar producto (PUT /products/:id)
 */

/**
 * Producto actualizado en la respuesta (PUT /products/:id)
 * @typedef {Object} ProductUpdateDataDto
 * @property {string} id
 * @property {string} company_id
 * @property {string} category_id
 * @property {string} code
 * @property {string} name
 * @property {string} [description]
 * @property {string} [image_url]
 * @property {string} [sku]
 * @property {string} [barcode]
 * @property {number} price
 * @property {string} status
 * @property {string} created_at
 * @property {string} updated_at
 */

/**
 * Respuesta exitosa al actualizar producto
 * @typedef {Object} ProductUpdateResponseDto
 * @property {true} success
 * @property {string} message
 * @property {ProductUpdateDataDto} data
 */
