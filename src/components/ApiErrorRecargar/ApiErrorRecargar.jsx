import { X } from 'lucide-react'
import './ApiErrorRecargar.css'

/**
 * Bloque reutilizable para mostrar error de API.
 * @param {Object} props
 * @param {string} props.message - Mensaje de error a mostrar.
 * @param {() => void} [props.onRecargar] - Callback al hacer clic en Recargar (opcional).
 * @param {() => void} [props.onCerrar] - Callback al hacer clic en cerrar (X). Si se pasa, se muestra la X.
 * @param {boolean} [props.showRecargar=true] - Si false, no se muestra el botón Recargar.
 * @param {boolean} [props.loading] - Si true, deshabilita el botón Recargar.
 */
export default function ApiErrorRecargar({ message, onRecargar, onCerrar, showRecargar = true, loading = false }) {
  return (
    <div className="api-error-recargar" role="alert">
      <p className="api-error-recargar-message">{message}</p>
      {showRecargar && onRecargar && (
        <button
          type="button"
          className="api-error-recargar-btn"
          onClick={onRecargar}
          disabled={loading}
        >
          {loading ? 'Recargando...' : 'Recargar'}
        </button>
      )}
      {onCerrar && (
        <button
          type="button"
          className="api-error-recargar-cerrar"
          onClick={onCerrar}
          aria-label="Cerrar"
        >
          <X size={18} />
        </button>
      )}
    </div>
  )
}
