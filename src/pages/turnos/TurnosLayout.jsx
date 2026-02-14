import { createContext, useContext, useState } from 'react'
import { Outlet } from 'react-router-dom'

const turnosIniciales = [
  { id: 1, usuario: 'Admin', inicio: '2026-02-10 08:00', fin: '', ventas: 1250000, estado: 'Abierto' },
  { id: 2, usuario: 'Admin', inicio: '2026-02-09 08:00', fin: '2026-02-09 18:00', ventas: 980000, estado: 'Cerrado' },
]

const TurnosContext = createContext(null)

export function useTurnos() {
  const ctx = useContext(TurnosContext)
  if (!ctx) throw new Error('useTurnos debe usarse dentro de TurnosLayout')
  return ctx
}

export default function TurnosLayout() {
  const [turnos, setTurnos] = useState(turnosIniciales)

  const agregarTurno = (data) => {
    setTurnos((p) => [...p, { ...data, id: Date.now() }])
  }

  const actualizarTurno = (id, data) => {
    setTurnos((p) => p.map((t) => (t.id === Number(id) ? { ...t, ...data } : t)))
  }

  const value = {
    turnos,
    setTurnos,
    agregarTurno,
    actualizarTurno,
  }

  return (
    <TurnosContext.Provider value={value}>
      <Outlet />
    </TurnosContext.Provider>
  )
}
