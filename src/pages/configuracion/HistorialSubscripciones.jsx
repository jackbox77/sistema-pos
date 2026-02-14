import { useRef, useState, useEffect } from 'react'
import { ChevronDown, X } from 'lucide-react'
import PageModule from '../../components/PageModule/PageModule'
import TableResponsive from '../../components/TableResponsive/TableResponsive'
import '../../components/TableResponsive/TableResponsive.css'

const historialInicial = [
  { id: 1, plan: 'Plan básico', fechaAlta: '2024-06-01', fechaBaja: '2025-12-15', mesesActivo: 18, pagos: 2450000, comentarios: '' },
  { id: 2, plan: 'Plan profesional', fechaAlta: '2024-03-10', fechaBaja: '2025-08-20', mesesActivo: 17, pagos: 1890000, comentarios: '' },
  { id: 3, plan: 'Plan gratuito', fechaAlta: '2025-01-05', fechaBaja: '-', mesesActivo: 1, pagos: 120000, comentarios: '' },
]

export default function HistorialSubscripciones() {
  const [historial] = useState(historialInicial)
  const [showMasAcciones, setShowMasAcciones] = useState(false)
  const masAccionesRef = useRef(null)
  const [listaPrecios, setListaPrecios] = useState('general')
  const [filtrosActivos, setFiltrosActivos] = useState([{ id: 'estado', label: 'Estado: todos' }])

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (masAccionesRef.current && !masAccionesRef.current.contains(e.target)) setShowMasAcciones(false)
    }
    if (showMasAcciones) document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [showMasAcciones])

  const quitarFiltro = (id) => setFiltrosActivos((p) => p.filter((f) => f.id !== id))

  return (
    <PageModule title="" description="">
      <header className="maestro-encabezado">
        <div className="maestro-encabezado-top">
          <div className="maestro-encabezado-info">
            <h1 className="maestro-encabezado-titulo">Historial de subscripciones</h1>
            <p className="maestro-encabezado-desc">Consulta el historial de subscripciones. Incluye meses activos y pagos realizados por los usuarios.</p>
            <a href="#ver-mas" className="maestro-encabezado-link">Ver más</a>
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
      <div className="page-module-toolbar" style={{ marginTop: '16px' }}>
        <input type="search" className="input-search" placeholder="Buscar en historial..." />
      </div>
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
              historial.map((h) => (
                <tr key={h.id}>
                  <td data-label="Plan">{h.plan || '-'}</td>
                  <td data-label="Fecha alta">{h.fechaAlta}</td>
                  <td data-label="Fecha baja">{h.fechaBaja}</td>
                  <td data-label="Meses con nosotros">{h.mesesActivo} meses</td>
                  <td data-label="Pagos">${Number(h.pagos || 0).toLocaleString('es-CO')}</td>
                  <td data-label="Comentarios">{h.comentarios || '-'}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </TableResponsive>
    </PageModule>
  )
}
