import { updateLoyalCustomer } from '../service'

/**
 * Caso de uso: actualizar cliente fidelizado (PUT /loyal-customers/:id con token)
 * @param {string} id
 * @param {Object} params
 * @param {'CC'|'CE'|'PASSPORT'|'OTHER'} params.document_type
 * @param {string} params.document_number
 * @param {string} params.full_name
 * @param {string} [params.email]
 * @param {string} [params.phone]
 * @param {string} [params.birth_date]
 * @param {'active'|'inactive'} [params.status='active']
 * @returns {Promise<import('../dto/loyalCustomerUpdateResponse.dto').LoyalCustomerUpdateResponseDto>}
 */
export async function updateLoyalCustomerUseCase(id, params) {
  return updateLoyalCustomer(id, params)
}
