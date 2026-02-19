/**
 * DTO de respuesta para listado de API Keys (GET /api-keys?page=1&limit=10)
 *
 * Respuesta ejemplo:
 * {
 *   "success": true,
 *   "message": "API keys retrieved successfully",
 *   "data": {
 *     "data": [
 *       {
 *         "id": "db376299-9867-403e-a2dc-f904f19c9cbf",
 *         "company_id": "9d48445b-3132-4a09-9a54-5c8758ecf139",
 *         "api_brevo": "opcional-clave-brevo",
 *         "status": "active",
 *         "created_at": "2026-02-17T23:32:29.506391Z",
 *         "updated_at": "2026-02-17T23:33:49.420358Z"
 *       }
 *     ],
 *     "pagination": {
 *       "page": 1,
 *       "limit": 10,
 *       "total": 1,
 *       "total_pages": 1
 *     }
 *   }
 * }
 */

/** @typedef {Object} ApiKeyItemDto
 * @property {string} id
 * @property {string} company_id
 * @property {string} api_brevo
 * @property {string} status
 * @property {string} created_at
 * @property {string} updated_at
 */

/** @typedef {Object} ApiKeysPaginationDto
 * @property {number} page
 * @property {number} limit
 * @property {number} total
 * @property {number} total_pages
 */

/** @typedef {Object} ApiKeysDataDto
 * @property {ApiKeyItemDto[]} data
 * @property {ApiKeysPaginationDto} pagination
 */

/**
 * Respuesta GET /api-keys?page=1&limit=10
 * @typedef {Object} ApiKeysResponseDto
 * @property {boolean} success
 * @property {string} message
 * @property {ApiKeysDataDto} data
 */

/**
 * Respuesta PUT /api-keys (crear/actualizar)
 * {
 *   "success": true,
 *   "message": "API key created successfully",
 *   "data": {
 *     "id": "db376299-9867-403e-a2dc-f904f19c9cbf",
 *     "company_id": "9d48445b-3132-4a09-9a54-5c8758ecf139",
 *     "api_brevo": "opcional-clave-brevo",
 *     "status": "active",
 *     "created_at": "2026-02-17T23:32:29.506391Z",
 *     "updated_at": "2026-02-17T23:32:29.506726607Z"
 *   }
 * }
 * @typedef {Object} ApiKeyCreateResponseDto
 * @property {boolean} success
 * @property {string} message
 * @property {ApiKeyItemDto} data
 */

/**
 * Respuesta PUT /api-keys/:id (actualizar)
 * {
 *   "success": true,
 *   "message": "API key updated successfully",
 *   "data": { "id", "company_id", "api_brevo", "status", "created_at", "updated_at" }
 * }
 * @typedef {Object} ApiKeyUpdateResponseDto
 * @property {boolean} success
 * @property {string} message
 * @property {ApiKeyItemDto} data
 */
