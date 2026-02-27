/**
 * DTO de respuesta POST /storage/upload (FormData: file, path)
 *
 * Ejemplo:
 * {
 *   "success": true,
 *   "message": "Archivo subido",
 *   "data": {
 *     "key": "categorias/7a696f33-700b-4680-ae6b-2888a8796637.jfif",
 *     "url": "https://s3.apptrialhub.com/mi-bucket-mi-empresa/categorias/7a696f33-700b-4680-ae6b-2888a8796637.jfif"
 *   }
 * }
 */

/**
 * Datos internos de la respuesta de subida
 * @typedef {Object} UploadFileDataDto
 * @property {string} key - Clave del objeto en el bucket (ruta + nombre)
 * @property {string} url - URL pública del archivo
 */

/**
 * Respuesta exitosa POST /storage/upload
 * @typedef {Object} UploadFileResponseDto
 * @property {true} success
 * @property {string} message
 * @property {UploadFileDataDto} data
 */
