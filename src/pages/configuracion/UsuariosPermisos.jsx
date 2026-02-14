import { useRef, useState, useEffect } from 'react'
import { ChevronDown, X, Pencil, Trash2 } from 'lucide-react'
import PageModule from '../../components/PageModule/PageModule'
import TableResponsive from '../../components/TableResponsive/TableResponsive'
import '../../components/TableResponsive/TableResponsive.css'

const usuariosIniciales = [
  { id: 1, usuario: 'Admin', email: 'admin@empresa.com', rol: 'Administrador', estado: 'Activo', ultimoAcceso: '2026-02-11 09:30' },
  { id: 2, usuario: 'Vendedor1', email: 'vendedor1@empresa.com', rol: 'Vendedor', estado: 'Activo', ultimoAcceso: '2026-02-10 18:00' },
]

export default function UsuariosPermisos() {
  const [usuarios] = useState(usuariosIniciales)
  const [showMasAcciones, setShowMasAcciones] = useState(false)
  const masAccionesRef = useRef(null)
  const [listaPrecios, setListaPrecios] = useState('general')
  const [filtrosActivos, setFiltrosActivos] = useState([{ id: 'estado', label: 'Estado: todos' }])

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (masAccionesRef.current && !masAccionesRef.current.contains(e.target)) setShowMasAcciones(false)
    }
    if (showMasAcciones) document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [showMasAcciones])

  const quitarFiltro = (id) => setFiltrosActivos((p) => p.filter((f) => f.id !== id))

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
                  <button type="button" onClick={() => setShowMasAcciones(false)}>Exportar usuarios</button>
                </div>
              )}
            </div>
            <button type="button" className="btn-primary">+ Nuevo usuario</button>
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
        <button type="button" className="form-btn-secondary">+ Nuevo rol</button>
        <select className="input-select">
          <option>Todos los usuarios</option>
          <option>Activos</option>
          <option>Inactivos</option>
        </select>
        <input type="search" className="input-search" placeholder="Buscar usuarios..." />
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
            {usuarios.length === 0 ? (
              <tr>
                <td colSpan="6">
                  <div className="page-module-empty">No hay usuarios registrados. Añade usuarios para que puedan acceder al sistema.</div>
                </td>
              </tr>
            ) : (
              usuarios.map((u) => (
                <tr key={u.id}>
                  <td data-label="Usuario">{u.usuario}</td>
                  <td data-label="Email">{u.email}</td>
                  <td data-label="Rol">{u.rol}</td>
                  <td data-label="Estado">
                    <span className={`badge ${u.estado === 'Activo' ? 'badge-success' : 'badge-pending'}`}>{u.estado}</span>
                  </td>
                  <td data-label="Último acceso">{u.ultimoAcceso}</td>
                  <td data-label="Acciones">
                    <button type="button" className="btn-icon-action btn-icon-edit" title="Editar"><Pencil size={18} /></button>
                    <button type="button" className="btn-icon-action btn-icon-delete" title="Eliminar"><Trash2 size={18} /></button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </TableResponsive>
    </PageModule>
  )
}
