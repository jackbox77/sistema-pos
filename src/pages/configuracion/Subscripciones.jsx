import { useRef, useState, useEffect, useCallback } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { ChevronDown, X } from 'lucide-react'
import PageModule from '../../components/PageModule/PageModule'
import TableResponsive from '../../components/TableResponsive/TableResponsive'
import '../../components/TableResponsive/TableResponsive.css'
import './Perfil.css'
import { getSubscriptionHistoryUseCase } from '../../feature/configuration/subscription-history/use-case'

const TABS = [
  { id: 'plan', label: 'Subscripciones' },
  { id: 'historial', label: 'Historial de subscripciones' },
]

export default function Subscripciones() {
  const location = useLocation()
  const navigate = useNavigate()
  const tabFromState = location.state?.tab
  const [tabActiva, setTabActiva] = useState(tabFromState === 'historial' ? 'historial' : 'plan')
  const [historial, setHistorial] = useState([])
  const [historialLoading, setHistorialLoading] = useState(false)
  const [historialError, setHistorialError] = useState(null)
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, total_pages: 0 })
  const [showMasAcciones, setShowMasAcciones] = useState(false)
  const masAccionesRef = useRef(null)
  const [listaPrecios, setListaPrecios] = useState('general')
  const [filtrosActivos, setFiltrosActivos] = useState([{ id: 'estado', label: 'Estado: todos' }])

  const cargarHistorial = useCallback(async (page = 1, limit = 10) => {
    setHistorialLoading(true)
    setHistorialError(null)
    try {
      const response = await getSubscriptionHistoryUseCase(page, limit)
      if (response?.success && response?.data) {
        setHistorial(response.data.data ?? [])
        setPagination(response.data.pagination ?? { page: 1, limit: 10, total: 0, total_pages: 0 })
      } else {
        setHistorial([])
        setHistorialError(response?.message ?? 'No se pudo cargar el historial')
      }
    } catch (err) {
      setHistorial([])
      setHistorialError(err?.message ?? err?.data?.message ?? 'Error al cargar el historial')
    } finally {
      setHistorialLoading(false)
    }
  }, [])

  useEffect(() => {
    if (tabActiva === 'historial') {
      cargarHistorial(pagination.page, pagination.limit)
    }
  }, [tabActiva, cargarHistorial])

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (masAccionesRef.current && !masAccionesRef.current.contains(e.target)) setShowMasAcciones(false)
    }
    if (showMasAcciones) document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [showMasAcciones])

  const quitarFiltro = (id) => setFiltrosActivos((p) => p.filter((f) => f.id !== id))

  const setTab = (id) => {
    setTabActiva(id)
    if (location.state?.tab) {
      navigate(location.pathname, { replace: true, state: {} })
    }
  }

  return (
    <PageModule
      title="Subscripciones"
      description="Administra tu plan, nivel de suscripción y consulta el historial."
    >
      <div className="perfil-tabs">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            className={`perfil-tab ${tabActiva === tab.id ? 'active' : ''}`}
            onClick={() => setTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="perfil-content">
        {tabActiva === 'plan' && (
          <section className="perfil-section">
            <div className="subscription-card">
              <h3 className="perfil-section-title">Plan actual</h3>
              <p className="subscription-plan">Plan gratuito</p>
              <p className="subscription-desc">Características básicas del sistema POS.</p>
              <div className="subscription-features">
                <span>✓ Hasta 100 facturas/mes</span>
                <span>✓ 1 usuario</span>
                <span>✓ Soporte por email</span>
              </div>
              <button className="btn-primary" style={{ marginTop: '16px' }}>
                Ver planes disponibles
              </button>
            </div>
          </section>
        )}

        {tabActiva === 'historial' && (
          <section className="perfil-section">
            <header className="maestro-encabezado" style={{ marginBottom: '16px' }}>
              <div className="maestro-encabezado-top">
                <div className="maestro-encabezado-info">
                  <h3 className="maestro-encabezado-titulo perfil-section-title">Historial de subscripciones</h3>
                  <p className="maestro-encabezado-desc">Consulta el historial. Incluye meses activos y pagos realizados.</p>
                </div>
                <div className="maestro-encabezado-acciones">
                  <div className="toolbar-mas-acciones-wrap" ref={masAccionesRef}>
                    <button type="button" className="toolbar-mas-acciones" onClick={() => setShowMasAcciones((v) => !v)} aria-expanded={showMasAcciones} aria-haspopup="true">
                      Más acciones <ChevronDown size={18} />
                    </button>
                    {showMasAcciones && (
                      <div className="toolbar-dropdown">
                        <button type="button" onClick={() => setShowMasAcciones(false)}>Exportar historial</button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="maestro-encabezado-filtros">
                <div className="maestro-encabezado-filtros-left">
                  <label className="maestro-encabezado-label">Lista de precios</label>
                  <select className="maestro-encabezado-select" value={listaPrecios} onChange={(e) => setListaPrecios(e.target.value)}>
                    <option value="general">General</option>
                    <option value="mayorista">Mayorista</option>
                    <option value="especial">Especial</option>
                  </select>
                </div>
                <div className="maestro-encabezado-filtros-right">
                  <span className="maestro-encabezado-label">Filtros Activos:</span>
                  {filtrosActivos.length > 0 ? (
                    filtrosActivos.map((f) => (
                      <span key={f.id} className="maestro-filtro-tag">
                        {f.label}
                        <button type="button" onClick={() => quitarFiltro(f.id)} aria-label="Quitar filtro"><X size={14} /></button>
                      </span>
                    ))
                  ) : (
                    <span className="maestro-filtro-sin">Ninguno</span>
                  )}
                </div>
              </div>
            </header>
            {historialError && (
              <p className="auth-error" role="alert" style={{ marginBottom: '16px' }}>{historialError}</p>
            )}
            <div className="page-module-toolbar" style={{ marginBottom: '16px' }}>
              <input type="search" className="input-search" placeholder="Buscar en historial..." />
            </div>
            {historialLoading ? (
              <div className="page-module-empty">Cargando historial...</div>
            ) : (
              <TableResponsive>
                <table className="page-module-table">
                  <thead>
                    <tr>
                      <th>Plan</th>
                      <th>Fecha alta</th>
                      <th>Fecha baja</th>
                      <th>Meses con nosotros</th>
                      <th>Pagos</th>
                      <th>Comentarios</th>
                    </tr>
                  </thead>
                  <tbody>
                    {historial.length === 0 ? (
                      <tr>
                        <td colSpan="6">
                          <div className="page-module-empty">No hay historial de subscripciones.</div>
                        </td>
                      </tr>
                    ) : (
                      historial.map((h) => {
                        const fechaAlta = h.start_date ?? h.fechaAlta ?? '-'
                        const fechaBaja = h.end_date ?? h.fechaBaja ?? '-'
                        const mesesActivo = h.months_active ?? h.mesesActivo ?? 0
                        const pagos = h.total_payments ?? h.pagos ?? 0
                        const comentarios = h.comments ?? h.comentarios ?? '-'
                        return (
                          <tr key={h.id ?? h.plan}>
                            <td data-label="Plan">{h.plan || '-'}</td>
                            <td data-label="Fecha alta">{fechaAlta}</td>
                            <td data-label="Fecha baja">{fechaBaja}</td>
                            <td data-label="Meses con nosotros">{mesesActivo} meses</td>
                            <td data-label="Pagos">${Number(pagos).toLocaleString('es-CO')}</td>
                            <td data-label="Comentarios">{comentarios}</td>
                          </tr>
                        )
                      })
                    )}
                  </tbody>
                </table>
              </TableResponsive>
            )}
            {!historialLoading && pagination.total_pages > 1 && (
              <div style={{ marginTop: '16px', display: 'flex', gap: '8px', alignItems: 'center' }}>
                <button
                  type="button"
                  className="btn-secondary"
                  disabled={pagination.page <= 1}
                  onClick={() => cargarHistorial(pagination.page - 1, pagination.limit)}
                >
                  Anterior
                </button>
                <span>Página {pagination.page} de {pagination.total_pages}</span>
                <button
                  type="button"
                  className="btn-secondary"
                  disabled={pagination.page >= pagination.total_pages}
                  onClick={() => cargarHistorial(pagination.page + 1, pagination.limit)}
                >
                  Siguiente
                </button>
              </div>
            )}
          </section>
        )}
      </div>
    </PageModule>
  )
}
