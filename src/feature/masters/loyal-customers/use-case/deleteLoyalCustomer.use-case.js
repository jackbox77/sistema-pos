import { deleteLoyalCustomer } from '../service'

/**
 * Caso de uso: eliminar cliente fidelizado (DELETE /loyal-customers/:id con token)
 * @param {string} id
 * @returns {Promise<import('../dto/loyalCustomerDeleteResponse.dto').LoyalCustomerDeleteResponseDto>}
 */
export async function deleteLoyalCustomerUseCase(id) {
  return deleteLoyalCustomer(id)
}
