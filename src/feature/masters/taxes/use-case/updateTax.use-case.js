import { updateTax } from '../service'

/**
 * Caso de uso: actualizar impuesto (PUT /taxes/:id con token)
 * @param {string} id
 * @param {string} code
 * @param {string} name
 * @param {number} percentage
 * @param {string} [description]
 * @param {'active'|'inactive'} [status='active']
 * @returns {Promise<import('../dto/taxUpdateResponse.dto').TaxUpdateResponseDto>}
 */
export async function updateTaxUseCase(id, code, name, percentage, description = '', status = 'active') {
  return updateTax(id, code, name, percentage, description, status)
}
