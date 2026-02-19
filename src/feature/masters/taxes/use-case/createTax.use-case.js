import { createTax } from '../service'

/**
 * Caso de uso: crear impuesto (POST /taxes con token)
 * @param {string} code
 * @param {string} name
 * @param {number} percentage
 * @param {string} [description]
 * @param {'active'|'inactive'} [status='active']
 * @returns {Promise<import('../dto/taxCreateResponse.dto').TaxCreateResponseDto>}
 */
export async function createTaxUseCase(code, name, percentage, description = '', status = 'active') {
  return createTax(code, name, percentage, description, status)
}
