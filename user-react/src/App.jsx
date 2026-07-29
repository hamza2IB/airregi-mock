import BottomNav from './components/BottomNav'
import { ToastProvider } from './components/Toast'
import { AppProvider, useApp } from './store'
import Home from './pages/Home'
import Stores from './pages/Stores'
import StoreDetail from './pages/StoreDetail'
import Products from './pages/Products'
import Categories from './pages/Categories'
import ProductDetail from './pages/ProductDetail'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import OrderSuccess from './pages/OrderSuccess'
import Orders from './pages/Orders'
import OrderTrack from './pages/OrderTrack'
import Pay from './pages/Pay'
import Settings from './pages/Settings'
import SettingsDetail from './pages/SettingsDetail'

function Shell() {
  const { route, activeTab, isFullscreen, cartCount, orders, wishlist, go, openStore, openProduct, openSettings } = useApp()

  const onOpenCategory = (name) => (name === '__wishlist__' ? openSettings('wishlist') : go('products', { category: name }))

  const renderPage = () => {
    switch (route.page) {
      case 'home': return <Home onNavigate={go} onOpenStore={openStore} onOpenProduct={openProduct} onOpenCategory={onOpenCategory} orders={orders} wishlistCount={wishlist.length} />
      case 'stores': return <Stores />
      case 'store-detail': return <StoreDetail />
      case 'products': return <Products initialCategory={route.category || 'All'} />
      case 'categories': return <Categories />
      case 'product-detail': return <ProductDetail />
      case 'cart': return <Cart />
      case 'checkout': return <Checkout />
      case 'order-success': return <OrderSuccess />
      case 'orders': return <Orders />
      case 'order-track': return <OrderTrack />
      case 'pay': return <Pay />
      case 'settings': return <Settings />
      case 'settings-detail': return <SettingsDetail />
      default: return <Home onNavigate={go} onOpenStore={openStore} onOpenProduct={openProduct} onOpenCategory={onOpenCategory} orders={orders} wishlistCount={wishlist.length} />
    }
  }

  return (
    <>
      {/* key forces remount on route change so each page starts fresh + scrolled to top */}
      <div key={JSON.stringify(route)}>{renderPage()}</div>
      {!isFullscreen && <BottomNav activeTab={activeTab} onNavigate={go} cartCount={cartCount} />}
    </>
  )
}

export default function App() {
  return (
    <div id="device">
      <ToastProvider>
        <AppProvider>
          <Shell />
        </AppProvider>
      </ToastProvider>
    </div>
  )
}
