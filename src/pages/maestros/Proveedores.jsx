import { useRef, useState, useEffect, useCallback } from 'react'
import { Pencil, Trash2, Upload, Download, ChevronDown, ChevronLeft, ChevronRight, X } from 'lucide-react'
import { parsearCSV } from '../../utils/csvMaestros'
import { descargarDatosExcel, parsearExcel } from '../../utils/excelMaestros'
import ApiErrorRecargar from '../../components/ApiErrorRecargar/ApiErrorRecargar'
import PageModule from '../../components/PageModule/PageModule'
import TableResponsive from '../../components/TableResponsive/TableResponsive'
import '../../components/TableResponsive/TableResponsive.css'
import '../../components/FormularioProductos/FormularioProductos.css'
import {
  getSuppliersWithFiltersUseCase,
  getSuppliersAllUseCase,
  createSupplierUseCase,
  updateSupplierUseCase,
  deleteSupplierUseCase,
} from '../../feature/masters/suppliers/use-case'

/** Opciones de tipo de documento en la UI */
const TIPOS_DOCUMENTO = ['NIT', 'Cédula de ciudadanía', 'Cédula de extranjería', 'Pasaporte', 'Otro']

/** Mapeo UI (label) -> API (document_type) */
const TIPO_UI_A_API = {
  'NIT': 'NIT',
  'Cédula de ciudadanía': 'CC',
  'Cédula de extranjería': 'CE',
  'Pasaporte': 'PASSPORT',
  'Otro': 'OTHER',
}
/** Mapeo API -> UI */
const TIPO_API_A_UI = {
  'NIT': 'NIT',
  'CC': 'Cédula de ciudadanía',
  'CE': 'Cédula de extranjería',
  'PASSPORT': 'Pasaporte',
  'OTHER': 'Otro',
}

function mapSupplierApiToUI(p) {
  return {
    id: p.id,
    tipoDocumento: TIPO_API_A_UI[p.document_type] ?? p.document_type ?? 'NIT',
    numeroDocumento: p.document_number ?? '',
    nombre: p.supplier_name ?? '',
    contacto: p.contact_name ?? '',
    telefono: p.contact_phone ?? '',
    comprasAsociadas: p.compras_asociadas ?? 0,
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

export default function Proveedores() {
  const [proveedores, setProveedores] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [pagination, setPagination] = useState(null)
  const [showFormModal, setShowFormModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [formError, setFormError] = useState(null)
  const [proveedorEditando, setProveedorEditando] = useState(null)
  const [proveedorEliminar, setProveedorEliminar] = useState(null)
  const [showMasAcciones, setShowMasAcciones] = useState(false)
  const masAccionesRef = useRef(null)
  const inputCargaRef = useRef(null)
  const [filtrosActivos, setFiltrosActivos] = useState([{ id: 'estado', label: 'Estado: activos', value: 'active' }])
  const [search, setSearch] = useState('')
  const [searchDebounced, setSearchDebounced] = useState('')
  const searchTimeoutRef = useRef(null)
  const [searchDocument, setSearchDocument] = useState('')
  const [searchDocumentDebounced, setSearchDocumentDebounced] = useState('')
  const searchDocumentTimeoutRef = useRef(null)

  const cargarProveedores = useCallback(async () => {
    setError(null)
    setLoading(true)
    try {
      const statusFilter = filtrosActivos.find((f) => f.id === 'estado')?.value
      const documentTypeFilter = filtrosActivos.find((f) => f.id === 'document_type')?.value
      const res = await getSuppliersWithFiltersUseCase({
        page,
        limit,
        ...(statusFilter && { status: statusFilter }),
        ...(documentTypeFilter && { document_type: documentTypeFilter }),
        ...(searchDebounced.trim() && { search: searchDebounced.trim() }),
        ...(searchDocumentDebounced.trim() && { document_number: searchDocumentDebounced.trim() }),
      })
      if (res?.success && res?.data) {
        setProveedores(Array.isArray(res.data.data) ? res.data.data.map(mapSupplierApiToUI) : [])
        setPagination(res.data.pagination ?? null)
      } else {
        setProveedores([])
        setPagination(null)
      }
    } catch (err) {
      setError(err?.message ?? 'Error al cargar proveedores')
      setProveedores([])
      setPagination(null)
    } finally {
      setLoading(false)
    }
  }, [page, limit, searchDebounced, searchDocumentDebounced, filtrosActivos])

  useEffect(() => {
    cargarProveedores()
  }, [cargarProveedores])

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

  useEffect(() => {
    if (searchDocumentTimeoutRef.current) clearTimeout(searchDocumentTimeoutRef.current)
    searchDocumentTimeoutRef.current = setTimeout(() => {
      setSearchDocumentDebounced(searchDocument)
      setPage(1)
    }, 400)
    return () => {
      if (searchDocumentTimeoutRef.current) clearTimeout(searchDocumentTimeoutRef.current)
    }
  }, [searchDocument])

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (masAccionesRef.current && !masAccionesRef.current.contains(e.target)) setShowMasAcciones(false)
    }
    if (showMasAcciones) document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [showMasAcciones])

  const handleCrear = () => {
    setProveedorEditando(null)
    setShowFormModal(true)
  }
  const handleEditar = (p) => {
    setProveedorEditando(p)
    setShowFormModal(true)
  }
  const cerrarFormModal = () => {
    setShowFormModal(false)
    setFormError(null)
    setProveedorEditando(null)
  }
  const handleEliminar = (p) => {
    setProveedorEliminar(p)
    setShowDeleteModal(true)
  }

  const handleConfirmarEliminar = async () => {
    if (!proveedorEliminar) return
    setError(null)
    try {
      const res = await deleteSupplierUseCase(proveedorEliminar.id)
      if (res?.success) {
        setShowDeleteModal(false)
        setProveedorEliminar(null)
        await cargarProveedores()
      } else {
        setError(res?.message ?? 'Error al eliminar')
        setShowDeleteModal(false)
        setProveedorEliminar(null)
      }
    } catch (err) {
      setError(err?.message ?? 'Error al eliminar')
      setShowDeleteModal(false)
      setProveedorEliminar(null)
    }
  }

  const descargarTodoProveedores = async () => {
    try {
      const list = await getSuppliersAllUseCase()
      const columnas = ['tipoDocumento', 'numeroDocumento', 'nombre', 'contacto', 'telefono']
      const filas = (Array.isArray(list) ? list : []).map((p) => [
        TIPO_API_A_UI[p.document_type] ?? p.document_type ?? '',
        p.document_number ?? '',
        p.supplier_name ?? '',
        p.contact_name ?? '',
        p.contact_phone ?? '',
      ])
      descargarDatosExcel(columnas, filas, 'proveedores.xlsx')
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
      for (const f of datos) {
        if (!f[2]?.trim()) continue
        const docType = TIPO_UI_A_API[(f[0] ?? 'NIT').trim()] ?? 'NIT'
        try {
          await createSupplierUseCase({
            document_type: docType,
            document_number: (f[1] ?? '').trim(),
            supplier_name: (f[2] ?? '').trim(),
            contact_name: (f[3] ?? '').trim(),
            contact_phone: (f[4] ?? '').trim(),
            status: 'active',
          })
        } catch (_) {}
      }
      await cargarProveedores()
    }
    if (isExcel) reader.readAsArrayBuffer(file)
    else reader.readAsText(file, 'UTF-8')
    e.target.value = ''
  }
  const quitarFiltro = (id) => {
    setFiltrosActivos((prev) => prev.filter((f) => f.id !== id))
  }

  const total = pagination?.total ?? 0
  const totalPages = pagination?.total_pages ?? 1
  const desde = total === 0 ? 0 : (page - 1) * limit + 1
  const hasta = Math.min(page * limit, total)

  return (
    <PageModule title="" description="">
      <header className="maestro-encabezado">
        <div className="maestro-encabezado-top">
          <div className="maestro-encabezado-info">
            <h1 className="maestro-encabezado-titulo">Proveedores</h1>
            <p className="maestro-encabezado-desc">
              Registro y edición de proveedores. Visualización de compras asociadas a cada proveedor.
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
                  <button type="button" onClick={() => { descargarTodoProveedores(); setShowMasAcciones(false); }}>
                    <Download size={18} /> Descargar todo
                  </button>
                  <button type="button" onClick={() => { inputCargaRef.current?.click(); setShowMasAcciones(false); }}>
                    <Upload size={18} /> Carga masiva
                  </button>
                </div>
              )}
            </div>
            <button type="button" className="btn-primary" onClick={handleCrear}>
              + Nuevo proveedor
            </button>
          </div>
        </div>
        <div className="maestro-encabezado-filtros">
          <div className="maestro-encabezado-filtros-left">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <label className="maestro-encabezado-label">Tipo doc.</label>
              <select
                className="maestro-encabezado-select"
                style={{ height: '40px', boxSizing: 'border-box' }}
                value={filtrosActivos.find((f) => f.id === 'document_type')?.value ?? ''}
                onChange={(e) => {
                  const v = e.target.value
                  setFiltrosActivos((prev) => {
                    const rest = prev.filter((f) => f.id !== 'document_type')
                    if (!v) return rest
                    const tipoLabel = TIPOS_DOCUMENTO.find((t) => TIPO_UI_A_API[t] === v) ?? v
                    return [...rest, { id: 'document_type', label: `Tipo doc.: ${tipoLabel}`, value: v }]
                  })
                  setPage(1)
                }}
                aria-label="Filtrar por tipo de documento"
              >
                <option value="">Todos</option>
                {TIPOS_DOCUMENTO.map((t) => (
                  <option key={t} value={TIPO_UI_A_API[t]}>{t}</option>
                ))}
              </select>
              <input
                type="search"
                className="input-search"
                placeholder="Nº documento..."
                value={searchDocument}
                onChange={(e) => setSearchDocument(e.target.value)}
                aria-label="Buscar por número de documento"
                style={{ height: '40px', boxSizing: 'border-box', minWidth: '140px' }}
              />
            </div>
            <label className="maestro-encabezado-label">Nombre</label>
            <input
              type="search"
              className="input-search"
              placeholder="Buscar por nombre..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              aria-label="Buscar por nombre"
              style={{ height: '40px', boxSizing: 'border-box' }}
            />
            <label className="maestro-encabezado-label">Estado</label>
            <select
              className="maestro-encabezado-select"
              style={{ height: '40px', boxSizing: 'border-box' }}
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
        <ApiErrorRecargar message={error} onRecargar={cargarProveedores} loading={loading} />
      )}
      {!error && loading ? (
        <p className="page-module-empty">Cargando proveedores...</p>
      ) : !error ? (
        <>
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
                {proveedores.map((p) => (
                  <tr key={p.id}>
                    <td data-label="Tipo doc.">{p.tipoDocumento ?? '—'}</td>
                    <td data-label="Nº documento">{p.numeroDocumento ?? '—'}</td>
                    <td data-label="Nombre">{p.nombre}</td>
                    <td data-label="Contacto">{p.contacto ?? '—'}</td>
                    <td data-label="Teléfono">{p.telefono ?? '—'}</td>
                    <td data-label="Compras asociadas">{p.comprasAsociadas}</td>
                    <td data-label="Acciones">
                      <button
                        type="button"
                        className="btn-icon-action btn-icon-edit"
                        title="Editar"
                        aria-label="Editar"
                        onClick={() => handleEditar(p)}
                      >
                        <Pencil size={18} />
                      </button>
                      <button type="button" className="btn-icon-action btn-icon-delete" onClick={() => handleEliminar(p)} title="Eliminar" aria-label="Eliminar">
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </TableResponsive>
          {proveedores.length === 0 && !loading && (
            <p className="page-module-empty">
              {search.trim() || searchDocument.trim() || filtrosActivos.find((f) => f.id === 'estado')?.value === 'inactive' || filtrosActivos.some((f) => f.id === 'document_type')
                ? 'No hay proveedores que coincidan con los filtros.'
                : 'No hay proveedores. Crea uno con el botón "+ Nuevo proveedor".'}
            </p>
          )}
          {pagination && total > 0 && (
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
        </>
      ) : null}

      {showFormModal && (
        <ModalFormProveedor
          proveedor={proveedorEditando}
          tiposDocumento={TIPOS_DOCUMENTO}
          tipoUiAApi={TIPO_UI_A_API}
          onClose={cerrarFormModal}
          error={formError}
          onGuardar={async (apiParams) => {
            setFormError(null)
            try {
              if (proveedorEditando) {
                const res = await updateSupplierUseCase(proveedorEditando.id, apiParams)
                if (res?.success) {
                  await cargarProveedores()
                  cerrarFormModal()
                } else {
                  setFormError(res?.message ?? 'Error al actualizar')
                }
              } else {
                const res = await createSupplierUseCase(apiParams)
                if (res?.success) {
                  await cargarProveedores()
                  cerrarFormModal()
                } else {
                  setFormError(res?.message ?? 'Error al crear')
                }
              }
            } catch (err) {
              setFormError(err?.message ?? 'Error al guardar')
            }
          }}
          esEdicion={Boolean(proveedorEditando)}
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
          onConfirmar={handleConfirmarEliminar}
        />
      )}
    </PageModule>
  )
}

function ModalFormProveedor({ proveedor, tiposDocumento, tipoUiAApi, onClose, onGuardar, esEdicion = false, error: apiError }) {
  const [tipoDocumento, setTipoDocumento] = useState(proveedor?.tipoDocumento ?? 'NIT')
  const [numeroDocumento, setNumeroDocumento] = useState(proveedor?.numeroDocumento ?? '')
  const [nombre, setNombre] = useState(proveedor?.nombre ?? '')
  const [contacto, setContacto] = useState(proveedor?.contacto ?? '')
  const [telefono, setTelefono] = useState(proveedor?.telefono ?? '')
  const [saving, setSaving] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      await onGuardar({
        document_type: tipoUiAApi[tipoDocumento] ?? 'NIT',
        document_number: numeroDocumento.trim(),
        supplier_name: nombre.trim(),
        contact_name: contacto.trim(),
        contact_phone: telefono.trim(),
        status: 'active',
      })
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="form-overlay" onClick={onClose}>
      <div className="form-modal" onClick={(e) => e.stopPropagation()}>
        <div className="form-header">
          <h3>{esEdicion ? 'Editar proveedor' : 'Nuevo proveedor'}</h3>
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
              <select
                value={tipoDocumento}
                onChange={(e) => setTipoDocumento(e.target.value)}
                required
              >
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
                placeholder="Ej: 900.123.456-1 o número de cédula"
                required
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
              <label>Contacto *</label>
              <input
                type="text"
                value={contacto}
                onChange={(e) => setContacto(e.target.value)}
                placeholder="Nombre del contacto"
                required
              />
            </div>
            <div className="config-field">
              <label>Teléfono *</label>
              <input
                type="text"
                value={telefono}
                onChange={(e) => setTelefono(e.target.value)}
                placeholder="Ej: 300 123 4567"
                required
              />
            </div>
          </div>
          <div className="form-footer">
            <button type="button" className="form-btn-secondary" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="form-btn-primary" disabled={saving}>
              {saving ? 'Guardando...' : esEdicion ? 'Guardar cambios' : 'Crear proveedor'}
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
