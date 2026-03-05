import { useState, useEffect } from 'react'
import { Printer } from 'lucide-react'
import PageModule from '../../components/PageModule/PageModule'
import TableResponsive from '../../components/TableResponsive/TableResponsive'
import ApiErrorRecargar from '../../components/ApiErrorRecargar/ApiErrorRecargar'
import ComprobanteImpresion from '../../components/ComprobanteImpresion/ComprobanteImpresion'
import { getSalesUseCase } from '../../feature/finance/Sales/use-case'
import { usePos } from './PosLayout'
import '../../components/TableResponsive/TableResponsive.css'

export default function ComprobanteVentaDiarias() {
  const { currentShiftId } = usePos()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [sales, setSales] = useState([])
  const [comprobanteVenta, setComprobanteVenta] = useState(null)

  const loadData = async () => {
    if (!currentShiftId) return
    setLoading(true)
    setError(null)
    try {
      const res = await getSalesUseCase(currentShiftId, 1, 150)
      if (res.success && res.data?.data) {
        setSales(res.data.data)
      } else {
        throw new Error(res.message || 'Error al cargar ventas del turno')
      }
    } catch (err) {
      setError(err?.message || 'No se pudieron cargar las ventas.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (currentShiftId) {
      loadData()
    } else {
      setSales([])
    }
  }, [currentShiftId])

  const isShiftOpen = !!currentShiftId

  return (
    <PageModule
      title="Ventas del Turno Activo"
      description="Consulta las ventas realizadas detalladamente durante tu jornada o turno actual."
    >
      {error && <ApiErrorRecargar message={error} onRecargar={loadData} loading={loading} />}

      <div className="page-module-toolbar">
        <button className="btn-primary" disabled={loading || !isShiftOpen} onClick={loadData}>
          {loading ? 'Cargando...' : 'Actualizar tabla'}
        </button>
      </div>

      <TableResponsive>
        <table className="page-module-table">
          <thead>
            <tr>
              <th>ID Venta</th>
              <th>Referencia</th>
              <th>Fecha y hora</th>
              <th>Total cobrado</th>
              <th>Imprimir</th>
            </tr>
          </thead>
          <tbody>
            {!isShiftOpen ? (
              <tr>
                <td colSpan="5">
                  <div className="page-module-empty">
                    No hay turno activo. Abre uno en la sección de Turnos para registrar y visualizar ventas.
                  </div>
                </td>
              </tr>
            ) : loading ? (
              <tr>
                <td colSpan="5" style={{ textAlign: 'center', padding: '20px' }}>Cargando ventas...</td>
              </tr>
            ) : sales.length === 0 ? (
              <tr>
                <td colSpan="5">
                  <div className="page-module-empty">
                    Aún no hay ventas registradas en este turno.
                  </div>
                </td>
              </tr>
            ) : (
              sales.map((item) => (
                <tr key={item.id}>
                  <td>
                    <span style={{
                      background: '#e0f2fe', color: '#0369a1', padding: '4px 8px', borderRadius: '4px', fontSize: '13px', fontWeight: 'bold'
                    }}>
                      {(item.id || '').substring(0, 8).toUpperCase()}
                    </span>
                  </td>
                  <td>{item.reference || 'N/A'}</td>
                  <td>{new Date(item.created_at).toLocaleString()}</td>
                  <td style={{ fontWeight: 'bold' }}>${Number(item.total || 0).toLocaleString('es-CO')}</td>
                  <td>
                    <button
                      type="button"
                      className="btn-icon-action"
                      onClick={() => setComprobanteVenta(item)}
                      title="Visualizar impresión"
                      aria-label="Visualizar impresión"
                    >
                      <Printer size={18} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </TableResponsive>

      {comprobanteVenta && (
        <ComprobanteImpresion
          open={!!comprobanteVenta}
          onClose={() => setComprobanteVenta(null)}
          title="Comprobante de venta"
          lineas={[
            { label: 'ID Venta', value: (comprobanteVenta.id || '').substring(0, 8).toUpperCase() },
            { label: 'Referencia', value: comprobanteVenta.reference || 'N/A' },
            { label: 'Fecha y hora', value: new Date(comprobanteVenta.created_at).toLocaleString('es-CO') },
            { label: 'Total cobrado', value: `$${Number(comprobanteVenta.total || 0).toLocaleString('es-CO')}` },
          ]}
        />
      )}
    </PageModule>
  )
}
