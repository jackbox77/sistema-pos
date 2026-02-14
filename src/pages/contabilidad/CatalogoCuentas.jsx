import { useState } from 'react'
import { Pencil, Trash2 } from 'lucide-react'
import { useContabilidad } from './ContabilidadLayout'
import PageModule from '../../components/PageModule/PageModule'
import TableResponsive from '../../components/TableResponsive/TableResponsive'
import '../../components/TableResponsive/TableResponsive.css'
import '../../components/FormularioProductos/FormularioProductos.css'

export default function CatalogoCuentas() {
  const { cuentas, agregarCuenta, actualizarCuenta, eliminarCuenta } = useContabilidad()
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState(null)
  const [toDelete, setToDelete] = useState(null)
  const [form, setForm] = useState({ codigo: '', cuenta: '', tipo: 'Activo', saldo: '' })

  const abrirNuevo = () => {
    setForm({ codigo: '', cuenta: '', tipo: 'Activo', saldo: '' })
    setEditing(null)
    setShowModal(true)
  }

  const abrirEditar = (c) => {
    setForm({ codigo: c.codigo, cuenta: c.cuenta, tipo: c.tipo, saldo: String(c.saldo || 0) })
    setEditing(c)
    setShowModal(true)
  }

  const guardar = (e) => {
    e.preventDefault()
    const data = { ...form, saldo: Number(form.saldo) || 0 }
    if (editing) actualizarCuenta(editing.id, data)
    else agregarCuenta(data)
    setShowModal(false)
  }

  return (
    <PageModule
      title="Catálogo de cuentas"
      description="Plan de cuentas contables para clasificar las transacciones."
    >
      <div className="page-module-toolbar">
        <button className="btn-primary" type="button" onClick={abrirNuevo}>+ Nueva cuenta</button>
        <select className="input-select">
          <option>Todas las cuentas</option>
          <option>Activo</option>
          <option>Pasivo</option>
          <option>Patrimonio</option>
          <option>Ingreso</option>
          <option>Gasto</option>
        </select>
      </div>
      <TableResponsive>
      <table className="page-module-table">
        <thead>
          <tr>
            <th>Código</th>
            <th>Cuenta</th>
            <th>Tipo</th>
            <th>Saldo</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {cuentas.length === 0 ? (
              <tr>
                <td colSpan="5">
                  <div className="page-module-empty">No hay cuentas en el catálogo. Define el plan de cuentas de tu empresa.</div>
                </td>
              </tr>
            ) : (
              cuentas.map((c) => (
                <tr key={c.id}>
                  <td data-label="Código">{c.codigo}</td>
                  <td data-label="Cuenta">{c.cuenta}</td>
                  <td data-label="Tipo">{c.tipo}</td>
                  <td data-label="Saldo">${Number(c.saldo || 0).toLocaleString('es-CO')}</td>
                  <td data-label="Acciones">
                    <button type="button" className="btn-icon-action btn-icon-edit" onClick={() => abrirEditar(c)} title="Editar"><Pencil size={18} /></button>
                    <button type="button" className="btn-icon-action btn-icon-delete" onClick={() => setToDelete(c)} title="Eliminar"><Trash2 size={18} /></button>
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
              <h3>{editing ? 'Editar cuenta' : 'Nueva cuenta'}</h3>
              <button type="button" className="form-close" onClick={() => setShowModal(false)}>✕</button>
            </div>
            <form onSubmit={guardar} className="form-body">
              <div className="config-form-grid" style={{ gridTemplateColumns: '1fr' }}>
                <div className="config-field">
                  <label>Código *</label>
                  <input type="text" value={form.codigo} onChange={(e) => setForm((p) => ({ ...p, codigo: e.target.value }))} placeholder="1105" required />
                </div>
                <div className="config-field">
                  <label>Cuenta *</label>
                  <input type="text" value={form.cuenta} onChange={(e) => setForm((p) => ({ ...p, cuenta: e.target.value }))} placeholder="Caja" required />
                </div>
                <div className="config-field">
                  <label>Tipo *</label>
                  <select value={form.tipo} onChange={(e) => setForm((p) => ({ ...p, tipo: e.target.value }))}>
                    <option>Activo</option>
                    <option>Pasivo</option>
                    <option>Patrimonio</option>
                    <option>Ingreso</option>
                    <option>Gasto</option>
                  </select>
                </div>
                <div className="config-field">
                  <label>Saldo inicial</label>
                  <input type="number" value={form.saldo} onChange={(e) => setForm((p) => ({ ...p, saldo: e.target.value }))} placeholder="0" />
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
              <h3>Eliminar cuenta</h3>
              <button type="button" className="form-close" onClick={() => setToDelete(null)}>✕</button>
            </div>
            <div className="form-body">
              <p style={{ marginBottom: '20px', color: '#6b7280' }}>¿Eliminar la cuenta <strong>{toDelete.codigo} - {toDelete.cuenta}</strong>?</p>
              <div className="form-footer">
                <button type="button" className="form-btn-secondary" onClick={() => setToDelete(null)}>Cancelar</button>
                <button type="button" className="form-btn-primary" onClick={() => { eliminarCuenta(toDelete.id); setToDelete(null); }} style={{ background: '#dc2626' }}>Eliminar</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </PageModule>
  )
}
