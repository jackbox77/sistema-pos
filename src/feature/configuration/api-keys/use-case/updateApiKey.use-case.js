import { updateApiKey } from '../service'

/**
 * Caso de uso: actualizar API Key (PUT /api-keys/:id)
 * @param {string} id
 * @param {Object} params
 * @param {string} params.api_brevo
 * @param {'active'|'inactive'} [params.status='active']
 * @returns {Promise<import('../dto/apiKeyResponse.dto').ApiKeyUpdateResponseDto>}
 */
export async function updateApiKeyUseCase(id, params) {
  return updateApiKey(id, params)
}
