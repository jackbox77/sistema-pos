import { requestWithToken } from '../../../../utils/apiMiddleware'
import { SUBSCRIPTION_HISTORY_API } from '../api-const'

/**
 * Lista historial de subscripciones con paginación (GET /subscription-history con token)
 * @param {number} [page=1]
 * @param {number} [limit=10]
 * @returns {Promise<import('../dto/subscriptionHistoryResponse.dto').SubscriptionHistoryResponseDto>}
 */
export async function getSubscriptionHistory(page = 1, limit = 10) {
  const url = SUBSCRIPTION_HISTORY_API.LIST(page, limit)
  const response = await requestWithToken.get(url)
  return response
}
