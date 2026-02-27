import { getProductsAll } from '../service'

/**
 * Caso de uso: obtener todos los productos (GET /products/all o listado con límite alto).
 * @returns {Promise<Array<{ id: string, name: string, category_id: string, [key: string]: any }>>} Lista de productos
 */
export async function getProductsAllUseCase() {
  const res = await getProductsAll()
  if (!res?.success || !res?.data) return []
  const data = res.data
  if (Array.isArray(data)) return data
  if (Array.isArray(data?.data)) return data.data
  return []
}
