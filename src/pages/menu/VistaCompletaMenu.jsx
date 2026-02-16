import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { useMenu } from './MenuContext'
import MenuPreviewTarjetas from './MenuPreviewTarjetas'
import './VistaCompletaMenu.css'

/** Vista final estilo Pirpos/Loggro: barra de categorías + tarjetas de productos */
export default function VistaCompletaMenu() {
  const { empresaInfo, apariencia, categoriasConProductos, tipoMenu, mostrarImagenes, mostrarVerMas, tipoHeader } = useMenu()

  return (
    <div className="vista-completa-menu">
      <header className="vista-completa-menu-bar">
        <Link to="/app/menu" className="vista-completa-menu-volver">
          <ArrowLeft size={20} />
          Volver al editor
        </Link>
      </header>
      <main className="vista-completa-menu-main">
        <div className="vista-completa-menu-frame vista-completa-menu-pirpos">
          <MenuPreviewTarjetas
            categorias={categoriasConProductos}
            apariencia={apariencia}
            empresaInfo={empresaInfo}
            mostrarImagenes={mostrarImagenes}
            mostrarVerMas={mostrarVerMas}
            tipoHeader={tipoHeader}
          />
        </div>
      </main>
    </div>
  )
}
