import { validateBucket, createBucket } from '../service'

/**
 * Caso de uso: crear bucket (POST /storage/bucket).
 * Solo permite crear si el usuario no tiene bucket; si ya tiene uno, rechaza sin llamar al API.
 * @param {Object} [body={}] - Body opcional para POST
 * @returns {Promise<import('../dto/createBucketResponse.dto').CreateBucketResponseDto>}
 * @throws {Error} Si el usuario ya tiene un bucket (has_bucket === true)
 */
export async function createBucketUseCase(body = {}) {
  const validateRes = await validateBucket()
  if (validateRes?.success && validateRes?.data?.has_bucket === true) {
    const err = new Error('Ya tienes un bucket asignado. No se puede crear otro.')
    err.code = 'BUCKET_ALREADY_EXISTS'
    throw err
  }
  return createBucket(body)
}
