import { createContext, useContext, useState } from 'react'
import { Outlet } from 'react-router-dom'

const facturasIniciales = [
  { id: 1, numero: 'FV-001', proveedor: 'Distribuidora Central', fecha: '2025-02-01', total: 1250000, estado: 'Pagada' },
  { id: 2, numero: 'FV-002', proveedor: 'Bebidas y Más', fecha: '2025-02-05', total: 890000, estado: 'Pendiente' },
]

const documentosIniciales = [
  { id: 1, numero: 'DOC-001', descripcion: 'Recibo de servicios', fecha: '2025-02-03', monto: 150000, proveedor: 'Servicios varios' },
]

const pagosIniciales = [
  { id: 1, numero: 'PAG-001', beneficiario: 'Distribuidora Central', fecha: '2025-02-02', monto: 1250000, metodo: 'Transferencia' },
]

const ordenesIniciales = [
  { id: 1, numero: 'OC-001', proveedor: 'Bebidas y Más', fecha: '2025-02-06', total: 450000, estado: 'Enviada' },
]

const GastosContext = createContext(null)

export function useGastos() {
  const ctx = useContext(GastosContext)
  if (!ctx) throw new Error('useGastos debe usarse dentro de GastosLayout')
  return ctx
}

export default function GastosLayout() {
  const [facturasCompras, setFacturasCompras] = useState(facturasIniciales)
  const [documentosSoporte, setDocumentosSoporte] = useState(documentosIniciales)
  const [pagos, setPagos] = useState(pagosIniciales)
  const [ordenesCompra, setOrdenesCompra] = useState(ordenesIniciales)

  const value = {
    facturasCompras,
    setFacturasCompras,
    documentosSoporte,
    setDocumentosSoporte,
    pagos,
    setPagos,
    ordenesCompra,
    setOrdenesCompra,
    agregarFactura: (data) => setFacturasCompras((p) => [...p, { ...data, id: Date.now() }]),
    actualizarFactura: (id, data) => setFacturasCompras((p) => p.map((f) => (f.id === Number(id) ? { ...f, ...data } : f))),
    eliminarFactura: (id) => setFacturasCompras((p) => p.filter((f) => f.id !== id)),
    agregarDocumento: (data) => setDocumentosSoporte((p) => [...p, { ...data, id: Date.now() }]),
    actualizarDocumento: (id, data) => setDocumentosSoporte((p) => p.map((d) => (d.id === Number(id) ? { ...d, ...data } : d))),
    eliminarDocumento: (id) => setDocumentosSoporte((p) => p.filter((d) => d.id !== id)),
    agregarPago: (data) => setPagos((p) => [...p, { ...data, id: Date.now() }]),
    actualizarPago: (id, data) => setPagos((p) => p.map((pa) => (pa.id === Number(id) ? { ...pa, ...data } : pa))),
    eliminarPago: (id) => setPagos((p) => p.filter((pa) => pa.id !== id)),
    agregarOrden: (data) => setOrdenesCompra((p) => [...p, { ...data, id: Date.now() }]),
    actualizarOrden: (id, data) => setOrdenesCompra((p) => p.map((o) => (o.id === Number(id) ? { ...o, ...data } : o))),
    eliminarOrden: (id) => setOrdenesCompra((p) => p.filter((o) => o.id !== id)),
  }

  return (
    <GastosContext.Provider value={value}>
      <Outlet />
    </GastosContext.Provider>
  )
}
