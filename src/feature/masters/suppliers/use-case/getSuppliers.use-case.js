import { getSuppliers } from '../service'

/**
 * Caso de uso: obtener listado de proveedores paginado
 * @param {number} [page=1]
 * @param {number} [limit=10]
 * @returns {Promise<import('../dto/suppliersResponse.dto').SuppliersResponseDto>}
 */
export async function getSuppliersUseCase(page = 1, limit = 10) {
  return getSuppliers(page, limit)
}
