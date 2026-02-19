import { updateCompany } from '../service'

/**
 * Caso de uso: actualizar perfil de empresa
 * @param {Object} params
 * @returns {Promise<import('../dto/companyResponse.dto').CompanyResponseDto>}
 */
export async function updateCompanyUseCase(params) {
  return updateCompany(params)
}
