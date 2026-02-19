import { login } from '../service'

/**
 * Caso de uso: login (POST /auth/login sin token)
 * @param {string} email
 * @param {string} password
 * @returns {Promise<import('../dto/loginResponse.dto').LoginResponseDto>}
 */
export async function loginUseCase(email, password) {
  return login(email, password)
}
