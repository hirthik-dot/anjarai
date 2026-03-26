import { useParams, useLocation } from 'react-router-dom';
import { useAdmin } from '../context/AdminContext';
import { Home, ChevronRight, Eye, RefreshCcw } from 'lucide-react';

export default function AdminHeader() {
  const { admin } = useAdmin();
  const location = useLocation();
  const path = location.pathname.split('/').filter(Boolean).pop();
  const title = path ? path.charAt(0).toUpperCase() + path.slice(1) : 'Dashboard';

  return (
    <header className="fixed top-0 left-64 right-0 h-20 bg-white/80 backdrop-blur-md z-30 border-b border-gray-100 px-10 flex items-center justify-between shadow-sm shadow-black/5 animate-in slide-in-from-top-4 duration-500">
      {/* Breadcrumbs */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-2xl bg-brand-green-pale/30 flex items-center justify-center text-brand-green shadow-sm">
          <Home size={18} />
        </div>
        <ChevronRight size={14} className="text-brand-mid/30" />
        <div>
          <p className="text-[10px] font-black tracking-widest text-brand-mid/50 uppercase leading-none mb-1">Admin Panel</p>
          <h2 className="text-lg font-black tracking-tight text-brand-dark leading-none">{title}</h2>
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-6">
        {/* Real-time Indicator */}
        <div className="flex items-center gap-2 px-4 py-2 bg-brand-green/5 border border-brand-green-pale/30 rounded-full animate-pulse">
          <div className="w-2 h-2 rounded-full bg-brand-green" />
          <span className="text-[10px] font-black tracking-widest text-brand-green uppercase">Syncing Live</span>
        </div>

        {/* Refresh Button */}
        <button 
          onClick={() => window.location.reload()}
          className="w-10 h-10 rounded-2xl bg-brand-light flex items-center justify-center text-brand-dark hover:bg-brand-green-pale hover:text-brand-green transition-all group"
          title="Refresh Data"
        >
          <RefreshCcw size={18} className="group-hover:rotate-180 transition-transform duration-500" />
        </button>

        {/* View Store Pill */}
        <a 
          href="/" target="_blank"
          className="bg-brand-green hover:bg-brand-green-light text-white rounded-full px-6 py-2.5 text-xs font-black tracking-widest uppercase transition-all flex items-center gap-2 shadow-lg shadow-brand-green/20"
        >
          <Eye size={16} />
          View Live Store
        </a>

        {/* User Profile */}
        <div className="flex items-center gap-4 pl-6 border-l border-gray-100 ml-2">
          <div className="text-right hidden sm:block">
            <p className="text-[10px] font-black uppercase tracking-widest text-brand-mid/40 mb-1">Signed in as</p>
            <p className="text-sm font-black text-brand-dark leading-none">{admin?.username || 'Admin'}</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-brand-green to-brand-green-light flex items-center justify-center text-white font-bold text-lg shadow-inner ring-4 ring-brand-green-pale/20">
            {admin?.username?.charAt(0).toUpperCase() || 'A'}
          </div>
        </div>
      </div>
    </header>
  );
}
