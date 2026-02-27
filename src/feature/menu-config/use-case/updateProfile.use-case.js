import { updateProfile } from '../service'

/**
 * Caso de uso: actualizar perfil (company + menu_config)
 * @param {Object} params - company: { logo, business_type }, menu_config: { header_type, menu_type, visualization, view_more, colores... }
 * @returns {Promise<import('../dto/profileResponse.dto').ProfileResponseDto>}
 */
export async function updateProfileUseCase(params) {
  return updateProfile(params)
}
