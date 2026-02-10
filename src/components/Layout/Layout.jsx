import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Header from './Header'
import Sidebar from './Sidebar'
import './Layout.css'

export default function Layout() {
  const [sidebarExpanded, setSidebarExpanded] = useState(false)

  return (
    <div className="layout">
      <Header />
      <div className="layout-body">
        <Sidebar
          isExpanded={sidebarExpanded}
          onToggle={() => setSidebarExpanded(!sidebarExpanded)}
        />
        <main className="layout-content">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
