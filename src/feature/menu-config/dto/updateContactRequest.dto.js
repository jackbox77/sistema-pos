/**
 * DTO de envío PUT /menu-config-contact
 */

/**
 * @typedef {Object} ScheduleSlot
 * @property {string} from
 * @property {string} to
 */

/**
 * @typedef {Object} ScheduleDay
 * @property {number} day
 * @property {ScheduleSlot[]} slots
 */

/**
 * @typedef {Object} UpdateContactRequestDto
 * @property {string} [whatsapp_contact]
 * @property {boolean} [visibility_whatsapp_contact]
 * @property {string} [mail_contact]
 * @property {boolean} [visibility_mail_contact]
 * @property {string} [phone_contact]
 * @property {boolean} [visibility_phone_contact]
 * @property {string} [location]
 * @property {boolean} [visibility_location]
 * @property {boolean} [schedule_visibility]
 * @property {ScheduleDay[]} [schedule]
 */

/**
 * Crea el cuerpo para actualizar el contacto (PUT /menu-config-contact)
 * @param {Object} params
 * @returns {UpdateContactRequestDto}
 */
export function createUpdateContactRequest(params = {}) {
    const body = {}

    if (params.whatsapp_contact !== undefined) body.whatsapp_contact = params.whatsapp_contact
    if (params.visibility_whatsapp_contact !== undefined) body.visibility_whatsapp_contact = params.visibility_whatsapp_contact
    if (params.mail_contact !== undefined) body.mail_contact = params.mail_contact
    if (params.visibility_mail_contact !== undefined) body.visibility_mail_contact = params.visibility_mail_contact
    if (params.phone_contact !== undefined) body.phone_contact = params.phone_contact
    if (params.visibility_phone_contact !== undefined) body.visibility_phone_contact = params.visibility_phone_contact
    if (params.location !== undefined) body.location = params.location
    if (params.visibility_location !== undefined) body.visibility_location = params.visibility_location
    if (params.schedule_visibility !== undefined) body.schedule_visibility = params.schedule_visibility
    if (params.schedule !== undefined) body.schedule = params.schedule

    return body
}
