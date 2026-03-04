import { requestWithToken } from '../../../utils/apiMiddleware'
import { MENU_CONFIG_API } from '../api-const'
import { createUpdateProfileRequest } from '../dto/updateProfileRequest.dto'

/**
 * Actualiza el perfil (company + menu_config) (PUT /companies/me/profile)
 * @param {Object} params - company: { logo, business_type }, menu_config: { header_type, menu_type, colores... }
 * @returns {Promise<import('../dto/profileResponse.dto').ProfileResponseDto>}
 */
/** Si tu backend espera el payload dentro de { data: { company, menu_config } }, define VITE_PROFILE_PAYLOAD_DATA=true en .env */
const WRAP_PAYLOAD_IN_DATA = typeof import.meta !== 'undefined' && import.meta.env?.VITE_PROFILE_PAYLOAD_DATA === 'true'

export async function updateProfile(params) {
  const payload = createUpdateProfileRequest(params)
  const body = WRAP_PAYLOAD_IN_DATA ? { data: payload } : payload
  if (typeof import.meta !== 'undefined' && import.meta.env?.DEV) {
    // eslint-disable-next-line no-console
    console.log('[updateProfile] body enviado:', JSON.stringify(body, null, 2))
  }
  const response = await requestWithToken.put(MENU_CONFIG_API.UPDATE_PROFILE, body)
  return response
}
