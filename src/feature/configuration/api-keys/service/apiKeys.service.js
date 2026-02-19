import { requestWithToken } from '../../../../utils/apiMiddleware'
import { API_KEYS_API } from '../api-const'
import { createApiKeyRequest } from '../dto/apiKeyRequest.dto'

/**
 * Lista API Keys con paginación (GET /api-keys?page=1&limit=10 con token)
 * @param {number} [page=1]
 * @param {number} [limit=10]
 * @returns {Promise<import('../dto/apiKeyResponse.dto').ApiKeysResponseDto>}
 */
export async function getApiKeys(page = 1, limit = 10) {
  const url = API_KEYS_API.LIST(page, limit)
  const response = await requestWithToken.get(url)
  return response
}

/**
 * Crea/actualiza API Key (PUT /api-keys con token)
 * @param {Object} params
 * @param {string} params.api_brevo
 * @param {'active'|'inactive'} [params.status='active']
 * @returns {Promise<import('../dto/apiKeyResponse.dto').ApiKeyCreateResponseDto>}
 */
export async function createApiKey(params) {
  const body = createApiKeyRequest(params)
  const response = await requestWithToken.put(API_KEYS_API.CREATE, body)
  return response
}

/**
 * Actualiza API Key (PUT /api-keys/:id con token)
 * @param {string} id
 * @param {Object} params
 * @param {string} params.api_brevo
 * @param {'active'|'inactive'} [params.status='active']
 * @returns {Promise<import('../dto/apiKeyResponse.dto').ApiKeyUpdateResponseDto>}
 */
export async function updateApiKey(id, params) {
  const body = createApiKeyRequest(params)
  const url = API_KEYS_API.UPDATE(id)
  const response = await requestWithToken.put(url, body)
  return response
}

/**
 * Regenera la API Key (POST /api-keys/regenerate con token)
 * @returns {Promise<import('../dto/apiKeyResponse.dto').ApiKeyResponseDto>}
 */
export async function regenerateApiKey() {
  const response = await requestWithToken.post(API_KEYS_API.REGENERATE, {})
  return response
}
