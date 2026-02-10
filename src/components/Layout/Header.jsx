import './Header.css'

export default function Header() {
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
      <div className="header-right">
        <button className="header-btn">+ Añadir</button>
        <button className="header-btn header-btn-icon">?</button>
        <button className="header-btn header-btn-avatar">U</button>
      </div>
    </header>
  )
}
