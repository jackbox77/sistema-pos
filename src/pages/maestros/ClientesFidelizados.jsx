import { useRef, useState, useEffect, useCallback } from 'react'
import { Pencil, Trash2, Upload, Download, ChevronDown, ChevronLeft, ChevronRight, BookOpen, X } from 'lucide-react'
import PageModule from '../../components/PageModule/PageModule'
import { parsearCSV } from '../../utils/csvMaestros'
import { descargarDatosExcel, parsearExcel } from '../../utils/excelMaestros'
import ApiErrorRecargar from '../../components/ApiErrorRecargar/ApiErrorRecargar'
import TableResponsive from '../../components/TableResponsive/TableResponsive'
import '../../components/TableResponsive/TableResponsive.css'
import '../../components/FormularioProductos/FormularioProductos.css'
import {
  getLoyalCustomersWithFiltersUseCase,
  getLoyalCustomersAllUseCase,
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
    ventasAsociadas: c.ventas_asociadas ?? 0,
  }
}

const LIMIT_OPCIONES = [10, 25, 50]

function getPaginationItems(totalPages, current) {
  if (totalPages <= 0) return []
  if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1)
  const set = new Set([1, totalPages, current, current - 1, current - 2, current + 1, current + 2].filter(p => p >= 1 && p <= totalPages))
  const sorted = [...set].sort((a, b) => a - b)
  const out = []
  for (let i = 0; i < sorted.length; i++) {
    if (i > 0 && sorted[i] - sorted[i - 1] > 1) out.push('ellipsis')
    out.push(sorted[i])
  }
  return out
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
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [pagination, setPagination] = useState(null)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [formError, setFormError] = useState(null)
  const [clienteEditando, setClienteEditando] = useState(null)
  const [clienteEliminar, setClienteEliminar] = useState(null)
  const [updatingEstadoId, setUpdatingEstadoId] = useState(null)
  const [error, setError] = useState(null)
  const [filtrosActivos, setFiltrosActivos] = useState([{ id: 'estado', label: 'Estado: activos', value: 'active' }])
  const [search, setSearch] = useState('')
  const [searchDebounced, setSearchDebounced] = useState('')
  const searchTimeoutRef = useRef(null)

  const cargarClientes = useCallback(async (silent = false) => {
    if (!silent) setLoading(true)
    if (!silent) setError(null)
    try {
      const statusFilter = filtrosActivos.find((f) => f.id === 'estado')?.value
      const documentTypeFilter = filtrosActivos.find((f) => f.id === 'document_type')?.value
      const res = await getLoyalCustomersWithFiltersUseCase({
        page,
        limit,
        ...(statusFilter && { status: statusFilter }),
        ...(documentTypeFilter && { document_type: documentTypeFilter }),
        ...(searchDebounced.trim() && { search: searchDebounced.trim() }),
      })
      if (res?.success && res?.data) {
        setClientes(Array.isArray(res.data.data) ? res.data.data.map(mapApiToUI) : [])
        setPagination(res.data.pagination ?? null)
      } else {
        setClientes([])
        setPagination(null)
      }
    } catch (err) {
      setClientes([])
      setPagination(null)
      const msg = err?.message ?? ''
      const esErrorRed = /failed to fetch|network error|load failed|networkrequestfailed/i.test(msg)
      setError(esErrorRed ? 'No fue posible cargar los clientes. Compruebe su conexión e intente de nuevo.' : (msg || 'No fue posible cargar los clientes'))
    } finally {
      if (!silent) setLoading(false)
    }
  }, [page, limit, searchDebounced, filtrosActivos])

  useEffect(() => {
    cargarClientes()
  }, [cargarClientes])

  useEffect(() => {
    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current)
    searchTimeoutRef.current = setTimeout(() => {
      setSearchDebounced(search)
      setPage(1)
    }, 400)
    return () => {
      if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current)
    }
  }, [search])

  const handleCrear = () => setShowCreateModal(true)
  const handleEditar = (c) => {
    setClienteEditando(c)
    setShowEditModal(true)
  }
  const handleEliminar = (c) => {
    setClienteEliminar(c)
    setShowDeleteModal(true)
  }

  const total = pagination?.total ?? 0
  const totalPages = pagination?.total_pages ?? 1
  const desde = total === 0 ? 0 : (page - 1) * limit + 1
  const hasta = Math.min(page * limit, total)

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

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (masAccionesRef.current && !masAccionesRef.current.contains(e.target)) setShowMasAcciones(false)
    }
    if (showMasAcciones) document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [showMasAcciones])
  const descargarTodoClientes = async () => {
    try {
      const list = await getLoyalCustomersAllUseCase()
      const columnas = ['tipoDocumento', 'numeroDocumento', 'nombre', 'email', 'fechaCumpleanos', 'estado']
      const filas = (Array.isArray(list) ? list : []).map((c) => [
        TIPO_DOC_API_TO_UI[c.document_type] ?? c.document_type ?? '',
        c.document_number ?? '',
        c.full_name ?? '',
        c.email ?? '',
        c.birth_date ?? '',
        c.status === 'active' ? 'Activo' : 'Inactivo',
      ])
      descargarDatosExcel(columnas, filas, 'clientes_fidelizados.xlsx')
    } catch (_) {}
  }
  const handleCargaMasiva = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const isExcel = /\.xlsx?$/i.test(file.name)
    const reader = new FileReader()
    reader.onload = async () => {
      const filas = isExcel ? parsearExcel(reader.result) : parsearCSV(reader.result)
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
    if (isExcel) reader.readAsArrayBuffer(file)
    else reader.readAsText(file, 'UTF-8')
    e.target.value = ''
  }

  const quitarFiltro = (id) => {
    setFiltrosActivos((prev) => prev.filter((f) => f.id !== id))
  }

  return (
    <PageModule title="" description="" fullWidth>
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
                  <button type="button" onClick={() => { descargarTodoClientes(); setShowMasAcciones(false); }}>
                    <Download size={18} /> Descargar todo
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
            <input
              type="search"
              className="input-search"
              placeholder="Buscar clientes..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              aria-label="Buscar clientes"
            />
            <label className="maestro-encabezado-label">Estado</label>
            <select
              className="maestro-encabezado-select"
              value={filtrosActivos.find((f) => f.id === 'estado')?.value ?? ''}
              onChange={(e) => {
                const v = e.target.value
                setFiltrosActivos((prev) => {
                  const rest = prev.filter((f) => f.id !== 'estado')
                  if (!v) return rest
                  return [...rest, { id: 'estado', label: v === 'active' ? 'Estado: activos' : 'Estado: inactivos', value: v }]
                })
                setPage(1)
              }}
              aria-label="Filtrar por estado"
            >
              <option value="">Todos</option>
              <option value="active">Activos</option>
              <option value="inactive">Inactivos</option>
            </select>
            <label className="maestro-encabezado-label">Tipo doc.</label>
            <select
              className="maestro-encabezado-select"
              value={filtrosActivos.find((f) => f.id === 'document_type')?.value ?? ''}
              onChange={(e) => {
                const v = e.target.value
                setFiltrosActivos((prev) => {
                  const rest = prev.filter((f) => f.id !== 'document_type')
                  if (!v) return rest
                  const tipoLabel = TIPOS_DOCUMENTO.find((t) => TIPO_DOC_UI_TO_API[t] === v) ?? v
                  return [...rest, { id: 'document_type', label: `Tipo doc.: ${tipoLabel}`, value: v }]
                })
                setPage(1)
              }}
              aria-label="Filtrar por tipo de documento"
            >
              <option value="">Todos</option>
              {TIPOS_DOCUMENTO.map((t) => (
                <option key={t} value={TIPO_DOC_UI_TO_API[t]}>{t}</option>
              ))}
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
        accept=".csv,.xlsx"
        className="input-file"
        style={{ position: 'absolute', width: 0, height: 0, opacity: 0 }}
        onChange={handleCargaMasiva}
      />
      {error && (
        <ApiErrorRecargar message={error} onRecargar={() => cargarClientes(false)} loading={loading} />
      )}
      {!error && (
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
              clientes.map((c) => (
              <tr key={c.id}>
                <td data-label="Tipo doc.">{c.tipoDocumento}</td>
                <td data-label="Nº documento">{c.numeroDocumento}</td>
                <td data-label="Nombre">{c.nombre}</td>
                <td data-label="Email">{c.email}</td>
                <td data-label="Fecha cumpleaños">
                  {(() => {
                    if (!c.fechaCumpleanos) return '—'
                    const d = new Date(c.fechaCumpleanos)
                    if (Number.isNaN(d.getTime())) return '—'
                    return d.toLocaleDateString('es-CO')
                  })()}
                </td>
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
      )}
      {!error && !loading && clientes.length === 0 && (
        <p className="page-module-empty">
          {search.trim() || filtrosActivos.find((f) => f.id === 'estado')?.value === 'inactive' || filtrosActivos.some((f) => f.id === 'document_type')
            ? 'No hay clientes que coincidan con los filtros.'
            : 'No hay clientes fidelizados. Crea uno con el botón "+ Nuevo cliente fidelizado".'}
        </p>
      )}
      {!error && pagination && total > 0 && (
        <div className="page-module-pagination">
          <div className="page-module-pagination-info">Mostrando {desde}-{hasta} de {total}</div>
          <div className="page-module-pagination-controls">
            <label className="page-module-pagination-limit">
              <span>Por página</span>
              <select value={limit} onChange={(e) => { setLimit(Number(e.target.value)); setPage(1) }} aria-label="Registros por página">
                {LIMIT_OPCIONES.map((n) => (
                  <option key={n} value={n}>{n}</option>
                ))}
              </select>
            </label>
            <div className="page-module-pagination-pill">
              <button type="button" className="page-module-pagination-prev" disabled={page <= 1 || loading} onClick={() => setPage((p) => Math.max(1, p - 1))} aria-label="Página anterior">
                <ChevronLeft size={20} />
              </button>
              <div className="page-module-pagination-nums">
                {getPaginationItems(totalPages, page).map((item, idx) =>
                  item === 'ellipsis' ? (
                    <span key={`e-${idx}`} className="page-module-pagination-ellipsis">…</span>
                  ) : (
                    <button key={item} type="button" className={`page-module-pagination-num ${item === page ? 'is-active' : ''}`} disabled={loading} onClick={() => setPage(item)} aria-label={`Página ${item}`} aria-current={item === page ? 'page' : undefined}>
                      {item}
                    </button>
                  )
                )}
              </div>
              <button type="button" className="page-module-pagination-next" disabled={page >= totalPages || loading} onClick={() => setPage((p) => Math.min(totalPages, p + 1))} aria-label="Página siguiente">
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        </div>
      )}

      {showCreateModal && (
        <ModalFormCliente
          tiposDocumento={TIPOS_DOCUMENTO}
          onClose={() => { setShowCreateModal(false); setFormError(null) }}
          error={formError}
          onGuardar={async (data) => {
            setFormError(null)
            try {
              await createLoyalCustomerUseCase(mapFormToApi(data))
              await cargarClientes()
              setShowCreateModal(false)
            } catch (err) {
              setFormError(err?.message ?? 'Error al crear cliente')
            }
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
            setFormError(null)
          }}
          error={formError}
          onGuardar={async (data) => {
            setFormError(null)
            try {
              await updateLoyalCustomerUseCase(clienteEditando.id, mapFormToApi(data))
              await cargarClientes()
              setShowEditModal(false)
              setClienteEditando(null)
            } catch (err) {
              setFormError(err?.message ?? 'Error al actualizar cliente')
            }
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
            } catch (err) {
              setError(err?.message ?? 'Error al eliminar')
              setShowDeleteModal(false)
              setClienteEliminar(null)
            }
          }}
        />
      )}
    </PageModule>
  )
}

function ModalFormCliente({ cliente, tiposDocumento, onClose, onGuardar, esEdicion = false, error: apiError }) {
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
          {apiError && (
            <p className="form-api-error" role="alert" style={{ color: '#dc2626', fontSize: '14px', marginBottom: '12px' }}>
              {apiError}
            </p>
          )}
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
