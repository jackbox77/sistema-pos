import { useRef, useState, useEffect } from 'react'
import { ChevronDown, X } from 'lucide-react'
import { useTurnos } from './TurnosLayout'
import { formatoTurno } from '../../utils/fechaUtils'
import PageModule from '../../components/PageModule/PageModule'
import TableResponsive from '../../components/TableResponsive/TableResponsive'
import '../../components/TableResponsive/TableResponsive.css'

export default function HistorialTurnos() {
  const { turnos } = useTurnos()
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

  const turnosCerrados = turnos.filter((t) => t.estado === 'Cerrado')

  const extraerFecha = (inicio) => {
    if (!inicio) return ''
    const match = inicio.match(/^(\d{4}-\d{2}-\d{2})/)
    return match ? match[1] : ''
  }

  return (
    <PageModule title="" description="">
      <header className="maestro-encabezado">
        <div className="maestro-encabezado-top">
          <div className="maestro-encabezado-info">
            <h1 className="maestro-encabezado-titulo">Historial de turnos</h1>
            <p className="maestro-encabezado-desc">Consulta todos los turnos cerrados. Revisa ventas, horarios y estados por período.</p>
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
              <th>Usuario</th>
              <th>Inicio</th>
              <th>Fin</th>
              <th>Turno</th>
              <th>Ventas</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            {turnosCerrados.length === 0 ? (
              <tr>
                <td colSpan="6">
                  <div className="page-module-empty">No hay turnos cerrados en el historial.</div>
                </td>
              </tr>
            ) : (
              turnosCerrados.map((t) => (
                <tr key={t.id}>
                  <td data-label="Usuario">{t.usuario}</td>
                  <td data-label="Inicio">{t.inicio}</td>
                  <td data-label="Fin">{t.fin || '-'}</td>
                  <td data-label="Turno">{formatoTurno(extraerFecha(t.inicio), extraerFecha(t.fin))}</td>
                  <td data-label="Ventas">${Number(t.ventas || 0).toLocaleString('es-CO')}</td>
                  <td data-label="Estado">
                    <span className={`badge ${t.estado === 'Cerrado' ? 'badge-success' : 'badge-pending'}`}>{t.estado}</span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </TableResponsive>
    </PageModule>
  )
}
