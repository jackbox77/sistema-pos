import { Outlet } from 'react-router-dom'
import MenuProvider from './MenuContext'

export default function MenuLayout() {
  return (
    <MenuProvider>
      <Outlet />
    </MenuProvider>
  )
}
