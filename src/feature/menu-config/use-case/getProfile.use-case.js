import { getProfile } from '../service'

/**
 * Caso de uso: obtener perfil (company + menu_config)
 * @returns {Promise<import('../dto/profileResponse.dto').ProfileResponseDto>}
 */
export async function getProfileUseCase() {
  return getProfile()
}
