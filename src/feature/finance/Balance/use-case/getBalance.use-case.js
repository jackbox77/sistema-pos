import { getBalance } from '../service'

/**
 * Caso de uso: obtener balance del turno (GET /balances/:id_shift con token)
 * @param {string} id_shift
 * @returns {Promise<import('../dto/balanceResponse.dto').BalanceResponseDto>}
 */
export async function getBalanceUseCase(id_shift) {
  return getBalance(id_shift)
}
