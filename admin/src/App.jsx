import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AdminProvider, useAdmin } from './context/AdminContext';
import AdminLayout from './components/AdminLayout';

// Pages
import AdminLoginPage from './pages/AdminLoginPage';
import DashboardPage from './pages/DashboardPage';
import NavbarPage from './pages/NavbarPage';
import ProductsPage from './pages/ProductsPage';
import HeroSlidesPage from './pages/HeroSlidesPage';
import AnnouncementPage from './pages/AnnouncementPage';
import TaglinePage from './pages/TaglinePage';
import TrustBarPage from './pages/TrustBarPage';
import MarqueePage from './pages/MarqueePage';
import CategoryCardsPage from './pages/CategoryCardsPage';
import AboutStripPage from './pages/AboutStripPage';
import AdBannersPage from './pages/AdBannersPage';
import ClosingBannerPage from './pages/ClosingBannerPage';
import VideoSectionPage from './pages/VideoSectionPage';
import NewsletterPage from './pages/NewsletterPage';
import FooterPage from './pages/FooterPage';
import OffersPage from './pages/OffersPage';
import CollectionsPage from './pages/CollectionsPage';
import InventoryPage from './pages/InventoryPage';
import AdminProfilePage from './pages/AdminProfilePage';
import ChangePasswordPage from './pages/ChangePasswordPage';
import ClientUsersPage from './pages/ClientUsersPage';
import InventoryHistoryPage from './pages/InventoryHistoryPage';
import InventoryReportsPage from './pages/InventoryReportsPage';

// Simple Protection
function RequireAuth({ children }) {
  const { admin } = useAdmin();
  if (!admin) return <Navigate to="/" replace />;
  return children;
}

import { ToastProvider } from './components/Toast';

export default function App() {
  const basename = import.meta.env.MODE === 'production' ? '/admin' : '';

  return (
    <ToastProvider>
      <AdminProvider>
        <BrowserRouter basename={basename}>
        <Routes>
          {/* Main Auth */}
          <Route path="/" element={<AdminLoginPage />} />

          {/* Protected Routes inside Layout */}
          <Route element={<RequireAuth><AdminLayout /></RequireAuth>}>
            <Route path="/dashboard"         element={<DashboardPage />} />
            <Route path="/navbar"            element={<NavbarPage />} />
            <Route path="/products"          element={<ProductsPage />} />
            <Route path="/hero"              element={<HeroSlidesPage />} />
            <Route path="/announcements"     element={<AnnouncementPage />} />
            <Route path="/tagline"           element={<TaglinePage />} />
            <Route path="/trust"             element={<TrustBarPage />} />
            <Route path="/marquee"           element={<MarqueePage />} />
            <Route path="/categories"        element={<CategoryCardsPage />} />
            <Route path="/about"             element={<AboutStripPage />} />
            <Route path="/ads"               element={<AdBannersPage />} />
            <Route path="/closing-banner"    element={<ClosingBannerPage />} />
            <Route path="/videos"            element={<VideoSectionPage />} />
            <Route path="/newsletter"        element={<NewsletterPage />} />
            <Route path="/footer"            element={<FooterPage />} />
            <Route path="/offers"            element={<OffersPage />} />
            <Route path="/collections"       element={<CollectionsPage />} />
            <Route path="/inventory"         element={<InventoryPage />} />
            <Route path="/profile"           element={<AdminProfilePage />} />
            <Route path="/change-password"   element={<ChangePasswordPage />} />
            <Route path="/clients"           element={<ClientUsersPage />} />
            <Route path="/inventory-history" element={<InventoryHistoryPage />} />
            <Route path="/inventory-reports" element={<InventoryReportsPage />} />
          </Route>

          {/* Default Redirect */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AdminProvider>
  </ToastProvider>
);
}
