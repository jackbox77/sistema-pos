import { regenerateApiKey } from '../service'

/**
 * Caso de uso: regenerar API Key
 * @returns {Promise<import('../dto/apiKeyResponse.dto').ApiKeyResponseDto>}
 */
export async function regenerateApiKeyUseCase() {
  return regenerateApiKey()
}
