/**
 * DTO de envío para cerrar turno (POST /shifts/end)
 * @typedef {Object} EndShiftRequestDto
 * @property {string} end_at - ISO 8601 (ej: "2026-02-20T02:00:00Z")
 */

/**
 * Crea el cuerpo de la petición para cerrar un turno
 * @param {string} end_at - ISO 8601
 * @returns {EndShiftRequestDto}
 */
export function createEndShiftRequest(end_at) {
  return { end_at }
}
