/**
 * DTO de envío para iniciar turno (POST /shifts/start)
 * @typedef {Object} StartShiftRequestDto
 * @property {string} name
 * @property {string} start_at - ISO 8601 (ej: "2026-02-19T20:00:00Z")
 */

/**
 * Crea el cuerpo de la petición para iniciar un turno
 * @param {string} name
 * @param {string} start_at - ISO 8601
 * @returns {StartShiftRequestDto}
 */
export function createStartShiftRequest(name, start_at) {
  return { name, start_at }
}
