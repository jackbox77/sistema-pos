import { useState, useMemo, useCallback, useEffect } from 'react'
import { Plus } from 'lucide-react'
import { usePos } from './PosLayout'
import ApiErrorRecargar from '../../components/ApiErrorRecargar/ApiErrorRecargar'
import HistorialVentas from './HistorialVentas'
import ComprobanteVentaDiarias from './ComprobanteVentaDiarias'
import './Facturar.css'

/** Genera id y nombre para la siguiente factura */
function createNuevaFactura(pedidos) {
  const n = pedidos.length + 1
  const id = `f-${Date.now()}-${n}`
  const nombre = `Factura ${n}`
  return { id, nombre, cart: [] }
}

const POS_TABS = [
  { id: 'facturar', label: 'Facturar' },
  { id: 'historial', label: 'Historial de ventas' },
  { id: 'comprobante', label: 'Comprobante de venta diarias' },
]

function getCategoriesWithProductsList(categoriesWithProducts) {
  if (!Array.isArray(categoriesWithProducts)) return []
  const list = []
  for (const item of categoriesWithProducts) {
    const name = item.name ?? item.code ?? 'Sin categoría'
    const products = Array.isArray(item.products) ? item.products : (item.id && (item.price != null || item.unit_price != null) ? [item] : [])
    if (products.length > 0) list.push({ id: item.id ?? name, categoryName: name, products })
  }
  return list
}

/** Obtiene la inicial del nombre del producto para la tarjeta */
function getProductInitial(name) {
  const n = (name ?? '').toString().trim()
  return n.charAt(0).toUpperCase() || '?'
}

export default function Facturar() {
  const { categoriesWithProducts, currentShiftId, loading, error, loadData, registerSale } = usePos()
  const [activeTab, setActiveTab] = useState('facturar')
  const [pedidos, setPedidos] = useState(() => {
    const first = createNuevaFactura([])
    return [first]
  })
  const [currentPedidoId, setCurrentPedidoId] = useState(null)
  const [saving, setSaving] = useState(false)
  const [saleError, setSaleError] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('todos')
  const [search, setSearch] = useState('')

  const currentPedido = useMemo(
    () => pedidos.find((p) => p.id === currentPedidoId) ?? pedidos[0],
    [pedidos, currentPedidoId]
  )
  const cart = currentPedido?.cart ?? []
  useEffect(() => {
    if (pedidos.length > 0 && (currentPedidoId == null || !pedidos.some((p) => p.id === currentPedidoId))) {
      setCurrentPedidoId(pedidos[0].id)
    }
  }, [pedidos, currentPedidoId])

  const categoriesAndProducts = useMemo(
    () => getCategoriesWithProductsList(categoriesWithProducts),
    [categoriesWithProducts]
  )

  const allProducts = useMemo(() => {
    return categoriesAndProducts.flatMap((c) => c.products.map((p) => ({ ...p, categoryName: c.categoryName, categoryId: c.id })))
  }, [categoriesAndProducts])

  const filteredProducts = useMemo(() => {
    let list = allProducts
    if (categoryFilter !== 'todos') {
      list = list.filter((p) => p.categoryName === categoryFilter)
    }
    if (search.trim()) {
      const q = search.toLowerCase().trim()
      list = list.filter(
        (p) =>
          (p.name ?? '').toLowerCase().includes(q) ||
          (p.code ?? '').toLowerCase().includes(q) ||
          (p.description ?? '').toLowerCase().includes(q)
      )
    }
    return list
  }, [allProducts, categoryFilter, search])

  const updateCurrentPedidoCart = useCallback((fn) => {
    setPedidos((prev) =>
      prev.map((p) =>
        p.id === currentPedido?.id ? { ...p, cart: fn(p.cart) } : p
      )
    )
    setSaleError('')
  }, [currentPedido?.id])

  const addToCart = (product) => {
    const id = product.id
    const unit_price = Number(product.price ?? product.unit_price ?? 0)
    const tax_amount = Number(product.tax_amount ?? 0)
    updateCurrentPedidoCart((prev) => {
      const i = prev.findIndex((x) => x.product_id === id)
      if (i >= 0) {
        const next = [...prev]
        next[i] = { ...next[i], quantity: next[i].quantity + 1 }
        return next
      }
      return [...prev, { product_id: id, product_name: product.name ?? product.code ?? 'Producto', quantity: 1, unit_price, tax_amount }]
    })
  }

  const updateQuantity = (product_id, delta) => {
    updateCurrentPedidoCart((prev) => {
      const i = prev.findIndex((x) => x.product_id === product_id)
      if (i < 0) return prev
      const next = [...prev]
      const q = next[i].quantity + delta
      if (q <= 0) return prev.filter((_, idx) => idx !== i)
      next[i] = { ...next[i], quantity: q }
      return next
    })
  }

  const removeFromCart = (product_id) => {
    updateCurrentPedidoCart((prev) => prev.filter((x) => x.product_id !== product_id))
  }

  const clearOrder = () => {
    updateCurrentPedidoCart(() => [])
  }

  const addNuevaFactura = () => {
    const nueva = createNuevaFactura(pedidos)
    setPedidos((prev) => [...prev, nueva])
    setCurrentPedidoId(nueva.id)
    setSaleError('')
  }

  const selectFactura = (id) => {
    setCurrentPedidoId(id)
    setSaleError('')
  }

  const removeFactura = (id) => {
    setPedidos((prev) => {
      const next = prev.filter((p) => p.id !== id)
      if (next.length === 0) {
        return [createNuevaFactura([])]
      }
      return next
    })
    if (currentPedidoId === id) {
      setCurrentPedidoId(null)
    }
  }

  const subtotal = cart.reduce((sum, it) => sum + it.quantity * it.unit_price, 0)
  const discount = 0
  const taxTotal = cart.reduce((sum, it) => sum + (it.tax_amount ?? 0) * it.quantity, 0)
  const totalCart = subtotal - discount + taxTotal
  const totalPcs = cart.reduce((sum, it) => sum + it.quantity, 0)

  const handleRegisterSale = async () => {
    if (!currentShiftId) {
      setSaleError('No hay turno abierto. Abre un turno en Turnos.')
      return
    }
    if (cart.length === 0) {
      setSaleError('Agrega al menos un producto al pedido.')
      return
    }
    setSaleError('')
    setSaving(true)
    try {
      await registerSale({
        items: cart.map((it) => ({
          product_id: it.product_id,
          quantity: it.quantity,
          unit_price: it.unit_price,
          tax_amount: it.tax_amount ?? 0,
        })),
      })
      updateCurrentPedidoCart(() => [])
    } catch (err) {
      setSaleError(err?.message ?? 'No se pudo registrar la venta.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className={`facturar-page ${activeTab === 'facturar' ? 'facturar-page--con-barra' : ''}`}>
      <div className="pos-tabs">
        {POS_TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            className={`pos-tab ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'historial' && <HistorialVentas />}
      {activeTab === 'comprobante' && <ComprobanteVentaDiarias />}

      {activeTab === 'facturar' && (
        <>
      {error && <ApiErrorRecargar message={error} onRecargar={loadData} loading={loading} />}

      {loading ? (
        <p className="facturar-loading">Cargando categorías y productos...</p>
      ) : (
        <div className="facturar-grid">
          {/* Izquierda: categorías + búsqueda + grid de productos */}
          <div className="facturar-productos">
            <div className="facturar-filtros">
              <div className="facturar-categorias-filtro">
                <button
                  type="button"
                  className={`facturar-filtro-btn ${categoryFilter === 'todos' ? 'active' : ''}`}
                  onClick={() => setCategoryFilter('todos')}
                >
                  Todos ({allProducts.length})
                </button>
                {categoriesAndProducts.map((c) => (
                <button
                  key={c.id ?? c.categoryName}
                  type="button"
                  className={`facturar-filtro-btn ${categoryFilter === c.categoryName ? 'active' : ''}`}
                  onClick={() => setCategoryFilter(c.categoryName)}
                >
                  {c.categoryName} ({c.products.length})
                </button>
                ))}
              </div>
              <input
                type="search"
                className="facturar-buscar"
                placeholder="Buscar producto..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <div className="facturar-productos-grid">
              {filteredProducts.length === 0 ? (
                <p className="facturar-empty">
                  {categoriesAndProducts.length === 0
                    ? 'No hay categorías con productos. Carga productos en Maestros.'
                    : 'No hay productos que coincidan con el filtro o la búsqueda.'}
                </p>
              ) : (
                filteredProducts.map((p) => (
                  <div key={p.id} className="facturar-producto-card">
                    <div className="facturar-producto-inicial">
                      {getProductInitial(p.name ?? p.code)}
                    </div>
                    <h4 className="facturar-producto-nombre">{p.name ?? p.code ?? 'Producto'}</h4>
                    {(p.description ?? p.categoryName ?? '').trim() && (
                      <p className="facturar-producto-desc">
                        {(p.description ?? p.categoryName ?? '').trim().slice(0, 50)}
                        {(p.description ?? p.categoryName ?? '').trim().length > 50 ? '...' : ''}
                      </p>
                    )}
                    <div className="facturar-producto-footer">
                      <span className="facturar-producto-precio">
                        ${Number(p.price ?? p.unit_price ?? 0).toLocaleString('es-CO')}/und
                      </span>
                      <button
                        type="button"
                        className="facturar-producto-btn-mas"
                        onClick={() => addToCart(p)}
                        aria-label="Agregar a la factura"
                      >
                        <Plus size={20} strokeWidth={2.5} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Derecha: panel de facturación */}
          <div className="facturar-panel-factura">
            <h3 className="facturar-panel-titulo">{currentPedido?.nombre ?? 'Pedido'}</h3>
            {saleError && (
              <div role="alert" className="facturar-error">
                {saleError}
              </div>
            )}
            {cart.length === 0 ? (
              <p className="facturar-panel-empty">Añade productos desde el catálogo</p>
            ) : (
              <>
                <ul className="facturar-carrito-lista">
                  {cart.map((it) => (
                    <li key={it.product_id} className="facturar-carrito-item">
                      <span className="facturar-carrito-nombre">{it.product_name}</span>
                      <div className="facturar-carrito-cantidad">
                        <button type="button" onClick={() => updateQuantity(it.product_id, -1)} aria-label="Menos">−</button>
                        <span>{it.quantity}</span>
                        <button type="button" onClick={() => updateQuantity(it.product_id, 1)} aria-label="Más">+</button>
                      </div>
                      <span className="facturar-carrito-precio">
                        ${(it.quantity * it.unit_price).toLocaleString('es-CO')}
                      </span>
                      <button type="button" className="facturar-carrito-quitar" onClick={() => removeFromCart(it.product_id)} aria-label="Quitar">✕</button>
                    </li>
                  ))}
                </ul>
                <div className="facturar-detalle-pago">
                  <div className="facturar-detalle-linea">
                    <span>Total productos</span>
                    <span>{totalPcs} und</span>
                  </div>
                  <div className="facturar-detalle-linea">
                    <span>Subtotal</span>
                    <span>${subtotal.toLocaleString('es-CO')}</span>
                  </div>
                  <div className="facturar-detalle-linea">
                    <span>Descuento</span>
                    <span>${discount.toLocaleString('es-CO')}</span>
                  </div>
                  <div className="facturar-detalle-linea">
                    <span>Impuesto</span>
                    <span>${taxTotal.toLocaleString('es-CO')}</span>
                  </div>
                  <div className="facturar-detalle-linea facturar-total-linea">
                    <span>Total</span>
                    <span>${totalCart.toLocaleString('es-CO')}</span>
                  </div>
                </div>
                <div className="facturar-panel-botones">
                  <button type="button" className="facturar-btn-secundario" onClick={clearOrder}>
                    Eliminar pedido
                  </button>
                  <button type="button" className="facturar-btn-secundario">
                    Guardar pedido
                  </button>
                  <button
                    type="button"
                    className="facturar-btn-registrar"
                    onClick={handleRegisterSale}
                    disabled={saving || !currentShiftId}
                  >
                    {saving ? 'Registrando...' : 'Continuar a pagar'}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Barra inferior: otras facturas */}
      {activeTab === 'facturar' && !loading && (
        <div className="facturar-barra-facturas">
          <div className="facturar-barra-facturas-inner">
            {pedidos.map((p) => {
              const itemsCount = p.cart?.length ?? 0
              const total = (p.cart ?? []).reduce((sum, it) => sum + it.quantity * it.unit_price + (it.tax_amount ?? 0) * it.quantity, 0)
              const isActive = p.id === currentPedidoId
              const num = (p.nombre.match(/\d+/) || ['1'])[0]
              return (
                <button
                  key={p.id}
                  type="button"
                  className={`facturar-factura-pill ${isActive ? 'active' : ''}`}
                  onClick={() => selectFactura(p.id)}
                >
                  <span className="facturar-factura-pill-badge">F{num}</span>
                  <div className="facturar-factura-pill-content">
                    <span className="facturar-factura-pill-nombre">{p.nombre}</span>
                    <span className="facturar-factura-pill-info">
                      {itemsCount} {itemsCount === 1 ? 'producto' : 'productos'} · ${total.toLocaleString('es-CO')}
                    </span>
                  </div>
                  {pedidos.length > 1 && (
                    <button
                      type="button"
                      className="facturar-factura-pill-cerrar"
                      onClick={(e) => { e.stopPropagation(); removeFactura(p.id); }}
                      aria-label="Cerrar factura"
                    >
                      ✕
                    </button>
                  )}
                </button>
              )
            })}
            <button
              type="button"
              className="facturar-factura-pill nueva"
              onClick={addNuevaFactura}
              aria-label="Nueva factura"
            >
              <Plus size={24} strokeWidth={2.5} />
            </button>
          </div>
        </div>
      )}

        </>
      )}
    </div>
  )
}
