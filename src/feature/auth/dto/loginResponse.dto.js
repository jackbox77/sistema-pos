/**
 * DTOs de respuesta del login
 */

/**
 * Usuario en la respuesta de login
 * @typedef {Object} LoginUserDto
 * @property {string} id
 * @property {string} company_id
 * @property {string} first_name
 * @property {string} last_name
 * @property {string} email
 * @property {string} [phone]
 * @property {string|null} [birth_date]
 * @property {string} role
 * @property {string} status
 * @property {string} [last_login_at]
 * @property {string} created_at
 * @property {string} updated_at
 */

/**
 * Empresa en la respuesta de login
 * @typedef {Object} LoginCompanyDto
 * @property {string} id
 * @property {string} name
 * @property {string} email
 * @property {string} [phone]
 * @property {string} identification_type
 * @property {string} identification_number
 * @property {string} [address]
 * @property {string} [legal_representative_name]
 * @property {string} status
 * @property {string} created_at
 * @property {string} updated_at
 */

/**
 * Datos internos cuando login es exitoso
 * @typedef {Object} LoginDataDto
 * @property {string} token
 * @property {LoginUserDto} user
 * @property {LoginCompanyDto} company
 */

/**
 * Respuesta exitosa de login
 * @typedef {Object} LoginResponseSuccessDto
 * @property {true} success
 * @property {string} message
 * @property {LoginDataDto} data
 */

/**
 * Respuesta cuando login falla (credenciales inválidas, etc.)
 * @typedef {Object} LoginResponseErrorDto
 * @property {false} success
 * @property {string} message
 * @property {string} [error]
 */

/**
 * Respuesta de login (éxito o error)
 * @typedef {LoginResponseSuccessDto | LoginResponseErrorDto} LoginResponseDto
 */
