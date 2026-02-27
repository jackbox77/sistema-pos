import { createContext, useContext, useState, useCallback, useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import {
  getShiftsUseCase,
  startShiftUseCase,
  endShiftUseCase,
} from '../../feature/shifts/use-case'

/** Formato ISO 8601 → "YYYY-MM-DD HH:mm" para mostrar en la UI */
function formatISOToDisplay(iso) {
  if (!iso) return ''
  const d = new Date(iso)
  if (isNaN(d.getTime())) return ''
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
}

/** Mapea turno de la API al formato usado por la UI (sin cambiar estructura de columnas) */
function mapShiftApiToUI(shift) {
  return {
    id: shift.id,
    usuario: shift.name ?? 'Usuario',
    inicio: formatISOToDisplay(shift.start_at),
    fin: shift.end_at ? formatISOToDisplay(shift.end_at) : '',
    ventas: 0,
    estado: shift.end_at ? 'Cerrado' : 'Abierto',
  }
}

const TurnosContext = createContext(null)

export function useTurnos() {
  const ctx = useContext(TurnosContext)
  if (!ctx) throw new Error('useTurnos debe usarse dentro de TurnosLayout')
  return ctx
}

export default function TurnosLayout() {
  const [turnos, setTurnos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const loadTurnos = useCallback(async () => {
    setError(null)
    setLoading(true)
    try {
      const res = await getShiftsUseCase(1, 100)
      if (res?.success && res?.data?.data) {
        setTurnos(res.data.data.map(mapShiftApiToUI))
      } else {
        setTurnos([])
      }
    } catch (err) {
      setTurnos([])
      setError(err?.message ?? 'No se pudieron cargar los turnos')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadTurnos()
  }, [loadTurnos])

  const agregarTurno = useCallback(
    async (data) => {
      setError(null)
      try {
        await startShiftUseCase(data.usuario ?? 'Turno', data.start_at)
        await loadTurnos()
      } catch (err) {
        setError(err?.message ?? 'No se pudo iniciar el turno')
      }
    },
    [loadTurnos]
  )

  const actualizarTurno = useCallback(
    async (id, data) => {
      if (data.estado === 'Cerrado' && data.end_at) {
        setError(null)
        try {
          await endShiftUseCase(data.end_at)
          await loadTurnos()
        } catch (err) {
          setError(err?.message ?? 'No se pudo cerrar el turno')
        }
      }
    },
    [loadTurnos]
  )

  const value = {
    turnos,
    setTurnos,
    agregarTurno,
    actualizarTurno,
    loading,
    error,
    loadTurnos,
  }

  return (
    <TurnosContext.Provider value={value}>
      <Outlet />
    </TurnosContext.Provider>
  )
}
