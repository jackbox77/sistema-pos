import { useState } from 'react'
import { Pencil, Trash2 } from 'lucide-react'
import { useGastos } from './GastosLayout'
import PageModule from '../../components/PageModule/PageModule'
import TableResponsive from '../../components/TableResponsive/TableResponsive'
import '../../components/TableResponsive/TableResponsive.css'
import '../../components/FormularioProductos/FormularioProductos.css'

export default function DocumentoSoporte() {
  const { documentosSoporte, agregarDocumento, actualizarDocumento, eliminarDocumento } = useGastos()
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState(null)
  const [toDelete, setToDelete] = useState(null)
  const [form, setForm] = useState({ numero: '', descripcion: '', fecha: '', monto: '', proveedor: '' })

  const abrirNuevo = () => {
    setForm({ numero: '', descripcion: '', fecha: new Date().toISOString().slice(0, 10), monto: '', proveedor: '' })
    setEditing(null)
    setShowModal(true)
  }

  const abrirEditar = (d) => {
    setForm({ numero: d.numero, descripcion: d.descripcion, fecha: d.fecha, monto: String(d.monto), proveedor: d.proveedor })
    setEditing(d)
    setShowModal(true)
  }

  const guardar = (e) => {
    e.preventDefault()
    const data = { ...form, monto: Number(form.monto) || 0 }
    if (editing) actualizarDocumento(editing.id, data)
    else agregarDocumento(data)
    setShowModal(false)
  }

  return (
    <PageModule title="Documento soporte" description="Documentos que respaldan gastos y compras sin factura.">
      <div className="page-module-toolbar">
        <button className="btn-primary" onClick={abrirNuevo}>+ Nuevo documento soporte</button>
        <input type="date" className="input-date" />
        <select className="input-select">
          <option>Todos los documentos</option>
        </select>
      </div>
      <TableResponsive>
        <table className="page-module-table">
          <thead>
            <tr>
              <th>Nº Documento</th>
              <th>Descripción</th>
              <th>Fecha</th>
              <th>Monto</th>
              <th>Proveedor</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {documentosSoporte.length === 0 ? (
              <tr>
                <td colSpan="6">
                  <div className="page-module-empty">No hay documentos soporte. Añade documentos para respaldar tus gastos.</div>
                </td>
              </tr>
            ) : (
              documentosSoporte.map((d) => (
                <tr key={d.id}>
                  <td data-label="Nº Documento">{d.numero}</td>
                  <td data-label="Descripción">{d.descripcion}</td>
                  <td data-label="Fecha">{d.fecha}</td>
                  <td data-label="Monto">${Number(d.monto).toLocaleString('es-CO')}</td>
                  <td data-label="Proveedor">{d.proveedor}</td>
                  <td data-label="Acciones">
                    <button type="button" className="btn-icon-action btn-icon-edit" onClick={() => abrirEditar(d)} title="Editar"><Pencil size={18} /></button>
                    <button type="button" className="btn-icon-action btn-icon-delete" onClick={() => setToDelete(d)} title="Eliminar"><Trash2 size={18} /></button>
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
              <h3>{editing ? 'Editar documento' : 'Nuevo documento soporte'}</h3>
              <button className="form-close" onClick={() => setShowModal(false)} aria-label="Cerrar">✕</button>
            </div>
            <form onSubmit={guardar} className="form-body">
              <div className="config-form-grid" style={{ gridTemplateColumns: '1fr' }}>
                <div className="config-field">
                  <label>Nº Documento *</label>
                  <input type="text" value={form.numero} onChange={(e) => setForm((p) => ({ ...p, numero: e.target.value }))} placeholder="DOC-001" required />
                </div>
                <div className="config-field">
                  <label>Descripción *</label>
                  <input type="text" value={form.descripcion} onChange={(e) => setForm((p) => ({ ...p, descripcion: e.target.value }))} placeholder="Recibo, comprobante..." required />
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
                  <label>Proveedor</label>
                  <input type="text" value={form.proveedor} onChange={(e) => setForm((p) => ({ ...p, proveedor: e.target.value }))} placeholder="Nombre" />
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
              <h3>Eliminar documento</h3>
              <button className="form-close" onClick={() => setToDelete(null)}>✕</button>
            </div>
            <div className="form-body">
              <p style={{ marginBottom: '20px', color: '#6b7280' }}>¿Eliminar el documento <strong>{toDelete.numero}</strong>?</p>
              <div className="form-footer">
                <button type="button" className="form-btn-secondary" onClick={() => setToDelete(null)}>Cancelar</button>
                <button type="button" className="form-btn-primary" onClick={() => { eliminarDocumento(toDelete.id); setToDelete(null); }} style={{ background: '#dc2626' }}>Eliminar</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </PageModule>
  )
}
