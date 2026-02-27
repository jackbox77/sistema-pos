import { requestWithToken } from '../../../utils/apiMiddleware'
import { MENU_CONFIG_API } from '../api-const'

/**
 * Obtiene la información de contacto del menú (GET /menu-config-contact)
 * @returns {Promise<import('../dto/contactResponse.dto').ContactResponseDto>}
 */
export async function getContact() {
    const response = await requestWithToken.get(MENU_CONFIG_API.GET_CONTACT)
    return response
}
