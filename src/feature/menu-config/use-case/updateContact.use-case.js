import { updateContact } from '../service'

/**
 * Caso de uso: actualizar información de contacto
 * @param {Object} params
 * @returns {Promise<import('../dto/contactResponse.dto').ContactResponseDto>}
 */
export async function updateContactUseCase(params) {
    return updateContact(params)
}
