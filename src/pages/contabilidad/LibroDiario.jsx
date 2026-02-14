import { useState } from 'react'
import { Pencil, Trash2 } from 'lucide-react'
import { useContabilidad } from './ContabilidadLayout'
import PageModule from '../../components/PageModule/PageModule'
import TableResponsive from '../../components/TableResponsive/TableResponsive'
import '../../components/TableResponsive/TableResponsive.css'
import '../../components/FormularioProductos/FormularioProductos.css'

export default function LibroDiario() {
  const { cuentas, asientos, agregarAsiento, actualizarAsiento, eliminarAsiento } = useContabilidad()
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState(null)
  const [toDelete, setToDelete] = useState(null)
  const [form, setForm] = useState({ fecha: '', numeroAsiento: '', cuenta: '', descripcion: '', debito: '', credito: '' })

  const abrirNuevo = () => {
    setForm({ fecha: new Date().toISOString().slice(0, 10), numeroAsiento: '', cuenta: cuentas.length ? cuentas[0].cuenta : '', descripcion: '', debito: '', credito: '' })
    setEditing(null)
    setShowModal(true)
  }

  const abrirEditar = (a) => {
    setForm({ fecha: a.fecha, numeroAsiento: a.numeroAsiento, cuenta: a.cuenta, descripcion: a.descripcion, debito: String(a.debito), credito: String(a.credito) })
    setEditing(a)
    setShowModal(true)
  }

  const guardar = (e) => {
    e.preventDefault()
    const data = { ...form, debito: Number(form.debito) || 0, credito: Number(form.credito) || 0 }
    if (editing) actualizarAsiento(editing.id, data)
    else agregarAsiento(data)
    setShowModal(false)
  }

  return (
    <PageModule title="Libro diario" description="Registro cronológico de todas las transacciones contables del negocio.">
      <div className="page-module-toolbar">
        <button className="btn-primary" type="button" onClick={abrirNuevo}>+ Nuevo asiento</button>
        <input type="date" className="input-date" />
        <input type="date" className="input-date" placeholder="Hasta" />
      </div>
      <TableResponsive>
        <table className="page-module-table">
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Nº Asiento</th>
              <th>Cuenta</th>
              <th>Descripción</th>
              <th>Débito</th>
              <th>Crédito</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {asientos.length === 0 ? (
              <tr>
                <td colSpan="7">
                  <div className="page-module-empty">No hay asientos en el libro diario. Registra las transacciones contables.</div>
                </td>
              </tr>
            ) : (
              asientos.map((a) => (
                <tr key={a.id}>
                  <td data-label="Fecha">{a.fecha}</td>
                  <td data-label="Nº Asiento">{a.numeroAsiento}</td>
                  <td data-label="Cuenta">{a.cuenta}</td>
                  <td data-label="Descripción">{a.descripcion}</td>
                  <td data-label="Débito">{a.debito ? `$${Number(a.debito).toLocaleString('es-CO')}` : '-'}</td>
                  <td data-label="Crédito">{a.credito ? `$${Number(a.credito).toLocaleString('es-CO')}` : '-'}</td>
                  <td data-label="Acciones">
                    <button type="button" className="btn-icon-action btn-icon-edit" onClick={() => abrirEditar(a)} title="Editar"><Pencil size={18} /></button>
                    <button type="button" className="btn-icon-action btn-icon-delete" onClick={() => setToDelete(a)} title="Eliminar"><Trash2 size={18} /></button>
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
              <h3>{editing ? 'Editar asiento' : 'Nuevo asiento'}</h3>
              <button type="button" className="form-close" onClick={() => setShowModal(false)}>✕</button>
            </div>
            <form onSubmit={guardar} className="form-body">
              <div className="config-form-grid" style={{ gridTemplateColumns: '1fr' }}>
                <div className="config-field">
                  <label>Fecha *</label>
                  <input type="date" value={form.fecha} onChange={(e) => setForm((p) => ({ ...p, fecha: e.target.value }))} required />
                </div>
                <div className="config-field">
                  <label>Nº Asiento *</label>
                  <input type="text" value={form.numeroAsiento} onChange={(e) => setForm((p) => ({ ...p, numeroAsiento: e.target.value }))} placeholder="1" required />
                </div>
                <div className="config-field">
                  <label>Cuenta *</label>
                  <select value={form.cuenta} onChange={(e) => setForm((p) => ({ ...p, cuenta: e.target.value }))} required>
                    {cuentas.map((c) => (
                      <option key={c.id} value={c.cuenta}>{c.codigo} - {c.cuenta}</option>
                    ))}
                    {cuentas.length === 0 && <option value="">Crear cuentas en Catálogo de cuentas</option>}
                  </select>
                </div>
                <div className="config-field">
                  <label>Descripción *</label>
                  <input type="text" value={form.descripcion} onChange={(e) => setForm((p) => ({ ...p, descripcion: e.target.value }))} placeholder="Detalle de la transacción" required />
                </div>
                <div className="config-field">
                  <label>Débito</label>
                  <input type="number" value={form.debito} onChange={(e) => setForm((p) => ({ ...p, debito: e.target.value, credito: '' }))} placeholder="0" min="0" />
                </div>
                <div className="config-field">
                  <label>Crédito</label>
                  <input type="number" value={form.credito} onChange={(e) => setForm((p) => ({ ...p, credito: e.target.value, debito: '' }))} placeholder="0" min="0" />
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
              <h3>Eliminar asiento</h3>
              <button type="button" className="form-close" onClick={() => setToDelete(null)}>✕</button>
            </div>
            <div className="form-body">
              <p style={{ marginBottom: '20px', color: '#6b7280' }}>¿Eliminar el asiento Nº {toDelete.numeroAsiento} - {toDelete.descripcion}?</p>
              <div className="form-footer">
                <button type="button" className="form-btn-secondary" onClick={() => setToDelete(null)}>Cancelar</button>
                <button type="button" className="form-btn-primary" onClick={() => { eliminarAsiento(toDelete.id); setToDelete(null); }} style={{ background: '#dc2626' }}>Eliminar</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </PageModule>
  )
}
