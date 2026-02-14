import { createContext, useContext, useState } from 'react'
import { Outlet } from 'react-router-dom'

const facturasVentasIniciales = [
  { id: 1, numero: 'FV-001', cliente: 'Distribuidora López S.A.S.', fecha: '2026-02-05', items: [], total: 1250000, estado: 'Pagada' },
  { id: 2, numero: 'FV-002', cliente: 'Tienda El Ahorro', fecha: '2026-02-04', items: [], total: 580000, estado: 'Pendiente' },
]

const IngresosContext = createContext(null)

export function useIngresos() {
  const ctx = useContext(IngresosContext)
  if (!ctx) throw new Error('useIngresos debe usarse dentro de IngresosLayout')
  return ctx
}

export default function IngresosLayout() {
  const [facturasVentas, setFacturasVentas] = useState(facturasVentasIniciales)

  const agregarFacturaVenta = (data) => {
    setFacturasVentas((p) => [...p, { ...data, id: Date.now() }])
  }

  const actualizarFacturaVenta = (id, data) => {
    setFacturasVentas((p) => p.map((f) => (f.id === Number(id) ? { ...f, ...data } : f)))
  }

  const eliminarFacturaVenta = (id) => {
    setFacturasVentas((p) => p.filter((f) => f.id !== id))
  }

  const value = {
    facturasVentas,
    setFacturasVentas,
    agregarFacturaVenta,
    actualizarFacturaVenta,
    eliminarFacturaVenta,
  }

  return (
    <IngresosContext.Provider value={value}>
      <Outlet />
    </IngresosContext.Provider>
  )
}
