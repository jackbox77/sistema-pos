/**
 * DTO de envío para crear/actualizar cliente fidelizado
 * @typedef {Object} LoyalCustomerRequestDto
 * @property {'CC'|'CE'|'PASSPORT'|'OTHER'} document_type
 * @property {string} document_number
 * @property {string} full_name
 * @property {string} [email]
 * @property {string} [phone]
 * @property {string} [birth_date]
 * @property {'active'|'inactive'} status
 */

/**
 * Crea el cuerpo de la petición para crear o actualizar cliente fidelizado
 * @param {Object} params
 * @param {'CC'|'CE'|'PASSPORT'|'OTHER'} params.document_type
 * @param {string} params.document_number
 * @param {string} params.full_name
 * @param {string} [params.email]
 * @param {string} [params.phone]
 * @param {string} [params.birth_date]
 * @param {'active'|'inactive'} [params.status='active']
 * @returns {LoyalCustomerRequestDto}
 */
export function createLoyalCustomerRequest({
  document_type,
  document_number,
  full_name,
  email = '',
  phone = '',
  birth_date = '',
  status = 'active',
}) {
  return {
    document_type,
    document_number,
    full_name,
    email,
    phone,
    birth_date,
    status,
  }
}
