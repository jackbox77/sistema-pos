import { useState } from 'react'
import { X } from 'lucide-react'
import { useIngresos } from './IngresosLayout'
import { formatoTurno } from '../../utils/fechaUtils'
import PageModule from '../../components/PageModule/PageModule'
import TableResponsive from '../../components/TableResponsive/TableResponsive'
import '../../components/TableResponsive/TableResponsive.css'

export default function Ventas() {
  const { facturasVentas } = useIngresos()
  const [listaPrecios, setListaPrecios] = useState('general')
  const [filtrosActivos, setFiltrosActivos] = useState([{ id: 'estado', label: 'Estado: todas' }])

  const quitarFiltro = (id) => setFiltrosActivos((p) => p.filter((f) => f.id !== id))

  return (
    <PageModule title="" description="">
      <header className="maestro-encabezado">
        <div className="maestro-encabezado-top">
          <div className="maestro-encabezado-info">
            <h1 className="maestro-encabezado-titulo">Ventas</h1>
            <p className="maestro-encabezado-desc">Registra y consulta las ventas realizadas. Genera ventas con los productos del catálogo.</p>
            <a href="#ver-mas" className="maestro-encabezado-link">Ver más</a>
          </div>
          <div className="maestro-encabezado-acciones">
            <button type="button" className="form-btn-secondary" onClick={() => {}}>Exportar ventas</button>
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
        <input type="search" className="input-search" placeholder="Buscar ventas..." />
      </div>
      <TableResponsive>
        <table className="page-module-table">
          <thead>
            <tr>
              <th>Nº</th>
              <th>Cliente</th>
              <th>Fecha</th>
              <th>Turno</th>
              <th>Total</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            {facturasVentas.length === 0 ? (
              <tr>
                <td colSpan="6">
                  <div className="page-module-empty">No hay ventas registradas.</div>
                </td>
              </tr>
            ) : (
              facturasVentas.map((f) => (
                <tr key={f.id}>
                  <td data-label="Nº">{f.numero}</td>
                  <td data-label="Cliente">{f.cliente}</td>
                  <td data-label="Fecha">{f.fecha}</td>
                  <td data-label="Turno">{formatoTurno(f.fecha, f.fechaFin)}</td>
                  <td data-label="Total">${Number(f.total || 0).toLocaleString('es-CO')}</td>
                  <td data-label="Estado">
                    <span className={`badge ${f.estado === 'Pagada' ? 'badge-success' : 'badge-pending'}`}>{f.estado}</span>
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
