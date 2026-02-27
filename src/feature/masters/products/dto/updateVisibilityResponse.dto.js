/**
 * DTO de respuesta PATCH /products/:id/visibility
 *
 * Respuesta ejemplo:
 * {
 *   "success": true,
 *   "message": "Product visibility updated successfully",
 *   "data": {
 *     "id": "f643f234-10df-47b7-92d2-9c3c2464c410",
 *     "company_id": "...",
 *     "category_id": "...",
 *     "code": "COCA-500",
 *     "name": "Coca-Cola 400ml",
 *     "description": "Gaseosa",
 *     "image_url": "https://ejemplo.com/imagen.jpg",
 *     "sku": "SKU-001",
 *     "barcode": "7701234567890",
 *     "price": 2500,
 *     "status": "active",
 *     "visibility": true,
 *     "created_at": "...",
 *     "updated_at": "..."
 *   }
 * }
 */

/**
 * @typedef {Object} ProductVisibilityDataDto
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
 * @property {boolean} visibility
 * @property {string} created_at
 * @property {string} updated_at
 */

/**
 * @typedef {Object} UpdateVisibilityResponseDto
 * @property {boolean} success
 * @property {string} message
 * @property {ProductVisibilityDataDto} data
 */
