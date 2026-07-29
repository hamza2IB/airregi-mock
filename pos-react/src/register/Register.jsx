import { StoreProvider, useStore } from './store.jsx'
import Login from './Login.jsx'
import MainScreen from './MainScreen.jsx'
import OrdersScreen from './OrdersScreen.jsx'
import CloseDayScreen from './CloseDayScreen.jsx'
import HelpScreen from './HelpScreen.jsx'
import Modals from './modals.jsx'

export default function Register() {
  return (
    <StoreProvider>
      <RegisterInner />
    </StoreProvider>
  )
}

function RegisterInner() {
  const { screen } = useStore()
  return (
    <>
      {screen === 'login' && <Login />}
      {screen === 'main' && <MainScreen />}
      {screen === 'orders' && <OrdersScreen />}
      {screen === 'closeday' && <CloseDayScreen />}
      {screen === 'help' && <HelpScreen />}
      <Modals />
    </>
  )
}
