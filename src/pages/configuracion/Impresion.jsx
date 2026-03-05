import { useState, useCallback, useRef } from 'react'
import PageModule from '../../components/PageModule/PageModule'
import { Loader2, Printer, ImagePlus } from 'lucide-react'
import './Impresion.css'

const PRINTER_SERVER_URL = 'http://localhost:3333'
const REQUEST_TIMEOUT_MS = 10000

const RECEIPT_EXAMPLE = {
  type: 'receipt',
  items: [
    { name: 'Pizza Margarita', qty: 1, price: 25000 },
    { name: 'Coca Cola', qty: 2, price: 5000 },
  ],
  total: 35000,
}

const RESTAURANT_NAME = 'La Mesa del Chef'
const LOGO_URL = 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=160&h=80&fit=crop'

// Logo en base64; el servidor decodifica e imprime (campo logoBase64).
const DEFAULT_LOGO_BASE64 =
  'iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAARElEQVRYR2NkYGD4z0ABYBw1gGE0DBgZGRn/MzAwMjAw/Gf4z8DA8J+BgYHhPwMDA8N/BgYGhv8MDAwM/xkYGP4DAH0OBvq5g0gZAAAAAElFTkSuQmCC'

function fetchWithTimeout(url, options = {}, timeoutMs = REQUEST_TIMEOUT_MS) {
  const controller = new AbortController()
  const id = setTimeout(() => controller.abort(), timeoutMs)
  return fetch(url, { ...options, signal: controller.signal }).finally(() => clearTimeout(id))
}

function getNetworkErrorMessage(err) {
  const msg = (err?.message ?? '').toLowerCase()
  if (msg.includes('aborted') || msg.includes('timeout')) {
    return 'La solicitud tardó demasiado. Compruebe que el servidor de impresión esté en marcha.'
  }
  if (
    msg.includes('failed to fetch') ||
    msg.includes('load failed') ||
    msg.includes('networkerror') ||
    msg.includes('network request failed')
  ) {
    return 'Servidor de impresión no disponible. Asegúrese de iniciarlo con npm start (puerto 3333).'
  }
  return err?.message ?? 'Error de conexión.'
}

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      const dataUrl = reader.result
      const base64 = typeof dataUrl === 'string' && dataUrl.includes(',') ? dataUrl.split(',')[1] : ''
      resolve(base64 || null)
    }
    reader.onerror = () => reject(new Error('Error al leer el archivo'))
    reader.readAsDataURL(file)
  })
}

export default function Impresion() {
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState(null)
  const [isSuccess, setIsSuccess] = useState(false)
  const [logoBase64, setLogoBase64] = useState(null)
  const [logoDataUrl, setLogoDataUrl] = useState(null)
  const fileInputRef = useRef(null)

  const sendPrint = useCallback(async (payload) => {
    setLoading(true)
    setMessage(null)
    setIsSuccess(false)

    try {
      const statusRes = await fetchWithTimeout(`${PRINTER_SERVER_URL}/status`)
      if (!statusRes.ok) {
        setMessage('Servidor de impresión no disponible.')
        return
      }
      const statusData = await statusRes.json().catch(() => ({}))
      if (statusData?.status !== 'ok') {
        setMessage('El servidor no respondió correctamente.')
        return
      }

      const printRes = await fetchWithTimeout(`${PRINTER_SERVER_URL}/print`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const printData = await printRes.json().catch(() => ({}))
      if (printData?.success) {
        setMessage('Recibo de prueba impreso.')
        setIsSuccess(true)
      } else {
        setMessage(printData?.error ? `No se pudo imprimir: ${printData.error}` : 'No se pudo imprimir.')
      }
    } catch (err) {
      setMessage(getNetworkErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }, [])

  const probarImpresion = useCallback(() => {
    sendPrint(RECEIPT_EXAMPLE)
  }, [sendPrint])

  const imprimirReciboTest = useCallback(() => {
    const logo = logoBase64 || DEFAULT_LOGO_BASE64
    sendPrint({
      type: 'receipt',
      width: 58,
      storeName: RESTAURANT_NAME,
      logoBase64: logo,
      items: [
        { name: 'Pizza Margarita', qty: 1, price: 25000 },
        { name: 'Coca Cola', qty: 2, price: 5000 },
      ],
      total: 35000,
    })
  }, [sendPrint, logoBase64])

  const onLogoFileChange = useCallback((e) => {
    const file = e.target.files?.[0]
    if (!file || !file.type.startsWith('image/')) return
    fileToBase64(file).then((b64) => {
      setLogoBase64(b64)
      setLogoDataUrl(b64 ? `data:${file.type};base64,${b64}` : null)
    }).catch(() => setMessage('No se pudo leer la imagen.'))
    e.target.value = ''
  }, [])

  return (
    <PageModule
      title="Prueba de impresora"
      description="Comprueba que el servidor de impresión y la impresora térmica respondan correctamente."
    >
      <div className="impresion-card">
        <p className="impresion-intro">
          Envía un recibo de ejemplo al servidor local (localhost:3333). Asegúrate de tener el servidor de impresión
          iniciado con <code>npm start</code>.
        </p>

        <div className="impresion-receipt-preview">
          <p className="impresion-receipt-label">Vista previa recibo 58mm (test)</p>
          <div className="impresion-receipt-58mm" aria-hidden>
            <img
              src={logoDataUrl || LOGO_URL}
              alt=""
              className="impresion-receipt-logo"
            />
            <p className="impresion-receipt-store">{RESTAURANT_NAME}</p>
            <div className="impresion-receipt-divider" />
            <div className="impresion-receipt-line">Pizza Margarita    1   $25.000</div>
            <div className="impresion-receipt-line">Coca Cola          2   $10.000</div>
            <div className="impresion-receipt-divider" />
            <div className="impresion-receipt-total">Total          $35.000</div>
          </div>
        </div>

        <div className="impresion-actions">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={onLogoFileChange}
            className="impresion-file-input"
            aria-label="Elegir logo"
          />
          <button
            type="button"
            className="impresion-btn impresion-btn-outline"
            onClick={() => fileInputRef.current?.click()}
          >
            <ImagePlus size={18} aria-hidden />
            {logoBase64 ? 'Cambiar logo' : 'Usar mi logo'}
          </button>
          <button
            type="button"
            className="impresion-btn impresion-btn-primary"
            onClick={probarImpresion}
            disabled={loading}
            aria-busy={loading}
          >
            {loading ? (
              <>
                <Loader2 className="impresion-spinner" size={20} aria-hidden />
                Imprimiendo…
              </>
            ) : (
              <>
                <Printer size={20} aria-hidden />
                Probar impresión
              </>
            )}
          </button>
          <button
            type="button"
            className="impresion-btn impresion-btn-secondary"
            onClick={imprimirReciboTest}
            disabled={loading}
            aria-busy={loading}
          >
            {loading ? (
              <>
                <Loader2 className="impresion-spinner" size={20} aria-hidden />
                Imprimiendo…
              </>
            ) : (
              <>
                <Printer size={20} aria-hidden />
                Imprimir recibo de test
              </>
            )}
          </button>
        </div>
        {message && (
          <div className={`impresion-message ${isSuccess ? 'impresion-message--success' : 'impresion-message--error'}`} role="status">
            {message}
          </div>
        )}
      </div>
    </PageModule>
  )
}
