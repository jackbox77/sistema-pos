import { getCompany } from '../service'

/**
 * Caso de uso: obtener perfil de empresa
 * @returns {Promise<import('../dto/companyResponse.dto').CompanyResponseDto>}
 */
export async function getCompanyUseCase() {
  return getCompany()
}
