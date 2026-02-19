import { createLoyalCustomer } from '../service'

/**
 * Caso de uso: crear cliente fidelizado (POST /loyal-customers con token)
 * @param {Object} params
 * @param {'CC'|'CE'|'PASSPORT'|'OTHER'} params.document_type
 * @param {string} params.document_number
 * @param {string} params.full_name
 * @param {string} [params.email]
 * @param {string} [params.phone]
 * @param {string} [params.birth_date]
 * @param {'active'|'inactive'} [params.status='active']
 * @returns {Promise<import('../dto/loyalCustomerCreateResponse.dto').LoyalCustomerCreateResponseDto>}
 */
export async function createLoyalCustomerUseCase(params) {
  return createLoyalCustomer(params)
}
