import { useRef, useState, useMemo, useEffect, useCallback } from 'react'
import { Pencil, Trash2, Upload, Download, ChevronDown, BookOpen, X } from 'lucide-react'
import PageModule from '../../components/PageModule/PageModule'
import { descargarPlantilla, parsearCSV } from '../../utils/csvMaestros'
import TableResponsive from '../../components/TableResponsive/TableResponsive'
import '../../components/TableResponsive/TableResponsive.css'
import '../../components/FormularioProductos/FormularioProductos.css'
import {
  getLoyalCustomersUseCase,
  createLoyalCustomerUseCase,
  updateLoyalCustomerUseCase,
  deleteLoyalCustomerUseCase,
} from '../../feature/masters/loyal-customers/use-case'

const TIPOS_DOCUMENTO = ['NIT', 'Cédula de ciudadanía', 'Cédula de extranjería', 'Pasaporte', 'Otro']

const TIPO_DOC_UI_TO_API = {
  'Cédula de ciudadanía': 'CC',
  'Cédula de extranjería': 'CE',
  Pasaporte: 'PASSPORT',
  Otro: 'OTHER',
  NIT: 'OTHER',
}
const TIPO_DOC_API_TO_UI = {
  CC: 'Cédula de ciudadanía',
  CE: 'Cédula de extranjería',
  PASSPORT: 'Pasaporte',
  OTHER: 'Otro',
}

function mapApiToUI(c) {
  return {
    id: c.id,
    tipoDocumento: TIPO_DOC_API_TO_UI[c.document_type] ?? c.document_type ?? 'Otro',
    numeroDocumento: c.document_number ?? '',
    nombre: c.full_name ?? '',
    email: c.email ?? '',
    fechaCumpleanos: c.birth_date ?? '',
    estado: c.status === 'active' ? 'Activo' : 'Inactivo',
    ventasAsociadas: 0,
  }
}

function mapFormToApi(data) {
  return {
    document_type: TIPO_DOC_UI_TO_API[data.tipoDocumento] ?? 'OTHER',
    document_number: data.numeroDocumento ?? '',
    full_name: data.nombre ?? '',
    email: data.email ?? '',
    birth_date: data.fechaCumpleanos ? String(data.fechaCumpleanos).trim() : '',
    status: data.estado === 'Activo' ? 'active' : 'inactive',
  }
}

export default function ClientesFidelizados() {
  const [clientes, setClientes] = useState([])
  const [loading, setLoading] = useState(true)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [clienteEditando, setClienteEditando] = useState(null)
  const [clienteEliminar, setClienteEliminar] = useState(null)
  const [busqueda, setBusqueda] = useState('')
  const [updatingEstadoId, setUpdatingEstadoId] = useState(null)

  const cargarClientes = useCallback(async (silent = false) => {
    if (!silent) setLoading(true)
    try {
      const res = await getLoyalCustomersUseCase(1, 100)
      if (res?.success && res?.data?.data) {
        setClientes(res.data.data.map(mapApiToUI))
      } else setClientes([])
    } catch {
      setClientes([])
    } finally {
      if (!silent) setLoading(false)
    }
  }, [])

  useEffect(() => {
    cargarClientes()
  }, [cargarClientes])

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

  const cambiarEstado = async (c) => {
    const newEstado = c.estado === 'Activo' ? 'Inactivo' : 'Activo'
    setUpdatingEstadoId(c.id)
    try {
      await updateLoyalCustomerUseCase(c.id, mapFormToApi({ ...c, estado: newEstado }))
      await cargarClientes(true)
    } catch (_) {}
    finally {
      setUpdatingEstadoId(null)
    }
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
      ['tipoDocumento', 'numeroDocumento', 'nombre', 'email', 'fechaCumpleanos', 'estado'],
      ['Cédula de ciudadanía', '1.234.567-8', 'Cliente Ejemplo', 'cliente@email.com', '1990-01-15', 'Activo'],
      'plantilla_clientes_fidelizados.csv'
    )
  }
  const handleCargaMasiva = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = async () => {
      const filas = parsearCSV(reader.result)
      if (filas.length < 2) return
      const [, ...datos] = filas
      const filasValidas = datos.filter((f) => (f[2] ?? '').trim())
      for (const f of filasValidas) {
        const data = {
          tipoDocumento: (f[0] ?? 'Cédula de ciudadanía').trim(),
          numeroDocumento: (f[1] ?? '').trim(),
          nombre: (f[2] ?? '').trim(),
          email: (f[3] ?? '').trim(),
          fechaCumpleanos: (f[4] ?? '').trim(),
          estado: (f[5] ?? 'Activo').trim() === 'Inactivo' ? 'Inactivo' : 'Activo',
        }
        try {
          await createLoyalCustomerUseCase(mapFormToApi(data))
        } catch (_) {}
      }
      await cargarClientes()
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
              <th>Fecha cumpleaños</th>
              <th>Estado</th>
              <th>Ventas asociadas</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="8">
                  <div className="page-module-empty">Cargando...</div>
                </td>
              </tr>
            ) : (
              clientesFiltrados.map((c) => (
              <tr key={c.id}>
                <td data-label="Tipo doc.">{c.tipoDocumento}</td>
                <td data-label="Nº documento">{c.numeroDocumento}</td>
                <td data-label="Nombre">{c.nombre}</td>
                <td data-label="Email">{c.email}</td>
                <td data-label="Fecha cumpleaños">{c.fechaCumpleanos ? new Date(c.fechaCumpleanos + 'T00:00:00').toLocaleDateString('es-CO') : '—'}</td>
                <td data-label="Estado">
                  {updatingEstadoId === c.id ? (
                    <span className="badge badge-estado-toggle" aria-busy="true">Cargando</span>
                  ) : (
                    <button
                      type="button"
                      className={`badge badge-estado-toggle ${c.estado === 'Activo' ? 'badge-success' : 'badge-inactive'}`}
                      onClick={() => cambiarEstado(c)}
                      title="Clic para cambiar estado"
                    >
                      {c.estado}
                    </button>
                  )}
                </td>
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
            ))
            )}
          </tbody>
        </table>
      </TableResponsive>
      {!loading && clientesFiltrados.length === 0 && (
        <p className="page-module-empty">
          {busqueda ? 'No hay clientes que coincidan con la búsqueda.' : 'No hay clientes fidelizados. Crea uno con el botón "+ Nuevo cliente fidelizado".'}
        </p>
      )}

      {showCreateModal && (
        <ModalFormCliente
          tiposDocumento={TIPOS_DOCUMENTO}
          onClose={() => setShowCreateModal(false)}
          onGuardar={async (data) => {
            try {
              await createLoyalCustomerUseCase(mapFormToApi(data))
              await cargarClientes()
              setShowCreateModal(false)
            } catch (_) {}
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
          onGuardar={async (data) => {
            try {
              await updateLoyalCustomerUseCase(clienteEditando.id, mapFormToApi(data))
              await cargarClientes()
              setShowEditModal(false)
              setClienteEditando(null)
            } catch (_) {}
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
          onConfirmar={async () => {
            try {
              await deleteLoyalCustomerUseCase(clienteEliminar.id)
              await cargarClientes()
              setShowDeleteModal(false)
              setClienteEliminar(null)
            } catch (_) {}
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
  const [fechaCumpleanos, setFechaCumpleanos] = useState(cliente?.fechaCumpleanos ?? '')
  const [estado, setEstado] = useState(cliente?.estado ?? 'Activo')
  const [saving, setSaving] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      await Promise.resolve(onGuardar({ tipoDocumento, numeroDocumento, nombre, email, fechaCumpleanos, estado }))
    } finally {
      setSaving(false)
    }
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
              <label>Tipo de documento *</label>
              <select value={tipoDocumento} onChange={(e) => setTipoDocumento(e.target.value)} required>
                {tiposDocumento.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
            <div className="config-field">
              <label>Número de documento *</label>
              <input
                type="text"
                value={numeroDocumento}
                onChange={(e) => setNumeroDocumento(e.target.value)}
                placeholder="Ej: 1.234.567-8"
                required
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
            <div className="config-field">
              <label>Fecha de cumpleaños</label>
              <input
                type="date"
                value={fechaCumpleanos}
                onChange={(e) => setFechaCumpleanos(e.target.value)}
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
            <button type="submit" className="form-btn-primary" disabled={saving}>
              {saving ? 'Guardando...' : esEdicion ? 'Guardar cambios' : 'Crear cliente'}
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
            ¿Estás seguro de que deseas eliminar <strong>{nombre}</strong>?
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
