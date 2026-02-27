import { createExpense } from '../service'

/**
 * Caso de uso: crear egreso (POST /expenses)
 * @param {import('../dto/createExpenseRequest.dto').CreateExpenseRequestDto} body - { shift_id, amount, concept, reference }
 * @returns {Promise<import('../dto/createExpenseResponse.dto').CreateExpenseResponseDto>}
 */
export async function createExpenseUseCase(body) {
  return createExpense(body)
}
