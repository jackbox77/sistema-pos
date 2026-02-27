import { getSuppliersAll } from '../service'

/**
 * Caso de uso: obtener todos los proveedores (GET /suppliers/all o listado con límite alto).
 * @returns {Promise<Array>} Lista de proveedores
 */
export async function getSuppliersAllUseCase() {
  const res = await getSuppliersAll()
  if (!res?.success || !res?.data) return []
  const data = res.data
  if (Array.isArray(data)) return data
  if (Array.isArray(data?.data)) return data.data
  return []
}
