/**
 * DTO de envío para crear/actualizar API Key (PUT /api-keys)
 * @typedef {Object} ApiKeyRequestDto
 * @property {string} api_brevo
 * @property {'active'|'inactive'} status
 */

/**
 * Crea el cuerpo de la petición para crear/actualizar API Key
 * @param {Object} params
 * @param {string} params.api_brevo
 * @param {'active'|'inactive'} [params.status='active']
 * @returns {ApiKeyRequestDto}
 */
export function createApiKeyRequest(params) {
  return {
    api_brevo: params.api_brevo ?? '',
    status: params.status ?? 'active',
  }
}
