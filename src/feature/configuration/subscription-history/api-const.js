/**
 * Constantes de API para Historial de subscripciones
 */

const BASE = '/subscription-history'

export const SUBSCRIPTION_HISTORY_API = {
  /** GET /subscription-history?page=1&limit=10 */
  LIST: (page = 1, limit = 10) => `${BASE}?page=${page}&limit=${limit}`,
}
