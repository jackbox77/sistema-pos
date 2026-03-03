import { useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
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
  FileBarChart,
} from 'lucide-react'
import './Sidebar.css'

const menuItems = [
  { path: '/app', label: 'Dashboard', icon: Home },
  { path: '/app/pos', label: 'POS', icon: ShoppingCart },
  // { path: '/app/factura-electronica', label: 'Habilitar factura electrónica', icon: FileText },
  { path: '/app/turnos', label: 'Turnos', icon: Clock },
  {
    path: '/app/finanzas',
    label: 'Finanzas',
    icon: ArrowDownToLine,
    children: [
      { path: '/app/finanzas/ingresos', label: 'Ingresos' },
      { path: '/app/finanzas/egresos', label: 'Egresos' },
      { path: '/app/finanzas/ventas', label: 'Ventas' },
    ],
  },
  { path: '/app/reportes', label: 'Reportes', icon: FileBarChart },
  {
    path: '/app/menu',
    label: 'Menú',
    icon: UtensilsCrossed,
    children: [
      { path: '/app/menu', label: 'Editor de menú' },
      { path: '/app/menu/categoria', label: 'Editor de categoria' },
      { path: '/app/menu/productos', label: 'Editor de productos' },
    ],
  },
  {
    path: '/app/almacen',
    label: 'Almacén',
    icon: ClipboardList,
    children: [
      { path: '/app/almacen/categorias', label: 'Categorías' },
      { path: '/app/almacen/productos', label: 'Productos' },
      { path: '/app/almacen/proveedores', label: 'Proveedores' },
      { path: '/app/almacen/clientes-fidelizados', label: 'Clientes fidelizados' },
      { path: '/app/almacen/impuestos', label: 'Impuestos' },
      { path: '/app/almacen/metodos-pago', label: 'Métodos de pago' },
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
      { path: '/app/configuracion/general', label: 'General' },
      { path: '/app/configuracion/usuarios-permisos', label: 'Usuarios y permisos' },
      { path: '/app/configuracion/subscripciones', label: 'Subscripciones' },
      { path: '/app/configuracion/imagenes', label: 'Imágenes almacenadas' },
    ],
  },
]

export default function Sidebar({ isExpanded = false, onToggle }) {
  const location = useLocation()
  const [expanded, setExpanded] = useState({ 'app/menu': false, 'app/almacen': false, 'app/finanzas': false, 'app/turnos': false, 'app/gastos': false, 'app/contabilidad': false, 'app/nomina': false, 'app/configuracion': false })

  const isParentActive = (item) => {
    if (!item.children) return false
    return item.children.some(child => location.pathname === child.path)
  }

  const toggle = (key) => {
    if (!isExpanded && onToggle) {
      onToggle()
    }
    setExpanded((prev) => {
      const isCurrentlyOpen = prev[key]
      if (isCurrentlyOpen) {
        return { ...prev, [key]: false }
      }
      const next = { ...prev }
      Object.keys(next).forEach((k) => { next[k] = k === key })
      return next
    })
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
                className={`sidebar-group-toggle ${isParentActive(item) ? 'active' : ''}`}
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
                      end
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
