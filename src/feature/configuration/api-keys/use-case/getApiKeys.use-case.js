import { getApiKeys } from '../service'

/**
 * Caso de uso: listar API Keys con paginación
 * @param {number} [page=1]
 * @param {number} [limit=10]
 * @returns {Promise<import('../dto/apiKeyResponse.dto').ApiKeysResponseDto>}
 */
export async function getApiKeysUseCase(page = 1, limit = 10) {
  return getApiKeys(page, limit)
}
