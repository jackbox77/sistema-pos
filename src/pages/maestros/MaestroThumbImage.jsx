import { useState } from 'react'
import { Image as ImageIcon } from 'lucide-react'

/**
 * Muestra la imagen o un icono de imagen si no hay URL o si la imagen falla al cargar.
 * Para uso en tablas de Almacén (Productos, Categorías).
 */
export default function MaestroThumbImage({ src, className = 'categoria-thumb', iconClassName = 'categoria-thumb-sin-imagen', iconSize = 24 }) {
  const [error, setError] = useState(false)
  const showIcon = !src || error

  if (showIcon) {
    return (
      <span className={iconClassName} title="Sin imagen" aria-hidden>
        <ImageIcon size={iconSize} />
      </span>
    )
  }

  return (
    <img
      src={src}
      alt=""
      className={className}
      onError={() => setError(true)}
    />
  )
}
