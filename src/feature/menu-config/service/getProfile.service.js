import { requestWithToken } from '../../../utils/apiMiddleware'
import { MENU_CONFIG_API } from '../api-const'

/**
 * Obtiene el perfil (company + menu_config) (GET /companies/me/profile)
 * @returns {Promise<import('../dto/profileResponse.dto').ProfileResponseDto>}
 */
export async function getProfile() {
  const response = await requestWithToken.get(MENU_CONFIG_API.GET_PROFILE)
  return response
}
