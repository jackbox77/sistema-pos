import { logout } from '../service'

/**
 * Caso de uso: logout (POST /auth/logout con token)
 * @returns {Promise<import('../dto/logoutResponse.dto').LogoutResponseDto>}
 */
export async function logoutUseCase() {
  return logout()
}
