import { useRef, useState, useMemo, useEffect, useCallback } from 'react'
import { Pencil, Trash2, Upload, Download, ChevronDown, X } from 'lucide-react'
import { descargarPlantilla, parsearCSV } from '../../utils/csvMaestros'
import PageModule from '../../components/PageModule/PageModule'
import TableResponsive from '../../components/TableResponsive/TableResponsive'
import '../../components/TableResponsive/TableResponsive.css'
import '../../components/FormularioProductos/FormularioProductos.css'
import {
  getSuppliersUseCase,
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
    comprasAsociadas: 0,
  }
}

export default function Proveedores() {
  const [proveedores, setProveedores] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showFormModal, setShowFormModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [proveedorEditando, setProveedorEditando] = useState(null)
  const [proveedorEliminar, setProveedorEliminar] = useState(null)
  const [busqueda, setBusqueda] = useState('')
  const [showMasAcciones, setShowMasAcciones] = useState(false)
  const masAccionesRef = useRef(null)
  const inputCargaRef = useRef(null)
  const [listaPrecios, setListaPrecios] = useState('general')
  const [filtrosActivos, setFiltrosActivos] = useState([{ id: 'estado', label: 'Estado: activos' }])

  const cargarProveedores = useCallback(async () => {
    setError(null)
    try {
      const res = await getSuppliersUseCase(1, 200)
      if (res?.success && res?.data?.data) {
        setProveedores(res.data.data.map(mapSupplierApiToUI))
      } else {
        setProveedores([])
      }
    } catch (err) {
      setError(err?.message ?? 'Error al cargar proveedores')
      setProveedores([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    cargarProveedores()
  }, [cargarProveedores])

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
      }
    } catch (err) {
      setError(err?.message ?? 'Error al eliminar')
    }
  }

  const descargarPlantillaProveedores = () => {
    descargarPlantilla(
      ['tipoDocumento', 'numeroDocumento', 'nombre', 'contacto', 'telefono'],
      ['NIT', '900.111.222-3', 'Proveedor Ejemplo S.A.S.', 'Contacto', '300 111 2233'],
      'plantilla_proveedores.csv'
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
                  <button type="button" onClick={() => { descargarPlantillaProveedores(); setShowMasAcciones(false); }}>
                    <Download size={18} /> Descargar plantilla
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
          placeholder="Buscar por nombre, documento o contacto..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />
      </div>
      {error && (
        <p className="page-module-empty" style={{ color: '#dc2626', marginBottom: '12px' }}>
          {error}
        </p>
      )}
      {loading ? (
        <p className="page-module-empty">Cargando proveedores...</p>
      ) : (
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
                {proveedoresFiltrados.map((p) => (
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
          {proveedoresFiltrados.length === 0 && (
            <p className="page-module-empty">
              {busqueda ? 'No hay proveedores que coincidan con la búsqueda.' : 'No hay proveedores. Crea uno con el botón "+ Nuevo proveedor".'}
            </p>
          )}
        </>
      )}

      {showFormModal && (
        <ModalFormProveedor
          proveedor={proveedorEditando}
          tiposDocumento={TIPOS_DOCUMENTO}
          tipoUiAApi={TIPO_UI_A_API}
          onClose={cerrarFormModal}
          onGuardar={async (apiParams) => {
            setError(null)
            try {
              if (proveedorEditando) {
                const res = await updateSupplierUseCase(proveedorEditando.id, apiParams)
                if (res?.success) {
                  await cargarProveedores()
                  cerrarFormModal()
                } else {
                  setError(res?.message ?? 'Error al actualizar')
                }
              } else {
                const res = await createSupplierUseCase(apiParams)
                if (res?.success) {
                  await cargarProveedores()
                  cerrarFormModal()
                } else {
                  setError(res?.message ?? 'Error al crear')
                }
              }
            } catch (err) {
              setError(err?.message ?? 'Error al guardar')
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

function ModalFormProveedor({ proveedor, tiposDocumento, tipoUiAApi, onClose, onGuardar, esEdicion = false }) {
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
