import { getTaxes } from '../service'

/**
 * Caso de uso: obtener listado de impuestos paginado
 * @param {number} [page=1]
 * @param {number} [limit=10]
 * @returns {Promise<import('../dto/taxesResponse.dto').TaxesResponseDto>}
 */
export async function getTaxesUseCase(page = 1, limit = 10) {
  return getTaxes(page, limit)
}
