import { useState, useEffect } from 'react'
import './FormularioProductos.css'

const TIPO_ITEM = {
  producto: 'Producto',
  servicio: 'Servicio',
  combo: 'Combo',
}

const DESCRIPCION_POR_TIPO = {
  producto: 'Crea los bienes y mercancías que vendes e incluye todos sus detalles.',
  servicio: 'Registra los servicios que ofreces con su descripción y precio.',
  combo: 'Combina productos y/o servicios en una sola oferta.',
}

const UNIDADES = ['Unidad', 'Kilogramo', 'Gramo', 'Litro', 'Metro', 'Caja', 'Paquete']

const IMPUESTOS = [
  { id: 'iva', nombre: 'IVA (19.00%)', porcentaje: 19 },
  { id: 'iva0', nombre: 'Exento (0%)', porcentaje: 0 },
]

export default function FormularioProductos({ onClose, onCreate }) {
  const [tipo, setTipo] = useState('producto')
  const [nombre, setNombre] = useState('')
  const [categoria, setCategoria] = useState('')
  const [unidadMedida, setUnidadMedida] = useState('Unidad')
  const [bodega, setBodega] = useState('Principal')
  const [cantidad, setCantidad] = useState(0)
  const [costoInicial, setCostoInicial] = useState(0)
  const [precioBase, setPrecioBase] = useState(0)
  const [impuestoSeleccionado, setImpuestoSeleccionado] = useState('iva')
  const [precioFinal, setPrecioFinal] = useState(0)

  useEffect(() => {
    const impuesto = IMPUESTOS.find((i) => i.id === impuestoSeleccionado)
    const iva = (precioBase * (impuesto?.porcentaje || 0)) / 100
    setPrecioFinal(precioBase + iva)
  }, [precioBase, impuestoSeleccionado])

  const handleSubmit = (e) => {
    e.preventDefault()
    onCreate?.()
  }

  const isProducto = tipo === 'producto'

  return (
    <div className="form-overlay" onClick={onClose}>
      <div className="form-modal" onClick={(e) => e.stopPropagation()}>
        <div className="form-header">
          <h3>Formulario básico de productos</h3>
          <button className="form-close" onClick={onClose} aria-label="Cerrar">
            ✕
          </button>
        </div>

        <div className="form-tipo-selector">
          {Object.entries(TIPO_ITEM).map(([key, label]) => (
            <button
              key={key}
              type="button"
              className={`form-tipo-btn ${tipo === key ? 'active' : ''}`}
              onClick={() => setTipo(key)}
            >
              <span className={`form-tipo-radio ${tipo === key ? 'checked' : ''}`} />
              {label}
            </button>
          ))}
        </div>

        <p className="form-descripcion">{DESCRIPCION_POR_TIPO[tipo]}</p>

        <form onSubmit={handleSubmit} className="form-body">
          <div className="form-grid">
            <div className="form-field">
              <label>Nombre *</label>
              <input
                type="text"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                placeholder="Nombre del artículo"
                required
              />
            </div>

            <div className="form-field">
              <label>Categoría</label>
              <select
                value={categoria}
                onChange={(e) => setCategoria(e.target.value)}
              >
                <option value="">Seleccionar</option>
                <option value="general">General</option>
                <option value="alimentos">Alimentos</option>
                <option value="servicios">Servicios</option>
              </select>
            </div>

            {isProducto && (
              <div className="form-field">
                <label>Unidad de medida *</label>
                <select
                  value={unidadMedida}
                  onChange={(e) => setUnidadMedida(e.target.value)}
                >
                  {UNIDADES.map((u) => (
                    <option key={u} value={u}>{u}</option>
                  ))}
                </select>
              </div>
            )}

            {isProducto && (
              <div className="form-field">
                <label>Bodega</label>
                <input type="text" value={bodega} readOnly className="readonly" />
              </div>
            )}

            {isProducto && (
              <div className="form-field">
                <label>Cantidad *</label>
                <input
                  type="number"
                  min="0"
                  value={cantidad}
                  onChange={(e) => setCantidad(Number(e.target.value))}
                  required={isProducto}
                />
              </div>
            )}

            <div className="form-field">
              <label>Costo inicial *</label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={costoInicial}
                onChange={(e) => setCostoInicial(Number(e.target.value))}
              />
            </div>

            <div className="form-field">
              <label>Precio base *</label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={precioBase}
                onChange={(e) => setPrecioBase(Number(e.target.value))}
                required
              />
            </div>

            <div className="form-field">
              <label>Impuestos</label>
              <div className="form-impuestos">
                <span className="form-impuestos-plus">+</span>
                <select
                  value={impuestoSeleccionado}
                  onChange={(e) => setImpuestoSeleccionado(e.target.value)}
                >
                  {IMPUESTOS.map((i) => (
                    <option key={i.id} value={i.id}>{i.nombre}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-field">
              <label>Precio final *</label>
              <input
                type="text"
                value={`= ${precioFinal.toFixed(2)}`}
                readOnly
                className="form-precio-final readonly"
              />
            </div>
          </div>

          <div className="form-footer">
            <button type="button" className="form-btn-secondary">
              Ir al formulario avanzado ↗
            </button>
            <button type="submit" className="form-btn-primary">
              Crear {tipo === 'producto' ? 'producto' : tipo === 'servicio' ? 'servicio' : 'combo'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
