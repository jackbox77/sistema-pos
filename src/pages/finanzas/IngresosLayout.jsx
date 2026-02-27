import { createContext, useContext, useState, useCallback, useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import { getIncomesUseCase, createIncomeUseCase } from '../../feature/finance/Income/use-case'
import { getCurrentShiftUseCase } from '../../feature/shifts/use-case'

function formatISOToFecha(iso) {
  if (!iso) return ''
  const d = new Date(iso)
  if (isNaN(d.getTime())) return ''
  return d.toISOString().slice(0, 10)
}

function mapIncomeApiToUI(income) {
  return {
    id: income.id,
    numero: income.reference ?? income.id?.slice(0, 8) ?? '-',
    cliente: income.concept ?? '-',
    fecha: formatISOToFecha(income.created_at),
    fechaFin: '',
    items: [],
    total: income.amount ?? 0,
    estado: 'Pagada',
  }
}

const IngresosContext = createContext(null)

export function useIngresos() {
  const ctx = useContext(IngresosContext)
  if (!ctx) throw new Error('useIngresos debe usarse dentro de IngresosLayout')
  return ctx
}

export default function IngresosLayout() {
  const [facturasVentas, setFacturasVentas] = useState([])
  const [currentShiftId, setCurrentShiftId] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const loadIncomes = useCallback(async () => {
    setError(null)
    setLoading(true)
    try {
      const shiftRes = await getCurrentShiftUseCase()
      const shiftId = shiftRes?.data?.id ?? null
      setCurrentShiftId(shiftId)
      if (!shiftId) {
        setFacturasVentas([])
        return
      }
      const res = await getIncomesUseCase(shiftId, 1, 100)
      if (res?.success && Array.isArray(res?.data?.data)) {
        setFacturasVentas(res.data.data.map(mapIncomeApiToUI))
      } else {
        setFacturasVentas([])
      }
    } catch (err) {
      setError(err?.message ?? 'No se pudieron cargar los ingresos')
      setFacturasVentas([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadIncomes()
  }, [loadIncomes])

  const agregarFacturaVenta = useCallback(
    async (data) => {
      const shiftId = currentShiftId
      if (!shiftId) {
        const msg = 'No hay turno abierto. Abre un turno para registrar ingresos.'
        setError(msg)
        throw new Error(msg)
      }
      setError(null)
      try {
        await createIncomeUseCase({
          shift_id: shiftId,
          amount: Number(data.total) || 0,
          concept: data.cliente ?? '',
          reference: data.numero ?? '',
        })
        await loadIncomes()
      } catch (err) {
        const msg = err?.message ?? 'No se pudo registrar el ingreso'
        setError(msg)
        throw err
      }
    },
    [currentShiftId, loadIncomes]
  )

  const actualizarFacturaVenta = useCallback(() => {
    // La API de ingresos no expone actualización; se mantiene por compatibilidad con la UI
  }, [])

  const eliminarFacturaVenta = useCallback(() => {
    // La API de ingresos no expone eliminación; se mantiene por compatibilidad con la UI
  }, [])

  const value = {
    facturasVentas,
    setFacturasVentas,
    agregarFacturaVenta,
    actualizarFacturaVenta,
    eliminarFacturaVenta,
    loading,
    error,
    loadIncomes,
    currentShiftId,
  }

  return (
    <IngresosContext.Provider value={value}>
      <Outlet />
    </IngresosContext.Provider>
  )
}
