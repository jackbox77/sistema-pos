/**
 * DTO de respuesta POST /storage/bucket
 *
 * Ejemplo:
 * {
 *   "success": true,
 *   "message": "Bucket creado correctamente",
 *   "data": {
 *     "bucket": "mi-bucket-mi-empresa"
 *   }
 * }
 */

/**
 * Datos internos de la respuesta de creación de bucket
 * @typedef {Object} CreateBucketDataDto
 * @property {string} bucket - Nombre del bucket creado
 */

/**
 * Respuesta exitosa POST /storage/bucket
 * @typedef {Object} CreateBucketResponseDto
 * @property {true} success
 * @property {string} message
 * @property {CreateBucketDataDto} data
 */
