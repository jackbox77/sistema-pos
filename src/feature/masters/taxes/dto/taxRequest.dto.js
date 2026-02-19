/**
 * DTO de envío para crear/actualizar impuesto
 * @typedef {Object} TaxRequestDto
 * @property {string} code
 * @property {string} name
 * @property {number} percentage
 * @property {string} [description]
 * @property {'active'|'inactive'} status
 */

/**
 * Crea el cuerpo de la petición para crear o actualizar impuesto
 * @param {string} code
 * @param {string} name
 * @param {number} percentage
 * @param {string} [description]
 * @param {'active'|'inactive'} [status='active']
 * @returns {TaxRequestDto}
 */
export function createTaxRequest(code, name, percentage, description = '', status = 'active') {
  return {
    code,
    name,
    percentage,
    description,
    status,
  }
}
