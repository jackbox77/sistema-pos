/**
 * DTO de respuesta al obtener/actualizar empresa (GET/PUT /companies/me)
 *
 * Respuesta ejemplo (actualización):
 * {
 *   "success": true,
 *   "message": "Company updated successfully",
 *   "data": {
 *     "id": "9d48445b-3132-4a09-9a54-5c8758ecf139",
 *     "name": "terraza",
 *     "slug": null,
 *     "logo": "logo.png",
 *     "business_type": "string",
 *     "email": "string",
 *     "phone": "string",
 *     "identification_type": "string",
 *     "identification_number": "string",
 *     "address": "string",
 *     "legal_representative_name": "string",
 *     "status": "string",
 *     "created_at": "2026-02-17T16:19:10.694177Z",
 *     "updated_at": "2026-02-23T16:18:29.576938132Z"
 *   }
 * }
 */

/**
 * @typedef {Object} CompanyDataDto
 * @property {string} id
 * @property {string} name
 * @property {string|null} slug
 * @property {string|null} logo
 * @property {string|null} business_type
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
 * Respuesta GET/PUT /companies/me
 * @typedef {Object} CompanyResponseDto
 * @property {boolean} success
 * @property {string} message
 * @property {CompanyDataDto} data
 */
