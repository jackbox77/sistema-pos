import { requestWithToken, apiWithToken } from '../../../utils/apiMiddleware'
import { STORAGE_API } from '../api-const'
import { createFolderRequest } from '../dto/createFolderRequest.dto'

/**
 * Valida si el usuario tiene un bucket: GET /storage/bucket/validate
 * @returns {Promise<import('../dto/validateBucketResponse.dto').ValidateBucketResponseDto>}
 */
export async function validateBucket() {
  const response = await requestWithToken.get(STORAGE_API.BUCKET_VALIDATE)
  return response
}

/**
 * Obtiene el bucket del usuario y el árbol de carpetas/imágenes: GET /storage/bucket
 * @returns {Promise<import('../dto/getBucketResponse.dto').GetBucketResponseDto>}
 */
export async function getBucket() {
  const response = await requestWithToken.get(STORAGE_API.BUCKET_GET)
  return response
}

/**
 * Crea un bucket para el usuario: POST /storage/bucket
 * El backend debe rechazar si el usuario ya tiene bucket.
 * @param {Object} [body={}] - Body opcional (ej: { name } si el API lo acepta)
 * @returns {Promise<import('../dto/createBucketResponse.dto').CreateBucketResponseDto>}
 */
export async function createBucket(body = {}) {
  const response = await requestWithToken.post(STORAGE_API.BUCKET_CREATE, body)
  return response
}

/**
 * Crea una carpeta en el bucket: POST /storage/folders
 * @param {string} path - Ruta de la carpeta (ej: "categorias", "productos/fotos", "categorias/peces/azul")
 * @returns {Promise<import('../dto/createFolderResponse.dto').CreateFolderResponseDto>}
 */
export async function createFolder(path) {
  const body = createFolderRequest(path)
  const response = await requestWithToken.post(STORAGE_API.FOLDERS_CREATE, body)
  return response
}

/**
 * Sube un archivo al bucket: POST /storage/upload (FormData: file, path)
 * Usa apiWithToken para enviar FormData sin stringify.
 * @param {File} file - Archivo a subir
 * @param {string} path - Ruta/carpeta donde guardar (ej: "categorias", "productos/fotos")
 * @returns {Promise<import('../dto/uploadFileResponse.dto').UploadFileResponseDto>}
 */
export async function uploadFile(file, path) {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('path', String(path ?? '').trim())
  const response = await apiWithToken(STORAGE_API.UPLOAD, {
    method: 'POST',
    body: formData,
  })
  return response
}
