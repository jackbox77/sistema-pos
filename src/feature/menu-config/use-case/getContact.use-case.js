import { getContact } from '../service'

/**
 * Caso de uso: obtener información de contacto del menú
 * @returns {Promise<import('../dto/contactResponse.dto').ContactResponseDto>}
 */
export async function getContactUseCase() {
    return getContact()
}
