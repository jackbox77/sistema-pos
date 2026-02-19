import { deleteTax } from '../service'

/**
 * Caso de uso: eliminar impuesto (DELETE /taxes/:id con token)
 * @param {string} id
 * @returns {Promise<import('../dto/taxDeleteResponse.dto').TaxDeleteResponseDto>}
 */
export async function deleteTaxUseCase(id) {
  return deleteTax(id)
}
