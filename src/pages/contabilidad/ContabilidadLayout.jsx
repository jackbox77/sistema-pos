import { createContext, useContext, useState } from 'react'
import { Outlet } from 'react-router-dom'

const cuentasIniciales = [
  { id: 1, codigo: '1105', cuenta: 'Caja', tipo: 'Activo', saldo: 0 },
  { id: 2, codigo: '1120', cuenta: 'Bancos', tipo: 'Activo', saldo: 0 },
  { id: 3, codigo: '3105', cuenta: 'Capital social', tipo: 'Patrimonio', saldo: 0 },
  { id: 4, codigo: '4135', cuenta: 'Comercio al por mayor y al por menor', tipo: 'Ingreso', saldo: 0 },
  { id: 5, codigo: '5105', cuenta: 'Mercancías no fabricadas', tipo: 'Gasto', saldo: 0 },
]

const asientosIniciales = [
  { id: 1, fecha: '2025-02-01', numeroAsiento: '1', cuenta: 'Caja', descripcion: 'Apertura caja', debito: 500000, credito: 0 },
  { id: 2, fecha: '2025-02-01', numeroAsiento: '1', cuenta: 'Capital social', descripcion: 'Apertura caja', debito: 0, credito: 500000 },
]

const activosIniciales = [
  { id: 1, codigo: 'ACT-001', descripcion: 'Computador portátil', categoria: 'Equipo de cómputo', valor: 2500000, estado: 'En uso' },
  { id: 2, codigo: 'ACT-002', descripcion: 'Máquina registradora', categoria: 'Equipo', valor: 1200000, estado: 'En uso' },
]

const ContabilidadContext = createContext(null)

export function useContabilidad() {
  const ctx = useContext(ContabilidadContext)
  if (!ctx) throw new Error('useContabilidad debe usarse dentro de ContabilidadLayout')
  return ctx
}

export default function ContabilidadLayout() {
  const [cuentas, setCuentas] = useState(cuentasIniciales)
  const [asientos, setAsientos] = useState(asientosIniciales)
  const [activos, setActivos] = useState(activosIniciales)

  const value = {
    cuentas,
    setCuentas,
    asientos,
    setAsientos,
    activos,
    setActivos,
    agregarCuenta: (data) => setCuentas((p) => [...p, { ...data, id: Date.now() }]),
    actualizarCuenta: (id, data) => setCuentas((p) => p.map((c) => (c.id === Number(id) ? { ...c, ...data } : c))),
    eliminarCuenta: (id) => setCuentas((p) => p.filter((c) => c.id !== id)),
    agregarAsiento: (data) => setAsientos((p) => [...p, { ...data, id: Date.now() }]),
    actualizarAsiento: (id, data) => setAsientos((p) => p.map((a) => (a.id === Number(id) ? { ...a, ...data } : a))),
    eliminarAsiento: (id) => setAsientos((p) => p.filter((a) => a.id !== id)),
    agregarActivo: (data) => setActivos((p) => [...p, { ...data, id: Date.now() }]),
    actualizarActivo: (id, data) => setActivos((p) => p.map((a) => (a.id === Number(id) ? { ...a, ...data } : a))),
    eliminarActivo: (id) => setActivos((p) => p.filter((a) => a.id !== id)),
  }

  return (
    <ContabilidadContext.Provider value={value}>
      <Outlet />
    </ContabilidadContext.Provider>
  )
}
