import { getLoyalCustomersAll } from '../service'

/**
 * Caso de uso: obtener todos los clientes fidelizados (GET /loyal-customers/all o listado con límite alto).
 * @returns {Promise<Array>} Lista de clientes fidelizados
 */
export async function getLoyalCustomersAllUseCase() {
  const res = await getLoyalCustomersAll()
  if (!res?.success || !res?.data) return []
  const data = res.data
  if (Array.isArray(data)) return data
  if (Array.isArray(data?.data)) return data.data
  return []
}
