import './ApiErrorRecargar.css'

/**
 * Bloque reutilizable para mostrar error de API con botón Recargar.
 * Úsalo en cualquier pantalla que cargue datos por API para dar opción de reintentar.
 *
 * @param {Object} props
 * @param {string} props.message - Mensaje de error a mostrar.
 * @param {() => void | Promise<void>} props.onRecargar - Callback al hacer clic en Recargar (ej: volver a llamar la API).
 * @param {boolean} [props.loading] - Si true, deshabilita el botón Recargar (ej: mientras se está recargando).
 */
export default function ApiErrorRecargar({ message, onRecargar, loading = false }) {
  return (
    <div className="api-error-recargar" role="alert">
      <p className="api-error-recargar-message">{message}</p>
      <button
        type="button"
        className="api-error-recargar-btn"
        onClick={onRecargar}
        disabled={loading}
      >
        {loading ? 'Recargando...' : 'Recargar'}
      </button>
    </div>
  )
}
