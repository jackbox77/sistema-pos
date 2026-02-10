import { useState } from 'react'
import FormularioProductos from '../../components/FormularioProductos/FormularioProductos'
import './Facturar.css'

export default function Facturar() {
  const [showForm, setShowForm] = useState(false)

  return (
    <div className="facturar-page">
      <h2>Facturar</h2>
      <p className="facturar-desc">Gestiona productos, servicios y combos para facturar.</p>
      <button
        className="facturar-btn-new"
        onClick={() => setShowForm(true)}
      >
        + Nuevo producto / servicio / combo
      </button>

      {showForm && (
        <FormularioProductos
          onClose={() => setShowForm(false)}
          onCreate={() => setShowForm(false)}
        />
      )}
    </div>
  )
}
