import { useRef, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { LogOut } from 'lucide-react'
import { logoutUseCase } from '../../feature/auth/use-case'
import './Header.css'

const TOKEN_STORAGE_KEY = 'token'

export default function Header() {
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false)
      }
    }
    if (menuOpen) document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [menuOpen])

  const handleCerrarSesion = async () => {
    setMenuOpen(false)
    try {
      await logoutUseCase()
    } catch (_) {}
    localStorage.removeItem(TOKEN_STORAGE_KEY)
    navigate('/', { replace: true })
  }

  return (
    <header className="header">
      <div className="header-left">
        <h1 className="header-logo">Sistema POS</h1>
      </div>
      <div className="header-center">
        <input
          type="search"
          placeholder="Buscar"
          className="header-search"
        />
      </div>
      <div className="header-right" ref={menuRef}>
        <button className="header-btn">+ Añadir</button>
        <button className="header-btn header-btn-icon">?</button>
        <button
          type="button"
          className="header-btn header-btn-avatar"
          onClick={() => setMenuOpen((v) => !v)}
          aria-expanded={menuOpen}
          aria-haspopup="true"
          aria-label="Menú de usuario"
        >
          U
        </button>
        {menuOpen && (
          <div className="header-user-menu" role="menu">
            <button
              type="button"
              className="header-user-menu-item"
              onClick={handleCerrarSesion}
              role="menuitem"
            >
              <LogOut size={18} />
              Cerrar sesión
            </button>
          </div>
        )}
      </div>
    </header>
  )
}
