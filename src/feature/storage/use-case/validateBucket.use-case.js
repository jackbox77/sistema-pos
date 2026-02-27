import { validateBucket } from '../service'

/**
 * Caso de uso: validar si el usuario tiene un bucket (GET /storage/bucket/validate)
 * @returns {Promise<import('../dto/validateBucketResponse.dto').ValidateBucketResponseDto>}
 */
export async function validateBucketUseCase() {
  return validateBucket()
}
