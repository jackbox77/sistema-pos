import { requestWithToken } from '../../../utils/apiMiddleware'
import { SHIFTS_API } from '../api-const'
import { createStartShiftRequest } from '../dto/startShiftRequest.dto'
import { createEndShiftRequest } from '../dto/endShiftRequest.dto'

/**
 * Iniciar turno: POST /shifts/start con token
 * @param {string} name
 * @param {string} start_at - ISO 8601 (ej: "2026-02-19T20:00:00Z")
 * @returns {Promise<import('../dto/startShiftResponse.dto').StartShiftResponseDto>}
 */
export async function startShift(name, start_at) {
  const body = createStartShiftRequest(name, start_at)
  const response = await requestWithToken.post(SHIFTS_API.START, body)
  return response
}

/**
 * Listar turnos: GET /shifts?page=1&limit=10 con token
 * @param {number} [page=1]
 * @param {number} [limit=10]
 * @returns {Promise<import('../dto/shiftsListResponse.dto').ShiftsListResponseDto>}
 */
export async function getShifts(page = 1, limit = 10) {
  const url = SHIFTS_API.LIST(page, limit)
  const response = await requestWithToken.get(url)
  return response
}

/**
 * Obtener turno por ID: GET /shifts/:id con token
 * @param {string} id
 * @returns {Promise<import('../dto/getShiftResponse.dto').GetShiftResponseDto>}
 */
export async function getShift(id) {
  const url = SHIFTS_API.GET(id)
  const response = await requestWithToken.get(url)
  return response
}

/**
 * Obtener turno actual: GET /shifts/current con token
 * @returns {Promise<import('../dto/currentShiftResponse.dto').CurrentShiftResponseDto>}
 */
export async function getCurrentShift() {
  const response = await requestWithToken.get(SHIFTS_API.CURRENT)
  return response
}

/**
 * Cerrar turno: POST /shifts/end con body { end_at } (ISO 8601)
 * @param {string} end_at - ISO 8601 (ej: "2026-02-20T02:00:00Z")
 * @returns {Promise<import('../dto/endShiftResponse.dto').EndShiftResponseDto>}
 */
export async function endShift(end_at) {
  const body = createEndShiftRequest(end_at)
  const response = await requestWithToken.post(SHIFTS_API.END, body)
  return response
}
