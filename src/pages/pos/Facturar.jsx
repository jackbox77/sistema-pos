import { useState, useMemo, useCallback, useEffect, useRef } from 'react'
import { Plus, User, UserPlus, Search, ChevronDown, X, RefreshCw } from 'lucide-react'
import { usePos } from './PosLayout'
import ApiErrorRecargar from '../../components/ApiErrorRecargar/ApiErrorRecargar'
import ComprobanteVentaDiarias from './ComprobanteVentaDiarias'
import './Facturar.css'

function createNuevaFactura(pedidos) {
  const n = pedidos.length + 1
  const id = `f-${Date.now()}-${n}`
  const nombre = `Factura ${n}`
  return { id, nombre, cart: [], customerId: '', paymentMethodId: '', customTaxStr: '' }
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
  const [customerSearch, setCustomerSearch] = useState('')
  const [showCustomerDropdown, setShowCustomerDropdown] = useState(false)
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

  const subtotal = cart.reduce((sum, it) => sum + it.quantity * it.unit_price, 0)
  const discount = 0

  let taxTotal = 0
  if (!taxes || taxes.length === 0) {
    taxTotal = 0
  } else {
    const selectedTax = taxes.find(t => String(t.id) === String(currentPedido?.customTaxStr))
    if (selectedTax) {
      taxTotal = subtotal * (Number(selectedTax.percentage) / 100)
    } else {
      taxTotal = cart.reduce((sum, it) => sum + (it.tax_amount ?? 0) * it.quantity, 0)
    }
  }

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
    setShowValidationPopup(true)
  }

  const confirmRegisterSale = async () => {
    setShowValidationPopup(false)
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
        customer_id: currentPedido?.customerId || undefined,
        payment_method_id: currentPedido?.paymentMethodId || undefined,
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
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
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
                      <div className="facturar-detalle-linea" style={{ borderBottom: '1px solid #e5e7eb', paddingBottom: '12px', marginBottom: '12px', flexWrap: 'wrap', gap: '8px' }}>
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
                                {selectedCustomer ? selectedCustomer.name : 'Consumidor final'}
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
                              position: 'absolute', top: '100%', left: 0, right: 0, marginTop: '4px',
                              background: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px',
                              boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05)',
                              zIndex: 50, display: 'flex', flexDirection: 'column'
                            }}>
                              <div style={{ padding: '8px', borderBottom: '1px solid #e5e7eb', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <Search size={14} color="#9ca3af" />
                                <input
                                  type="text"
                                  placeholder="Buscar cliente..."
                                  value={customerSearch}
                                  onChange={e => setCustomerSearch(e.target.value)}
                                  style={{ border: 'none', outline: 'none', width: '100%', fontSize: '13px' }}
                                  autoFocus
                                />
                              </div>
                              <ul style={{ listStyle: 'none', margin: 0, padding: 0, maxHeight: '200px', overflowY: 'auto' }}>
                                <li
                                  onClick={() => { updateCurrentPedidoField('customerId', ''); setShowCustomerDropdown(false); setCustomerSearch('') }}
                                  style={{ padding: '10px 12px', cursor: 'pointer', fontSize: '13px', color: '#374151', display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid #f3f4f6' }}
                                  onMouseEnter={(e) => e.currentTarget.style.background = '#f3f4f6'}
                                  onMouseLeave={(e) => e.currentTarget.style.background = 'none'}
                                >
                                  <User size={14} color="#9ca3af" /> Consumidor final
                                </li>
                                {customers.filter(c => (c.name || '').toLowerCase().includes(customerSearch.toLowerCase()) || (c.identification_number || '').includes(customerSearch)).map(c => (
                                  <li
                                    key={c.id}
                                    onClick={() => { updateCurrentPedidoField('customerId', c.id); setShowCustomerDropdown(false); setCustomerSearch('') }}
                                    style={{ padding: '10px 12px', cursor: 'pointer', fontSize: '13px', color: '#111827', display: 'flex', alignItems: 'center', gap: '10px' }}
                                    onMouseEnter={(e) => e.currentTarget.style.background = '#f3f4f6'}
                                    onMouseLeave={(e) => e.currentTarget.style.background = 'none'}
                                  >
                                    <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: '#e0e7ff', color: '#4f46e5', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 'bold', flexShrink: 0 }}>
                                      {(c.name || 'C').charAt(0).toUpperCase()}
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                                      <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{c.name}</span>
                                      {c.identification_number && <span style={{ fontSize: '11px', color: '#6b7280' }}>ID: {c.identification_number}</span>}
                                    </div>
                                  </li>
                                ))}
                              </ul>
                              <div style={{ padding: '10px', borderTop: '1px solid #e5e7eb', background: '#f9fafb', borderBottomLeftRadius: '8px', borderBottomRightRadius: '8px' }}>
                                <button type="button" style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', background: 'none', border: 'none', color: '#4f46e5', fontSize: '13px', fontWeight: 500, cursor: 'pointer' }}>
                                  <UserPlus size={14} /> Nuevo cliente
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                        <div style={{ width: '100%', marginTop: '4px' }}>
                          <label style={{ fontSize: '12px', color: '#6b7280', display: 'block', marginBottom: '4px' }}>Método de pago ({paymentMethods.length})</label>
                          <select
                            className="input-select"
                            style={{ width: '100%', minHeight: '36px', padding: '6px 10px', fontSize: '13px' }}
                            value={currentPedido?.paymentMethodId || ''}
                            onChange={(e) => updateCurrentPedidoField('paymentMethodId', e.target.value)}
                          >
                            <option value="">Efectivo (Por defecto)</option>
                            {paymentMethods.map(m => (
                              <option key={m.id} value={m.id}>{m.name}</option>
                            ))}
                          </select>
                        </div>
                      </div>

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
                      <div className="facturar-detalle-linea" style={{ alignItems: 'center' }}>
                        <span>Impuesto</span>
                        <select
                          className="input-select"
                          style={{ width: '180px', padding: '4px 8px', minHeight: '32px', fontSize: '13px' }}
                          value={currentPedido?.customTaxStr ?? ''}
                          onChange={(e) => updateCurrentPedidoField('customTaxStr', e.target.value)}
                        >
                          {(!taxes || taxes.length === 0) ? (
                            <option value="">0% (Sin impuestos en Almacén)</option>
                          ) : (
                            <>
                              <option value="">Por productos (${cart.reduce((sum, it) => sum + (it.tax_amount ?? 0) * it.quantity, 0).toLocaleString('es-CO')})</option>
                              {taxes.map(t => (
                                <option key={t.id} value={t.id}>{t.name} ({t.percentage}%)</option>
                              ))}
                            </>
                          )}
                        </select>
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
    </div>
  )
}

function ModalValidarTransaccion({ pedido, subtotal, taxTotal, totalCart, customers, paymentMethods, onClose, onConfirm }) {
  const customer = customers.find(c => String(c.id) === String(pedido.customerId))
  const pm = paymentMethods.find(p => String(p.id) === String(pedido.paymentMethodId))

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
              <strong style={{ color: '#111827' }}>{customer ? customer.name : 'Consumidor Final'}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ color: '#6b7280' }}>Método de pago:</span>
              <strong style={{ color: '#111827' }}>{pm ? pm.name : 'Efectivo'}</strong>
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
