import { useState, useMemo } from 'react'
import PageModule from '../../components/PageModule/PageModule'
import TableResponsive from '../../components/TableResponsive/TableResponsive'
import '../../components/TableResponsive/TableResponsive.css'
import '../../components/FormularioProductos/FormularioProductos.css'

const TIPOS_DOCUMENTO = ['NIT', 'Cédula de ciudadanía', 'Cédula de extranjería', 'Pasaporte', 'Otro']

const proveedoresIniciales = [
  { id: 1, tipoDocumento: 'NIT', numeroDocumento: '900.123.456-1', nombre: 'Distribuidora Central S.A.S.', contacto: 'Juan Pérez', telefono: '300 123 4567', comprasAsociadas: 24 },
  { id: 2, tipoDocumento: 'NIT', numeroDocumento: '900.789.012-3', nombre: 'Bebidas y Más Ltda.', contacto: 'María López', telefono: '310 987 6543', comprasAsociadas: 15 },
]

export default function Proveedores() {
  const [proveedores, setProveedores] = useState(proveedoresIniciales)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [proveedorEditando, setProveedorEditando] = useState(null)
  const [proveedorEliminar, setProveedorEliminar] = useState(null)
  const [busqueda, setBusqueda] = useState('')

  const proveedoresFiltrados = useMemo(() => {
    if (!busqueda.trim()) return proveedores
    const q = busqueda.toLowerCase().trim()
    return proveedores.filter(
      (p) =>
        p.nombre.toLowerCase().includes(q) ||
        (p.numeroDocumento && p.numeroDocumento.toLowerCase().includes(q)) ||
        (p.contacto && p.contacto.toLowerCase().includes(q))
    )
  }, [proveedores, busqueda])

  const handleCrear = () => setShowCreateModal(true)
  const handleEditar = (p) => {
    setProveedorEditando(p)
    setShowEditModal(true)
  }
  const handleEliminar = (p) => {
    setProveedorEliminar(p)
    setShowDeleteModal(true)
  }

  return (
    <PageModule
      title="Proveedores"
      description="Registro y edición de proveedores. Visualización de compras asociadas a cada proveedor."
    >
      <div className="page-module-toolbar">
        <button className="btn-primary" onClick={handleCrear}>+ Nuevo proveedor</button>
        <input
          type="search"
          className="input-search"
          placeholder="Buscar por nombre, documento o contacto..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />
      </div>
      <TableResponsive>
        <table className="page-module-table">
          <thead>
            <tr>
              <th>Tipo doc.</th>
              <th>Nº documento</th>
              <th>Nombre</th>
              <th>Contacto</th>
              <th>Teléfono</th>
              <th>Compras asociadas</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {proveedoresFiltrados.map((p) => (
              <tr key={p.id}>
                <td data-label="Tipo doc.">{p.tipoDocumento ?? (p.nit ? 'NIT' : '—')}</td>
                <td data-label="Nº documento">{p.numeroDocumento ?? p.nit ?? '—'}</td>
                <td data-label="Nombre">{p.nombre}</td>
                <td data-label="Contacto">{p.contacto}</td>
                <td data-label="Teléfono">{p.telefono}</td>
                <td data-label="Compras asociadas">{p.comprasAsociadas}</td>
                <td data-label="Acciones">
                  <button className="btn-action" onClick={() => handleEditar(p)}>Editar</button>
                  <button className="btn-action btn-action-danger" onClick={() => handleEliminar(p)}>Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </TableResponsive>
      {proveedoresFiltrados.length === 0 && (
        <p className="page-module-empty">
          {busqueda ? 'No hay proveedores que coincidan con la búsqueda.' : 'No hay proveedores. Crea uno con el botón "+ Nuevo proveedor".'}
        </p>
      )}

      {showCreateModal && (
        <ModalFormProveedor
          tiposDocumento={TIPOS_DOCUMENTO}
          onClose={() => setShowCreateModal(false)}
          onGuardar={(data) => {
            setProveedores((prev) => [...prev, { ...data, id: Date.now(), comprasAsociadas: 0 }])
            setShowCreateModal(false)
          }}
        />
      )}

      {showEditModal && proveedorEditando && (
        <ModalFormProveedor
          proveedor={proveedorEditando}
          tiposDocumento={TIPOS_DOCUMENTO}
          onClose={() => {
            setShowEditModal(false)
            setProveedorEditando(null)
          }}
          onGuardar={(data) => {
            setProveedores((prev) =>
              prev.map((pr) => (pr.id === proveedorEditando.id ? { ...pr, ...data } : pr))
            )
            setShowEditModal(false)
            setProveedorEditando(null)
          }}
          esEdicion
        />
      )}

      {showDeleteModal && proveedorEliminar && (
        <ModalConfirmarEliminar
          titulo="Eliminar proveedor"
          nombre={proveedorEliminar.nombre}
          onClose={() => {
            setShowDeleteModal(false)
            setProveedorEliminar(null)
          }}
          onConfirmar={() => {
            setProveedores((prev) => prev.filter((pr) => pr.id !== proveedorEliminar.id))
            setShowDeleteModal(false)
            setProveedorEliminar(null)
          }}
        />
      )}
    </PageModule>
  )
}

function ModalFormProveedor({ proveedor, tiposDocumento, onClose, onGuardar, esEdicion = false }) {
  const [tipoDocumento, setTipoDocumento] = useState(proveedor?.tipoDocumento ?? (proveedor?.nit ? 'NIT' : 'NIT'))
  const [numeroDocumento, setNumeroDocumento] = useState(proveedor?.numeroDocumento ?? proveedor?.nit ?? '')
  const [nombre, setNombre] = useState(proveedor?.nombre ?? '')
  const [contacto, setContacto] = useState(proveedor?.contacto ?? '')
  const [telefono, setTelefono] = useState(proveedor?.telefono ?? '')

  const handleSubmit = (e) => {
    e.preventDefault()
    onGuardar({ tipoDocumento, numeroDocumento, nombre, contacto, telefono })
  }

  return (
    <div className="form-overlay" onClick={onClose}>
      <div className="form-modal" onClick={(e) => e.stopPropagation()}>
        <div className="form-header">
          <h3>{esEdicion ? 'Editar proveedor' : 'Nuevo proveedor'}</h3>
          <button className="form-close" onClick={onClose} aria-label="Cerrar">✕</button>
        </div>
        <form onSubmit={handleSubmit} className="form-body">
          <div className="config-form-grid" style={{ gridTemplateColumns: '1fr' }}>
            <div className="config-field">
              <label>Tipo de documento</label>
              <select
                value={tipoDocumento}
                onChange={(e) => setTipoDocumento(e.target.value)}
              >
                {tiposDocumento.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
            <div className="config-field">
              <label>Número de documento</label>
              <input
                type="text"
                value={numeroDocumento}
                onChange={(e) => setNumeroDocumento(e.target.value)}
                placeholder="Ej: 900.123.456-1 o número de cédula"
              />
            </div>
            <div className="config-field">
              <label>Nombre *</label>
              <input
                type="text"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                placeholder="Razón social o nombre del proveedor"
                required
              />
            </div>
            <div className="config-field">
              <label>Contacto</label>
              <input
                type="text"
                value={contacto}
                onChange={(e) => setContacto(e.target.value)}
                placeholder="Nombre del contacto"
              />
            </div>
            <div className="config-field">
              <label>Teléfono</label>
              <input
                type="text"
                value={telefono}
                onChange={(e) => setTelefono(e.target.value)}
                placeholder="Ej: 300 123 4567"
              />
            </div>
          </div>
          <div className="form-footer">
            <button type="button" className="form-btn-secondary" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="form-btn-primary">
              {esEdicion ? 'Guardar cambios' : 'Crear proveedor'}
            </button>
          </div>
        </form>
      </div>
    </div>
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
            ¿Estás seguro de que deseas eliminar <strong>{nombre}</strong>?
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
