/**
 * DTO de respuesta al obtener empresa (GET /companies/me)
 *
 * Respuesta ejemplo:
 * {
 *   "success": true,
 *   "message": "Company retrieved successfully",
 *   "data": {
 *     "id": "9d48445b-3132-4a09-9a54-5c8758ecf139",
 *     "name": "Mi Tienda S.A.S",
 *     "email": "cdna2001@gmail.com",
 *     "phone": "+573017883059",
 *     "identification_type": "CC",
 *     "identification_number": "9001234567",
 *     "address": "Calle 100 # 50-20",
 *     "legal_representative_name": "christian noel",
 *     "status": "active",
 *     "created_at": "2026-02-17T16:19:10.694177Z",
 *     "updated_at": "2026-02-17T16:19:10.694521Z"
 *   }
 * }
 */

/** @typedef {Object} CompanyDataDto
 * @property {string} id
 * @property {string} name
 * @property {string} email
 * @property {string} phone
 * @property {string} identification_type
 * @property {string} identification_number
 * @property {string} address
 * @property {string} legal_representative_name
 * @property {string} status
 * @property {string} created_at
 * @property {string} updated_at
 */

/**
 * Respuesta GET /companies/me
 * @typedef {Object} CompanyResponseDto
 * @property {boolean} success
 * @property {string} message
 * @property {CompanyDataDto} data
 */
