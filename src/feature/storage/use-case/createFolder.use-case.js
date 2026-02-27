import { createFolder } from '../service'

/**
 * Caso de uso: crear carpeta en el bucket (POST /storage/folders)
 * @param {string} path - Ruta de la carpeta (ej: "categorias", "productos/fotos", "categorias/peces/azul")
 * @returns {Promise<import('../dto/createFolderResponse.dto').CreateFolderResponseDto>}
 */
export async function createFolderUseCase(path) {
  return createFolder(path)
}
