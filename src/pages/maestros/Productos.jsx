import { useRef, useState, useEffect, useCallback } from 'react'
import { Pencil, Trash2, Upload, Download, ChevronDown, Image as ImageIcon, X } from 'lucide-react'
import { descargarPlantilla, parsearCSV } from '../../utils/csvMaestros'
import PageModule from '../../components/PageModule/PageModule'
import TableResponsive from '../../components/TableResponsive/TableResponsive'
import '../../components/TableResponsive/TableResponsive.css'
import '../../components/FormularioProductos/FormularioProductos.css'
import {
  getProductsUseCase,
  createProductUseCase,
  updateProductUseCase,
  deleteProductUseCase,
} from '../../feature/masters/products/use-case'
import { getCategoriesUseCase } from '../../feature/masters/category/use-case'

function normalizarCodigo(s) {
  return (s ?? '').toString().trim().replace(/\s+/g, '-').toUpperCase()
}

/** Mapea item de API a forma usada en la UI (tabla y formulario) */
function mapProductApiToUI(p) {
  return {
    id: p.id,
    codigo: p.sku ?? p.barcode ?? '',
    nombre: p.name ?? '',
    categoriaId: p.category_id,
    precio: p.price ?? 0,
    imagen: '',
    description: p.description ?? '',
    status: p.status ?? 'active',
  }
}

export default function Productos() {
  const [productos, setProductos] = useState([])
  const [categorias, setCategorias] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [productoEliminar, setProductoEliminar] = useState(null)
  const [showFormModal, setShowFormModal] = useState(false)
  const [editingId, setEditingId] = useState(null)

  const [showMasAcciones, setShowMasAcciones] = useState(false)
  const masAccionesRef = useRef(null)
  const inputCargaRef = useRef(null)
  const [listaPrecios, setListaPrecios] = useState('general')
  const [filtrosActivos, setFiltrosActivos] = useState([{ id: 'estado', label: 'Estado: activos' }])

  const cargarProductos = useCallback(async () => {
    setError(null)
    setLoading(true)
    try {
      const res = await getProductsUseCase(1, 200)
      if (res?.success && res?.data?.data) {
        setProductos(res.data.data.map(mapProductApiToUI))
      } else {
        setProductos([])
      }
    } catch (err) {
      setProductos([])
      const msg = err?.message ?? ''
      const esErrorRed = /failed to fetch|network error|load failed|networkrequestfailed/i.test(msg)
      setError(esErrorRed ? 'No fue posible cargar los productos. Compruebe su conexión e intente de nuevo.' : (msg || 'No fue posible cargar los productos'))
    } finally {
      setLoading(false)
    }
  }, [])

  const cargarCategorias = useCallback(async () => {
    try {
      const res = await getCategoriesUseCase(1, 100)
      if (res?.success && res?.data?.data) {
        setCategorias(res.data.data.map((c) => ({ id: c.id, nombre: c.name ?? '' })))
      } else {
        setCategorias([])
      }
    } catch {
      setCategorias([])
    }
  }, [])

  useEffect(() => {
    cargarProductos()
    cargarCategorias()
  }, [cargarProductos, cargarCategorias])

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (masAccionesRef.current && !masAccionesRef.current.contains(e.target)) setShowMasAcciones(false)
    }
    if (showMasAcciones) document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [showMasAcciones])

  const getCategoria = useCallback(
    (id) => categorias.find((c) => String(c.id) === String(id)),
    [categorias]
  )
  const obtenerProducto = useCallback(
    (id) => productos.find((p) => String(p.id) === String(id)),
    [productos]
  )

  const abrirNuevo = () => {
    setEditingId(null)
    setShowFormModal(true)
  }
  const abrirEditar = (id) => {
    setEditingId(id)
    setShowFormModal(true)
  }
  const cerrarFormModal = () => {
    setShowFormModal(false)
    setEditingId(null)
  }

  const handleEliminar = (prod) => {
    setProductoEliminar(prod)
    setShowDeleteModal(true)
  }

  const handleConfirmarEliminar = async () => {
    if (!productoEliminar) return
    setError(null)
    try {
      const res = await deleteProductUseCase(productoEliminar.id)
      if (res?.success) {
        setShowDeleteModal(false)
        setProductoEliminar(null)
        await cargarProductos()
      } else {
        setError(res?.message ?? 'Error al eliminar')
      }
    } catch (err) {
      setError(err?.message ?? 'Error al eliminar')
    }
  }

  const descargarPlantillaProductos = () => {
    descargarPlantilla(
      ['codigo', 'nombre', 'categoria', 'precio'],
      ['PROD-003', 'Leche 1L', 'Lácteos', '3200'],
      'plantilla_productos.csv'
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
      const categoryIdDefault = categorias[0]?.id ?? ''
      for (const f of datos) {
        if (!f[1]?.trim()) continue
        const nombreCategoria = (f[2] ?? '').trim()
        const cat = categorias.find((c) => c.nombre.toLowerCase() === nombreCategoria.toLowerCase())
        const category_id = cat ? String(cat.id) : String(categoryIdDefault)
        try {
          await createProductUseCase({
            category_id,
            name: (f[1] ?? '').trim(),
            sku: (f[0] ?? '').trim(),
            barcode: (f[0] ?? '').trim(),
            price: Number(f[3]) || 0,
            description: '',
            status: 'active',
          })
        } catch (_) {}
      }
      await cargarProductos()
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
            <h1 className="maestro-encabezado-titulo">Productos</h1>
            <p className="maestro-encabezado-desc">
              Ver, crear, editar y eliminar productos. Búsqueda rápida y filtrado. Asociación a categorías.
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
                  <button type="button" onClick={() => { descargarPlantillaProductos(); setShowMasAcciones(false); }}>
                    <Download size={18} /> Descargar plantilla
                  </button>
                  <button type="button" onClick={() => { inputCargaRef.current?.click(); setShowMasAcciones(false); }}>
                    <Upload size={18} /> Carga masiva
                  </button>
                </div>
              )}
            </div>
            <button type="button" className="btn-primary" onClick={abrirNuevo}>
              + Nuevo producto
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
        <input type="search" className="input-search" placeholder="Buscar productos..." />
      </div>
      {error && !loading && (
        <div className="page-module-empty" style={{ padding: '24px', textAlign: 'center' }}>
          <p style={{ margin: '0 0 16px', color: '#6b7280' }}>{error}</p>
          <button type="button" className="form-btn-primary" onClick={() => cargarProductos()}>
            Reintentar
          </button>
        </div>
      )}
      {!error && (
      <TableResponsive>
        <table className="page-module-table">
          <thead>
            <tr>
              <th>Imagen</th>
              <th>Código</th>
              <th>Nombre</th>
              <th>Categoría</th>
              <th>Precio</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="6">
                  <div className="page-module-empty">Cargando...</div>
                </td>
              </tr>
            ) : (
            productos.map((prod) => (
              <tr key={prod.id}>
                <td data-label="Imagen">
                  {prod.imagen ? (
                    <img src={prod.imagen} alt="" className="categoria-thumb" />
                  ) : (
                    <span className="categoria-thumb-sin-imagen" title="Sin imagen">
                      <ImageIcon size={24} />
                    </span>
                  )}
                </td>
                <td data-label="Código">{normalizarCodigo(prod.codigo)}</td>
                <td data-label="Nombre">{prod.nombre}</td>
                <td data-label="Categoría">{getCategoria(prod.categoriaId)?.nombre ?? '-'}</td>
                <td data-label="Precio">${Number(prod.precio).toLocaleString()}</td>
                <td data-label="Acciones">
                  <button
                    type="button"
                    className="btn-icon-action btn-icon-edit"
                    title="Editar"
                    aria-label="Editar"
                    onClick={() => abrirEditar(prod.id)}
                  >
                    <Pencil size={18} />
                  </button>
                  <button type="button" className="btn-icon-action btn-icon-delete" onClick={() => handleEliminar(prod)} title="Eliminar" aria-label="Eliminar">
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

      {showFormModal && (
        <ProductoFormModal
          editingId={editingId}
          categorias={categorias}
          obtenerProducto={obtenerProducto}
          onClose={cerrarFormModal}
          onGuardar={async (params) => {
            setError(null)
            try {
              if (editingId) {
                const res = await updateProductUseCase(editingId, params)
                if (res?.success) {
                  await cargarProductos()
                  cerrarFormModal()
                } else {
                  setError(res?.message ?? 'Error al actualizar')
                }
              } else {
                const res = await createProductUseCase(params)
                if (res?.success) {
                  await cargarProductos()
                  cerrarFormModal()
                } else {
                  setError(res?.message ?? 'Error al crear')
                }
              }
            } catch (err) {
              setError(err?.message ?? 'Error al guardar')
            }
          }}
        />
      )}

      {showDeleteModal && productoEliminar && (
        <ModalConfirmarEliminar
          nombre={productoEliminar.nombre}
          onClose={() => {
            setShowDeleteModal(false)
            setProductoEliminar(null)
          }}
          onConfirmar={handleConfirmarEliminar}
        />
      )}
    </PageModule>
  )
}

function ProductoFormModal({ editingId, categorias, obtenerProducto, onClose, onGuardar }) {
  const esEdicion = Boolean(editingId)
  const prod = esEdicion ? obtenerProducto(editingId) : null

  const [codigo, setCodigo] = useState(prod?.codigo ?? '')
  const [nombre, setNombre] = useState(prod?.nombre ?? '')
  const [categoriaId, setCategoriaId] = useState(prod?.categoriaId ?? categorias[0]?.id ?? '')
  const [precio, setPrecio] = useState(prod?.precio ?? '')
  const [imagen, setImagen] = useState(prod?.imagen ?? '')
  const [imagenInputUrl, setImagenInputUrl] = useState(prod?.imagen?.startsWith?.('http') ? prod.imagen : '')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (esEdicion && prod) {
      setCodigo(prod.codigo)
      setNombre(prod.nombre)
      setCategoriaId(prod.categoriaId ?? categorias[0]?.id ?? '')
      setPrecio(prod.precio)
      setImagen(prod.imagen ?? '')
      setImagenInputUrl(prod.imagen?.startsWith?.('http') ? prod.imagen : '')
    }
  }, [esEdicion, prod, categorias])

  const handleImagenUrlChange = (e) => {
    const url = e.target.value.trim()
    setImagenInputUrl(url)
    setImagen(url || '')
  }

  const handleFileChange = (e) => {
    const file = e.target.files?.[0]
    if (!file || !file.type.startsWith('image/')) return
    const reader = new FileReader()
    reader.onload = () => {
      setImagen(reader.result)
      setImagenInputUrl('')
    }
    reader.readAsDataURL(file)
    e.target.value = ''
  }

  const quitarImagen = () => {
    setImagen('')
    setImagenInputUrl('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      await onGuardar({
        category_id: String(categoriaId),
        name: nombre.trim(),
        sku: normalizarCodigo(codigo),
        barcode: normalizarCodigo(codigo),
        price: Number(precio) || 0,
        description: '',
        status: 'active',
      })
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="form-overlay" onClick={onClose}>
      <div className="form-modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '560px' }}>
        <div className="form-header">
          <h3>{esEdicion ? 'Editar producto' : 'Nuevo producto'}</h3>
          <button className="form-close" onClick={onClose} aria-label="Cerrar">✕</button>
        </div>
        <form onSubmit={handleSubmit} className="config-form" style={{ padding: '1rem' }}>
          <div className="config-form-grid">
            <div className="config-field categoria-imagen-field">
              <label>Imagen</label>
              {imagen ? (
                <div className="categoria-imagen-preview">
                  <img src={imagen} alt="Vista previa" />
                  <button type="button" className="btn-action" onClick={quitarImagen}>
                    Quitar imagen
                  </button>
                </div>
              ) : (
                <>
                  <input
                    type="url"
                    value={imagenInputUrl}
                    onChange={handleImagenUrlChange}
                    placeholder="https://ejemplo.com/imagen.jpg"
                  />
                  <span className="categoria-imagen-o">o</span>
                  <label className="categoria-imagen-upload">
                    <input type="file" accept="image/*" onChange={handleFileChange} className="input-file" />
                    Subir archivo
                  </label>
                </>
              )}
            </div>
            <div className="config-field">
              <label>Código *</label>
              <input
                type="text"
                value={codigo}
                onChange={(e) => setCodigo(e.target.value)}
                placeholder="Ej: PROD-003"
                required
              />
            </div>
            <div className="config-field">
              <label>Nombre *</label>
              <input
                type="text"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                placeholder="Nombre del producto"
                required
              />
            </div>
            <div className="config-field">
              <label>Categoría *</label>
              <select value={String(categoriaId)} onChange={(e) => setCategoriaId(e.target.value)} required>
                {categorias.map((c) => (
                  <option key={c.id} value={String(c.id)}>{c.nombre}</option>
                ))}
              </select>
            </div>
            <div className="config-field">
              <label>Precio *</label>
              <input
                type="number"
                value={precio}
                onChange={(e) => setPrecio(e.target.value)}
                placeholder="0"
                min="0"
                required
              />
            </div>
          </div>
          <div className="form-footer" style={{ marginTop: '1rem', display: 'flex', gap: '12px' }}>
            <button type="button" className="form-btn-secondary" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="form-btn-primary" disabled={saving}>
              {saving ? 'Guardando...' : esEdicion ? 'Guardar cambios' : 'Crear producto'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

function ModalConfirmarEliminar({ nombre, onClose, onConfirmar }) {
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
          <h3>Eliminar producto</h3>
          <button className="form-close" onClick={onClose} aria-label="Cerrar" disabled={deleting}>✕</button>
        </div>
        <div className="form-body">
          <p style={{ marginBottom: '20px', color: '#6b7280' }}>
            ¿Estás seguro de que deseas eliminar el producto <strong>{nombre}</strong>?
          </p>
          <div className="form-footer">
            <button type="button" className="form-btn-secondary" onClick={onClose} disabled={deleting}>
              Cancelar
            </button>
            <button
              type="button"
              className="form-btn-primary"
              onClick={handleConfirmar}
              disabled={deleting}
              style={{ background: '#dc2626' }}
            >
              {deleting ? 'Eliminando...' : 'Eliminar'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
