// src/App.jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { CartProvider } from './context/CartContext'
import { AuthProvider } from './context/AuthContext'
import AnnouncementBar from './components/AnnouncementBar'
import TaglineBar from './components/TaglineBar'
import Header from './components/Header'
import Navbar from './components/Navbar'
import CartDrawer from './components/CartDrawer'
import LoginModal from './components/LoginModal'
import WhatsAppButton from './components/WhatsAppButton'
import Newsletter from './components/Newsletter'
import Footer from './components/Footer'
import HomePage from './pages/HomePage'
import CollectionPage from './pages/CollectionPage'
import ProductDetailPage from './pages/ProductDetailPage'
import ComingSoonPage from './pages/ComingSoonPage'
import CheckoutPage from './pages/CheckoutPage'
import OrderSuccessPage from './pages/OrderSuccessPage'
import WakeUpBanner from './components/WakeUpBanner'

import { DataProvider } from './context/DataContext'

export default function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <CartProvider>
          <BrowserRouter>
            <div className="relative min-h-screen flex flex-col font-body">
            <div className="fixed top-0 left-0 right-0 z-[100] shadow-md border-b border-gray-100">
              <AnnouncementBar />
              <TaglineBar />
              <Header className="sticky-none" />
              <Navbar className="sticky-none" />
            </div>

            {/* Spacer to avoid content collision with fixed nav */}
            <div className="h-[145px] sm:h-[155px] lg:h-[185px] print:hidden" />

            <CartDrawer />
            <LoginModal />
            <WhatsAppButton />
            <WakeUpBanner />

            <main className="flex-grow">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/collections/:slug" element={<CollectionPage />} />
                <Route path="/products/:slug" element={<ProductDetailPage />} />
                <Route path="/checkout" element={<CheckoutPage />} />
                <Route path="/order-success" element={<OrderSuccessPage />} />
                <Route path="*" element={<ComingSoonPage />} />
              </Routes>
            </main>

            <Newsletter />
            <Footer />
          </div>
        </BrowserRouter>
      </CartProvider>
    </DataProvider>
  </AuthProvider>
)
}

