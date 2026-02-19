import { createApiKey } from '../service'

/**
 * Caso de uso: crear/actualizar API Key (PUT /api-keys)
 * @param {Object} params
 * @param {string} params.api_brevo
 * @param {'active'|'inactive'} [params.status='active']
 * @returns {Promise<import('../dto/apiKeyResponse.dto').ApiKeyCreateResponseDto>}
 */
export async function createApiKeyUseCase(params) {
  return createApiKey(params)
}
