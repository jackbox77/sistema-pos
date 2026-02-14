import { useState } from 'react'
import { Pencil, Trash2 } from 'lucide-react'
import { useGastos } from './GastosLayout'
import PageModule from '../../components/PageModule/PageModule'
import TableResponsive from '../../components/TableResponsive/TableResponsive'
import '../../components/TableResponsive/TableResponsive.css'
import '../../components/FormularioProductos/FormularioProductos.css'

export default function FacturasCompras() {
  const { facturasCompras, agregarFactura, actualizarFactura, eliminarFactura } = useGastos()
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState(null)
  const [toDelete, setToDelete] = useState(null)
  const [form, setForm] = useState({ numero: '', proveedor: '', fecha: '', total: '', estado: 'Pendiente' })

  const abrirNuevo = () => {
    setForm({ numero: '', proveedor: '', fecha: new Date().toISOString().slice(0, 10), total: '', estado: 'Pendiente' })
    setEditing(null)
    setShowModal(true)
  }

  const abrirEditar = (f) => {
    setForm({ numero: f.numero, proveedor: f.proveedor, fecha: f.fecha, total: String(f.total), estado: f.estado })
    setEditing(f)
    setShowModal(true)
  }

  const guardar = (e) => {
    e.preventDefault()
    const data = { ...form, total: Number(form.total) || 0 }
    if (editing) actualizarFactura(editing.id, data)
    else agregarFactura(data)
    setShowModal(false)
  }

  const eliminar = () => {
    if (toDelete) eliminarFactura(toDelete.id)
    setToDelete(null)
  }

  return (
    <PageModule title="Facturas de compras" description="Registra y consulta las facturas de proveedores y compras realizadas.">
      <div className="page-module-toolbar">
        <button className="btn-primary" type="button" onClick={abrirNuevo}>+ Nueva factura de compra</button>
        <input type="date" className="input-date" />
        <select className="input-select">
          <option>Todas las facturas</option>
          <option>Pendientes</option>
          <option>Pagadas</option>
        </select>
      </div>
      <TableResponsive>
      <table className="page-module-table">
        <thead>
          <tr>
            <th>Nº Factura</th>
            <th>Proveedor</th>
            <th>Fecha</th>
            <th>Total</th>
            <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {facturasCompras.length === 0 ? (
              <tr>
                <td colSpan="6">
                  <div className="page-module-empty">No hay facturas de compra. Registra las facturas de tus proveedores.</div>
                </td>
              </tr>
            ) : (
              facturasCompras.map((f) => (
                <tr key={f.id}>
                  <td data-label="Nº Factura">{f.numero}</td>
                  <td data-label="Proveedor">{f.proveedor}</td>
                  <td data-label="Fecha">{f.fecha}</td>
                  <td data-label="Total">${Number(f.total).toLocaleString('es-CO')}</td>
                  <td data-label="Estado">{f.estado}</td>
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
          <div className="form-modal" onClick={(e) => e.stopPropagation()}>
            <div className="form-header">
              <h3>{editing ? 'Editar factura' : 'Nueva factura de compra'}</h3>
              <button type="button" className="form-close" onClick={() => setShowModal(false)} aria-label="Cerrar">✕</button>
            </div>
            <form onSubmit={guardar} className="form-body">
              <div className="config-form-grid" style={{ gridTemplateColumns: '1fr' }}>
                <div className="config-field">
                  <label>Nº Factura *</label>
                  <input type="text" value={form.numero} onChange={(e) => setForm((p) => ({ ...p, numero: e.target.value }))} placeholder="FV-001" required />
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
                    <option>Pagada</option>
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
              <h3>Eliminar factura</h3>
              <button type="button" className="form-close" onClick={() => setToDelete(null)}>✕</button>
            </div>
            <div className="form-body">
              <p style={{ marginBottom: '20px', color: '#6b7280' }}>¿Eliminar la factura <strong>{toDelete.numero}</strong> de {toDelete.proveedor}?</p>
              <div className="form-footer">
                <button type="button" className="form-btn-secondary" onClick={() => setToDelete(null)}>Cancelar</button>
                <button type="button" className="form-btn-primary" onClick={eliminar} style={{ background: '#dc2626' }}>Eliminar</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </PageModule>
  )
}
