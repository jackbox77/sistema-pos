import { requestWithoutToken, requestWithToken } from '../../../utils/apiMiddleware'
import { AUTH_API } from '../api-const'
import { createLoginRequest } from '../dto/loginRequest.dto'

/**
 * Login: POST /auth/login sin token
 * @param {string} email
 * @param {string} password
 * @returns {Promise<import('../dto/loginResponse.dto').LoginResponseDto>}
 */
export async function login(email, password) {
  const body = createLoginRequest(email, password)
  const response = await requestWithoutToken.post(AUTH_API.LOGIN, body)
  return response
}

/**
 * Logout: POST /auth/logout con token
 * @returns {Promise<import('../dto/logoutResponse.dto').LogoutResponseDto>}
 */
export async function logout() {
  const response = await requestWithToken.post(AUTH_API.LOGOUT, {})
  return response
}
