/**
 * DTO de respuesta POST /storage/folders
 *
 * Ejemplo:
 * {
 *   "success": true,
 *   "message": "Carpeta creada",
 *   "data": {
 *     "path": "categorias/peces"
 *   }
 * }
 */

/**
 * Datos internos de la respuesta de creación de carpeta
 * @typedef {Object} CreateFolderDataDto
 * @property {string} path - Ruta de la carpeta creada
 */

/**
 * Respuesta exitosa POST /storage/folders
 * @typedef {Object} CreateFolderResponseDto
 * @property {true} success
 * @property {string} message
 * @property {CreateFolderDataDto} data
 */
