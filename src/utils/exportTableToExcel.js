/**
 * Utilidad reutilizable para exportar datos de tabla a un archivo Excel-compatible (CSV con BOM).
 * Úsala en cualquier pantalla con tabla para descargar los datos visibles.
 *
 * @param {Object} options
 * @param {Array<{ key: string, label: string }>} options.columns - Columnas: key (campo en cada fila), label (encabezado en el archivo).
 * @param {Array<Record<string, unknown>>} options.data - Array de objetos (cada uno con las keys indicadas en columns).
 * @param {string} [options.filename] - Nombre del archivo sin extensión (se añade .csv). Por defecto "exportacion_YYYY-MM-DD".
 * @example
 * exportTableToExcel({
 *   columns: [
 *     { key: 'fecha', label: 'Fecha/Hora' },
 *     { key: 'total', label: 'Total' },
 *   ],
 *   data: ventas,
 *   filename: 'historial_ventas',
 * })
 */
export function exportTableToExcel({ columns, data, filename }) {
  const escape = (val) => {
    const s = String(val ?? '')
    if (s.includes(',') || s.includes('"') || s.includes('\n') || s.includes('\r')) {
      return `"${s.replace(/"/g, '""')}"`
    }
    return s
  }

  const headerRow = columns.map((col) => escape(col.label)).join(',')
  const dataRows = (Array.isArray(data) ? data : []).map((row) =>
    columns.map((col) => escape(row[col.key])).join(',')
  )
  const csv = '\uFEFF' + [headerRow, ...dataRows].join('\n')
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' })
  const name = (filename || `exportacion_${new Date().toISOString().slice(0, 10)}`).replace(/\.csv$/i, '') + '.csv'
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = name
  a.click()
  URL.revokeObjectURL(url)
}
