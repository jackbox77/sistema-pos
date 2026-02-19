/**
 * DTO de envío para login
 * @typedef {Object} LoginRequestDto
 * @property {string} email
 * @property {string} password
 */

/**
 * Crea el cuerpo de la petición de login
 * @param {string} email
 * @param {string} password
 * @returns {LoginRequestDto}
 */
export function createLoginRequest(email, password) {
  return { email, password }
}
