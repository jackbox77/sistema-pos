/**
 * DTO de respuesta PATCH /categories/:id/visibility
 *
 * Respuesta ejemplo:
 * {
 *   "success": true,
 *   "message": "Category visibility updated successfully",
 *   "data": {
 *     "id": "1369964f-bee9-4bec-a507-a176de1c8f30",
 *     "company_id": "...",
 *     "code": "BEB",
 *     "name": "Bebidas1",
 *     "description": "Opcional",
 *     "status": "active",
 *     "visibility": true,
 *     "created_at": "...",
 *     "updated_at": "...",
 *     "product_count": 0
 *   }
 * }
 */

/**
 * @typedef {Object} CategoryVisibilityDataDto
 * @property {string} id
 * @property {string} company_id
 * @property {string} code
 * @property {string} name
 * @property {string} [description]
 * @property {string} status
 * @property {boolean} visibility
 * @property {string} created_at
 * @property {string} updated_at
 * @property {number} product_count
 */

/**
 * @typedef {Object} UpdateVisibilityResponseDto
 * @property {boolean} success
 * @property {string} message
 * @property {CategoryVisibilityDataDto} data
 */
