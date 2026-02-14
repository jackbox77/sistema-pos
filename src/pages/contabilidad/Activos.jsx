import { useState } from 'react'
import { Pencil, Trash2 } from 'lucide-react'
import { useContabilidad } from './ContabilidadLayout'
import PageModule from '../../components/PageModule/PageModule'
import TableResponsive from '../../components/TableResponsive/TableResponsive'
import '../../components/TableResponsive/TableResponsive.css'
import '../../components/FormularioProductos/FormularioProductos.css'

export default function Activos() {
  const { activos, agregarActivo, actualizarActivo, eliminarActivo } = useContabilidad()
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState(null)
  const [toDelete, setToDelete] = useState(null)
  const [form, setForm] = useState({ codigo: '', descripcion: '', categoria: '', valor: '', estado: 'En uso' })

  const abrirNuevo = () => {
    setForm({ codigo: '', descripcion: '', categoria: '', valor: '', estado: 'En uso' })
    setEditing(null)
    setShowModal(true)
  }

  const abrirEditar = (a) => {
    setForm({ codigo: a.codigo, descripcion: a.descripcion, categoria: a.categoria, valor: String(a.valor), estado: a.estado })
    setEditing(a)
    setShowModal(true)
  }

  const guardar = (e) => {
    e.preventDefault()
    const data = { ...form, valor: Number(form.valor) || 0 }
    if (editing) actualizarActivo(editing.id, data)
    else agregarActivo(data)
    setShowModal(false)
  }

  return (
    <PageModule
      title="Activos"
      description="Registro y control de los activos fijos e intangibles de la empresa."
    >
      <div className="page-module-toolbar">
        <button className="btn-primary" type="button" onClick={abrirNuevo}>+ Nuevo activo</button>
        <select className="input-select">
          <option>Todos los activos</option>
          <option>En uso</option>
          <option>En mantenimiento</option>
          <option>Dado de baja</option>
        </select>
      </div>
      <TableResponsive>
      <table className="page-module-table">
        <thead>
          <tr>
            <th>Código</th>
            <th>Descripción</th>
            <th>Categoría</th>
            <th>Valor</th>
            <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {activos.length === 0 ? (
              <tr>
                <td colSpan="6">
                  <div className="page-module-empty">No hay activos registrados. Registra los bienes de tu empresa.</div>
                </td>
              </tr>
            ) : (
              activos.map((a) => (
                <tr key={a.id}>
                  <td data-label="Código">{a.codigo}</td>
                  <td data-label="Descripción">{a.descripcion}</td>
                  <td data-label="Categoría">{a.categoria}</td>
                  <td data-label="Valor">${Number(a.valor).toLocaleString('es-CO')}</td>
                  <td data-label="Estado">{a.estado}</td>
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
              <h3>{editing ? 'Editar activo' : 'Nuevo activo'}</h3>
              <button type="button" className="form-close" onClick={() => setShowModal(false)}>✕</button>
            </div>
            <form onSubmit={guardar} className="form-body">
              <div className="config-form-grid" style={{ gridTemplateColumns: '1fr' }}>
                <div className="config-field">
                  <label>Código *</label>
                  <input type="text" value={form.codigo} onChange={(e) => setForm((p) => ({ ...p, codigo: e.target.value }))} placeholder="ACT-001" required />
                </div>
                <div className="config-field">
                  <label>Descripción *</label>
                  <input type="text" value={form.descripcion} onChange={(e) => setForm((p) => ({ ...p, descripcion: e.target.value }))} placeholder="Equipo, mueble..." required />
                </div>
                <div className="config-field">
                  <label>Categoría *</label>
                  <input type="text" value={form.categoria} onChange={(e) => setForm((p) => ({ ...p, categoria: e.target.value }))} placeholder="Equipo de cómputo, muebles..." required />
                </div>
                <div className="config-field">
                  <label>Valor *</label>
                  <input type="number" value={form.valor} onChange={(e) => setForm((p) => ({ ...p, valor: e.target.value }))} placeholder="0" min="0" required />
                </div>
                <div className="config-field">
                  <label>Estado</label>
                  <select value={form.estado} onChange={(e) => setForm((p) => ({ ...p, estado: e.target.value }))}>
                    <option>En uso</option>
                    <option>En mantenimiento</option>
                    <option>Dado de baja</option>
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
              <h3>Eliminar activo</h3>
              <button type="button" className="form-close" onClick={() => setToDelete(null)}>✕</button>
            </div>
            <div className="form-body">
              <p style={{ marginBottom: '20px', color: '#6b7280' }}>¿Eliminar el activo <strong>{toDelete.codigo}</strong> - {toDelete.descripcion}?</p>
              <div className="form-footer">
                <button type="button" className="form-btn-secondary" onClick={() => setToDelete(null)}>Cancelar</button>
                <button type="button" className="form-btn-primary" onClick={() => { eliminarActivo(toDelete.id); setToDelete(null); }} style={{ background: '#dc2626' }}>Eliminar</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </PageModule>
  )
}
