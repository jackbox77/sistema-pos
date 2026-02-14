import { useRef, useState, useEffect, useMemo } from 'react'
import { Pencil, Trash2, Upload, Download, ChevronDown, Image as ImageIcon, X } from 'lucide-react'
import PageModule from '../../components/PageModule/PageModule'
import { useMaestros } from '../../context/MaestrosContext'
import { descargarPlantilla, parsearCSV } from '../../utils/csvMaestros'
import TableResponsive from '../../components/TableResponsive/TableResponsive'
import '../../components/TableResponsive/TableResponsive.css'
import '../../components/FormularioProductos/FormularioProductos.css'

export default function Categorias() {
  const { categorias: categoriasRaw, setCategorias, productos, agregarCategoria, actualizarCategoria, eliminarCategoria } = useMaestros()
  const categorias = useMemo(
    () => categoriasRaw.map((c) => ({
      ...c,
      productosAsociados: productos.filter((p) => p.categoriaId === c.id).length,
    })),
    [categoriasRaw, productos]
  )
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [categoriaEditando, setCategoriaEditando] = useState(null)
  const [categoriaEliminar, setCategoriaEliminar] = useState(null)
  const [showMasAcciones, setShowMasAcciones] = useState(false)
  const masAccionesRef = useRef(null)
  const [listaPrecios, setListaPrecios] = useState('general')
  const [filtrosActivos, setFiltrosActivos] = useState([{ id: 'estado', label: 'Estado: activos' }])

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (masAccionesRef.current && !masAccionesRef.current.contains(e.target)) {
        setShowMasAcciones(false)
      }
    }
    if (showMasAcciones) document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [showMasAcciones])

  const handleCrear = () => setShowCreateModal(true)
  const handleEditar = (cat) => {
    setCategoriaEditando(cat)
    setShowEditModal(true)
  }
  const handleEliminar = (cat) => {
    setCategoriaEliminar(cat)
    setShowDeleteModal(true)
  }

  const inputCargaRef = useRef(null)
  const descargarPlantillaCategorias = () => {
    descargarPlantilla(
      ['codigo', 'nombre', 'descripcion'],
      ['CAT-003', 'Limpieza', 'Productos de limpieza'],
      'plantilla_categorias.csv'
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
      setCategorias((prev) => {
        const maxId = Math.max(0, ...prev.map((c) => c.id))
        const nuevas = datos
          .filter((f) => f[0]?.trim())
          .map((f, i) => ({
            id: maxId + i + 1,
            codigo: (f[0] ?? '').trim(),
            nombre: (f[1] ?? '').trim(),
            descripcion: (f[2] ?? '').trim(),
            imagen: '',
          }))
        return [...prev, ...nuevas]
      })
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
            <h1 className="maestro-encabezado-titulo">Categorías</h1>
            <p className="maestro-encabezado-desc">
              Crea, edita y administra las categorías de tus productos.
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
                  <button type="button" onClick={() => { descargarPlantillaCategorias(); setShowMasAcciones(false); }}>
                    <Download size={18} /> Descargar plantilla
                  </button>
                  <button type="button" onClick={() => { inputCargaRef.current?.click(); setShowMasAcciones(false); }}>
                    <Upload size={18} /> Carga masiva
                  </button>
                </div>
              )}
            </div>
            <button type="button" className="btn-primary" onClick={handleCrear}>
              + Nueva categoría
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
        <input type="search" className="input-search" placeholder="Buscar categorías..." />
      </div>
      <TableResponsive>
        <table className="page-module-table">
          <thead>
            <tr>
              <th>Imagen</th>
              <th>Código</th>
              <th>Nombre</th>
              <th>Descripción</th>
              <th>Productos asociados</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {categorias.map((cat) => (
              <tr key={cat.id}>
                <td data-label="Imagen">
                  {cat.imagen ? (
                    <img src={cat.imagen} alt="" className="categoria-thumb" />
                  ) : (
                    <span className="categoria-thumb-sin-imagen" title="Sin imagen">
                      <ImageIcon size={24} />
                    </span>
                  )}
                </td>
                <td data-label="Código">{cat.codigo}</td>
                <td data-label="Nombre">{cat.nombre}</td>
                <td data-label="Descripción">{cat.descripcion}</td>
                <td data-label="Productos asociados">{cat.productosAsociados}</td>
                <td data-label="Acciones">
                  <button type="button" className="btn-icon-action btn-icon-edit" onClick={() => handleEditar(cat)} title="Editar" aria-label="Editar">
                    <Pencil size={18} />
                  </button>
                  <button type="button" className="btn-icon-action btn-icon-delete" onClick={() => handleEliminar(cat)} title="Eliminar" aria-label="Eliminar">
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </TableResponsive>

      {showCreateModal && (
        <ModalFormCategoria
          onClose={() => setShowCreateModal(false)}
          onGuardar={(data) => {
            agregarCategoria(data)
            setShowCreateModal(false)
          }}
        />
      )}

      {showEditModal && categoriaEditando && (
        <ModalFormCategoria
          categoria={categoriaEditando}
          onClose={() => {
            setShowEditModal(false)
            setCategoriaEditando(null)
          }}
          onGuardar={(data) => {
            actualizarCategoria(categoriaEditando.id, data)
            setShowEditModal(false)
            setCategoriaEditando(null)
          }}
          esEdicion
        />
      )}

      {showDeleteModal && categoriaEliminar && (
        <ModalConfirmarEliminar
          nombre={categoriaEliminar.nombre}
          onClose={() => {
            setShowDeleteModal(false)
            setCategoriaEliminar(null)
          }}
          onConfirmar={() => {
            eliminarCategoria(categoriaEliminar.id)
            setShowDeleteModal(false)
            setCategoriaEliminar(null)
          }}
        />
      )}
    </PageModule>
  )
}

function ModalFormCategoria({ categoria, onClose, onGuardar, esEdicion = false }) {
  const [codigo, setCodigo] = useState(categoria?.codigo ?? '')
  const [nombre, setNombre] = useState(categoria?.nombre ?? '')
  const [descripcion, setDescripcion] = useState(categoria?.descripcion ?? '')
  const [imagen, setImagen] = useState(categoria?.imagen ?? '')
  const [imagenInputUrl, setImagenInputUrl] = useState(categoria?.imagen?.startsWith('http') ? categoria.imagen : '')

  const handleSubmit = (e) => {
    e.preventDefault()
    onGuardar({ codigo, nombre, descripcion, imagen: imagen || undefined })
  }

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

  return (
    <div className="form-overlay" onClick={onClose}>
      <div className="form-modal" onClick={(e) => e.stopPropagation()}>
        <div className="form-header">
          <h3>{esEdicion ? 'Editar categoría' : 'Nueva categoría'}</h3>
          <button className="form-close" onClick={onClose} aria-label="Cerrar">✕</button>
        </div>
        <form onSubmit={handleSubmit} className="form-body">
          <div className="config-form-grid" style={{ gridTemplateColumns: '1fr' }}>
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
                placeholder="Ej: CAT-003"
                required
              />
            </div>
            <div className="config-field">
              <label>Nombre *</label>
              <input
                type="text"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                placeholder="Nombre de la categoría"
                required
              />
            </div>
            <div className="config-field">
              <label>Descripción</label>
              <textarea
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                placeholder="Descripción opcional"
                rows={3}
              />
            </div>
          </div>
          <div className="form-footer">
            <button type="button" className="form-btn-secondary" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="form-btn-primary">
              {esEdicion ? 'Guardar cambios' : 'Crear categoría'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

function ModalConfirmarEliminar({ nombre, onClose, onConfirmar }) {
  return (
    <div className="form-overlay" onClick={onClose}>
      <div className="form-modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '400px' }}>
        <div className="form-header">
          <h3>Eliminar categoría</h3>
          <button className="form-close" onClick={onClose} aria-label="Cerrar">✕</button>
        </div>
        <div className="form-body">
          <p style={{ marginBottom: '20px', color: '#6b7280' }}>
            ¿Estás seguro de que deseas eliminar la categoría <strong>{nombre}</strong>?
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
