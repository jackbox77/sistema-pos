import { endShift } from '../service'

/**
 * Caso de uso: cerrar turno (POST /shifts/end)
 * @param {string} end_at - ISO 8601 (ej: "2026-02-20T02:00:00Z")
 * @returns {Promise<import('../dto/endShiftResponse.dto').EndShiftResponseDto>}
 */
export async function endShiftUseCase(end_at) {
  return endShift(end_at)
}
