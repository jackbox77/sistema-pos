import { requestWithToken } from '../../../utils/apiMiddleware'
import { MENU_CONFIG_API } from '../api-const'
import { createUpdateProfileRequest } from '../dto/updateProfileRequest.dto'

/**
 * Actualiza el perfil (company + menu_config) (PUT /companies/me/profile)
 * @param {Object} params - company: { logo, business_type }, menu_config: { header_type, menu_type, ... }
 * @returns {Promise<import('../dto/profileResponse.dto').ProfileResponseDto>}
 */
export async function updateProfile(params) {
  const body = createUpdateProfileRequest(params)
  const response = await requestWithToken.put(MENU_CONFIG_API.UPDATE_PROFILE, body)
  return response
}
