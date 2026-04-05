// src/App.jsx
import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { CartProvider } from './context/CartContext'
import { AuthProvider } from './context/AuthContext'
import AnnouncementBar from './components/AnnouncementBar'
import TaglineBar from './components/TaglineBar'
import Navbar from './components/Navbar'
import CartDrawer from './components/CartDrawer'
import LoginModal from './components/LoginModal'
import WhatsAppButton from './components/WhatsAppButton'
import Newsletter from './components/Newsletter'
import Footer from './components/Footer'
import BottomNav from './components/BottomNav'
import HomePage from './pages/HomePage'
import CollectionsListPage from './pages/CollectionsListPage'
import CollectionPage from './pages/CollectionPage'
import ProductDetailPage from './pages/ProductDetailPage'
import SearchPage from './pages/SearchPage'
import ComingSoonPage from './pages/ComingSoonPage'
import CheckoutPage from './pages/CheckoutPage'
import OrderSuccessPage from './pages/OrderSuccessPage'
import MyOrdersPage from './pages/MyOrdersPage'
import OrderDetailPage from './pages/OrderDetailPage'
import AboutPage from './pages/AboutPage'
import PolicyPage from './pages/PolicyPage'
import SpecialPromoOffersPage from './pages/SpecialPromoOffersPage'
import WakeUpBanner from './components/WakeUpBanner'
import AccountPage from './pages/AccountPage'

import { DataProvider } from './context/DataContext'
import { LanguageProvider } from './context/LanguageContext'

function ScrollToTop() {
  const location = useLocation();
  useEffect(() => {
    // Ensure we scroll after the route content mounts.
    // This prevents "URL changed but I still see the footer area" behavior.
    const t = setTimeout(() => window.scrollTo({ top: 0, left: 0, behavior: 'auto' }), 0);
    return () => clearTimeout(t);
  }, [location.pathname]);
  return null;
}

export default function App() {
  return (
    <LanguageProvider>
    <AuthProvider>
      <DataProvider>
        <CartProvider>
          <BrowserRouter>
            <div className="relative min-h-screen flex flex-col font-body">
            <div className="relative z-[95]">
              <AnnouncementBar />
            </div>

            <div className="relative z-[94]">
              <TaglineBar />
            </div>
            
            <div className="sticky top-0 left-0 right-0 z-[100]">
              <Navbar />
            </div>

            <CartDrawer />
            <LoginModal />
            <WhatsAppButton />
            <WakeUpBanner />

            <main className="flex-grow pb-20 md:pb-0">
              <ScrollToTop />
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/collections" element={<CollectionsListPage />} />
                <Route path="/collections/special-promo-offers" element={<SpecialPromoOffersPage />} />
                <Route path="/collections/:slug" element={<CollectionPage />} />
                <Route path="/products/:slug" element={<ProductDetailPage />} />
                <Route path="/terms" element={<PolicyPage policyKey="terms" />} />
                <Route path="/privacy" element={<PolicyPage policyKey="privacy" />} />
                <Route path="/shipping" element={<PolicyPage policyKey="shipping" />} />
                <Route path="/refund" element={<PolicyPage policyKey="refund" />} />
                <Route path="/cookie" element={<PolicyPage policyKey="cookie" />} />
                <Route path="/cancellation" element={<PolicyPage policyKey="cancellation" />} />
                <Route path="/checkout" element={<CheckoutPage />} />
                <Route path="/order-success" element={<OrderSuccessPage />} />
                <Route path="/account" element={<AccountPage />} />
                <Route path="/orders" element={<MyOrdersPage />} />
                <Route path="/orders/:id" element={<OrderDetailPage />} />
                <Route path="/search" element={<SearchPage />} />
                <Route path="*" element={<ComingSoonPage />} />
              </Routes>
            </main>

            <Newsletter />
            <Footer />
            <BottomNav />
          </div>
        </BrowserRouter>
      </CartProvider>
    </DataProvider>
   </AuthProvider>
    </LanguageProvider>
  )
}
