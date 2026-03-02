/**
 * DTO de respuesta GET /companies/me/profile
 *
 * Respuesta ejemplo:
 * {
 *   "success": true,
 *   "message": "Profile retrieved successfully",
 *   "data": {
 *     "company": { ... },
 *     "menu_config": null
 *   }
 * }
 */

/**
 * @typedef {Object} CompanyProfileDto
 * @property {string} id
 * @property {string} name
 * @property {string|null} slug
 * @property {string|null} subtitle
 * @property {string|null} description
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
 * menu_config en respuesta (GET/PUT /companies/me/profile)
 * @typedef {Object} MenuConfigDto
 * @property {string} id
 * @property {string} company_id
 * @property {string} header_type
 * @property {string} menu_type
 * @property {string} visualization
 * @property {string} view_more
 * @property {string} menu_background_color
 * @property {string} content_background_color
 * @property {string} text_color
 * @property {string} title_color
 * @property {string} subtitle_color
 * @property {string} price_color
 * @property {string} accent_color
 * @property {string} contact_icon_color
 * @property {string} contact_text_color
 * @property {string} contact_background_color
 * @property {string} created_at
 * @property {string} updated_at
 */

/**
 * @typedef {Object} ProfileDataDto
 * @property {CompanyProfileDto} company
 * @property {MenuConfigDto|null} menu_config
 */

/**
 * Respuesta GET /companies/me/profile
 * @typedef {Object} ProfileResponseDto
 * @property {boolean} success
 * @property {string} message
 * @property {ProfileDataDto} data
 */
