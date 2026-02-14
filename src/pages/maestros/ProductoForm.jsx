import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useProductos } from './ProductosLayout'
import PageModule from '../../components/PageModule/PageModule'
import '../../components/FormularioProductos/FormularioProductos.css'

const IMPUESTOS = ['IVA 19%', 'Exento (0%)']

export default function ProductoForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { categorias, agregarProducto, actualizarProducto, obtenerProducto } = useProductos()
  const esEdicion = Boolean(id)

  const [codigo, setCodigo] = useState('')
  const [nombre, setNombre] = useState('')
  const [categoriaId, setCategoriaId] = useState(1)
  const [precio, setPrecio] = useState('')
  const [impuesto, setImpuesto] = useState('IVA 19%')
  const [imagen, setImagen] = useState('')
  const [imagenInputUrl, setImagenInputUrl] = useState('')

  useEffect(() => {
    if (esEdicion && id) {
      const prod = obtenerProducto(id)
      if (prod) {
        setCodigo(prod.codigo)
        setNombre(prod.nombre)
        setCategoriaId(prod.categoriaId ?? categorias[0]?.id ?? 1)
        setPrecio(prod.precio)
        setImpuesto(prod.impuesto ?? 'IVA 19%')
        setImagen(prod.imagen ?? '')
        setImagenInputUrl(prod.imagen?.startsWith?.('http') ? prod.imagen : '')
      }
    }
  }, [id, esEdicion, obtenerProducto, categorias])

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

  const handleSubmit = (e) => {
    e.preventDefault()
    const data = { codigo, nombre, categoriaId, precio, impuesto, imagen: imagen || undefined }
    if (esEdicion) {
      actualizarProducto(id, data)
    } else {
      agregarProducto(data)
    }
    navigate('/app/maestros/productos')
  }

  return (
    <PageModule
      title={esEdicion ? 'Editar producto' : 'Nuevo producto'}
      description={esEdicion ? 'Modifica los datos del producto.' : 'Registra un nuevo producto en el sistema.'}
    >
      <form onSubmit={handleSubmit} className="config-form">
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
            <select value={categoriaId} onChange={(e) => setCategoriaId(Number(e.target.value))} required>
              {categorias.map((c) => (
                <option key={c.id} value={c.id}>{c.nombre}</option>
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
          <div className="config-field">
            <label>Impuesto *</label>
            <select value={impuesto} onChange={(e) => setImpuesto(e.target.value)}>
              {IMPUESTOS.map((i) => (
                <option key={i} value={i}>{i}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="config-form-actions" style={{ display: 'flex', gap: '12px' }}>
          <button type="button" className="btn-secondary" onClick={() => navigate('/app/maestros/productos')}>
            Cancelar
          </button>
          <button type="submit" className="btn-primary">
            {esEdicion ? 'Guardar cambios' : 'Crear producto'}
          </button>
        </div>
      </form>
    </PageModule>
  )
}
