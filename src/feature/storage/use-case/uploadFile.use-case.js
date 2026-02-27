import { uploadFile } from '../service'

/**
 * Caso de uso: subir archivo al bucket (POST /storage/upload)
 * @param {File} file - Archivo a subir
 * @param {string} path - Ruta/carpeta donde guardar (ej: "categorias", "productos/fotos")
 * @returns {Promise<import('../dto/uploadFileResponse.dto').UploadFileResponseDto>}
 */
export async function uploadFileUseCase(file, path) {
  return uploadFile(file, path)
}
