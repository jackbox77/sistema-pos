import { getBucket } from '../service'

/**
 * Caso de uso: obtener bucket y árbol de carpetas/imágenes (GET /storage/bucket)
 * @returns {Promise<import('../dto/getBucketResponse.dto').GetBucketResponseDto>}
 */
export async function getBucketUseCase() {
  return getBucket()
}
