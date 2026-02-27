/**
 * DTO de respuesta GET /storage/bucket
 *
 * Ejemplo:
 * {
 *   "success": true,
 *   "message": "",
 *   "data": {
 *     "bucket": "mi-bucket-mi-empresa",
 *     "tree": {
 *       "folders": {
 *         "categorias": {
 *           "images": [
 *             { "key": "2.svg", "url": "https://s3.../categorias/2.svg" }
 *           ],
 *           "folders": {}
 *         }
 *       }
 *     }
 *   }
 * }
 */

/**
 * Imagen dentro de una carpeta en el árbol
 * @typedef {Object} BucketImageDto
 * @property {string} key - Nombre/clave del archivo
 * @property {string} url - URL pública del archivo
 */

/**
 * Nodo de carpeta en el árbol (recursivo)
 * @typedef {Object} BucketFolderNodeDto
 * @property {BucketImageDto[]} images - Lista de imágenes en esta carpeta
 * @property {Record<string, BucketFolderNodeDto>} folders - Subcarpetas por nombre
 */

/**
 * Árbol del bucket
 * @typedef {Object} BucketTreeDto
 * @property {Record<string, BucketFolderNodeDto>} folders - Carpetas raíz por nombre
 */

/**
 * Datos internos GET /storage/bucket
 * @typedef {Object} GetBucketDataDto
 * @property {string} bucket - Nombre del bucket
 * @property {BucketTreeDto} tree - Árbol de carpetas e imágenes
 */

/**
 * Respuesta exitosa GET /storage/bucket
 * @typedef {Object} GetBucketResponseDto
 * @property {true} success
 * @property {string} message
 * @property {GetBucketDataDto} data
 */
