/**
 * DTO de envío POST /storage/folders
 *
 * Ejemplos válidos de path: "categorias", "productos/fotos", "categorias/peces/azul"
 */

/**
 * @typedef {Object} CreateFolderRequestDto
 * @property {string} path - Ruta de la carpeta (ej: "categorias/peces")
 */

/**
 * @param {string} path - Ruta de la carpeta
 * @returns {CreateFolderRequestDto}
 */
export function createFolderRequest(path) {
  return { path: String(path ?? '').trim() }
}
