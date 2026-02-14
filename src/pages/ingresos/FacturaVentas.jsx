import { useRef, useState, useEffect } from 'react'
import { Pencil, Trash2, Plus, X, ChevronDown } from 'lucide-react'
import { useIngresos } from './IngresosLayout'
import { formatoTurno } from '../../utils/fechaUtils'
import { useMaestros } from '../../context/MaestrosContext'
import PageModule from '../../components/PageModule/PageModule'
import TableResponsive from '../../components/TableResponsive/TableResponsive'
import '../../components/TableResponsive/TableResponsive.css'
import '../../components/FormularioProductos/FormularioProductos.css'

function generarNumeroFactura(existentes) {
  const nums = existentes
    .map((f) => parseInt(f.numero?.replace(/\D/g, ''), 10))
    .filter((n) => !isNaN(n))
  const max = nums.length ? Math.max(...nums) : 0
  return `FV-${String(max + 1).padStart(3, '0')}`
}

export default function FacturaVentas() {
  const { facturasVentas, agregarFacturaVenta, actualizarFacturaVenta, eliminarFacturaVenta } = useIngresos()
  const { productos } = useMaestros()
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState(null)
  const [toDelete, setToDelete] = useState(null)
  const [form, setForm] = useState({
    cliente: '',
    fecha: new Date().toISOString().slice(0, 10),
    fechaFin: '',
    items: [],
    estado: 'Pendiente',
  })
  const [productoSeleccionado, setProductoSeleccionado] = useState('')
  const [cantidadAgregar, setCantidadAgregar] = useState(1)
  const [showMasAcciones, setShowMasAcciones] = useState(false)
  const masAccionesRef = useRef(null)
  const [listaPrecios, setListaPrecios] = useState('general')
  const [filtrosActivos, setFiltrosActivos] = useState([{ id: 'estado', label: 'Estado: todas' }])

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (masAccionesRef.current && !masAccionesRef.current.contains(e.target)) setShowMasAcciones(false)
    }
    if (showMasAcciones) document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [showMasAcciones])

  const quitarFiltro = (id) => setFiltrosActivos((p) => p.filter((f) => f.id !== id))

  const agregarLinea = () => {
    const prod = productos.find((p) => p.id === Number(productoSeleccionado))
    if (!prod) return
    const precio = Number(prod.precio) || 0
    const cantidad = Number(cantidadAgregar) || 1
    const subtotal = precio * cantidad
    setForm((prev) => ({
      ...prev,
      items: [
        ...prev.items,
        {
          productoId: prod.id,
          nombre: prod.nombre,
          cantidad,
          precioUnitario: precio,
          subtotal,
        },
      ],
    }))
    setProductoSeleccionado('')
    setCantidadAgregar(1)
  }

  const quitarLinea = (index) => {
    setForm((prev) => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index),
    }))
  }

  const totalFactura = form.items.reduce((sum, it) => sum + (it.subtotal || 0), 0)

  const abrirNuevo = () => {
    setForm({
      cliente: '',
      fecha: new Date().toISOString().slice(0, 10),
      fechaFin: '',
      items: [],
      estado: 'Pendiente',
    })
    setEditing(null)
    setProductoSeleccionado('')
    setCantidadAgregar(1)
    setShowModal(true)
  }

  const abrirEditar = (f) => {
    setForm({
      numero: f.numero,
      cliente: f.cliente,
      fecha: f.fecha,
      fechaFin: f.fechaFin || '',
      items: f.items?.length ? f.items : [],
      estado: f.estado,
    })
    setEditing(f)
    setShowModal(true)
  }

  const guardar = (e) => {
    e.preventDefault()
    const numero = editing?.numero ?? generarNumeroFactura(facturasVentas)
    const data = {
      numero,
      cliente: form.cliente,
      fecha: form.fecha,
      fechaFin: form.fechaFin || undefined,
      items: form.items,
      total: totalFactura,
      estado: form.estado,
    }
    if (editing) actualizarFacturaVenta(editing.id, data)
    else agregarFacturaVenta(data)
    setShowModal(false)
  }

  return (
    <PageModule title="" description="">
      <header className="maestro-encabezado">
        <div className="maestro-encabezado-top">
          <div className="maestro-encabezado-info">
            <h1 className="maestro-encabezado-titulo">Ingresos</h1>
            <p className="maestro-encabezado-desc">Registra y consulta los ingresos de tu negocio. Genera facturas de venta con los productos del catálogo.</p>
            <a href="#ver-mas" className="maestro-encabezado-link">Ver más</a>
          </div>
          <div className="maestro-encabezado-acciones">
            <div className="toolbar-mas-acciones-wrap" ref={masAccionesRef}>
              <button type="button" className="toolbar-mas-acciones" onClick={() => setShowMasAcciones((v) => !v)} aria-expanded={showMasAcciones} aria-haspopup="true">
                Más acciones <ChevronDown size={18} />
              </button>
              {showMasAcciones && (
                <div className="toolbar-dropdown">
                  <button type="button" onClick={() => setShowMasAcciones(false)}>Exportar ingresos</button>
                </div>
              )}
            </div>
            <button type="button" className="btn-primary" onClick={abrirNuevo}>+ Registrar ingreso</button>
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
        <input type="search" className="input-search" placeholder="Buscar ingresos..." />
      </div>
      <TableResponsive>
        <table className="page-module-table">
          <thead>
            <tr>
              <th>Nº Factura</th>
              <th>Cliente</th>
              <th>Fecha</th>
              <th>Turno</th>
              <th>Total</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {facturasVentas.length === 0 ? (
              <tr>
                <td colSpan="7">
                  <div className="page-module-empty">No hay ingresos registrados. Registra ventas o facturas usando los productos del catálogo.</div>
                </td>
              </tr>
            ) : (
              facturasVentas.map((f) => (
                <tr key={f.id}>
                  <td data-label="Nº Factura">{f.numero}</td>
                  <td data-label="Cliente">{f.cliente}</td>
                  <td data-label="Fecha">{f.fecha}</td>
                  <td data-label="Turno">{formatoTurno(f.fecha, f.fechaFin)}</td>
                  <td data-label="Total">${Number(f.total || 0).toLocaleString('es-CO')}</td>
                  <td data-label="Estado">
                    <span className={`badge ${f.estado === 'Pagada' ? 'badge-success' : 'badge-pending'}`}>{f.estado}</span>
                  </td>
                  <td data-label="Acciones">
                    <button type="button" className="btn-icon-action btn-icon-edit" onClick={() => abrirEditar(f)} title="Editar"><Pencil size={18} /></button>
                    <button type="button" className="btn-icon-action btn-icon-delete" onClick={() => setToDelete(f)} title="Eliminar"><Trash2 size={18} /></button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </TableResponsive>

      {showModal && (
        <div className="form-overlay" onClick={() => setShowModal(false)}>
          <div className="form-modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '640px' }}>
            <div className="form-header">
              <h3>{editing ? 'Editar ingreso' : 'Registrar ingreso'}</h3>
              <button type="button" className="form-close" onClick={() => setShowModal(false)}>✕</button>
            </div>
            <form onSubmit={guardar} className="form-body">
              <div className="config-form-grid" style={{ gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="config-field">
                  <label>Cliente *</label>
                  <input type="text" value={form.cliente} onChange={(e) => setForm((p) => ({ ...p, cliente: e.target.value }))} placeholder="Nombre o razón social" required />
                </div>
                <div className="config-field">
                  <label>Fecha *</label>
                  <input type="date" value={form.fecha} onChange={(e) => setForm((p) => ({ ...p, fecha: e.target.value }))} required />
                </div>
                <div className="config-field">
                  <label>Fecha fin (turno)</label>
                  <input type="date" value={form.fechaFin} onChange={(e) => setForm((p) => ({ ...p, fechaFin: e.target.value }))} placeholder="Opcional: intervalo de días" min={form.fecha} />
                </div>
              </div>

              <div className="config-field" style={{ marginTop: '16px' }}>
                <label>Agregar producto</label>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-end' }}>
                  <div style={{ flex: 1 }}>
                    <select
                      value={productoSeleccionado}
                      onChange={(e) => setProductoSeleccionado(e.target.value)}
                      style={{ width: '100%', padding: '8px 12px', border: '1px solid #e5e7eb', borderRadius: '6px' }}
                    >
                      <option value="">Seleccionar producto...</option>
                      {productos.map((p) => (
                        <option key={p.id} value={p.id}>{p.nombre} - ${Number(p.precio || 0).toLocaleString('es-CO')}</option>
                      ))}
                    </select>
                  </div>
                  <div style={{ width: '100px' }}>
                    <input type="number" min="1" value={cantidadAgregar} onChange={(e) => setCantidadAgregar(Number(e.target.value) || 1)} style={{ width: '100%', padding: '8px 12px', border: '1px solid #e5e7eb', borderRadius: '6px' }} />
                  </div>
                  <button type="button" className="form-btn-secondary" onClick={agregarLinea} disabled={!productoSeleccionado}>
                    <Plus size={18} /> Agregar
                  </button>
                </div>
              </div>

              {form.items.length > 0 && (
                <div style={{ marginTop: '16px', overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid #e5e7eb' }}>
                        <th style={{ textAlign: 'left', padding: '8px' }}>Producto</th>
                        <th style={{ textAlign: 'right', padding: '8px' }}>Cant.</th>
                        <th style={{ textAlign: 'right', padding: '8px' }}>P. unit.</th>
                        <th style={{ textAlign: 'right', padding: '8px' }}>Subtotal</th>
                        <th style={{ width: '40px' }}></th>
                      </tr>
                    </thead>
                    <tbody>
                      {form.items.map((it, idx) => (
                        <tr key={idx} style={{ borderBottom: '1px solid #f3f4f6' }}>
                          <td style={{ padding: '8px' }}>{it.nombre}</td>
                          <td style={{ textAlign: 'right', padding: '8px' }}>{it.cantidad}</td>
                          <td style={{ textAlign: 'right', padding: '8px' }}>${Number(it.precioUnitario || 0).toLocaleString('es-CO')}</td>
                          <td style={{ textAlign: 'right', padding: '8px' }}>${Number(it.subtotal || 0).toLocaleString('es-CO')}</td>
                          <td>
                            <button type="button" onClick={() => quitarLinea(idx)} className="btn-icon-action btn-icon-delete" title="Quitar" style={{ padding: '4px' }}><X size={16} /></button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <p style={{ marginTop: '8px', fontWeight: 700, textAlign: 'right' }}>Total: ${totalFactura.toLocaleString('es-CO')}</p>
                </div>
              )}

              <div className="config-field" style={{ marginTop: '16px' }}>
                <label>Estado</label>
                <select value={form.estado} onChange={(e) => setForm((p) => ({ ...p, estado: e.target.value }))}>
                  <option>Pendiente</option>
                  <option>Pagada</option>
                  <option>Anulada</option>
                </select>
              </div>

              <div className="form-footer" style={{ marginTop: '20px' }}>
                <button type="button" className="form-btn-secondary" onClick={() => setShowModal(false)}>Cancelar</button>
                <button type="submit" className="form-btn-primary" disabled={form.items.length === 0}>Guardar ingreso</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {toDelete && (
        <div className="form-overlay" onClick={() => setToDelete(null)}>
          <div className="form-modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '400px' }}>
            <div className="form-header">
              <h3>Eliminar ingreso</h3>
              <button type="button" className="form-close" onClick={() => setToDelete(null)}>✕</button>
            </div>
            <div className="form-body">
              <p style={{ marginBottom: '20px', color: '#6b7280' }}>¿Eliminar el ingreso <strong>{toDelete.numero}</strong> de {toDelete.cliente}?</p>
              <div className="form-footer">
                <button type="button" className="form-btn-secondary" onClick={() => setToDelete(null)}>Cancelar</button>
                <button type="button" className="form-btn-primary" onClick={() => { eliminarFacturaVenta(toDelete.id); setToDelete(null); }} style={{ background: '#dc2626' }}>Eliminar</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </PageModule>
  )
}
