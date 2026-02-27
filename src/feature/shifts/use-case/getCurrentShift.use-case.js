import { getCurrentShift } from '../service'

/**
 * Caso de uso: obtener turno actual (GET /shifts/current con token)
 * @returns {Promise<import('../dto/currentShiftResponse.dto').CurrentShiftResponseDto>}
 */
export async function getCurrentShiftUseCase() {
  return getCurrentShift()
}
