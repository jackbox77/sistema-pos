import { getShift } from '../service'

/**
 * Caso de uso: obtener turno por ID (GET /shifts/:id con token)
 * @param {string} id
 * @returns {Promise<import('../dto/getShiftResponse.dto').GetShiftResponseDto>}
 */
export async function getShiftUseCase(id) {
  return getShift(id)
}
