import { useNavigate, useLocation } from 'react-router-dom'
import '../configuracion/Perfil.css'

export default function TurnosTabs() {
    const navigate = useNavigate()
    const location = useLocation()

    const TABS = [
        { id: '/app/turnos', label: 'TURNOS' },
        { id: '/app/turnos/historial', label: 'HISTORIAL DE TURNOS' },
    ]

    // Solo hacemos validación simple, asumiendo exact match
    const isActive = (path) => {
        return location.pathname === path || location.pathname === path + '/'
    }

    return (
        <div className="perfil-tabs" style={{ marginBottom: '24px' }}>
            {TABS.map((tab) => (
                <button
                    key={tab.id}
                    type="button"
                    className={`perfil-tab ${isActive(tab.id) ? 'active' : ''}`}
                    onClick={() => navigate(tab.id)}
                >
                    {tab.label}
                </button>
            ))}
        </div>
    )
}
