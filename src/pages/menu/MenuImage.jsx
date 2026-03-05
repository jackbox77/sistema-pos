import { useState } from 'react'
import { Image as ImageIcon } from 'lucide-react'

/**
 * Muestra la imagen o un icono de imagen si no hay URL o si la imagen falla al cargar.
 */
export default function MenuImage({ src, alt = '', className = '', iconSize = 24, style = {}, wrapperClassName = '' }) {
  const [error, setError] = useState(false)
  const showIcon = !src || error

  if (showIcon) {
    return (
      <span
        className={wrapperClassName || className}
        style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', ...style }}
        aria-hidden
      >
        <ImageIcon size={iconSize} />
      </span>
    )
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      onError={() => setError(true)}
    />
  )
}
