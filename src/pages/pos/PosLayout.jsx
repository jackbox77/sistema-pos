import { Outlet, NavLink } from 'react-router-dom'
import './PosLayout.css'

const posSections = [
  {
    path: '/pos/ingresos',
    label: 'Ingresos',
    children: [
      { path: '/pos/ingresos/historial-ventas', label: 'Historial de ventas' },
      { path: '/pos/ingresos/comprobante-venta-diarias', label: 'Comprobante de venta diarias' },
    ],
  },
  { path: '/pos/turnos', label: 'Turnos inicio y fin' },
  { path: '/pos/facturar', label: 'Facturar' },
]

export default function PosLayout() {
  return (
    <div className="pos-layout">
      <h1 className="pos-title">POS</h1>
      <nav className="pos-nav">
        {posSections.map((section) =>
          section.children ? (
            <div key={section.path} className="pos-nav-group">
              <span className="pos-nav-group-label">{section.label}</span>
              {section.children.map((child) => (
                <NavLink
                  key={child.path}
                  to={child.path}
                  className={({ isActive }) =>
                    `pos-nav-link ${isActive ? 'active' : ''}`
                  }
                >
                  {child.label}
                </NavLink>
              ))}
            </div>
          ) : (
            <NavLink
              key={section.path}
              to={section.path}
              className={({ isActive }) =>
                `pos-nav-link pos-nav-link-main ${isActive ? 'active' : ''}`
              }
            >
              {section.label}
            </NavLink>
          )
        )}
      </nav>
      <div className="pos-content">
        <Outlet />
      </div>
    </div>
  )
}
