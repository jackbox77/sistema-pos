import { useState, useEffect, useCallback } from 'react'
import { Download } from 'lucide-react'
import PageModule from '../../components/PageModule/PageModule'
import TableResponsive from '../../components/TableResponsive/TableResponsive'
import '../../components/TableResponsive/TableResponsive.css'
import ApiErrorRecargar from '../../components/ApiErrorRecargar/ApiErrorRecargar'
import { exportTableToExcel } from '../../utils/exportTableToExcel'
import { getSalesUseCase } from '../../feature/finance/Sales/use-case'
import { getCurrentShiftUseCase } from '../../feature/shifts/use-case'

function formatFechaHora(iso) {
  if (!iso) return '-'
  const d = new Date(iso)
  if (isNaN(d.getTime())) return '-'
  return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
}

const COLUMNAS_EXCEL = [
  { key: 'fecha_hora', label: 'Fecha/Hora' },
  { key: 'ticket', label: 'Ticket' },
  { key: 'cliente', label: 'Cliente' },
  { key: 'total', label: 'Total' },
  { key: 'vendedor', label: 'Vendedor' },
]

export default function HistorialVentas() {
  const [ventas, setVentas] = useState([])
  const [shiftName, setShiftName] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const loadVentas = useCallback(async () => {
    setError(null)
    setLoading(true)
    try {
      const shiftRes = await getCurrentShiftUseCase()
      const shiftId = shiftRes?.data?.id
      const name = shiftRes?.data?.name ?? 'Turno actual'
      setShiftName(name)
      if (!shiftId) {
        setVentas([])
        return
      }
      const res = await getSalesUseCase(shiftId, 1, 100)
      if (res?.success && Array.isArray(res?.data?.data)) {
        setVentas(res.data.data)
      } else {
        setVentas([])
      }
    } catch (err) {
      setError(err?.message ?? 'No se pudo cargar el historial')
      setVentas([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadVentas()
  }, [loadVentas])

  const descargarExcel = () => {
    const data = ventas.map((v) => ({
      fecha_hora: formatFechaHora(v.created_at),
      ticket: v.reference ?? v.id?.slice(0, 8) ?? '-',
      cliente: v.loyal_customer_id ? String(v.loyal_customer_id) : '-',
      total: Number(v.total ?? 0),
      vendedor: '-',
    }))
    exportTableToExcel({
      columns: COLUMNAS_EXCEL,
      data,
      filename: `historial_ventas_${new Date().toISOString().slice(0, 10)}`,
    })
  }

  return (
    <PageModule
      title="Historial de ventas"
      description="Consulta el historial completo de ventas realizadas en el punto de venta."
    >
      {error && (
        <ApiErrorRecargar message={error} onRecargar={loadVentas} loading={loading} />
      )}
      <div className="page-module-toolbar">
        <span style={{ fontSize: '14px', color: '#6b7280' }}>{shiftName && `Turno: ${shiftName}`}</span>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            type="button"
            className="form-btn-secondary"
            onClick={descargarExcel}
            disabled={loading || ventas.length === 0}
          >
            <Download size={18} style={{ verticalAlign: 'middle', marginRight: '6px' }} />
            Descargar Excel
          </button>
          <button type="button" className="form-btn-secondary" onClick={loadVentas} disabled={loading}>
            {loading ? 'Cargando...' : 'Actualizar'}
          </button>
        </div>
      </div>
      <TableResponsive>
        <table className="page-module-table">
          <thead>
            <tr>
              <th>Fecha/Hora</th>
              <th>Ticket</th>
              <th>Cliente</th>
              <th>Total</th>
              <th>Vendedor</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="5">
                  <div className="page-module-empty">Cargando ventas...</div>
                </td>
              </tr>
            ) : ventas.length === 0 ? (
              <tr>
                <td colSpan="5">
                  <div className="page-module-empty">
                    {shiftName ? 'No hay ventas registradas en este turno. Las ventas que registres en Facturar aparecerán aquí.' : 'No hay turno abierto. Abre un turno en Turnos para ver las ventas.'}
                  </div>
                </td>
              </tr>
            ) : (
              ventas.map((v) => (
                <tr key={v.id}>
                  <td data-label="Fecha/Hora">{formatFechaHora(v.created_at)}</td>
                  <td data-label="Ticket">{v.reference ?? v.id?.slice(0, 8) ?? '-'}</td>
                  <td data-label="Cliente">{v.loyal_customer_id ? String(v.loyal_customer_id).slice(0, 8) + '...' : '-'}</td>
                  <td data-label="Total">${Number(v.total ?? 0).toLocaleString('es-CO')}</td>
                  <td data-label="Vendedor">-</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </TableResponsive>
    </PageModule>
  )
}
