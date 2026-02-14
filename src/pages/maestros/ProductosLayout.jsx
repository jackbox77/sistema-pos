import React, { createContext, useContext } from 'react'
import { Outlet } from 'react-router-dom'
import { useMaestros } from '../../context/MaestrosContext'

export const ProductosContext = createContext(null)

export function useProductos() {
  const ctx = useContext(ProductosContext)
  if (!ctx) throw new Error('useProductos debe usarse dentro de ProductosLayout')
  return ctx
}

export default function ProductosLayout() {
  const {
    productos,
    categorias,
    getCategoria,
    agregarProducto,
    actualizarProducto,
    eliminarProducto,
    obtenerProducto,
  } = useMaestros()

  const value = {
    productos,
    categorias,
    getCategoria,
    agregarProducto,
    actualizarProducto,
    eliminarProducto,
    obtenerProducto,
  }

  return (
    <ProductosContext.Provider value={value}>
      <Outlet />
    </ProductosContext.Provider>
  )
}
