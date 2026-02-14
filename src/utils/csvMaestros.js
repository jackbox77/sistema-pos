/**
 * Descarga un archivo CSV de plantilla con cabeceras y una fila de ejemplo.
 * @param {string[]} columnas - Nombres de las columnas (primera fila).
 * @param {string[]} filaEjemplo - Valores de ejemplo (segunda fila). Mismo orden que columnas.
 * @param {string} nombreArchivo - Nombre del archivo (ej: "plantilla_categorias.csv").
 */
export function descargarPlantilla(columnas, filaEjemplo, nombreArchivo) {
  const escape = (val) => {
    const s = String(val ?? '')
    if (s.includes(',') || s.includes('"') || s.includes('\n')) {
      return `"${s.replace(/"/g, '""')}"`
    }
    return s
  }
  const fila1 = columnas.map(escape).join(',')
  const fila2 = filaEjemplo.map(escape).join(',')
  const csv = '\uFEFF' + fila1 + '\n' + fila2 + '\n'
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = nombreArchivo
  a.click()
  URL.revokeObjectURL(url)
}

/**
 * Parsea texto CSV simple (una línea por fila, columnas separadas por coma).
 * Si un valor está entre comillas dobles, se preserva incluyendo comas internas.
 * @param {string} texto - Contenido del CSV.
 * @returns {string[][]} - Array de filas, cada fila es array de celdas.
 */
export function parsearCSV(texto) {
  const lineas = texto.split(/\r?\n/).filter((l) => l.trim())
  if (lineas.length === 0) return []
  const filas = []
  for (const linea of lineas) {
    const celdas = []
    let i = 0
    while (i < linea.length) {
      if (linea[i] === '"') {
        let val = ''
        i++
        while (i < linea.length) {
          if (linea[i] === '"') {
            i++
            if (linea[i] === '"') {
              val += '"'
              i++
            } else break
          } else {
            val += linea[i]
            i++
          }
        }
        celdas.push(val.trim())
      } else {
        let val = ''
        while (i < linea.length && linea[i] !== ',') {
          val += linea[i]
          i++
        }
        celdas.push(val.trim())
        i++
      }
    }
    filas.push(celdas)
  }
  return filas
}
