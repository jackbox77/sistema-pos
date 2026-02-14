import { useState } from 'react'
import { Pencil, Trash2, X } from 'lucide-react'
import PageModule from '../../components/PageModule/PageModule'
import TableResponsive from '../../components/TableResponsive/TableResponsive'
import '../../components/TableResponsive/TableResponsive.css'
import '../../components/FormularioProductos/FormularioProductos.css'

const metodosPagoIniciales = [
  { id: 1, codigo: 'EF', nombre: 'Efectivo', descripcion: 'Pago en efectivo', estado: 'Activo' },
  { id: 2, codigo: 'TD', nombre: 'Tarjeta débito', descripcion: 'Pago con tarjeta débito', estado: 'Activo' },
  { id: 3, codigo: 'TC', nombre: 'Tarjeta crédito', descripcion: 'Pago con tarjeta de crédito', estado: 'Activo' },
  { id: 4, codigo: 'TR', nombre: 'Transferencia', descripcion: 'Transferencia bancaria', estado: 'Inactivo' },
]

export default function MetodosPago() {
  const [metodos, setMetodos] = useState(metodosPagoIniciales)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [metodoEditando, setMetodoEditando] = useState(null)
  const [metodoEliminar, setMetodoEliminar] = useState(null)
  const [listaPrecios, setListaPrecios] = useState('general')
  const [filtrosActivos, setFiltrosActivos] = useState([{ id: 'estado', label: 'Estado: activos' }])

  const quitarFiltro = (id) => {
    setFiltrosActivos((prev) => prev.filter((f) => f.id !== id))
  }

  const cambiarEstado = (id) => {
    setMetodos((prev) =>
      prev.map((m) =>
        m.id === id
          ? { ...m, estado: m.estado === 'Activo' ? 'Inactivo' : 'Activo' }
          : m
      )
    )
  }

  const handleCrear = () => setShowCreateModal(true)
  const handleEditar = (m) => {
    setMetodoEditando(m)
    setShowEditModal(true)
  }
  const handleEliminar = (m) => {
    setMetodoEliminar(m)
    setShowDeleteModal(true)
  }

  return (
    <PageModule title="" description="">
      <header className="maestro-encabezado">
        <div className="maestro-encabezado-top">
          <div className="maestro-encabezado-info">
            <h1 className="maestro-encabezado-titulo">Métodos de pago</h1>
            <p className="maestro-encabezado-desc">
              Creación y edición de métodos de pago. Active o desactive cada método según disponibilidad.
            </p>
            <a href="#ver-mas" className="maestro-encabezado-link">Ver más</a>
          </div>
          <div className="maestro-encabezado-acciones">
            <button type="button" className="btn-primary" onClick={handleCrear}>
              + Nuevo método de pago
            </button>
          </div>
        </div>
        <div className="maestro-encabezado-filtros">
          <div className="maestro-encabezado-filtros-left">
            <label className="maestro-encabezado-label">Lista de precios</label>
            <select
              className="maestro-encabezado-select"
              value={listaPrecios}
              onChange={(e) => setListaPrecios(e.target.value)}
            >
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
                  <button type="button" onClick={() => quitarFiltro(f.id)} aria-label="Quitar filtro">
                    <X size={14} />
                  </button>
                </span>
              ))
            ) : (
              <span className="maestro-filtro-sin">Ninguno</span>
            )}
          </div>
        </div>
      </header>
      <div className="page-module-toolbar" style={{ marginTop: '16px' }}>
        <input type="search" className="input-search" placeholder="Buscar métodos de pago..." />
      </div>
      <TableResponsive>
        <table className="page-module-table">
          <thead>
            <tr>
              <th>Código</th>
              <th>Método de pago</th>
              <th>Descripción</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {metodos.map((m) => (
              <tr key={m.id}>
                <td data-label="Código">{m.codigo}</td>
                <td data-label="Método de pago">{m.nombre}</td>
                <td data-label="Descripción">{m.descripcion}</td>
                <td data-label="Estado">
                  <button
                    type="button"
                    className={`badge badge-estado-toggle ${m.estado === 'Activo' ? 'badge-success' : 'badge-inactive'}`}
                    onClick={() => cambiarEstado(m.id)}
                    title="Clic para cambiar estado"
                  >
                    {m.estado}
                  </button>
                </td>
                <td data-label="Acciones">
                  <button type="button" className="btn-icon-action btn-icon-edit" onClick={() => handleEditar(m)} title="Editar" aria-label="Editar">
                    <Pencil size={18} />
                  </button>
                  <button type="button" className="btn-icon-action btn-icon-delete" onClick={() => handleEliminar(m)} title="Eliminar" aria-label="Eliminar">
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </TableResponsive>

      {showCreateModal && (
        <ModalFormMetodoPago
          onClose={() => setShowCreateModal(false)}
          onGuardar={(data) => {
            setMetodos((prev) => [...prev, { ...data, id: Date.now() }])
            setShowCreateModal(false)
          }}
        />
      )}

      {showEditModal && metodoEditando && (
        <ModalFormMetodoPago
          metodo={metodoEditando}
          onClose={() => {
            setShowEditModal(false)
            setMetodoEditando(null)
          }}
          onGuardar={(data) => {
            setMetodos((prev) =>
              prev.map((mp) => (mp.id === metodoEditando.id ? { ...mp, ...data } : mp))
            )
            setShowEditModal(false)
            setMetodoEditando(null)
          }}
          esEdicion
        />
      )}

      {showDeleteModal && metodoEliminar && (
        <ModalConfirmarEliminar
          titulo="Eliminar método de pago"
          nombre={metodoEliminar.nombre}
          onClose={() => {
            setShowDeleteModal(false)
            setMetodoEliminar(null)
          }}
          onConfirmar={() => {
            setMetodos((prev) => prev.filter((mp) => mp.id !== metodoEliminar.id))
            setShowDeleteModal(false)
            setMetodoEliminar(null)
          }}
        />
      )}
    </PageModule>
  )
}

function ModalConfirmarEliminar({ titulo, nombre, onClose, onConfirmar }) {
  return (
    <div className="form-overlay" onClick={onClose}>
      <div className="form-modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '400px' }}>
        <div className="form-header">
          <h3>{titulo}</h3>
          <button className="form-close" onClick={onClose} aria-label="Cerrar">✕</button>
        </div>
        <div className="form-body">
          <p style={{ marginBottom: '20px', color: '#6b7280' }}>
            ¿Estás seguro de que deseas eliminar el método de pago <strong>{nombre}</strong>?
          </p>
          <div className="form-footer">
            <button type="button" className="form-btn-secondary" onClick={onClose}>
              Cancelar
            </button>
            <button type="button" className="form-btn-primary" onClick={onConfirmar} style={{ background: '#dc2626' }}>
              Eliminar
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function ModalFormMetodoPago({ metodo, onClose, onGuardar, esEdicion = false }) {
  const [codigo, setCodigo] = useState(metodo?.codigo ?? '')
  const [nombre, setNombre] = useState(metodo?.nombre ?? '')
  const [descripcion, setDescripcion] = useState(metodo?.descripcion ?? '')
  const [estado, setEstado] = useState(metodo?.estado ?? 'Activo')

  const handleSubmit = (e) => {
    e.preventDefault()
    onGuardar({ codigo, nombre, descripcion, estado })
  }

  return (
    <div className="form-overlay" onClick={onClose}>
      <div className="form-modal" onClick={(e) => e.stopPropagation()}>
        <div className="form-header">
          <h3>{esEdicion ? 'Editar método de pago' : 'Nuevo método de pago'}</h3>
          <button className="form-close" onClick={onClose} aria-label="Cerrar">✕</button>
        </div>
        <form onSubmit={handleSubmit} className="form-body">
          <div className="config-form-grid" style={{ gridTemplateColumns: '1fr' }}>
            <div className="config-field">
              <label>Código *</label>
              <input
                type="text"
                value={codigo}
                onChange={(e) => setCodigo(e.target.value)}
                placeholder="Ej: EF, TD, TC"
                required
              />
            </div>
            <div className="config-field">
              <label>Método de pago *</label>
              <input
                type="text"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                placeholder="Ej: Efectivo, Tarjeta débito"
                required
              />
            </div>
            <div className="config-field">
              <label>Descripción</label>
              <textarea
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                placeholder="Descripción opcional"
                rows={3}
              />
            </div>
            <div className="config-field">
              <label>Estado</label>
              <select value={estado} onChange={(e) => setEstado(e.target.value)}>
                <option value="Activo">Activo</option>
                <option value="Inactivo">Inactivo</option>
              </select>
            </div>
          </div>
          <div className="form-footer">
            <button type="button" className="form-btn-secondary" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="form-btn-primary">
              {esEdicion ? 'Guardar cambios' : 'Crear método de pago'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
