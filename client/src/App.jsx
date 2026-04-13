// src/App.jsx
import { useEffect, lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { CartProvider } from './context/CartContext'
import { AuthProvider } from './context/AuthContext'
import { DataProvider } from './context/DataContext'
import { LanguageProvider } from './context/LanguageContext'

// ── Always-present layout components (small, needed on every page) ──────────
import AnnouncementBar from './components/AnnouncementBar'
import TaglineBar from './components/TaglineBar'
import Navbar from './components/Navbar'
import CartDrawer from './components/CartDrawer'
import LoginModal from './components/LoginModal'
import WhatsAppButton from './components/WhatsAppButton'
import Newsletter from './components/Newsletter'
import Footer from './components/Footer'
import BottomNav from './components/BottomNav'
import WakeUpBanner from './components/WakeUpBanner'

// ── Pages: lazy-loaded (code-split per route) ───────────────────────────────
// Each page is fetched ONLY when that route is first visited.
// This eliminates 6+ MB of unused JS on the initial page load.
const HomePage               = lazy(() => import('./pages/HomePage'))
const CollectionsListPage    = lazy(() => import('./pages/CollectionsListPage'))
const CollectionPage         = lazy(() => import('./pages/CollectionPage'))
const ProductDetailPage      = lazy(() => import('./pages/ProductDetailPage'))
const SearchPage             = lazy(() => import('./pages/SearchPage'))
const ComingSoonPage         = lazy(() => import('./pages/ComingSoonPage'))
const CheckoutPage           = lazy(() => import('./pages/CheckoutPage'))
const OrderSuccessPage       = lazy(() => import('./pages/OrderSuccessPage'))
const MyOrdersPage           = lazy(() => import('./pages/MyOrdersPage'))
const OrderDetailPage        = lazy(() => import('./pages/OrderDetailPage'))
const AboutPage              = lazy(() => import('./pages/AboutPage'))
const PolicyPage             = lazy(() => import('./pages/PolicyPage'))
const SpecialPromoOffersPage = lazy(() => import('./pages/SpecialPromoOffersPage'))
const AccountPage            = lazy(() => import('./pages/AccountPage'))

// ── Minimal spinner shown while a lazy chunk loads ──────────────────────────
function PageLoader() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="w-10 h-10 rounded-full border-4 border-[#2E7D32]/20 border-t-[#2E7D32] animate-spin" />
    </div>
  )
}

function ScrollToTop() {
  const location = useLocation();
  useEffect(() => {
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
              <Suspense fallback={<PageLoader />}>
                <Routes>
                  <Route path="/"                                  element={<HomePage />} />
                  <Route path="/about"                             element={<AboutPage />} />
                  <Route path="/collections"                       element={<CollectionsListPage />} />
                  <Route path="/collections/special-promo-offers"  element={<SpecialPromoOffersPage />} />
                  <Route path="/collections/:slug"                 element={<CollectionPage />} />
                  <Route path="/products/:slug"                    element={<ProductDetailPage />} />
                  <Route path="/terms"       element={<PolicyPage policyKey="terms" />} />
                  <Route path="/privacy"     element={<PolicyPage policyKey="privacy" />} />
                  <Route path="/shipping"    element={<PolicyPage policyKey="shipping" />} />
                  <Route path="/refund"      element={<PolicyPage policyKey="refund" />} />
                  <Route path="/cookie"      element={<PolicyPage policyKey="cookie" />} />
                  <Route path="/cancellation" element={<PolicyPage policyKey="cancellation" />} />
                  <Route path="/checkout"    element={<CheckoutPage />} />
                  <Route path="/order-success" element={<OrderSuccessPage />} />
                  <Route path="/account"     element={<AccountPage />} />
                  <Route path="/orders"      element={<MyOrdersPage />} />
                  <Route path="/orders/:id"  element={<OrderDetailPage />} />
                  <Route path="/search"      element={<SearchPage />} />
                  <Route path="*"            element={<ComingSoonPage />} />
                </Routes>
              </Suspense>
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
