/**
 * DTO de respuesta del historial de subscripciones (GET /subscription-history?page=1&limit=10)
 *
 * Respuesta ejemplo:
 * {
 *   "success": true,
 *   "message": "Subscription history retrieved successfully",
 *   "data": {
 *     "data": [],
 *     "pagination": {
 *       "page": 1,
 *       "limit": 10,
 *       "total": 0,
 *       "total_pages": 0
 *     }
 *   }
 * }
 */

/** @typedef {Object} SubscriptionHistoryPaginationDto
 * @property {number} page
 * @property {number} limit
 * @property {number} total
 * @property {number} total_pages
 */

/** @typedef {Object} SubscriptionHistoryDataDto
 * @property {Array} data
 * @property {SubscriptionHistoryPaginationDto} pagination
 */

/**
 * Respuesta GET /subscription-history?page=1&limit=10
 * @typedef {Object} SubscriptionHistoryResponseDto
 * @property {boolean} success
 * @property {string} message
 * @property {SubscriptionHistoryDataDto} data
 */
