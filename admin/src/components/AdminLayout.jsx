import { Outlet } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';
import AdminHeader from './AdminHeader';

export default function AdminLayout() {
  return (
    <div className="min-h-screen bg-brand-light flex">
      {/* Fixed Sidebar */}
      <AdminSidebar />

      {/* Main Content Area */}
      <div className="flex-1 ml-64 min-h-screen flex flex-col pt-20">
        <AdminHeader />
        
        <main className="flex-1 px-10 py-10 max-w-7xl w-full mx-auto">
          {/* Outlet provides child route content */}
          <Outlet />

          {/* Site Footer (Admin) */}
          <footer className="mt-20 py-10 border-t border-gray-100/50 flex flex-col items-center gap-4 opacity-40 hover:opacity-100 transition-opacity">
            <h4 className="font-head text-lg font-bold text-brand-dark leading-none">
              The <span className="text-brand-warm">Anjaraipetti</span>
            </h4>
            <div className="flex items-center gap-3">
              <div className="h-px w-8 bg-brand-mid/20" />
              <p className="text-[10px] font-black uppercase tracking-[4px] text-brand-mid">Admin Control Panel v2.0</p>
              <div className="h-px w-8 bg-brand-mid/20" />
            </div>
            <p className="text-[10px] font-bold text-brand-mid/50 tracking-widest mt-2 uppercase">BUILD: {new Date().toLocaleDateString('en-IN')}</p>
          </footer>
        </main>
      </div>
    </div>
  );
}
