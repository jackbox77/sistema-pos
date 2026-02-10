import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import './Sidebar.css'

const menuItems = [
  { path: '/', label: 'Inicio', icon: '🏠' },
  { path: '/pos', label: 'POS', icon: '🛒' },
  { path: '/factura-electronica', label: 'Habilitar factura electrónica', icon: '📄' },
  {
    path: '/ingresos',
    label: 'Ingresos',
    icon: '📥',
    children: [
      { path: '/ingresos/factura-ventas', label: 'Factura de ventas' },
      { path: '/ingresos/pagos-recibidos', label: 'Pagos recibidos' },
      { path: '/ingresos/devoluciones', label: 'Devoluciones' },
      { path: '/ingresos/remisiones', label: 'Remisiones' },
    ],
  },
  {
    path: '/gastos',
    label: 'Gastos',
    icon: '📤',
    children: [
      { path: '/gastos/facturas-compras', label: 'Facturas de compras' },
      { path: '/gastos/documento-soporte', label: 'Documento soporte' },
      { path: '/gastos/pagos', label: 'Pagos' },
      { path: '/gastos/ordenes-compra', label: 'Órdenes de compra' },
    ],
  },
  {
    path: '/contabilidad',
    label: 'Contabilidad',
    icon: '📊',
    optional: true,
    children: [
      { path: '/contabilidad/libro-diario', label: 'Libro diario' },
      { path: '/contabilidad/activos', label: 'Activos' },
      { path: '/contabilidad/catalogo-cuentas', label: 'Catálogo de cuentas' },
    ],
  },
  {
    path: '/nomina',
    label: 'Nómina',
    icon: '👥',
    children: [
      { path: '/nomina/roles-usuarios', label: 'Roles y usuarios' },
    ],
  },
  {
    path: '/configuracion',
    label: 'Configuración',
    icon: '⚙️',
    children: [
      { path: '/configuracion/informacion-empresa', label: 'Información de la empresa' },
      { path: '/configuracion/subscripciones', label: 'Subscripciones' },
    ],
  },
  {
    path: '/maestros',
    label: 'Maestros',
    icon: '📋',
    children: [
      { path: '/maestros/categorias', label: 'Categorías' },
      { path: '/maestros/productos', label: 'Productos' },
      { path: '/maestros/proveedores', label: 'Proveedores' },
      { path: '/maestros/clientes-fidelizados', label: 'Clientes fidelizados' },
      { path: '/maestros/impuestos', label: 'Impuestos' },
    ],
  },
]

export default function Sidebar({ isExpanded = false, onToggle }) {
  const [expanded, setExpanded] = useState({ maestros: true, ingresos: true, gastos: true, contabilidad: true, nomina: true, configuracion: true })

  const toggle = (key) => {
    setExpanded((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  return (
    <aside className={`sidebar ${isExpanded ? 'sidebar-expanded' : 'sidebar-collapsed'}`}>
      <button
        className="sidebar-menu-toggle"
        onClick={onToggle}
        aria-label={isExpanded ? 'Colapsar menú' : 'Expandir menú'}
      >
        <span className="hamburger-line" />
        <span className="hamburger-line" />
        <span className="hamburger-line" />
      </button>
      <nav className="sidebar-nav">
        {menuItems.map((item) =>
          item.children ? (
            <div key={item.path} className="sidebar-group">
              <button
                className="sidebar-group-toggle"
                onClick={() => toggle(item.path.replace('/', ''))}
              >
                <span className="sidebar-icon">{item.icon}</span>
                <span className="sidebar-label">{item.label}</span>
                {item.optional && <span className="sidebar-optional">opcional</span>}
                <span className={`sidebar-arrow ${expanded[item.path.replace('/', '')] ? 'open' : ''}`}>▼</span>
              </button>
              {expanded[item.path.replace('/', '')] && (
                <div className="sidebar-children">
                  {item.children.map((child) => (
                    <NavLink
                      key={child.path}
                      to={child.path}
                      className={({ isActive }) =>
                        `sidebar-link sidebar-link-child ${isActive ? 'active' : ''}`
                      }
                    >
                      {child.label}
                    </NavLink>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/pos' ? false : true}
              className={({ isActive }) =>
                `sidebar-link ${isActive ? 'active' : ''}`
              }
            >
              <span className="sidebar-icon">{item.icon}</span>
              <span className="sidebar-label">{item.label}</span>
            </NavLink>
          )
        )}
      </nav>
        <div className="sidebar-footer">
          <p className="sidebar-footer-text">Sistema POS</p>
        </div>
    </aside>
  )
}
