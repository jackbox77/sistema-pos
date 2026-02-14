import { useRef, useState, useMemo, useEffect } from 'react'
import { Pencil, Trash2, Upload, Download, ChevronDown, BookOpen, X } from 'lucide-react'
import PageModule from '../../components/PageModule/PageModule'
import { descargarPlantilla, parsearCSV } from '../../utils/csvMaestros'
import TableResponsive from '../../components/TableResponsive/TableResponsive'
import '../../components/TableResponsive/TableResponsive.css'
import '../../components/FormularioProductos/FormularioProductos.css'

const TIPOS_DOCUMENTO = ['NIT', 'Cédula de ciudadanía', 'Cédula de extranjería', 'Pasaporte', 'Otro']

const clientesIniciales = [
  { id: 1, tipoDocumento: 'Cédula de ciudadanía', numeroDocumento: '1.234.567-8', nombre: 'Carlos Rodríguez', email: 'carlos@email.com', ventasAsociadas: 18 },
  { id: 2, tipoDocumento: 'Cédula de ciudadanía', numeroDocumento: '5.678.901-2', nombre: 'Ana Martínez', email: 'ana@email.com', ventasAsociadas: 12 },
]

export default function ClientesFidelizados() {
  const [clientes, setClientes] = useState(clientesIniciales)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [clienteEditando, setClienteEditando] = useState(null)
  const [clienteEliminar, setClienteEliminar] = useState(null)
  const [busqueda, setBusqueda] = useState('')

  const clientesFiltrados = useMemo(() => {
    if (!busqueda.trim()) return clientes
    const q = busqueda.toLowerCase().trim()
    return clientes.filter(
      (c) =>
        c.nombre.toLowerCase().includes(q) ||
        (c.email?.toLowerCase().includes(q)) ||
        (c.numeroDocumento?.toLowerCase().includes(q))
    )
  }, [clientes, busqueda])

  const handleCrear = () => setShowCreateModal(true)
  const handleEditar = (c) => {
    setClienteEditando(c)
    setShowEditModal(true)
  }
  const handleEliminar = (c) => {
    setClienteEliminar(c)
    setShowDeleteModal(true)
  }
  const [showMasAcciones, setShowMasAcciones] = useState(false)
  const masAccionesRef = useRef(null)
  const inputCargaRef = useRef(null)
  const [listaPrecios, setListaPrecios] = useState('general')
  const [filtrosActivos, setFiltrosActivos] = useState([{ id: 'estado', label: 'Estado: activos' }])

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (masAccionesRef.current && !masAccionesRef.current.contains(e.target)) setShowMasAcciones(false)
    }
    if (showMasAcciones) document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [showMasAcciones])
  const descargarPlantillaClientes = () => {
    descargarPlantilla(
      ['tipoDocumento', 'numeroDocumento', 'nombre', 'email'],
      ['Cédula de ciudadanía', '1.234.567-8', 'Cliente Ejemplo', 'cliente@email.com'],
      'plantilla_clientes_fidelizados.csv'
    )
  }
  const handleCargaMasiva = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      const filas = parsearCSV(reader.result)
      if (filas.length < 2) return
      const [, ...datos] = filas
      const nuevos = datos
        .filter((f) => f[2]?.trim())
        .map((f) => ({
          id: Date.now() + Math.random(),
          tipoDocumento: (f[0] ?? 'Cédula de ciudadanía').trim(),
          numeroDocumento: (f[1] ?? '').trim(),
          nombre: (f[2] ?? '').trim(),
          email: (f[3] ?? '').trim(),
          ventasAsociadas: 0,
        }))
      setClientes((prev) => [...prev, ...nuevos])
    }
    reader.readAsText(file, 'UTF-8')
    e.target.value = ''
  }

  const quitarFiltro = (id) => {
    setFiltrosActivos((prev) => prev.filter((f) => f.id !== id))
  }

  return (
    <PageModule title="" description="">
      <header className="maestro-encabezado">
        <div className="maestro-encabezado-top">
          <div className="maestro-encabezado-info">
            <h1 className="maestro-encabezado-titulo">Clientes fidelizados</h1>
            <p className="maestro-encabezado-desc">
              Gestión de clientes fidelizados. Visualización del registro de ventas asociadas a fidelización.
            </p>
            <a href="#ver-mas" className="maestro-encabezado-link">Ver más</a>
          </div>
          <div className="maestro-encabezado-acciones">
            <div className="toolbar-mas-acciones-wrap" ref={masAccionesRef}>
              <button
                type="button"
                className="toolbar-mas-acciones"
                onClick={() => setShowMasAcciones((v) => !v)}
                aria-expanded={showMasAcciones}
                aria-haspopup="true"
              >
                Más acciones <ChevronDown size={18} />
              </button>
              {showMasAcciones && (
                <div className="toolbar-dropdown">
                  <button type="button" onClick={() => { descargarPlantillaClientes(); setShowMasAcciones(false); }}>
                    <Download size={18} /> Descargar plantilla
                  </button>
                  <button type="button" onClick={() => { inputCargaRef.current?.click(); setShowMasAcciones(false); }}>
                    <Upload size={18} /> Carga masiva
                  </button>
                </div>
              )}
            </div>
            <button type="button" className="btn-primary" onClick={handleCrear}>
              + Nuevo cliente fidelizado
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
      <input
        ref={inputCargaRef}
        type="file"
        accept=".csv"
        className="input-file"
        style={{ position: 'absolute', width: 0, height: 0, opacity: 0 }}
        onChange={handleCargaMasiva}
      />
      <div className="page-module-toolbar" style={{ marginTop: '16px' }}>
        <input
          type="search"
          className="input-search"
          placeholder="Buscar clientes..."
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
              <th>Email</th>
              <th>Ventas asociadas</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {clientesFiltrados.map((c) => (
              <tr key={c.id}>
                <td data-label="Tipo doc.">{c.tipoDocumento}</td>
                <td data-label="Nº documento">{c.numeroDocumento}</td>
                <td data-label="Nombre">{c.nombre}</td>
                <td data-label="Email">{c.email}</td>
                <td data-label="Ventas asociadas">{c.ventasAsociadas}</td>
                <td data-label="Acciones">
                  <button type="button" className="btn-icon-action btn-icon-edit" onClick={() => handleEditar(c)} title="Editar" aria-label="Editar">
                    <Pencil size={18} />
                  </button>
                  <button type="button" className="btn-icon-action btn-icon-neutral" onClick={() => {}} title="Ver ventas" aria-label="Ver ventas">
                    <BookOpen size={18} />
                  </button>
                  <button type="button" className="btn-icon-action btn-icon-delete" onClick={() => handleEliminar(c)} title="Eliminar" aria-label="Eliminar">
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </TableResponsive>
      {clientesFiltrados.length === 0 && (
        <p className="page-module-empty">
          {busqueda ? 'No hay clientes que coincidan con la búsqueda.' : 'No hay clientes fidelizados. Crea uno con el botón "+ Nuevo cliente fidelizado".'}
        </p>
      )}

      {showCreateModal && (
        <ModalFormCliente
          tiposDocumento={TIPOS_DOCUMENTO}
          onClose={() => setShowCreateModal(false)}
          onGuardar={(data) => {
            setClientes((prev) => [...prev, { ...data, id: Date.now(), ventasAsociadas: 0 }])
            setShowCreateModal(false)
          }}
        />
      )}

      {showEditModal && clienteEditando && (
        <ModalFormCliente
          cliente={clienteEditando}
          tiposDocumento={TIPOS_DOCUMENTO}
          onClose={() => {
            setShowEditModal(false)
            setClienteEditando(null)
          }}
          onGuardar={(data) => {
            setClientes((prev) =>
              prev.map((cl) => (cl.id === clienteEditando.id ? { ...cl, ...data } : cl))
            )
            setShowEditModal(false)
            setClienteEditando(null)
          }}
          esEdicion
        />
      )}

      {showDeleteModal && clienteEliminar && (
        <ModalConfirmarEliminar
          titulo="Eliminar cliente fidelizado"
          nombre={clienteEliminar.nombre}
          onClose={() => {
            setShowDeleteModal(false)
            setClienteEliminar(null)
          }}
          onConfirmar={() => {
            setClientes((prev) => prev.filter((cl) => cl.id !== clienteEliminar.id))
            setShowDeleteModal(false)
            setClienteEliminar(null)
          }}
        />
      )}
    </PageModule>
  )
}

function ModalFormCliente({ cliente, tiposDocumento, onClose, onGuardar, esEdicion = false }) {
  const [tipoDocumento, setTipoDocumento] = useState(cliente?.tipoDocumento ?? 'Cédula de ciudadanía')
  const [numeroDocumento, setNumeroDocumento] = useState(cliente?.numeroDocumento ?? '')
  const [nombre, setNombre] = useState(cliente?.nombre ?? '')
  const [email, setEmail] = useState(cliente?.email ?? '')

  const handleSubmit = (e) => {
    e.preventDefault()
    onGuardar({ tipoDocumento, numeroDocumento, nombre, email })
  }

  return (
    <div className="form-overlay" onClick={onClose}>
      <div className="form-modal" onClick={(e) => e.stopPropagation()}>
        <div className="form-header">
          <h3>{esEdicion ? 'Editar cliente fidelizado' : 'Nuevo cliente fidelizado'}</h3>
          <button className="form-close" onClick={onClose} aria-label="Cerrar">✕</button>
        </div>
        <form onSubmit={handleSubmit} className="form-body">
          <div className="config-form-grid" style={{ gridTemplateColumns: '1fr' }}>
            <div className="config-field">
              <label>Tipo de documento</label>
              <select value={tipoDocumento} onChange={(e) => setTipoDocumento(e.target.value)}>
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
                placeholder="Ej: 1.234.567-8"
              />
            </div>
            <div className="config-field">
              <label>Nombre *</label>
              <input
                type="text"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                placeholder="Nombre del cliente"
                required
              />
            </div>
            <div className="config-field">
              <label>Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="cliente@email.com"
              />
            </div>
          </div>
          <div className="form-footer">
            <button type="button" className="form-btn-secondary" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="form-btn-primary">
              {esEdicion ? 'Guardar cambios' : 'Crear cliente'}
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
