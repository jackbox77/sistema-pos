/**
 * DTO de respuesta GET /storage/bucket/validate
 *
 * Ejemplo:
 * {
 *   "success": true,
 *   "message": "",
 *   "data": {
 *     "bucket": "mi-bucket-mi-empresa",
 *     "has_bucket": true
 *   }
 * }
 */

/**
 * Datos internos de la respuesta de validación de bucket
 * @typedef {Object} ValidateBucketDataDto
 * @property {string} bucket - Nombre del bucket (ej: "mi-bucket-mi-empresa")
 * @property {boolean} has_bucket - Si el usuario ya tiene un bucket asignado
 */

/**
 * Respuesta exitosa GET /storage/bucket/validate
 * @typedef {Object} ValidateBucketResponseDto
 * @property {true} success
 * @property {string} message
 * @property {ValidateBucketDataDto} data
 */
