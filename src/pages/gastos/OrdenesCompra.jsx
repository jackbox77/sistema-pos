import { useState } from 'react'
import { Pencil, Trash2 } from 'lucide-react'
import { useGastos } from './GastosLayout'
import PageModule from '../../components/PageModule/PageModule'
import TableResponsive from '../../components/TableResponsive/TableResponsive'
import '../../components/TableResponsive/TableResponsive.css'
import '../../components/FormularioProductos/FormularioProductos.css'

export default function OrdenesCompra() {
  const { ordenesCompra, agregarOrden, actualizarOrden, eliminarOrden } = useGastos()
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState(null)
  const [toDelete, setToDelete] = useState(null)
  const [form, setForm] = useState({ numero: '', proveedor: '', fecha: '', total: '', estado: 'Pendiente' })

  const abrirNuevo = () => {
    setForm({ numero: '', proveedor: '', fecha: new Date().toISOString().slice(0, 10), total: '', estado: 'Pendiente' })
    setEditing(null)
    setShowModal(true)
  }

  const abrirEditar = (o) => {
    setForm({ numero: o.numero, proveedor: o.proveedor, fecha: o.fecha, total: String(o.total), estado: o.estado })
    setEditing(o)
    setShowModal(true)
  }

  const guardar = (e) => {
    e.preventDefault()
    const data = { ...form, total: Number(form.total) || 0 }
    if (editing) actualizarOrden(editing.id, data)
    else agregarOrden(data)
    setShowModal(false)
  }

  return (
    <PageModule title="Órdenes de compra" description="Crea y sigue las órdenes de compra enviadas a proveedores.">
      <div className="page-module-toolbar">
        <button className="btn-primary" onClick={abrirNuevo}>+ Nueva orden de compra</button>
        <input type="date" className="input-date" />
        <select className="input-select">
          <option>Todas las órdenes</option>
          <option>Pendientes</option>
          <option>Enviadas</option>
          <option>Recibidas</option>
        </select>
      </div>
      <TableResponsive>
        <table className="page-module-table">
          <thead>
            <tr>
              <th>Nº Orden</th>
              <th>Proveedor</th>
              <th>Fecha</th>
              <th>Total</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {ordenesCompra.length === 0 ? (
              <tr>
                <td colSpan="6">
                  <div className="page-module-empty">No hay órdenes de compra. Crea una orden para solicitar mercancía a proveedores.</div>
                </td>
              </tr>
            ) : (
              ordenesCompra.map((o) => (
                <tr key={o.id}>
                  <td data-label="Nº Orden">{o.numero}</td>
                  <td data-label="Proveedor">{o.proveedor}</td>
                  <td data-label="Fecha">{o.fecha}</td>
                  <td data-label="Total">${Number(o.total).toLocaleString('es-CO')}</td>
                  <td data-label="Estado">{o.estado}</td>
                  <td data-label="Acciones">
                    <button type="button" className="btn-icon-action btn-icon-edit" onClick={() => abrirEditar(o)} title="Editar"><Pencil size={18} /></button>
                    <button type="button" className="btn-icon-action btn-icon-delete" onClick={() => setToDelete(o)} title="Eliminar"><Trash2 size={18} /></button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </TableResponsive>

      {showModal && (
        <div className="form-overlay" onClick={() => setShowModal(false)}>
          <div className="form-modal" onClick={(e) => e.stopPropagation()}>
            <div className="form-header">
              <h3>{editing ? 'Editar orden' : 'Nueva orden de compra'}</h3>
              <button className="form-close" onClick={() => setShowModal(false)}>✕</button>
            </div>
            <form onSubmit={guardar} className="form-body">
              <div className="config-form-grid" style={{ gridTemplateColumns: '1fr' }}>
                <div className="config-field">
                  <label>Nº Orden *</label>
                  <input type="text" value={form.numero} onChange={(e) => setForm((p) => ({ ...p, numero: e.target.value }))} placeholder="OC-001" required />
                </div>
                <div className="config-field">
                  <label>Proveedor *</label>
                  <input type="text" value={form.proveedor} onChange={(e) => setForm((p) => ({ ...p, proveedor: e.target.value }))} placeholder="Nombre del proveedor" required />
                </div>
                <div className="config-field">
                  <label>Fecha *</label>
                  <input type="date" value={form.fecha} onChange={(e) => setForm((p) => ({ ...p, fecha: e.target.value }))} required />
                </div>
                <div className="config-field">
                  <label>Total *</label>
                  <input type="number" value={form.total} onChange={(e) => setForm((p) => ({ ...p, total: e.target.value }))} placeholder="0" min="0" required />
                </div>
                <div className="config-field">
                  <label>Estado</label>
                  <select value={form.estado} onChange={(e) => setForm((p) => ({ ...p, estado: e.target.value }))}>
                    <option>Pendiente</option>
                    <option>Enviada</option>
                    <option>Recibida</option>
                    <option>Anulada</option>
                  </select>
                </div>
              </div>
              <div className="form-footer">
                <button type="button" className="form-btn-secondary" onClick={() => setShowModal(false)}>Cancelar</button>
                <button type="submit" className="form-btn-primary">Guardar</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {toDelete && (
        <div className="form-overlay" onClick={() => setToDelete(null)}>
          <div className="form-modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '400px' }}>
            <div className="form-header">
              <h3>Eliminar orden</h3>
              <button className="form-close" onClick={() => setToDelete(null)}>✕</button>
            </div>
            <div className="form-body">
              <p style={{ marginBottom: '20px', color: '#6b7280' }}>¿Eliminar la orden <strong>{toDelete.numero}</strong> a {toDelete.proveedor}?</p>
              <div className="form-footer">
                <button type="button" className="form-btn-secondary" onClick={() => setToDelete(null)}>Cancelar</button>
                <button type="button" className="form-btn-primary" onClick={() => { eliminarOrden(toDelete.id); setToDelete(null); }} style={{ background: '#dc2626' }}>Eliminar</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </PageModule>
  )
}
