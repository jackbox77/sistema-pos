/**
 * DTO de envío para actualizar empresa (PUT /companies/me)
 * Body: name, email, phone, identification_type, identification_number, address, legal_representative_name, status
 *
 * @typedef {Object} CompanyRequestDto
 * @property {string} name
 * @property {string} email
 * @property {string} phone
 * @property {string} identification_type
 * @property {string} identification_number
 * @property {string} address
 * @property {string} legal_representative_name
 * @property {string} status
 */

/**
 * Crea el cuerpo de la petición para actualizar empresa
 * @param {Object} params
 * @returns {CompanyRequestDto}
 */
export function createCompanyRequest(params) {
  return {
    name: params.name ?? '',
    email: params.email ?? '',
    phone: params.phone ?? '',
    identification_type: params.identification_type ?? '',
    identification_number: params.identification_number ?? '',
    address: params.address ?? '',
    legal_representative_name: params.legal_representative_name ?? '',
    status: params.status ?? 'active',
  }
}
