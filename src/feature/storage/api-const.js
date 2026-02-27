/**
 * Constantes de API para el módulo de storage (S3 / bucket)
 */

const BASE = '/storage'

export const STORAGE_API = {
  /** GET /storage/bucket/validate - Verifica si el usuario ya tiene un bucket */
  BUCKET_VALIDATE: `${BASE}/bucket/validate`,
  /** GET /storage/bucket - Obtener bucket y árbol de carpetas/imágenes */
  BUCKET_GET: `${BASE}/bucket`,
  /** POST /storage/bucket - Crear bucket (solo si el usuario no tiene uno) */
  BUCKET_CREATE: `${BASE}/bucket`,
  /** POST /storage/folders - Crear carpeta en el bucket (body: { path }) */
  FOLDERS_CREATE: `${BASE}/folders`,
  /** POST /storage/upload - Subir archivo (FormData: file, path) */
  UPLOAD: `${BASE}/upload`,
}
