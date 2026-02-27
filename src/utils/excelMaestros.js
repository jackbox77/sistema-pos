import * as XLSX from 'xlsx'

/**
 * Descarga un archivo Excel (.xlsx) de plantilla con cabeceras y una fila de ejemplo.
 * Reutilizable en cualquier maestro que ofrezca "Descargar plantilla".
 *
 * @param {string[]} columnas - Nombres de las columnas (primera fila).
 * @param {string[]} filaEjemplo - Valores de ejemplo (segunda fila). Mismo orden que columnas.
 * @param {string} nombreArchivo - Nombre del archivo (ej: "plantilla_categorias.xlsx"). Si termina en .csv se reemplaza por .xlsx.
 */
export function descargarPlantillaExcel(columnas, filaEjemplo, nombreArchivo) {
  let name = (nombreArchivo || 'plantilla').replace(/\.csv$/i, '')
  if (!name.toLowerCase().endsWith('.xlsx')) name = name.replace(/\.xlsx$/i, '') + '.xlsx'

  const aoa = [columnas, filaEjemplo]
  const ws = XLSX.utils.aoa_to_sheet(aoa)
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, 'Plantilla')
  XLSX.writeFile(wb, name)
}

/**
 * Genera un nombre de archivo con fecha y hora: "base_2025-02-11_14-30-45.xlsx"
 * @param {string} base - Nombre base (ej: "categorias" o "categorias.xlsx").
 * @returns {string}
 */
export function nombreArchivoConFechaHora(base) {
  const b = (base || 'datos').replace(/\.(xlsx|csv)$/i, '')
  const d = new Date()
  const fecha = d.toISOString().slice(0, 10)
  const hora = d.toTimeString().slice(0, 8).replace(/:/g, '-')
  return `${b}_${fecha}_${hora}.xlsx`
}

/**
 * Descarga un archivo Excel (.xlsx) con todos los datos indicados.
 * El nombre del archivo incluye automáticamente fecha y hora (ej: categorias_2025-02-11_14-30-45.xlsx).
 *
 * @param {string[]} columnas - Nombres de las columnas (primera fila).
 * @param {any[][]} filas - Filas de datos (cada fila es un array de valores). Mismo orden que columnas.
 * @param {string} nombreBase - Nombre base del archivo (ej: "categorias"). Se le añade _YYYY-MM-DD_HH-mm-ss.xlsx
 */
export function descargarDatosExcel(columnas, filas, nombreBase) {
  const name = nombreArchivoConFechaHora(nombreBase || 'datos')
  const aoa = [columnas, ...(filas || [])]
  const ws = XLSX.utils.aoa_to_sheet(aoa)
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, 'Datos')
  XLSX.writeFile(wb, name)
}

/**
 * Parsea un archivo Excel (.xlsx) y devuelve filas como array de arrays (igual que parsearCSV).
 * Útil para carga masiva cuando el usuario sube la plantilla en Excel.
 *
 * @param {ArrayBuffer} arrayBuffer - Contenido binario del archivo (FileReader.readAsArrayBuffer).
 * @returns {string[][]} - Array de filas, cada fila es array de celdas (strings).
 */
export function parsearExcel(arrayBuffer) {
  const wb = XLSX.read(arrayBuffer, { type: 'array' })
  const firstSheet = wb.Sheets[wb.SheetNames[0]]
  if (!firstSheet) return []
  const aoa = XLSX.utils.sheet_to_json(firstSheet, { header: 1, defval: '' })
  return aoa.map((row) => (Array.isArray(row) ? row.map((c) => String(c ?? '')) : [String(row)]))
}
