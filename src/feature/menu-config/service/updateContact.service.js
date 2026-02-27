import { requestWithToken } from '../../../utils/apiMiddleware'
import { MENU_CONFIG_API } from '../api-const'
import { createUpdateContactRequest } from '../dto/updateContactRequest.dto'

/**
 * Actualiza la información de contacto (PUT /menu-config-contact)
 * @param {Object} params
 * @returns {Promise<import('../dto/contactResponse.dto').ContactResponseDto>}
 */
export async function updateContact(params) {
    const body = createUpdateContactRequest(params)
    const response = await requestWithToken.put(MENU_CONFIG_API.UPDATE_CONTACT, body)
    return response
}
