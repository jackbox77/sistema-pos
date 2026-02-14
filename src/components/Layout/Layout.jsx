import { useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import MaestrosProvider from '../../context/MaestrosContext'
import Header from './Header'
import Sidebar from './Sidebar'
import './Layout.css'

export default function Layout() {
  const [sidebarExpanded, setSidebarExpanded] = useState(false)
  const { pathname } = useLocation()
  const isVistaCompletaMenu = pathname.includes('/menu/vista-completa')

  return (
    <MaestrosProvider>
      <div className="layout">
        <Header />
        <div className="layout-body">
          <Sidebar
            isExpanded={sidebarExpanded}
            onToggle={() => setSidebarExpanded(!sidebarExpanded)}
          />
          <main className={`layout-content ${isVistaCompletaMenu ? 'layout-content-fullscreen' : ''}`}>
            <Outlet />
          </main>
        </div>
      </div>
    </MaestrosProvider>
  )
}
