import { createIncome } from '../service'

/**
 * Caso de uso: crear ingreso (POST /incomes)
 * @param {import('../dto/createIncomeRequest.dto').CreateIncomeRequestDto} body - { shift_id, amount, concept, reference }
 * @returns {Promise<import('../dto/createIncomeResponse.dto').CreateIncomeResponseDto>}
 */
export async function createIncomeUseCase(body) {
  return createIncome(body)
}
