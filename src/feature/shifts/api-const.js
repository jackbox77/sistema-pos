/**
 * Constantes de API para el módulo de turnos (shifts)
 */

const BASE = '/shifts'

export const SHIFTS_API = {
  /** GET /shifts?page=1&limit=10 - Listar turnos */
  LIST: (page = 1, limit = 10) => `${BASE}?page=${page}&limit=${limit}`,
  /** GET /shifts/:id - Obtener turno por ID */
  GET: (id) => `${BASE}/${id}`,
  /** POST /shifts/start - Iniciar turno */
  START: `${BASE}/start`,
  /** GET /shifts/current - Turno actual */
  CURRENT: `${BASE}/current`,
  /** POST /shifts/end - Cerrar turno (body: end_at) */
  END: `${BASE}/end`,
}
