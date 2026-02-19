import { useRef, useState, useEffect, useMemo } from 'react'
import { ChevronDown, X, Pencil, Trash2, Download } from 'lucide-react'
import PageModule from '../../components/PageModule/PageModule'
import TableResponsive from '../../components/TableResponsive/TableResponsive'
import '../../components/TableResponsive/TableResponsive.css'
import '../../components/FormularioProductos/FormularioProductos.css'

const usuariosIniciales = [
  { id: 1, usuario: 'Admin', email: 'admin@empresa.com', rol: 'Administrador', estado: 'Activo', ultimoAcceso: '2026-02-11 09:30' },
  { id: 2, usuario: 'Vendedor1', email: 'vendedor1@empresa.com', rol: 'Vendedor', estado: 'Activo', ultimoAcceso: '2026-02-10 18:00' },
]
const rolesIniciales = ['Administrador', 'Vendedor']

export default function UsuariosPermisos() {
  const [usuarios, setUsuarios] = useState(usuariosIniciales)
  const [roles, setRoles] = useState(rolesIniciales)
  const [showFormUsuario, setShowFormUsuario] = useState(false)
  const [showFormRol, setShowFormRol] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [usuarioEditando, setUsuarioEditando] = useState(null)
  const [usuarioEliminar, setUsuarioEliminar] = useState(null)
  const [showMasAcciones, setShowMasAcciones] = useState(false)
  const masAccionesRef = useRef(null)
  const [listaPrecios, setListaPrecios] = useState('general')
  const [filtrosActivos, setFiltrosActivos] = useState([{ id: 'estado', label: 'Estado: todos' }])
  const [filtroEstado, setFiltroEstado] = useState('todos')
  const [busqueda, setBusqueda] = useState('')

  const usuariosFiltrados = useMemo(() => {
    let list = usuarios
    if (filtroEstado === 'activos') list = list.filter((u) => u.estado === 'Activo')
    else if (filtroEstado === 'inactivos') list = list.filter((u) => u.estado === 'Inactivo')
    if (busqueda.trim()) {
      const q = busqueda.toLowerCase().trim()
      list = list.filter(
        (u) =>
          u.usuario.toLowerCase().includes(q) ||
          u.email.toLowerCase().includes(q) ||
          (u.rol && u.rol.toLowerCase().includes(q))
      )
    }
    return list
  }, [usuarios, filtroEstado, busqueda])

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (masAccionesRef.current && !masAccionesRef.current.contains(e.target)) setShowMasAcciones(false)
    }
    if (showMasAcciones) document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [showMasAcciones])

  const quitarFiltro = (id) => setFiltrosActivos((p) => p.filter((f) => f.id !== id))

  const abrirNuevoUsuario = () => {
    setUsuarioEditando(null)
    setShowFormUsuario(true)
  }
  const abrirEditarUsuario = (u) => {
    setUsuarioEditando(u)
    setShowFormUsuario(true)
  }
  const cerrarFormUsuario = () => {
    setShowFormUsuario(false)
    setUsuarioEditando(null)
  }

  const handleGuardarUsuario = (data) => {
    if (usuarioEditando) {
      setUsuarios((prev) =>
        prev.map((u) => (u.id === usuarioEditando.id ? { ...u, ...data, ultimoAcceso: u.ultimoAcceso } : u))
      )
    } else {
      const ahora = new Date().toISOString().slice(0, 16).replace('T', ' ')
      setUsuarios((prev) => [...prev, { ...data, id: Date.now(), ultimoAcceso: ahora }])
    }
    if (data.rol && !roles.includes(data.rol)) setRoles((r) => [...r, data.rol])
    cerrarFormUsuario()
  }

  const handleEliminarUsuario = (u) => {
    setUsuarioEliminar(u)
    setShowDeleteModal(true)
  }
  const handleConfirmarEliminar = () => {
    if (!usuarioEliminar) return
    setUsuarios((prev) => prev.filter((u) => u.id !== usuarioEliminar.id))
    setShowDeleteModal(false)
    setUsuarioEliminar(null)
  }

  const abrirNuevoRol = () => setShowFormRol(true)
  const handleGuardarRol = (nombreRol) => {
    if (nombreRol.trim() && !roles.includes(nombreRol.trim())) {
      setRoles((prev) => [...prev, nombreRol.trim()])
    }
    setShowFormRol(false)
  }

  const exportarUsuarios = () => {
    const encabezados = ['Usuario', 'Email', 'Rol', 'Estado', 'Último acceso']
    const filas = usuarios.map((u) => [u.usuario, u.email, u.rol, u.estado, u.ultimoAcceso])
    const csv = [encabezados.join(','), ...filas.map((f) => f.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(','))].join('\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `usuarios_${new Date().toISOString().slice(0, 10)}.csv`
    link.click()
    URL.revokeObjectURL(link.href)
    setShowMasAcciones(false)
  }

  return (
    <PageModule title="" description="">
      <header className="maestro-encabezado">
        <div className="maestro-encabezado-top">
          <div className="maestro-encabezado-info">
            <h1 className="maestro-encabezado-titulo">Usuarios y permisos</h1>
            <p className="maestro-encabezado-desc">Gestiona los usuarios del sistema y sus permisos por rol. Asigna roles y controla el acceso.</p>
            <a href="#ver-mas" className="maestro-encabezado-link">Ver más</a>
          </div>
          <div className="maestro-encabezado-acciones">
            <div className="toolbar-mas-acciones-wrap" ref={masAccionesRef}>
              <button type="button" className="toolbar-mas-acciones" onClick={() => setShowMasAcciones((v) => !v)} aria-expanded={showMasAcciones} aria-haspopup="true">
                Más acciones <ChevronDown size={18} />
              </button>
              {showMasAcciones && (
                <div className="toolbar-dropdown">
                  <button type="button" onClick={exportarUsuarios}>
                    <Download size={18} /> Exportar usuarios
                  </button>
                </div>
              )}
            </div>
            <button type="button" className="btn-primary" onClick={abrirNuevoUsuario}>
              + Nuevo usuario
            </button>
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
        <button type="button" className="form-btn-secondary" onClick={abrirNuevoRol}>
          + Nuevo rol
        </button>
        <select className="input-select" value={filtroEstado} onChange={(e) => setFiltroEstado(e.target.value)}>
          <option value="todos">Todos los usuarios</option>
          <option value="activos">Activos</option>
          <option value="inactivos">Inactivos</option>
        </select>
        <input
          type="search"
          className="input-search"
          placeholder="Buscar usuarios..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />
      </div>
      <TableResponsive>
        <table className="page-module-table">
          <thead>
            <tr>
              <th>Usuario</th>
              <th>Email</th>
              <th>Rol</th>
              <th>Estado</th>
              <th>Último acceso</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {usuariosFiltrados.length === 0 ? (
              <tr>
                <td colSpan="6">
                  <div className="page-module-empty">
                    {usuarios.length === 0
                      ? 'No hay usuarios registrados. Añade usuarios para que puedan acceder al sistema.'
                      : 'No hay usuarios que coincidan con el filtro o la búsqueda.'}
                  </div>
                </td>
              </tr>
            ) : (
              usuariosFiltrados.map((u) => (
                <tr key={u.id}>
                  <td data-label="Usuario">{u.usuario}</td>
                  <td data-label="Email">{u.email}</td>
                  <td data-label="Rol">{u.rol}</td>
                  <td data-label="Estado">
                    <span className={`badge ${u.estado === 'Activo' ? 'badge-success' : 'badge-pending'}`}>{u.estado}</span>
                  </td>
                  <td data-label="Último acceso">{u.ultimoAcceso}</td>
                  <td data-label="Acciones">
                    <button type="button" className="btn-icon-action btn-icon-edit" title="Editar" aria-label="Editar" onClick={() => abrirEditarUsuario(u)}>
                      <Pencil size={18} />
                    </button>
                    <button type="button" className="btn-icon-action btn-icon-delete" title="Eliminar" aria-label="Eliminar" onClick={() => handleEliminarUsuario(u)}>
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </TableResponsive>

      {showFormUsuario && (
        <ModalFormUsuario
          usuario={usuarioEditando}
          roles={roles}
          onClose={cerrarFormUsuario}
          onGuardar={handleGuardarUsuario}
          esEdicion={Boolean(usuarioEditando)}
        />
      )}

      {showFormRol && (
        <ModalFormRol onClose={() => setShowFormRol(false)} onGuardar={handleGuardarRol} />
      )}

      {showDeleteModal && usuarioEliminar && (
        <ModalConfirmarEliminar
          titulo="Eliminar usuario"
          nombre={usuarioEliminar.usuario}
          onClose={() => {
            setShowDeleteModal(false)
            setUsuarioEliminar(null)
          }}
          onConfirmar={handleConfirmarEliminar}
        />
      )}
    </PageModule>
  )
}

function ModalFormUsuario({ usuario, roles, onClose, onGuardar, esEdicion }) {
  const [nombreUsuario, setNombreUsuario] = useState(usuario?.usuario ?? '')
  const [email, setEmail] = useState(usuario?.email ?? '')
  const [rol, setRol] = useState(usuario?.rol ?? roles[0] ?? '')
  const [estado, setEstado] = useState(usuario?.estado ?? 'Activo')
  const [password, setPassword] = useState('')
  const [saving, setSaving] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      await Promise.resolve(onGuardar({
        usuario: nombreUsuario.trim(),
        email: email.trim(),
        rol: rol.trim() || roles[0],
        estado: estado,
      }))
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="form-overlay" onClick={onClose}>
      <div className="form-modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '440px' }}>
        <div className="form-header">
          <h3>{esEdicion ? 'Editar usuario' : 'Nuevo usuario'}</h3>
          <button className="form-close" onClick={onClose} aria-label="Cerrar">✕</button>
        </div>
        <form onSubmit={handleSubmit} className="form-body">
          <div className="config-form-grid" style={{ gridTemplateColumns: '1fr' }}>
            <div className="config-field">
              <label>Usuario *</label>
              <input
                type="text"
                value={nombreUsuario}
                onChange={(e) => setNombreUsuario(e.target.value)}
                placeholder="Nombre de usuario"
                required
              />
            </div>
            <div className="config-field">
              <label>Email *</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="usuario@empresa.com"
                required
              />
            </div>
            <div className="config-field">
              <label>Rol *</label>
              <select value={rol} onChange={(e) => setRol(e.target.value)} required>
                {roles.map((r) => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </div>
            <div className="config-field">
              <label>Estado</label>
              <select value={estado} onChange={(e) => setEstado(e.target.value)}>
                <option value="Activo">Activo</option>
                <option value="Inactivo">Inactivo</option>
              </select>
            </div>
            {!esEdicion && (
              <div className="config-field">
                <label>Contraseña</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Opcional"
                />
              </div>
            )}
          </div>
          <div className="form-footer">
            <button type="button" className="form-btn-secondary" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="form-btn-primary" disabled={saving}>
              {saving ? 'Guardando...' : esEdicion ? 'Guardar cambios' : 'Crear usuario'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

function ModalFormRol({ onClose, onGuardar }) {
  const [nombreRol, setNombreRol] = useState('')
  const [saving, setSaving] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      await Promise.resolve(onGuardar(nombreRol))
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="form-overlay" onClick={onClose}>
      <div className="form-modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '360px' }}>
        <div className="form-header">
          <h3>Nuevo rol</h3>
          <button className="form-close" onClick={onClose} aria-label="Cerrar">✕</button>
        </div>
        <form onSubmit={handleSubmit} className="form-body">
          <div className="config-field">
            <label>Nombre del rol *</label>
            <input
              type="text"
              value={nombreRol}
              onChange={(e) => setNombreRol(e.target.value)}
              placeholder="Ej: Cajero, Supervisor"
              required
            />
          </div>
          <div className="form-footer">
            <button type="button" className="form-btn-secondary" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="form-btn-primary" disabled={saving}>
              {saving ? 'Guardando...' : 'Crear rol'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

function ModalConfirmarEliminar({ titulo, nombre, onClose, onConfirmar }) {
  const [deleting, setDeleting] = useState(false)
  const handleConfirmar = async () => {
    setDeleting(true)
    try {
      await Promise.resolve(onConfirmar())
    } finally {
      setDeleting(false)
    }
  }
  return (
    <div className="form-overlay" onClick={onClose}>
      <div className="form-modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '400px' }}>
        <div className="form-header">
          <h3>{titulo}</h3>
          <button className="form-close" onClick={onClose} aria-label="Cerrar" disabled={deleting}>✕</button>
        </div>
        <div className="form-body">
          <p style={{ marginBottom: '20px', color: '#6b7280' }}>
            ¿Estás seguro de que deseas eliminar al usuario <strong>{nombre}</strong>? Esta acción no se puede deshacer.
          </p>
          <div className="form-footer">
            <button type="button" className="form-btn-secondary" onClick={onClose} disabled={deleting}>
              Cancelar
            </button>
            <button type="button" className="form-btn-primary" onClick={handleConfirmar} disabled={deleting} style={{ background: '#dc2626' }}>
              {deleting ? 'Eliminando...' : 'Eliminar'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
