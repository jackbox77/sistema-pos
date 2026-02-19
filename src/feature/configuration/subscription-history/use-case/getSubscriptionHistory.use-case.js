import { getSubscriptionHistory } from '../service'

/**
 * Caso de uso: listar historial de subscripciones
 * @param {number} [page=1]
 * @param {number} [limit=10]
 * @returns {Promise<import('../dto/subscriptionHistoryResponse.dto').SubscriptionHistoryResponseDto>}
 */
export async function getSubscriptionHistoryUseCase(page = 1, limit = 10) {
  return getSubscriptionHistory(page, limit)
}
