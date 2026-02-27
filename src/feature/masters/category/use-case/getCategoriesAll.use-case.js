import { getCategoriesAll } from '../service'

/**
 * Caso de uso: obtener todas las categorías (GET /categories/all o listado con límite alto).
 * @returns {Promise<Array<{ id: string, name: string, [key: string]: any }>>} Lista de categorías
 */
export async function getCategoriesAllUseCase() {
  const res = await getCategoriesAll()
  if (!res?.success || !res?.data) return []
  const data = res.data
  if (Array.isArray(data)) return data
  if (Array.isArray(data?.data)) return data.data
  return []
}
