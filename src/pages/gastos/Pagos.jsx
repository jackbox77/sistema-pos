import { useState } from 'react'
import { Pencil, Trash2 } from 'lucide-react'
import { useGastos } from './GastosLayout'
import PageModule from '../../components/PageModule/PageModule'
import TableResponsive from '../../components/TableResponsive/TableResponsive'
import '../../components/TableResponsive/TableResponsive.css'
import '../../components/FormularioProductos/FormularioProductos.css'

export default function Pagos() {
  const { pagos, agregarPago, actualizarPago, eliminarPago } = useGastos()
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState(null)
  const [toDelete, setToDelete] = useState(null)
  const [form, setForm] = useState({ numero: '', beneficiario: '', fecha: '', monto: '', metodo: 'Transferencia' })

  const abrirNuevo = () => {
    setForm({ numero: '', beneficiario: '', fecha: new Date().toISOString().slice(0, 10), monto: '', metodo: 'Transferencia' })
    setEditing(null)
    setShowModal(true)
  }

  const abrirEditar = (p) => {
    setForm({ numero: p.numero, beneficiario: p.beneficiario, fecha: p.fecha, monto: String(p.monto), metodo: p.metodo })
    setEditing(p)
    setShowModal(true)
  }

  const guardar = (e) => {
    e.preventDefault()
    const data = { ...form, monto: Number(form.monto) || 0 }
    if (editing) actualizarPago(editing.id, data)
    else agregarPago(data)
    setShowModal(false)
  }

  return (
    <PageModule title="Pagos" description="Registra los pagos realizados a proveedores y acreedores.">
      <div className="page-module-toolbar">
        <button className="btn-primary" onClick={abrirNuevo}>+ Registrar pago</button>
        <input type="date" className="input-date" />
        <select className="input-select">
          <option>Todos los pagos</option>
        </select>
      </div>
      <TableResponsive>
        <table className="page-module-table">
          <thead>
            <tr>
              <th>Nº Pago</th>
              <th>Beneficiario</th>
              <th>Fecha</th>
              <th>Monto</th>
              <th>Método</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {pagos.length === 0 ? (
              <tr>
                <td colSpan="6">
                  <div className="page-module-empty">No hay pagos registrados. Los pagos realizados aparecerán aquí.</div>
                </td>
              </tr>
            ) : (
              pagos.map((p) => (
                <tr key={p.id}>
                  <td data-label="Nº Pago">{p.numero}</td>
                  <td data-label="Beneficiario">{p.beneficiario}</td>
                  <td data-label="Fecha">{p.fecha}</td>
                  <td data-label="Monto">${Number(p.monto).toLocaleString('es-CO')}</td>
                  <td data-label="Método">{p.metodo}</td>
                  <td data-label="Acciones">
                    <button type="button" className="btn-icon-action btn-icon-edit" onClick={() => abrirEditar(p)} title="Editar"><Pencil size={18} /></button>
                    <button type="button" className="btn-icon-action btn-icon-delete" onClick={() => setToDelete(p)} title="Eliminar"><Trash2 size={18} /></button>
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
              <h3>{editing ? 'Editar pago' : 'Registrar pago'}</h3>
              <button className="form-close" onClick={() => setShowModal(false)}>✕</button>
            </div>
            <form onSubmit={guardar} className="form-body">
              <div className="config-form-grid" style={{ gridTemplateColumns: '1fr' }}>
                <div className="config-field">
                  <label>Nº Pago *</label>
                  <input type="text" value={form.numero} onChange={(e) => setForm((p) => ({ ...p, numero: e.target.value }))} placeholder="PAG-001" required />
                </div>
                <div className="config-field">
                  <label>Beneficiario *</label>
                  <input type="text" value={form.beneficiario} onChange={(e) => setForm((p) => ({ ...p, beneficiario: e.target.value }))} placeholder="Nombre" required />
                </div>
                <div className="config-field">
                  <label>Fecha *</label>
                  <input type="date" value={form.fecha} onChange={(e) => setForm((p) => ({ ...p, fecha: e.target.value }))} required />
                </div>
                <div className="config-field">
                  <label>Monto *</label>
                  <input type="number" value={form.monto} onChange={(e) => setForm((p) => ({ ...p, monto: e.target.value }))} placeholder="0" min="0" required />
                </div>
                <div className="config-field">
                  <label>Método</label>
                  <select value={form.metodo} onChange={(e) => setForm((p) => ({ ...p, metodo: e.target.value }))}>
                    <option>Transferencia</option>
                    <option>Efectivo</option>
                    <option>Cheque</option>
                    <option>Tarjeta</option>
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
              <h3>Eliminar pago</h3>
              <button className="form-close" onClick={() => setToDelete(null)}>✕</button>
            </div>
            <div className="form-body">
              <p style={{ marginBottom: '20px', color: '#6b7280' }}>¿Eliminar el pago <strong>{toDelete.numero}</strong> a {toDelete.beneficiario}?</p>
              <div className="form-footer">
                <button type="button" className="form-btn-secondary" onClick={() => setToDelete(null)}>Cancelar</button>
                <button type="button" className="form-btn-primary" onClick={() => { eliminarPago(toDelete.id); setToDelete(null); }} style={{ background: '#dc2626' }}>Eliminar</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </PageModule>
  )
}
