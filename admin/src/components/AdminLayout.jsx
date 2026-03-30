import { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';
import AdminHeader from './AdminHeader';

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  // Close sidebar on navigation on mobile
  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-brand-light flex">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-brand-dark/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Fixed Sidebar */}
      <AdminSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Main Content Area */}
      <div className="flex-1 lg:ml-64 min-h-screen flex flex-col pt-16 md:pt-20 transition-all duration-300 w-full overflow-hidden">
        <AdminHeader setSidebarOpen={setSidebarOpen} />
        
        <main className="flex-1 px-4 sm:px-6 lg:px-10 py-6 md:py-10 max-w-7xl w-full mx-auto overflow-x-hidden">
          {/* Outlet provides child route content */}
          <Outlet />

          {/* Site Footer (Admin) */}
          <footer className="mt-12 md:mt-20 py-8 md:py-10 border-t border-gray-100/50 flex flex-col items-center gap-4 opacity-40 hover:opacity-100 transition-opacity">
            <h4 className="font-head text-base md:text-lg font-bold text-brand-dark leading-none">
              The <span className="text-brand-warm">Anjaraipetti</span>
            </h4>
            <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3 text-center">
              <div className="hidden sm:block h-px w-8 bg-brand-mid/20" />
              <p className="text-[9px] sm:text-[10px] font-black uppercase tracking-[4px] text-brand-mid">Admin Control Panel v2.0</p>
              <div className="hidden sm:block h-px w-8 bg-brand-mid/20" />
            </div>
            <p className="text-[9px] sm:text-[10px] font-bold text-brand-mid/50 tracking-widest mt-1 sm:mt-2 uppercase">BUILD: {new Date().toLocaleDateString('en-IN')}</p>
          </footer>
        </main>
      </div>
    </div>
  );
}
