import { getShifts } from '../service'

/**
 * Caso de uso: listar turnos (GET /shifts con token)
 * @param {number} [page=1]
 * @param {number} [limit=10]
 * @returns {Promise<import('../dto/shiftsListResponse.dto').ShiftsListResponseDto>}
 */
export async function getShiftsUseCase(page = 1, limit = 10) {
  return getShifts(page, limit)
}
