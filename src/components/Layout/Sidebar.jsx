import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import {
  Home,
  ShoppingCart,
  FileText,
  UtensilsCrossed,
  ArrowDownToLine,
  ArrowUpFromLine,
  BarChart2,
  Users,
  Settings,
  ClipboardList,
  Clock,
} from 'lucide-react'
import './Sidebar.css'

const menuItems = [
  { path: '/app', label: 'Inicio', icon: Home },
  { path: '/app/pos', label: 'POS', icon: ShoppingCart },
  // { path: '/app/factura-electronica', label: 'Habilitar factura electrónica', icon: FileText },
  {
    path: '/app/menu',
    label: 'Menú',
    icon: UtensilsCrossed,
    children: [
      { path: '/app/menu', label: 'Editor de menú' },
      { path: '/app/menu/categoria', label: 'Categoría' },
      { path: '/app/menu/productos', label: 'Productos' },
    ],
  },
  {
    path: '/app/ingresos',
    label: 'Finanzas',
    icon: ArrowDownToLine,
    children: [
      { path: '/app/ingresos/ingresos', label: 'Ingresos' },
      { path: '/app/ingresos/egresos', label: 'Egresos' },
      { path: '/app/ingresos/ventas', label: 'Ventas' },
    ],
  },
  {
    path: '/app/turnos',
    label: 'Turnos',
    icon: Clock,
    children: [
      { path: '/app/turnos', label: 'Turnos' },
      { path: '/app/turnos/historial', label: 'Historial de turnos' },
    ],
  },
  // Módulo Gastos comentado
  // {
  //   path: '/app/gastos',
  //   label: 'Gastos',
  //   icon: ArrowUpFromLine,
  //   children: [
  //     { path: '/app/gastos/facturas-compras', label: 'Facturas de compras' },
  //     { path: '/app/gastos/documento-soporte', label: 'Documento soporte' },
  //     { path: '/app/gastos/pagos', label: 'Pagos' },
  //     { path: '/app/gastos/ordenes-compra', label: 'Órdenes de compra' },
  //   ],
  // },
  // Módulo Contabilidad comentado
  // {
  //   path: '/app/contabilidad',
  //   label: 'Contabilidad',
  //   icon: BarChart2,
  //   optional: true,
  //   children: [
  //     { path: '/app/contabilidad/libro-diario', label: 'Libro diario' },
  //     { path: '/app/contabilidad/activos', label: 'Activos' },
  //     { path: '/app/contabilidad/catalogo-cuentas', label: 'Catálogo de cuentas' },
  //   ],
  // },
  // Módulo Nómina comentado
  // {
  //   path: '/app/nomina',
  //   label: 'Nómina',
  //   icon: Users,
  //   children: [
  //     { path: '/app/nomina/roles-usuarios', label: 'Roles y usuarios' },
  //   ],
  // },
  {
    path: '/app/configuracion',
    label: 'Configuración',
    icon: Settings,
    children: [
      { path: '/app/configuracion/perfil', label: 'Perfil' },
      { path: '/app/configuracion/usuarios-permisos', label: 'Usuarios y permisos' },
      { path: '/app/configuracion/historial-subscripciones', label: 'Historial de subscripciones' },
      { path: '/app/configuracion/subscripciones', label: 'Subscripciones' },
    ],
  },
  {
    path: '/app/maestros',
    label: 'Maestros',
    icon: ClipboardList,
    children: [
      { path: '/app/maestros/categorias', label: 'Categorías' },
      { path: '/app/maestros/productos', label: 'Productos' },
      { path: '/app/maestros/proveedores', label: 'Proveedores' },
      { path: '/app/maestros/clientes-fidelizados', label: 'Clientes fidelizados' },
      { path: '/app/maestros/impuestos', label: 'Impuestos' },
      { path: '/app/maestros/metodos-pago', label: 'Métodos de pago' },
    ],
  },
]

export default function Sidebar({ isExpanded = false, onToggle }) {
  const [expanded, setExpanded] = useState({ 'app/menu': true, 'app/maestros': true, 'app/ingresos': true, 'app/turnos': true, 'app/gastos': true, 'app/contabilidad': true, 'app/nomina': true, 'app/configuracion': true })

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
                <span className="sidebar-icon">{item.icon ? <item.icon size={20} /> : null}</span>
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
              end={item.path === '/app/pos' ? false : true}
              className={({ isActive }) =>
                `sidebar-link ${isActive ? 'active' : ''}`
              }
            >
              <span className="sidebar-icon">{item.icon ? <item.icon size={20} /> : null}</span>
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
