import { useRef, useState, useEffect } from 'react'
import { ChevronDown, X } from 'lucide-react'
import { useTurnos } from './TurnosLayout'
import PageModule from '../../components/PageModule/PageModule'
import TableResponsive from '../../components/TableResponsive/TableResponsive'
import '../../components/TableResponsive/TableResponsive.css'

export default function Turnos() {
  const { turnos, agregarTurno, actualizarTurno } = useTurnos()
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

  const turnosActivos = turnos.filter((t) => t.estado === 'Abierto')

  const iniciarTurno = () => {
    const ahora = new Date()
    const inicio = `${ahora.getFullYear()}-${String(ahora.getMonth() + 1).padStart(2, '0')}-${String(ahora.getDate()).padStart(2, '0')} ${String(ahora.getHours()).padStart(2, '0')}:${String(ahora.getMinutes()).padStart(2, '0')}`
    agregarTurno({ usuario: 'Admin', inicio, fin: '', ventas: 0, estado: 'Abierto' })
  }

  const cerrarTurno = (t) => {
    const ahora = new Date()
    const fin = `${ahora.getFullYear()}-${String(ahora.getMonth() + 1).padStart(2, '0')}-${String(ahora.getDate()).padStart(2, '0')} ${String(ahora.getHours()).padStart(2, '0')}:${String(ahora.getMinutes()).padStart(2, '0')}`
    actualizarTurno(t.id, { ...t, fin, estado: 'Cerrado' })
  }

  return (
    <PageModule title="" description="">
      <header className="maestro-encabezado">
        <div className="maestro-encabezado-top">
          <div className="maestro-encabezado-info">
            <h1 className="maestro-encabezado-titulo">Turnos</h1>
            <p className="maestro-encabezado-desc">Gestiona el inicio y cierre de turnos de caja. Cada turno registra las ventas del período.</p>
            <a href="#ver-mas" className="maestro-encabezado-link">Ver más</a>
          </div>
          <div className="maestro-encabezado-acciones">
            <div className="toolbar-mas-acciones-wrap" ref={masAccionesRef}>
              <button type="button" className="toolbar-mas-acciones" onClick={() => setShowMasAcciones((v) => !v)} aria-expanded={showMasAcciones} aria-haspopup="true">
                Más acciones <ChevronDown size={18} />
              </button>
              {showMasAcciones && (
                <div className="toolbar-dropdown">
                  <button type="button" onClick={() => setShowMasAcciones(false)}>Exportar turnos</button>
                </div>
              )}
            </div>
            <button type="button" className="btn-primary" onClick={iniciarTurno} disabled={turnosActivos.length > 0}>
              Iniciar turno
            </button>
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
        <input type="search" className="input-search" placeholder="Buscar turnos..." />
      </div>
      <TableResponsive>
        <table className="page-module-table">
          <thead>
            <tr>
              <th>Usuario</th>
              <th>Inicio</th>
              <th>Fin</th>
              <th>Ventas</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {turnosActivos.length === 0 ? (
              <tr>
                <td colSpan="6">
                  <div className="page-module-empty">No hay turnos. Inicia un turno para comenzar a vender.</div>
                </td>
              </tr>
            ) : (
              turnosActivos.map((t) => (
                <tr key={t.id}>
                  <td data-label="Usuario">{t.usuario}</td>
                  <td data-label="Inicio">{t.inicio}</td>
                  <td data-label="Fin">{t.fin || '-'}</td>
                  <td data-label="Ventas">${Number(t.ventas || 0).toLocaleString('es-CO')}</td>
                  <td data-label="Estado">
                    <span className={`badge ${t.estado === 'Cerrado' ? 'badge-success' : 'badge-pending'}`}>{t.estado}</span>
                  </td>
                  <td data-label="Acciones">
                    <button type="button" className="form-btn-secondary" onClick={() => cerrarTurno(t)} disabled={t.estado === 'Cerrado'}>
                      Cerrar turno
                    </button>
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
