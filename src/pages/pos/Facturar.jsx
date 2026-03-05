import { useState, useMemo, useCallback, useEffect, useRef } from 'react'
import { Plus, Minus, User, UserPlus, Search, ChevronDown, X, RefreshCw, ShoppingBag } from 'lucide-react'
import { createLoyalCustomerUseCase } from '../../feature/masters/loyal-customers/use-case'
import { usePos } from './PosLayout'
import ApiErrorRecargar from '../../components/ApiErrorRecargar/ApiErrorRecargar'
import ComprobanteVentaDiarias from './ComprobanteVentaDiarias'
import './Facturar.css'

function createNuevaFactura(pedidos) {
  const n = pedidos.length + 1
  const id = `f-${Date.now()}-${n}`
  const nombre = `Factura ${n}`
  return { id, nombre, cart: [], customerId: '', payments: [], customTaxStr: '', orderType: 'dine_in' }
}

const POS_TABS = [
  { id: 'facturar', label: 'Facturar' },
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

const TIPOS_DOCUMENTO = ['NIT', 'Cédula de ciudadanía', 'Cédula de extranjería', 'Pasaporte', 'Otro']

const TIPO_DOC_UI_TO_API = {
  'Cédula de ciudadanía': 'CC',
  'Cédula de extranjería': 'CE',
  Pasaporte: 'PASSPORT',
  Otro: 'OTHER',
  NIT: 'OTHER',
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

export default function Facturar() {
  const { categoriesWithProducts, paymentMethods, customers, taxes, currentShiftId, loading, error, loadData, registerSale, lastUpdate } = usePos()
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
  const [confirmAction, setConfirmAction] = useState(null)
  const [showValidationPopup, setShowValidationPopup] = useState(false)
  const [showNewCustomerModal, setShowNewCustomerModal] = useState(false)
  const [customerSearch, setCustomerSearch] = useState('')
  const [showCustomerDropdown, setShowCustomerDropdown] = useState(false)
  const [newCustomerError, setNewCustomerError] = useState(null)
  const customerDropdownRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (customerDropdownRef.current && !customerDropdownRef.current.contains(e.target)) {
        setShowCustomerDropdown(false)
      }
    }
    if (showCustomerDropdown) document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [showCustomerDropdown])

  const currentPedido = useMemo(
    () => pedidos.find((p) => p.id === currentPedidoId) ?? pedidos[0],
    [pedidos, currentPedidoId]
  )
  const selectedCustomer = customers.find(c => String(c.id) === String(currentPedido?.customerId))
  const customerName = selectedCustomer?.full_name || selectedCustomer?.name || 'Consumidor final'
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

  const updateCurrentPedidoField = useCallback((field, value) => {
    setPedidos((prev) =>
      prev.map((p) =>
        p.id === currentPedido?.id ? { ...p, [field]: value } : p
      )
    )
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
      return [...prev, { product_id: id, product_name: product.name ?? product.code ?? 'Producto', quantity: 1, unit_price, tax_amount, tax_id: '' }]
    })
  }

  const updateCartItemTax = useCallback((product_id, tax_id) => {
    updateCurrentPedidoCart((prev) =>
      prev.map((it) =>
        it.product_id === product_id ? { ...it, tax_id: tax_id || '' } : it
      )
    )
  }, [updateCurrentPedidoCart])

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
    const item = cart.find(x => x.product_id === product_id)
    if (!item) return
    setConfirmAction({
      title: 'Quitar producto',
      message: `¿Estás seguro de que deseas quitar "${item.product_name}" del pedido?`,
      onConfirm: () => {
        updateCurrentPedidoCart((prev) => prev.filter((x) => x.product_id !== product_id))
        setConfirmAction(null)
      }
    })
  }

  const clearOrder = () => {
    if (cart.length === 0) return
    setConfirmAction({
      title: 'Eliminar pedido',
      message: '¿Estás seguro de que deseas eliminar todos los productos de este pedido? Esta acción no se puede deshacer.',
      onConfirm: () => {
        updateCurrentPedidoCart(() => [])
        setConfirmAction(null)
      }
    })
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
    setConfirmAction({
      title: 'Eliminar factura',
      message: '¿Estás seguro de que deseas cerrar y eliminar esta factura? Esta acción no se puede deshacer.',
      onConfirm: () => {
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
        setConfirmAction(null)
      }
    })
  }

  const formatPrecioPos = (val) => {
    const raw = val ?? 0
    const num = typeof raw === 'string'
      ? parseFloat(String(raw).replace(/\/und$/i, '').replace(/,/g, '')) || 0
      : Number(raw) || 0
    return `$${num.toLocaleString('es-CO')}`
  }

  /** Impuesto efectivo por unidad para un item: si tiene tax_id usa ese %, sino el tax_amount del producto */
  const getItemTaxPerUnit = useCallback((it) => {
    if (taxes?.length > 0 && it.tax_id) {
      const tax = taxes.find(t => String(t.id) === String(it.tax_id))
      if (tax) return it.unit_price * (Number(tax.percentage) / 100)
    }
    return Number(it.tax_amount ?? 0)
  }, [taxes])

  const subtotal = cart.reduce((sum, it) => sum + it.quantity * it.unit_price, 0)
  const discount = 0

  const taxTotal = cart.reduce((sum, it) => sum + getItemTaxPerUnit(it) * it.quantity, 0)

  const totalCart = subtotal - discount + taxTotal
  const totalPcs = cart.reduce((sum, it) => sum + it.quantity, 0)

  const payments = currentPedido?.payments ?? []
  const paymentsSum = payments.reduce((sum, p) => sum + (Number(p.amount) || 0), 0)
  const allHaveMethod = payments.length === 0 || payments.every(p => p.payment_method_id)
  const paymentsValid = payments.length > 0 && allHaveMethod && Math.abs(paymentsSum - totalCart) < 0.01

  const addPayment = useCallback(() => {
    const activeMethods = paymentMethods?.filter(p => p.status !== 'inactive') ?? []
    const firstId = activeMethods[0]?.id ?? ''
    const remainder = Math.max(0, totalCart - paymentsSum)
    updateCurrentPedidoField('payments', [...payments, { payment_method_id: firstId, amount: remainder || 0 }])
  }, [paymentMethods, payments, paymentsSum, totalCart, updateCurrentPedidoField])

  const updatePayment = useCallback((index, field, value) => {
    const next = [...payments]
    if (!next[index]) return
    next[index] = { ...next[index], [field]: value }
    updateCurrentPedidoField('payments', next)
  }, [payments, updateCurrentPedidoField])

  const removePayment = useCallback((index) => {
    updateCurrentPedidoField('payments', payments.filter((_, i) => i !== index))
  }, [payments, updateCurrentPedidoField])

  const handleRegisterSale = async () => {
    if (!currentShiftId) {
      setSaleError('No hay turno abierto. Abre un turno en Turnos.')
      return
    }
    if (cart.length === 0) {
      setSaleError('Agrega al menos un producto al pedido.')
      return
    }
    if (!paymentsValid) {
      setSaleError('Configura los métodos de pago. La suma debe coincidir con el total.')
      return
    }
    setSaleError('')
    setShowValidationPopup(true)
  }

  const confirmRegisterSale = async () => {
    setShowValidationPopup(false)
    setSaleError('')
    setSaving(true)
    try {
      const paymentPayload = payments
        .filter(p => p.payment_method_id && (Number(p.amount) || 0) > 0)
        .map(p => ({ payment_method_id: p.payment_method_id, amount: Number(p.amount) || 0 }))
      await registerSale({
        items: cart.map((it) => ({
          product_id: it.product_id,
          quantity: it.quantity,
          unit_price: it.unit_price,
          tax_amount: getItemTaxPerUnit(it),
        })),
        customer_id: currentPedido?.customerId || undefined,
        payments: paymentPayload,
        payment_method_id: paymentPayload[0]?.payment_method_id,
        tax_total: taxTotal,
        total: totalCart
      })

      setPedidos((prev) => {
        const next = prev.filter((p) => p.id !== currentPedido.id)
        if (next.length === 0) {
          return [createNuevaFactura([])]
        }
        return next
      })
      if (currentPedidoId === currentPedido.id) {
        setCurrentPedidoId(null)
      }

    } catch (err) {
      setSaleError(err?.message ?? 'No se pudo registrar la venta.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className={`facturar-page ${activeTab === 'facturar' ? 'facturar-page--con-barra' : ''}`}>
      <div className="facturar-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <div className="pos-tabs" style={{ marginBottom: 0 }}>
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

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '13px' }}>
          {lastUpdate && (
            <span style={{ color: '#6b7280' }}>
              Actualizado: {lastUpdate.toLocaleTimeString()}
            </span>
          )}
      <button
            type="button"
            onClick={loadData}
            disabled={loading}
            style={{
              display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 12px',
              background: '#fff', border: '1px solid #d1d5db', borderRadius: '6px',
              color: '#374151', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1,
              transition: 'all 0.2s ease', fontWeight: 500
            }}
            onMouseEnter={(e) => { if (!loading) e.currentTarget.style.background = '#f3f4f6' }}
            onMouseLeave={(e) => e.currentTarget.style.background = '#fff'}
            title="Sincronizar Maestro (Productos, Clientes, Impuestos)"
          >
            <RefreshCw size={14} className={loading ? "animate-spin" : ""} style={{ animation: loading ? 'spin 1s linear infinite' : 'none' }} />
            <span>Sincronizar</span>
      </button>

          <style>
            {`
              @keyframes spin {
                from { transform: rotate(0deg); }
                to { transform: rotate(360deg); }
              }
            `}
          </style>
        </div>
      </div>

      {activeTab === 'comprobante' && <ComprobanteVentaDiarias />}

      {activeTab === 'facturar' && (
        <>
          {error && <ApiErrorRecargar message={error} onRecargar={loadData} loading={loading} />}

          {loading ? (
            <div className="facturar-grid">
              <div className="facturar-productos">
                <div className="facturar-filtros">
                  <div className="facturar-categorias-filtro">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div key={i} className="facturar-skeleton-pill" style={{ width: i === 1 ? 80 : 70 + i * 18 }} />
                    ))}
                  </div>
                  <div className="facturar-skeleton-input" />
                  <p className="facturar-skeleton-actualizado">Actualizado —</p>
                </div>
                <div className="facturar-productos-scroll">
                <div className="facturar-productos-grid">
                  {Array.from({ length: 12 }, (_, i) => (
                    <div key={i} className="facturar-skeleton-card">
                      <div className="facturar-skeleton-card-image" />
                      <div className="facturar-skeleton-card-line" style={{ width: '90%' }} />
                      <div className="facturar-skeleton-card-line facturar-skeleton-card-line--short" />
                      <div className="facturar-skeleton-card-line facturar-skeleton-card-line--price" />
                    </div>
                  ))}
                </div>
                </div>
              </div>
              <div className="facturar-panel-factura" style={{ minHeight: 320 }} />
            </div>
          ) : (
            <div className="facturar-grid">
              {/* Izquierda: categorías + productos + barra Factura 1 (solo en este espacio) */}
              <div className="facturar-col-productos">
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

                <div className="facturar-productos-scroll">
                <div className="facturar-productos-grid">
                  {filteredProducts.length === 0 ? (
                    <p className="facturar-empty">
                      {categoriesAndProducts.length === 0
                        ? 'No hay categorías con productos. Carga productos en Maestros.'
                        : 'No hay productos que coincidan con el filtro o la búsqueda.'}
                    </p>
                  ) : (
                    filteredProducts.map((p) => {
                      const cartItem = cart.find(it => it.product_id === p.id)
                      const quantityInCart = cartItem ? cartItem.quantity : 0

                      return (
                        <div key={p.id} className={`facturar-producto-card ${quantityInCart > 0 ? 'active' : ''}`} onClick={() => quantityInCart === 0 && addToCart(p)}>
                          <div className="facturar-producto-img-container">
                            {p.image_url ? (
                              <img src={p.image_url} alt={p.name} className="facturar-producto-img" />
                            ) : (
                              <div className="facturar-producto-inicial">
                                {getProductInitial(p.name ?? p.code)}
                              </div>
                            )}
                          </div>
                          <div className="facturar-producto-info">
                            <h4 className="facturar-producto-nombre">{p.name ?? p.code ?? 'Producto'}</h4>
                            <span className="facturar-producto-categoria">{p.categoryName || 'General'}</span>
                            <span className="facturar-producto-precio" title={formatPrecioPos(p.price ?? p.unit_price)}>
                              {formatPrecioPos(p.price ?? p.unit_price)}
                            </span>
                          </div>

                          <div className="facturar-producto-footer">
                            {quantityInCart > 0 ? (
                              <div className="facturar-producto-counter" onClick={(e) => e.stopPropagation()}>
                                <button type="button" onClick={() => updateQuantity(p.id, -1)} aria-label="Menos">
                                  <Minus size={14} />
                                </button>
                                <span>{quantityInCart}</span>
                                <button type="button" onClick={() => updateQuantity(p.id, 1)} aria-label="Más">
                                  <Plus size={14} />
                                </button>
                              </div>
                            ) : (
                              <button
                                type="button"
                                className="facturar-producto-btn-mas"
                                onClick={(e) => { e.stopPropagation(); addToCart(p); }}
                                aria-label="Agregar a la factura"
                              >
                                <Plus size={20} strokeWidth={2.5} />
                              </button>
                            )}
                          </div>
                        </div>
                      )
                    })
                  )}
                </div>
                </div>
              </div>

              {/* Barra Factura 1: solo en columna de productos */}
              <div className="facturar-barra-facturas">
                <div className="facturar-barra-facturas-inner">
                  {pedidos.map((p) => {
                    const itemsCount = p.cart?.length ?? 0
                    const total = (p.cart ?? []).reduce((sum, it) => sum + it.quantity * it.unit_price + getItemTaxPerUnit(it) * it.quantity, 0)
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
                    <Plus size={18} strokeWidth={2.5} />
                  </button>
                </div>
              </div>
              </div>

              {/* Derecha: panel de facturación */}
              <div className="facturar-panel-factura">
                <div className="facturar-order-types">
                  <button
                    type="button"
                    className={`facturar-order-type-btn ${currentPedido?.orderType === 'dine_in' ? 'active' : ''}`}
                    onClick={() => updateCurrentPedidoField('orderType', 'dine_in')}
                  >
                    Local
                  </button>
                  <button
                    type="button"
                    className={`facturar-order-type-btn ${currentPedido?.orderType === 'take_away' ? 'active' : ''}`}
                    onClick={() => updateCurrentPedidoField('orderType', 'take_away')}
                  >
                    Delivery
                  </button>
                </div>

                <div className="facturar-carrito-seccion">
                  {cart.length === 0 ? (
                    <div className="facturar-no-order">
                      <div className="facturar-no-order-icon-wrapper">
                        <ShoppingBag size={48} />
                        <div className="facturar-no-order-subicon">
                          <Search size={16} />
                        </div>
                      </div>
                      <h4>Sin pedidos</h4>
                      <p>Toca un producto para añadirlo al pedido</p>
                    </div>
                  ) : (
                    <ul className="facturar-carrito-lista">
                      {cart.map((it) => (
                        <li key={it.product_id} className="facturar-carrito-item">
                          <div className="facturar-carrito-item-main">
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
                          </div>
                          {taxes && taxes.length > 0 && (
                            <div className="facturar-carrito-item-impuesto">
                              <label>Impuesto:</label>
                              <select
                                value={it.tax_id ?? ''}
                                onChange={(e) => updateCartItemTax(it.product_id, e.target.value)}
                                className="facturar-carrito-impuesto-select"
                              >
                                <option value="">Por defecto</option>
                                {taxes.filter(t => t.name && t.name.trim() !== '').map((t) => (
                                  <option key={t.id} value={t.id}>
                                    {t.name} ({t.percentage}%)
                                  </option>
                                ))}
                              </select>
                            </div>
                          )}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                <div className="facturar-detalle-pago">
                  <div className="facturar-detalle-linea facturar-cliente-pago" style={{ borderBottom: '1px solid #e5e7eb', paddingBottom: '8px', marginBottom: '8px', flexWrap: 'wrap', gap: '6px' }}>
                    <div style={{ width: '100%', position: 'relative' }} ref={customerDropdownRef}>
                      <label style={{ fontSize: '12px', color: '#6b7280', display: 'block', marginBottom: '4px' }}>Cliente</label>
                      <div
                        onClick={() => { setShowCustomerDropdown(!showCustomerDropdown); setCustomerSearch(''); }}
                        style={{
                          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                          width: '100%', minHeight: '36px', padding: '6px 10px', background: '#fff', border: '1px solid #d1d5db',
                          borderRadius: '6px', cursor: 'pointer', fontSize: '13px', color: '#111827'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', overflow: 'hidden' }}>
                          <User size={16} color="#6b7280" />
                          <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {selectedCustomer ? customerName : 'Consumidor final'}
                          </span>
                        </div>
                        {selectedCustomer ? (
                          <button
                            type="button"
                            onClick={(e) => { e.stopPropagation(); updateCurrentPedidoField('customerId', '') }}
                            style={{ background: 'none', border: 'none', display: 'flex', alignItems: 'center', color: '#9ca3af', cursor: 'pointer', padding: '2px' }}
                          >
                            <X size={14} />
                          </button>
                        ) : (
                          <ChevronDown size={14} color="#9ca3af" />
                        )}
                      </div>

                      {showCustomerDropdown && (
                        <div style={{
                          position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 50, marginTop: '4px',
                          background: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px',
                          boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05)',
                        }}>
                          <div style={{ padding: '8px', borderBottom: '1px solid #f3f4f6' }}>
                            <div style={{ position: 'relative' }}>
                              <Search size={14} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
                              <input
                                type="text"
                                placeholder="Buscar cliente..."
                                value={customerSearch}
                                onChange={(e) => setCustomerSearch(e.target.value)}
                                autoFocus
                                style={{ width: '100%', padding: '8px 8px 8px 30px', border: '1px solid #e5e7eb', borderRadius: '6px', fontSize: '13px' }}
                                onClick={(e) => e.stopPropagation()}
                              />
                            </div>
                          </div>
                          <ul style={{ listStyle: 'none', padding: 0, margin: 0, maxHeight: '200px', overflowY: 'auto' }}>
                            {customers.filter(c => ((c.full_name || c.name || '').toLowerCase().includes(customerSearch.toLowerCase()))).map(c => (
                              <li
                                key={c.id}
                                onClick={() => { updateCurrentPedidoField('customerId', String(c.id)); setShowCustomerDropdown(false); }}
                                style={{ padding: '8px 12px', fontSize: '13px', cursor: 'pointer', borderBottom: '1px solid #f9fafb', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
                                onMouseEnter={(e) => e.target.style.background = '#f3f4f6'}
                                onMouseLeave={(e) => e.target.style.background = 'transparent'}
                              >
                                {c.full_name || c.name}
                              </li>
                            ))}
                          </ul>
                          <div style={{ padding: '10px', borderTop: '1px solid #e5e7eb', background: '#f9fafb', borderBottomLeftRadius: '8px', borderBottomRightRadius: '8px' }}>
                            <button
                              type="button"
                              onClick={() => { setShowNewCustomerModal(true); setShowCustomerDropdown(false); }}
                              style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', background: 'none', border: 'none', color: '#4f46e5', fontSize: '13px', fontWeight: 500, cursor: 'pointer' }}
                            >
                              <UserPlus size={14} /> Nuevo cliente
                            </button>
                          </div>
                        </div>
                      )}
                    </div>

                    <div style={{ width: '100%', marginTop: '8px' }}>
                      <label style={{ fontSize: '12px', color: '#6b7280', display: 'block', marginBottom: '4px' }}>Métodos de pago</label>
                      <div className="facturar-payments-list">
                        {payments.map((p, idx) => (
                          <div key={idx} className="facturar-payment-row">
                            <select
                              value={p.payment_method_id ?? ''}
                              onChange={(e) => updatePayment(idx, 'payment_method_id', e.target.value || '')}
                              className="facturar-payment-method-select"
                            >
                              <option value="">Seleccionar</option>
                              {Array.isArray(paymentMethods) && paymentMethods
                                .filter(pm => pm.status !== 'inactive')
                                .map((pm) => (
                                  <option key={pm.id} value={pm.id}>{pm.method_name ?? pm.name ?? pm.code ?? 'Método'}</option>
                                ))}
                            </select>
                            <input
                              type="number"
                              min="0"
                              step="1"
                              placeholder="Monto"
                              value={p.amount != null ? p.amount : ''}
                              onChange={(e) => updatePayment(idx, 'amount', e.target.value ? Number(e.target.value) : 0)}
                              className="facturar-payment-amount-input"
                            />
                            {payments.length > 1 && (
                              <button
                                type="button"
                                className="facturar-payment-remove"
                                onClick={() => removePayment(idx)}
                                aria-label="Quitar método"
                              >
                                ✕
                              </button>
                            )}
                          </div>
                        ))}
                        <button
                          type="button"
                          className="facturar-payment-add"
                          onClick={addPayment}
                          disabled={!paymentMethods?.length || paymentMethods.every(p => p.status === 'inactive')}
                        >
                          <Plus size={14} /> Añadir método
                        </button>
                      </div>
                      {payments.length > 0 && !paymentsValid && (
                        <p className="facturar-payments-error">
                          Suma (${paymentsSum.toLocaleString('es-CO')}) debe ser ${totalCart.toLocaleString('es-CO')}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="facturar-detalle-linea">
                    <span>Subtotal</span>
                    <span>${subtotal.toLocaleString('es-CO')}</span>
                  </div>
                  <div className="facturar-detalle-linea">
                    <span>Impuestos</span>
                    <span>${taxTotal.toLocaleString('es-CO')}</span>
                  </div>
                  <div className="facturar-detalle-linea">
                    <span>Descuento</span>
                    <span>${discount.toLocaleString('es-CO')}</span>
                  </div>
                  <div className="facturar-detalle-linea facturar-total-linea">
                    <span>Total</span>
                    <span>${totalCart.toLocaleString('es-CO')}</span>
                  </div>
                </div>

                <div className="facturar-panel-botones">
                  <button
                    type="button"
                    className="facturar-btn-registrar"
                    onClick={handleRegisterSale}
                    disabled={cart.length === 0 || saving || !currentShiftId || !paymentsValid}
                    style={{ width: '100%', padding: '16px' }}
                  >
                    {saving ? 'Registrando...' : 'Procesar Pago'}
                  </button>
                  {cart.length > 0 && (
                    <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
                      <button type="button" className="facturar-btn-borrar" onClick={clearOrder} style={{ flex: 1, padding: '10px' }}>
                        Borrar
                      </button>
                      <button type="button" className="facturar-btn-guardar" style={{ flex: 1, padding: '10px' }}>
                        Guardar
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

        </>
      )}

      {confirmAction && (
        <ModalConfirmarAccion
          titulo={confirmAction.title}
          mensaje={confirmAction.message}
          onClose={() => setConfirmAction(null)}
          onConfirmar={confirmAction.onConfirm}
        />
      )}

      {showValidationPopup && (
        <ModalValidarTransaccion
          pedido={currentPedido}
          subtotal={subtotal}
          taxTotal={taxTotal}
          totalCart={totalCart}
          customers={customers}
          paymentMethods={paymentMethods}
          onClose={() => setShowValidationPopup(false)}
          onConfirm={confirmRegisterSale}
        />
      )}

      {showNewCustomerModal && (
        <ModalFormClienteRapido
          tiposDocumento={TIPOS_DOCUMENTO}
          onClose={() => { setShowNewCustomerModal(false); setNewCustomerError(null); }}
          error={newCustomerError}
          onGuardar={async (formData) => {
            setNewCustomerError(null)
            try {
              const res = await createLoyalCustomerUseCase(mapFormToApi(formData))
              await loadData() // Refrescar lista de clientes en el contexto
              const newId = res?.data?.id ?? res?.id
              if (newId) {
                updateCurrentPedidoField('customerId', String(newId))
              }
              setShowNewCustomerModal(false)
            } catch (err) {
              setNewCustomerError(err?.message ?? 'Error al crear cliente')
            }
          }}
        />
      )}
    </div>
  )
}

function ModalFormClienteRapido({ tiposDocumento, onClose, onGuardar, error: apiError }) {
  const [tipoDocumento, setTipoDocumento] = useState('Cédula de ciudadanía')
  const [numeroDocumento, setNumeroDocumento] = useState('')
  const [nombre, setNombre] = useState('')
  const [email, setEmail] = useState('')
  const [saving, setSaving] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      await onGuardar({ tipoDocumento, numeroDocumento, nombre, email, estado: 'Activo' })
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="form-overlay" onClick={onClose} style={{ zIndex: 10000 }}>
      <div className="form-modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '400px' }}>
        <div className="form-header">
          <h3>Nuevo cliente</h3>
          <button className="form-close" onClick={onClose} aria-label="Cerrar">✕</button>
        </div>
        <form onSubmit={handleSubmit} className="form-body">
          {apiError && (
            <p style={{ color: '#dc2626', fontSize: '13px', marginBottom: '12px' }}>{apiError}</p>
          )}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div className="form-field">
              <label>Tipo de documento *</label>
              <select value={tipoDocumento} onChange={(e) => setTipoDocumento(e.target.value)} required style={{ fontSize: '14px' }}>
                {tiposDocumento.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
            <div className="form-field">
              <label>Número de documento *</label>
              <input
                type="text"
                value={numeroDocumento}
                onChange={(e) => setNumeroDocumento(e.target.value)}
                placeholder="Ej: 10203040"
                required
                style={{ fontSize: '14px' }}
              />
            </div>
            <div className="form-field">
              <label>Nombre completo *</label>
              <input
                type="text"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                placeholder="Nombre del cliente"
                required
                style={{ fontSize: '14px' }}
              />
            </div>
            <div className="form-field">
              <label>Email (opcional)</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="cliente@correo.com"
                style={{ fontSize: '14px' }}
              />
            </div>
          </div>
          <div className="form-footer" style={{ marginTop: '20px' }}>
            <button type="button" className="form-btn-secondary" onClick={onClose}>Cancelar</button>
            <button type="submit" className="form-btn-primary" disabled={saving}>
              {saving ? 'Guardando...' : 'Crear cliente'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

function ModalValidarTransaccion({ pedido, subtotal, taxTotal, totalCart, customers, paymentMethods, onClose, onConfirm }) {
  const customer = customers.find(c => String(c.id) === String(pedido.customerId))
  const paymentsList = pedido?.payments ?? []

  return (
    <div className="form-overlay" onClick={onClose} style={{ zIndex: 9999 }}>
      <div className="form-modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '420px' }}>
        <div className="form-header">
          <h3>Validar transacción</h3>
          <button className="form-close" onClick={onClose} aria-label="Cerrar">✕</button>
        </div>
        <div className="form-body">
          <div style={{ background: '#f9fafb', padding: '16px', borderRadius: '8px', marginBottom: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ color: '#6b7280' }}>Cliente:</span>
              <strong style={{ color: '#111827' }}>{customer ? (customer.full_name ?? customer.name) : 'Consumidor Final'}</strong>
            </div>
            <div style={{ marginBottom: '8px' }}>
              <span style={{ color: '#6b7280', display: 'block', marginBottom: '4px' }}>Métodos de pago:</span>
              {paymentsList.length > 0 ? (
                paymentsList.filter(p => p.payment_method_id).map((p, i) => {
                  const pm = paymentMethods?.find(m => String(m.id) === String(p.payment_method_id))
                  return (
                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
                      <span style={{ color: '#374151' }}>{pm ? (pm.method_name ?? pm.name ?? pm.code) : 'Método'}</span>
                      <strong>${(Number(p.amount) || 0).toLocaleString('es-CO')}</strong>
                    </div>
                  )
                })
              ) : (
                <strong style={{ color: '#111827' }}>—</strong>
              )}
            </div>
            <hr style={{ border: 'none', borderTop: '1px solid #e5e7eb', margin: '12px 0' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
              <span style={{ color: '#6b7280' }}>Subtotal:</span>
              <span>${subtotal.toLocaleString('es-CO')}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
              <span style={{ color: '#6b7280' }}>Impuestos:</span>
              <span>${taxTotal.toLocaleString('es-CO')}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '12px', fontSize: '18px', fontWeight: 'bold' }}>
              <span>Total a pagar:</span>
              <span style={{ color: '#0d9488' }}>${totalCart.toLocaleString('es-CO')}</span>
            </div>
          </div>

          <div className="form-footer">
            <button type="button" className="form-btn-secondary" onClick={onClose}>
              Revisar detalles
            </button>
            <button
              type="button"
              className="form-btn-primary"
              onClick={onConfirm}
            >
              Confirmar y cobrar
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function ModalConfirmarAccion({ titulo, mensaje, onClose, onConfirmar }) {
  const [procesando, setProcesando] = useState(false)

  const handleConfirmar = async () => {
    setProcesando(true)
    try {
      await Promise.resolve(onConfirmar())
    } finally {
      if (document.body.contains(document.querySelector('.form-overlay'))) {
        setProcesando(false)
      }
    }
  }

  return (
    <div className="form-overlay" onClick={onClose}>
      <div className="form-modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '400px' }}>
        <div className="form-header">
          <h3>{titulo}</h3>
          <button className="form-close" onClick={onClose} aria-label="Cerrar" disabled={procesando}>✕</button>
        </div>
        <div className="form-body">
          <p style={{ marginBottom: '20px', color: '#6b7280' }}>
            {mensaje}
          </p>
          <div className="form-footer">
            <button type="button" className="form-btn-secondary" onClick={onClose} disabled={procesando}>
              Cancelar
            </button>
            <button
              type="button"
              className="form-btn-primary"
              onClick={handleConfirmar}
              disabled={procesando}
              style={{ background: '#dc2626' }}
            >
              {procesando ? 'Eliminando...' : 'Eliminar'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
