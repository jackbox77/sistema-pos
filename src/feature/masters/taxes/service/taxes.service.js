import { requestWithToken } from '../../../../utils/apiMiddleware'
import { IMPUESTOS_API } from '../api-const'
import { createTaxRequest } from '../dto/taxRequest.dto'

/**
 * Lista impuestos con paginación (GET con token)
 * @param {number} [page=1]
 * @param {number} [limit=10]
 * @returns {Promise<import('../dto/taxesResponse.dto').TaxesResponseDto>}
 */
export async function getTaxes(page = 1, limit = 10) {
  const url = IMPUESTOS_API.LIST(page, limit)
  const response = await requestWithToken.get(url)
  return response
}

/**
 * Crea un impuesto (POST /taxes con token)
 * @param {string} code
 * @param {string} name
 * @param {number} percentage
 * @param {string} [description]
 * @param {'active'|'inactive'} [status='active']
 * @returns {Promise<import('../dto/taxCreateResponse.dto').TaxCreateResponseDto>}
 */
export async function createTax(code, name, percentage, description = '', status = 'active') {
  const body = createTaxRequest(code, name, percentage, description, status)
  const response = await requestWithToken.post(IMPUESTOS_API.CREATE, body)
  return response
}

/**
 * Actualiza un impuesto (PUT /taxes/:id con token)
 * @param {string} id
 * @param {string} code
 * @param {string} name
 * @param {number} percentage
 * @param {string} [description]
 * @param {'active'|'inactive'} [status='active']
 * @returns {Promise<import('../dto/taxUpdateResponse.dto').TaxUpdateResponseDto>}
 */
export async function updateTax(id, code, name, percentage, description = '', status = 'active') {
  const body = createTaxRequest(code, name, percentage, description, status)
  const url = IMPUESTOS_API.UPDATE(id)
  const response = await requestWithToken.put(url, body)
  return response
}

/**
 * Elimina un impuesto (DELETE /taxes/:id con token)
 * @param {string} id
 * @returns {Promise<import('../dto/taxDeleteResponse.dto').TaxDeleteResponseDto>}
 */
export async function deleteTax(id) {
  const url = IMPUESTOS_API.DELETE(id)
  const response = await requestWithToken.delete(url)
  return response
}
