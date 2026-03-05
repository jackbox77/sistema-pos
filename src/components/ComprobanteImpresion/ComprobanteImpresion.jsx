import { useRef } from 'react'
import { X, Printer } from 'lucide-react'
import './ComprobanteImpresion.css'

/**
 * Modal para visualizar e imprimir un comprobante (venta, ingreso, egreso).
 * @param {boolean} open - Si el modal está visible
 * @param {() => void} onClose - Callback al cerrar
 * @param {string} title - Título del comprobante (ej. "Comprobante de venta")
 * @param {Array<{ label: string, value: string | number }>} lineas - Líneas a mostrar (etiqueta, valor)
 */
export default function ComprobanteImpresion({ open, onClose, title, lineas = [] }) {
  const contentRef = useRef(null)

  const handleImprimir = () => {
    if (!contentRef.current) return
    const ventana = window.open('', '_blank')
    if (!ventana) {
      alert('Permite ventanas emergentes para imprimir.')
      return
    }
    ventana.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>${title}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 24px; max-width: 400px; margin: 0 auto; }
            h2 { margin: 0 0 16px 0; font-size: 18px; border-bottom: 2px solid #0d9488; padding-bottom: 8px; }
            .linea { display: flex; justify-content: space-between; margin: 8px 0; font-size: 14px; }
            .linea .label { color: #6b7280; }
            .linea .value { font-weight: 600; }
          </style>
        </head>
        <body>
          <h2>${title}</h2>
          <p style="font-size:12px;color:#9ca3af;margin:0 0 16px 0;">${new Date().toLocaleString('es-CO')}</p>
          ${(lineas || []).map((l) => `
            <div class="linea">
              <span class="label">${l.label}</span>
              <span class="value">${l.value}</span>
            </div>
          `).join('')}
        </body>
      </html>
    `)
    ventana.document.close()
    ventana.focus()
    setTimeout(() => {
      ventana.print()
      ventana.onafterprint = () => ventana.close()
    }, 300)
  }

  if (!open) return null

  return (
    <div className="form-overlay comprobante-impresion-overlay" onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="comprobante-titulo">
      <div className="comprobante-impresion-modal" onClick={(e) => e.stopPropagation()}>
        <div className="comprobante-impresion-header">
          <h3 id="comprobante-titulo">{title}</h3>
          <button type="button" className="comprobante-impresion-cerrar" onClick={onClose} aria-label="Cerrar">
            <X size={20} />
          </button>
        </div>
        <div ref={contentRef} className="comprobante-impresion-body">
          <p className="comprobante-impresion-fecha">{new Date().toLocaleString('es-CO')}</p>
          {(lineas || []).map((l, i) => (
            <div key={i} className="comprobante-impresion-linea">
              <span className="comprobante-impresion-label">{l.label}</span>
              <span className="comprobante-impresion-value">{l.value}</span>
            </div>
          ))}
        </div>
        <div className="comprobante-impresion-footer">
          <button type="button" className="btn-primary" onClick={handleImprimir}>
            <Printer size={18} /> Imprimir
          </button>
          <button type="button" className="form-btn-secondary" onClick={onClose}>
            Cerrar
          </button>
        </div>
      </div>
    </div>
  )
}
