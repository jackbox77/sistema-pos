import { useRef, useState, useEffect, useCallback, useMemo, Fragment } from 'react'
import { Pencil, Trash2, Upload, Download, ChevronDown, ChevronLeft, ChevronRight, Image as ImageIcon, X, Eye, EyeOff, FolderOpen, Plus } from 'lucide-react'
import { parsearCSV } from '../../utils/csvMaestros'
import { descargarDatosExcel, parsearExcel } from '../../utils/excelMaestros'
import ApiErrorRecargar from '../../components/ApiErrorRecargar/ApiErrorRecargar'
import PageModule from '../../components/PageModule/PageModule'
import TableResponsive from '../../components/TableResponsive/TableResponsive'
import '../../components/TableResponsive/TableResponsive.css'
import '../../components/FormularioProductos/FormularioProductos.css'
import {
  getProductsWithFiltersUseCase,
  getProductsAllUseCase,
  createProductUseCase,
  updateProductUseCase,
  deleteProductUseCase,
  updateProductVisibilityUseCase,
} from '../../feature/masters/products/use-case'
import { getCategoriesUseCase, getCategoriesAllUseCase } from '../../feature/masters/category/use-case'
import { validateBucketUseCase, getBucketUseCase, createBucketUseCase, createFolderUseCase, uploadFileUseCase } from '../../feature/storage/use-case'

function normalizarCodigo(s) {
  return (s ?? '').toString().trim().replace(/\s+/g, '-').toUpperCase()
}

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

/** Mapea item de API a forma usada en la UI (tabla y formulario) */
function mapProductApiToUI(p) {
  return {
    id: p.id,
    codigo: p.code ?? p.sku ?? p.barcode ?? '',
    nombre: p.name ?? '',
    categoriaId: p.category_id,
    precio: p.price ?? 0,
    imagen: p.image_url ?? '',
    description: p.description ?? '',
    status: p.status ?? 'active',
    visibility: p.visibility ?? true,
  }
}

const LIMIT_OPCIONES = [10, 25, 50]

export default function Productos() {
  const [productos, setProductos] = useState([])
  const [categorias, setCategorias] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [pagination, setPagination] = useState(null)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [productoEliminar, setProductoEliminar] = useState(null)
  const [showFormModal, setShowFormModal] = useState(false)
  const [formError, setFormError] = useState(null)
  const [editingId, setEditingId] = useState(null)

  const [showMasAcciones, setShowMasAcciones] = useState(false)
  const masAccionesRef = useRef(null)
  const inputCargaRef = useRef(null)
  const [filtrosActivos, setFiltrosActivos] = useState([{ id: 'estado', label: 'Estado: activos', value: 'active' }])
  const [visibilityUpdatingId, setVisibilityUpdatingId] = useState(null)
  const [search, setSearch] = useState('')
  const [searchDebounced, setSearchDebounced] = useState('')
  const searchTimeoutRef = useRef(null)
  const [orderBy, setOrderBy] = useState('')
  const [sortOrder, setSortOrder] = useState('asc')

  const cargarProductos = useCallback(async () => {
    setError(null)
    setLoading(true)
    try {
      const statusFilter = filtrosActivos.find((f) => f.id === 'estado')?.value
      const visibilityFilter = filtrosActivos.find((f) => f.id === 'visibility')
      const visibilityValue = visibilityFilter?.value
      const res = await getProductsWithFiltersUseCase({
        page,
        limit,
        ...(statusFilter && { status: statusFilter }),
        ...(visibilityValue !== undefined && visibilityValue !== null && { visibility: Boolean(visibilityValue) }),
        ...(searchDebounced.trim() && { search: searchDebounced.trim() }),
        ...(orderBy === 'price' && { order_by: 'price', sort_order: sortOrder }),
        ...(orderBy === 'category' && { order_by: 'category_id', sort_order: sortOrder }),
      })
      if (res?.success && res?.data) {
        setProductos(Array.isArray(res.data.data) ? res.data.data.map(mapProductApiToUI) : [])
        setPagination(res.data.pagination ?? null)
      } else {
        setProductos([])
        setPagination(null)
      }
    } catch (err) {
      setProductos([])
      setPagination(null)
      const msg = err?.message ?? ''
      const esErrorRed = /failed to fetch|network error|load failed|networkrequestfailed/i.test(msg)
      setError(esErrorRed ? 'No fue posible cargar los productos. Compruebe su conexión e intente de nuevo.' : (msg || 'No fue posible cargar los productos'))
    } finally {
      setLoading(false)
    }
  }, [page, limit, searchDebounced, filtrosActivos, orderBy, sortOrder])

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

  const sortedProductos = useMemo(() => {
    if (!orderBy) return productos
    const mult = sortOrder === 'asc' ? 1 : -1
    return [...productos].sort((a, b) => {
      if (orderBy === 'price') return mult * (Number(a.precio) - Number(b.precio))
      if (orderBy === 'category') {
        const na = getCategoria(a.categoriaId)?.nombre ?? ''
        const nb = getCategoria(b.categoriaId)?.nombre ?? ''
        return mult * na.localeCompare(nb, undefined, { sensitivity: 'base' })
      }
      return 0
    })
  }, [productos, getCategoria, orderBy, sortOrder])
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
    setFormError(null)
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
        setShowDeleteModal(false)
        setProductoEliminar(null)
      }
    } catch (err) {
      setError(err?.message ?? 'Error al eliminar')
      setShowDeleteModal(false)
      setProductoEliminar(null)
    }
  }

  const descargarTodoProductos = async () => {
    try {
      const [list, categoriasList] = await Promise.all([getProductsAllUseCase(), getCategoriesAllUseCase()])
      const catPorId = Object.fromEntries((Array.isArray(categoriasList) ? categoriasList : []).map((c) => [c.id, c.name ?? '']))
      const columnas = ['codigo', 'nombre', 'categoria', 'precio', 'descripcion']
      const filas = (Array.isArray(list) ? list : []).map((p) => [p.code ?? p.sku ?? p.barcode ?? '', p.name ?? '', catPorId[p.category_id] ?? '', p.price ?? '', p.description ?? ''])
      descargarDatosExcel(columnas, filas, 'productos.xlsx')
    } catch (_) { }
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
      const categoryIdDefault = categorias[0]?.id ?? ''
      for (const f of datos) {
        if (!f[1]?.trim()) continue
        const nombreCategoria = (f[2] ?? '').trim()
        const cat = categorias.find((c) => c.nombre.toLowerCase() === nombreCategoria.toLowerCase())
        const category_id = cat ? String(cat.id) : String(categoryIdDefault)
        try {
          await createProductUseCase({
            category_id,
            image_url: '',
            code: (f[0] ?? '').trim().replace(/\s+/g, '-').toUpperCase(),
            name: (f[1] ?? '').trim(),
            description: '',
            sku: (f[0] ?? '').trim(),
            barcode: (f[0] ?? '').trim(),
            price: Number(f[3]) || 0,
            status: 'active',
          })
        } catch (_) { }
      }
      await cargarProductos()
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

  const handleToggleVisibility = async (prod) => {
    if (!prod?.id) return
    setError(null)
    setVisibilityUpdatingId(prod.id)
    try {
      const res = await updateProductVisibilityUseCase(prod.id, !prod.visibility)
      if (res?.success && res?.data) {
        setProductos((prev) =>
          prev.map((p) => (p.id === prod.id ? { ...p, visibility: res.data.visibility } : p))
        )
      } else {
        setError(res?.message ?? 'Error al actualizar visibilidad')
      }
    } catch (err) {
      setError(err?.message ?? 'Error al actualizar visibilidad')
    } finally {
      setVisibilityUpdatingId(null)
    }
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
                  <button type="button" onClick={() => { descargarTodoProductos(); setShowMasAcciones(false); }}>
                    <Download size={18} /> Descargar todo
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
            <input
              type="search"
              className="input-search"
              placeholder="Buscar productos..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              aria-label="Buscar productos"
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
            <label className="maestro-encabezado-label">Visibilidad</label>
            <select
              className="maestro-encabezado-select"
              value={(() => {
                const f = filtrosActivos.find((x) => x.id === 'visibility')
                if (f == null) return ''
                return f.value === true ? 'true' : 'false'
              })()}
              onChange={(e) => {
                const v = e.target.value
                setFiltrosActivos((prev) => {
                  const rest = prev.filter((f) => f.id !== 'visibility')
                  if (v === '') return rest
                  const value = v === 'true'
                  return [...rest, { id: 'visibility', label: value ? 'Visibilidad: visible' : 'Visibilidad: oculta', value }]
                })
                setPage(1)
              }}
              aria-label="Filtrar por visibilidad"
            >
              <option value="">Todos</option>
              <option value="true">Visible</option>
              <option value="false">Oculta</option>
            </select>
            <label className="maestro-encabezado-label">Ordenar por</label>
            <select
              className="maestro-encabezado-select"
              value={orderBy}
              onChange={(e) => {
                setOrderBy(e.target.value)
                setPage(1)
              }}
              aria-label="Ordenar por"
            >
              <option value="">Ninguno</option>
              <option value="price">Precio</option>
              <option value="category">Categoría</option>
            </select>
            {orderBy && (
              <label className="maestro-encabezado-label">Orden</label>
            )}
            {orderBy && (
              <select
                className="maestro-encabezado-select"
                value={sortOrder}
                onChange={(e) => {
                  setSortOrder(e.target.value)
                  setPage(1)
                }}
                aria-label="Orden ascendente o descendente"
              >
                <option value="asc">Ascendente</option>
                <option value="desc">Descendente</option>
              </select>
            )}
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
        <ApiErrorRecargar message={error} onRecargar={cargarProductos} loading={loading} />
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
                <th>Visible</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7">
                    <div className="page-module-empty">Cargando...</div>
                  </td>
                </tr>
              ) : (
                sortedProductos.map((prod) => (
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
                    <td data-label="Visible">
                      <button
                        type="button"
                        className="btn-icon-action"
                        title={prod.visibility ? 'Ocultar en menú' : 'Mostrar en menú'}
                        aria-label={prod.visibility ? 'Ocultar' : 'Mostrar'}
                        onClick={() => handleToggleVisibility(prod)}
                        disabled={visibilityUpdatingId === prod.id}
                        style={{ opacity: visibilityUpdatingId === prod.id ? 0.6 : 1 }}
                      >
                        {prod.visibility ? (
                          <Eye size={18} style={{ color: '#16a34a' }} />
                        ) : (
                          <EyeOff size={18} style={{ color: '#9ca3af' }} />
                        )}
                      </button>
                    </td>
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

      {!error && pagination && total > 0 && (
        <div className="page-module-pagination">
          <div className="page-module-pagination-info">
            Mostrando {desde}-{hasta} de {total}
          </div>
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

      {showFormModal && (
        <ProductoFormModal
          editingId={editingId}
          categorias={categorias}
          obtenerProducto={obtenerProducto}
          onClose={cerrarFormModal}
          error={formError}
          onGuardar={async (params) => {
            setFormError(null)
            try {
              if (editingId) {
                const res = await updateProductUseCase(editingId, params)
                if (res?.success) {
                  await cargarProductos()
                  cerrarFormModal()
                } else {
                  setFormError(res?.message ?? 'Error al actualizar')
                }
              } else {
                const res = await createProductUseCase(params)
                if (res?.success) {
                  await cargarProductos()
                  cerrarFormModal()
                } else {
                  setFormError(res?.message ?? 'Error al crear')
                }
              }
            } catch (err) {
              setFormError(err?.message ?? 'Error al guardar')
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

/** Obtiene el nodo actual del árbol según la ruta de carpetas */
function getBucketCurrentNode(treeData, path) {
  const root = treeData?.data?.tree?.folders ?? {}
  if (path.length === 0) return { folders: root, images: [] }
  const node = path.reduce((n, name) => n?.folders?.[name], { folders: root })
  return node ?? { folders: {}, images: [] }
}

function BucketBrowserModal({ onSelectUrl, onClose }) {
  const [tree, setTree] = useState(null)
  const [currentPath, setCurrentPath] = useState(['productos'])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [hasBucket, setHasBucket] = useState(null)
  const [creatingBucket, setCreatingBucket] = useState(false)
  const [showNewFolderInput, setShowNewFolderInput] = useState(false)
  const [newFolderName, setNewFolderName] = useState('')
  const [creatingFolder, setCreatingFolder] = useState(false)
  const uploadInputRef = useRef(null)
  const newFolderInputRef = useRef(null)

  const loadBucketTree = useCallback(() => {
    setError(null)
    return getBucketUseCase()
      .then((res) => {
        if (res?.success) setTree(res)
        else setError(res?.message ?? 'No se pudo cargar el bucket')
      })
      .catch((err) => setError(err?.message ?? 'Error al cargar el bucket'))
  }, [])

  useEffect(() => {
    let cancelled = false
    setError(null)
    setLoading(true)
    setHasBucket(null)
    validateBucketUseCase()
      .then((res) => {
        if (cancelled) return
        if (!res?.success) {
          setError(res?.message ?? 'No se pudo validar el bucket')
          setLoading(false)
          return
        }
        const has = res?.data?.has_bucket === true
        setHasBucket(has)
        if (has) {
          return getBucketUseCase().then((bucketRes) => {
            if (!cancelled && bucketRes?.success) setTree(bucketRes)
            else if (!cancelled) setError(bucketRes?.message ?? 'No se pudo cargar el bucket')
          })
        }
      })
      .catch((err) => {
        if (!cancelled) setError(err?.message ?? 'Error al validar el bucket')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => { cancelled = true }
  }, [])

  const handleCreateBucket = async () => {
    setError(null)
    setCreatingBucket(true)
    try {
      const res = await createBucketUseCase()
      if (res?.success) {
        setHasBucket(true)
        await loadBucketTree()
      } else {
        setError(res?.message ?? 'No se pudo crear el bucket')
      }
    } catch (err) {
      setError(err?.message ?? 'Error al crear el bucket')
    } finally {
      setCreatingBucket(false)
    }
  }

  const currentNode = useMemo(() => getBucketCurrentNode(tree, currentPath), [tree, currentPath])
  const folderNames = useMemo(() => Object.keys(currentNode.folders || {}), [currentNode.folders])
  const images = useMemo(() => currentNode.images || [], [currentNode.images])
  const pathString = currentPath.length === 0 ? '' : currentPath.join('/')

  const handleCreateFolder = async () => {
    const name = newFolderName.trim().replace(/[/\\]/g, '')
    if (!name) return
    setError(null)
    setCreatingFolder(true)
    try {
      const fullPath = pathString ? `${pathString}/${name}` : name
      const res = await createFolderUseCase(fullPath)
      if (res?.success) {
        setShowNewFolderInput(false)
        setNewFolderName('')
        await loadBucketTree()
        setCurrentPath((prev) => [...prev, name])
      } else {
        setError(res?.message ?? 'No se pudo crear la carpeta')
      }
    } catch (err) {
      setError(err?.message ?? 'Error al crear la carpeta')
    } finally {
      setCreatingFolder(false)
    }
  }

  useEffect(() => {
    if (showNewFolderInput && newFolderInputRef.current) newFolderInputRef.current.focus()
  }, [showNewFolderInput])

  const handleUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file || !file.type.startsWith('image/')) return
    e.target.value = ''
    setUploading(true)
    setError(null)
    try {
      const res = await uploadFileUseCase(file, pathString || 'productos')
      if (res?.success && res?.data?.url) {
        onSelectUrl(res.data.url)
        onClose()
      } else {
        setError(res?.message ?? 'Error al subir')
      }
    } catch (err) {
      setError(err?.message ?? 'Error al subir el archivo')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="form-overlay bucket-browser-overlay" onClick={onClose} style={{ zIndex: 1001 }}>
      <div className="bucket-browser-modal-apple" onClick={(e) => e.stopPropagation()}>
        <div className="bucket-browser-header">
          <h3>Elegir imagen</h3>
          <button type="button" className="bucket-browser-close" onClick={onClose} aria-label="Cerrar">✕</button>
        </div>
        <div className="bucket-browser-content">
          {loading && <p className="bucket-browser-loading">Validando bucket…</p>}
          {error && <p className="bucket-browser-error" role="alert">{error}</p>}
          {!loading && hasBucket === false && (
            <div className="bucket-browser-no-bucket">
              <p>No tienes un bucket de almacenamiento. Créalo para subir y elegir imágenes.</p>
              <button type="button" className="bucket-browser-btn-primary" onClick={handleCreateBucket} disabled={creatingBucket}>
                {creatingBucket ? 'Creando…' : 'Crear bucket'}
              </button>
            </div>
          )}
          {!loading && hasBucket && tree && (
            <>
              <nav className="bucket-browser-breadcrumb" aria-label="Ruta">
                <button type="button" onClick={() => { setCurrentPath([]); setShowNewFolderInput(false); }} className="bucket-breadcrumb-item">
                  Inicio
                </button>
                {currentPath.map((name, i) => (
                  <Fragment key={i}>
                    <span className="bucket-breadcrumb-sep">/</span>
                    <button
                      type="button"
                      onClick={() => { setCurrentPath(currentPath.slice(0, i + 1)); setShowNewFolderInput(false); }}
                      className="bucket-breadcrumb-item"
                    >
                      {name}
                    </button>
                  </Fragment>
                ))}
              </nav>

              <div className="bucket-browser-layout">
                <div className="bucket-browser-sidebar">
                  <div className="bucket-browser-list-wrap">
                    {folderNames.length > 0 && (
                      <ul className="bucket-browser-list" role="list">
                        {folderNames.map((name) => (
                          <li key={name}>
                            <button
                              type="button"
                              className="bucket-browser-list-row"
                              onClick={() => { setCurrentPath([...currentPath, name]); setShowNewFolderInput(false); }}
                            >
                              <FolderOpen size={20} className="bucket-browser-row-icon" />
                              <span className="bucket-browser-row-label">{name}</span>
                              <ChevronRight size={18} className="bucket-browser-row-chevron" />
                            </button>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>

                  <div className="bucket-browser-actions">
                    {showNewFolderInput ? (
                      <div className="bucket-browser-new-folder-inline">
                        <input
                          ref={newFolderInputRef}
                          type="text"
                          value={newFolderName}
                          onChange={(e) => setNewFolderName(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') handleCreateFolder()
                            if (e.key === 'Escape') { setShowNewFolderInput(false); setNewFolderName('') }
                          }}
                          placeholder="Nombre de la carpeta"
                          className="bucket-browser-new-folder-input"
                          disabled={creatingFolder}
                        />
                        <div className="bucket-browser-new-folder-btns">
                          <button type="button" className="bucket-browser-btn-ghost" onClick={() => { setShowNewFolderInput(false); setNewFolderName('') }} disabled={creatingFolder}>
                            Cancelar
                          </button>
                          <button type="button" className="bucket-browser-btn-primary" onClick={handleCreateFolder} disabled={creatingFolder || !newFolderName.trim()}>
                            {creatingFolder ? 'Creando…' : 'Crear'}
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button type="button" className="bucket-browser-btn-icon-folder" onClick={() => setShowNewFolderInput(true)} aria-label="Nueva carpeta" title="Nueva carpeta">
                        <Plus size={20} /> Nueva carpeta
                      </button>
                    )}
                  </div>
                </div>

                <div className="bucket-browser-main">
                  <label className="bucket-browser-upload-zone">
                    <input
                      ref={uploadInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleUpload}
                      disabled={uploading}
                      className="input-file"
                    />
                    <Upload size={28} style={{ opacity: 0.6 }} />
                    <span className="bucket-browser-upload-text">
                      {uploading ? 'Subiendo…' : 'Arrastra una imagen aquí o haz clic para subir'}
                    </span>
                  </label>

                  {images.length > 0 && (
                    <div className="bucket-browser-images-section">
                      <p className="bucket-browser-section-title">Imágenes</p>
                      <div className="bucket-browser-grid">
                        {images.map((img) => (
                          <button
                            key={img.key}
                            type="button"
                            className="bucket-browser-image-card"
                            onClick={() => {
                              onSelectUrl(img.url)
                              onClose()
                            }}
                          >
                            <img src={img.url} alt="" />
                            <span className="bucket-browser-image-name" title={img.key}>{img.key}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

function ProductoFormModal({ editingId, categorias, obtenerProducto, onClose, onGuardar, error: apiError }) {
  const esEdicion = Boolean(editingId)
  const prod = esEdicion ? obtenerProducto(editingId) : null

  const [codigo, setCodigo] = useState(prod?.codigo ?? '')
  const [nombre, setNombre] = useState(prod?.nombre ?? '')
  const [descripcion, setDescripcion] = useState(prod?.description ?? '')
  const [categoriaId, setCategoriaId] = useState(prod?.categoriaId ?? categorias[0]?.id ?? '')
  const [precio, setPrecio] = useState(prod?.precio ?? '')
  const [imagen, setImagen] = useState(prod?.imagen ?? '')
  const [saving, setSaving] = useState(false)
  const [showBucketBrowser, setShowBucketBrowser] = useState(false)

  useEffect(() => {
    if (esEdicion && prod) {
      setCodigo(prod.codigo)
      setNombre(prod.nombre)
      setDescripcion(prod.description ?? '')
      setCategoriaId(prod.categoriaId ?? categorias[0]?.id ?? '')
      setPrecio(prod.precio)
      setImagen(prod.imagen ?? '')
    }
  }, [esEdicion, prod, categorias])

  const handleSelectUrlFromBucket = (url) => {
    setImagen(url)
    setShowBucketBrowser(false)
  }

  const quitarImagen = () => {
    setImagen('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      await onGuardar({
        category_id: String(categoriaId),
        image_url: typeof imagen === 'string' ? imagen : '',
        code: normalizarCodigo(codigo),
        name: nombre.trim(),
        description: descripcion.trim(),
        sku: normalizarCodigo(codigo),
        barcode: normalizarCodigo(codigo),
        price: Number(precio) || 0,
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
          {apiError && (
            <p className="form-api-error" role="alert" style={{ color: '#dc2626', fontSize: '14px', marginBottom: '12px' }}>
              {apiError}
            </p>
          )}
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
              ) : null}
              <div className="categoria-imagen-actions">
                <button type="button" className="btn-action" onClick={() => setShowBucketBrowser(true)}>
                  <ImageIcon size={18} /> Elegir imagen
                </button>
              </div>
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
            <div className="config-field" style={{ gridColumn: '1 / -1' }}>
              <label>Descripción</label>
              <input
                type="text"
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                placeholder="Descripción opcional"
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
      {showBucketBrowser && (
        <BucketBrowserModal
          onSelectUrl={handleSelectUrlFromBucket}
          onClose={() => setShowBucketBrowser(false)}
        />
      )}
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
