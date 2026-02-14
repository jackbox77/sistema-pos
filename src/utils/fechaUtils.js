const DIAS_SEMANA = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado']

/**
 * Obtiene el día de la semana en español a partir de una fecha (formato YYYY-MM-DD)
 * @param {string} fechaStr - Fecha en formato YYYY-MM-DD
 * @returns {string} Nombre del día de la semana (ej: "Lunes")
 */
export function diaDeLaSemana(fechaStr) {
  if (!fechaStr) return '-'
  const d = new Date(fechaStr + 'T12:00:00')
  if (isNaN(d.getTime())) return '-'
  return DIAS_SEMANA[d.getDay()]
}

/**
 * Obtiene el turno como un día o un intervalo de días
 * @param {string} fechaStr - Fecha inicio (formato YYYY-MM-DD)
 * @param {string} [fechaFinStr] - Fecha fin opcional (formato YYYY-MM-DD)
 * @returns {string} "Lunes" o "Lunes - Viernes"
 */
export function formatoTurno(fechaStr, fechaFinStr) {
  const diaInicio = diaDeLaSemana(fechaStr)
  if (!fechaFinStr || fechaFinStr === fechaStr) return diaInicio
  const diaFin = diaDeLaSemana(fechaFinStr)
  return diaInicio === diaFin ? diaInicio : `${diaInicio} - ${diaFin}`
}
