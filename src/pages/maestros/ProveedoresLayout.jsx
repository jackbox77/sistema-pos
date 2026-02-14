import { createContext, useContext, useState } from 'react'
import { Outlet } from 'react-router-dom'

const TIPOS_DOCUMENTO = ['NIT', 'Cédula de ciudadanía', 'Cédula de extranjería', 'Pasaporte', 'Otro']

const proveedoresIniciales = [
  { id: 1, tipoDocumento: 'NIT', numeroDocumento: '900.123.456-1', nombre: 'Distribuidora Central S.A.S.', contacto: 'Juan Pérez', telefono: '300 123 4567', comprasAsociadas: 24 },
  { id: 2, tipoDocumento: 'NIT', numeroDocumento: '900.789.012-3', nombre: 'Bebidas y Más Ltda.', contacto: 'María López', telefono: '310 987 6543', comprasAsociadas: 15 },
]

export const ProveedoresContext = createContext(null)

export function useProveedores() {
  const ctx = useContext(ProveedoresContext)
  if (!ctx) throw new Error('useProveedores debe usarse dentro de ProveedoresLayout')
  return ctx
}

export { TIPOS_DOCUMENTO }

export default function ProveedoresLayout() {
  const [proveedores, setProveedores] = useState(proveedoresIniciales)

  const agregarProveedor = (data) => {
    setProveedores((prev) => [...prev, { ...data, id: Date.now(), comprasAsociadas: 0 }])
  }

  const actualizarProveedor = (id, data) => {
    setProveedores((prev) =>
      prev.map((p) => (p.id === Number(id) ? { ...p, ...data } : p))
    )
  }

  const eliminarProveedor = (id) => {
    setProveedores((prev) => prev.filter((p) => p.id !== id))
  }

  const obtenerProveedor = (id) => proveedores.find((p) => p.id === Number(id))

  return (
    <ProveedoresContext.Provider
      value={{
        proveedores,
        agregarProveedor,
        actualizarProveedor,
        eliminarProveedor,
        obtenerProveedor,
      }}
    >
      <Outlet />
    </ProveedoresContext.Provider>
  )
}
