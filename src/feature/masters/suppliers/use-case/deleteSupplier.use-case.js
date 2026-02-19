import { deleteSupplier } from '../service'

/**
 * Caso de uso: eliminar proveedor (DELETE /suppliers/:id con token)
 * @param {string} id
 * @returns {Promise<import('../dto/supplierDeleteResponse.dto').SupplierDeleteResponseDto>}
 */
export async function deleteSupplierUseCase(id) {
  return deleteSupplier(id)
}
