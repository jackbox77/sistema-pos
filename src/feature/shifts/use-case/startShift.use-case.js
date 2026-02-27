import { startShift } from '../service'

/**
 * Caso de uso: iniciar turno (POST /shifts/start con token)
 * @param {string} name
 * @param {string} start_at - ISO 8601 (ej: "2026-02-19T20:00:00Z")
 * @returns {Promise<import('../dto/startShiftResponse.dto').StartShiftResponseDto>}
 */
export async function startShiftUseCase(name, start_at) {
  return startShift(name, start_at)
}
