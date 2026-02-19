import { getLoyalCustomers } from '../service'

/**
 * Caso de uso: obtener listado de clientes fidelizados paginado
 * @param {number} [page=1]
 * @param {number} [limit=10]
 * @returns {Promise<import('../dto/loyalCustomersResponse.dto').LoyalCustomersResponseDto>}
 */
export async function getLoyalCustomersUseCase(page = 1, limit = 10) {
  return getLoyalCustomers(page, limit)
}
