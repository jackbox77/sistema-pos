/**
 * DTO de respuesta de contacto
 */

/**
 * @typedef {Object} ContactResponseDto
 * @property {boolean} success
 * @property {string} message
 * @property {Object} data
 * @property {string} data.id
 * @property {string} data.company_id
 * @property {string} data.whatsapp_contact
 * @property {boolean} data.visibility_whatsapp_contact
 * @property {string} data.mail_contact
 * @property {boolean} data.visibility_mail_contact
 * @property {string} data.phone_contact
 * @property {boolean} data.visibility_phone_contact
 * @property {string} data.location
 * @property {boolean} data.visibility_location
 * @property {boolean} data.schedule_visibility
 * @property {import('./updateContactRequest.dto').ScheduleDay[]} data.schedule
 * @property {string} data.created_at
 * @property {string} data.updated_at
 */
