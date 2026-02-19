import { requestWithToken } from '../../../../utils/apiMiddleware'
import { COMPANY_API } from '../api-const'
import { createCompanyRequest } from '../dto/companyRequest.dto'

/**
 * Obtiene el perfil de la empresa (GET /companies/me con token)
 * @returns {Promise<import('../dto/companyResponse.dto').CompanyResponseDto>}
 */
export async function getCompany() {
  const response = await requestWithToken.get(COMPANY_API.GET)
  return response
}

/**
 * Actualiza el perfil de la empresa (PUT /companies/me con token)
 * @param {Object} params
 * @returns {Promise<import('../dto/companyResponse.dto').CompanyResponseDto>}
 */
export async function updateCompany(params) {
  const body = createCompanyRequest(params)
  const response = await requestWithToken.put(COMPANY_API.UPDATE, body)
  return response
}
