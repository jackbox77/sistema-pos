import { createContext, useContext, useState, useCallback, useEffect, Component } from 'react'
import { Outlet } from 'react-router-dom'
import { getCategoriesWithProductsUseCase, registerSaleUseCase } from '../../feature/pos/use-case'
import { getCurrentShiftUseCase } from '../../feature/shifts/use-case'
import './PosLayout.css'

const PosContext = createContext(null)

class PosErrorBoundary extends Component {
  state = { hasError: false, error: null }
  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }
  render() {
    if (this.state.hasError && this.state.error) {
      return (
        <div style={{ padding: 24, background: '#fef2f2', borderRadius: 8, margin: 16 }}>
          <h3 style={{ margin: '0 0 12px 0', color: '#b91c1c' }}>Error en POS</h3>
          <pre style={{ margin: 0, fontSize: 13, overflow: 'auto' }}>{this.state.error.message}</pre>
          <button
            type="button"
            onClick={() => this.setState({ hasError: false, error: null })}
            style={{ marginTop: 12, padding: '8px 16px' }}
          >
            Reintentar
          </button>
        </div>
      )
    }
    return this.props.children
  }
}

export function usePos() {
  const ctx = useContext(PosContext)
  if (!ctx) throw new Error('usePos debe usarse dentro de PosLayout')
  return ctx
}

export default function PosLayout() {
  const [categoriesWithProducts, setCategoriesWithProducts] = useState([])
  const [currentShiftId, setCurrentShiftId] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const loadData = useCallback(async () => {
    setError(null)
    setLoading(true)
    try {
      const [categoriesRes, shiftRes] = await Promise.all([
        getCategoriesWithProductsUseCase(),
        getCurrentShiftUseCase(),
      ])
      if (categoriesRes?.success && Array.isArray(categoriesRes?.data)) {
        setCategoriesWithProducts(categoriesRes.data)
      } else {
        setCategoriesWithProducts([])
      }
      setCurrentShiftId(shiftRes?.data?.id ?? null)
    } catch (err) {
      setError(err?.message ?? 'No se pudo cargar el POS')
      setCategoriesWithProducts([])
      setCurrentShiftId(null)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadData()
  }, [loadData])

  const registerSale = useCallback(
    async (body) => {
      if (!currentShiftId) throw new Error('No hay turno abierto. Abre un turno en Turnos.')
      return registerSaleUseCase({ ...body, shift_id: currentShiftId })
    },
    [currentShiftId]
  )

  const value = {
    categoriesWithProducts,
    currentShiftId,
    loading,
    error,
    loadData,
    registerSale,
  }

  return (
    <PosContext.Provider value={value}>
      <div className="pos-layout">
        <PosErrorBoundary>
          <Outlet />
        </PosErrorBoundary>
      </div>
    </PosContext.Provider>
  )
}
