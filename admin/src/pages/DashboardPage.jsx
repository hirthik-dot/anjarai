import { useState, useEffect, useCallback } from 'react';
import StatCard from '../components/StatCard';
import SectionCard from '../components/SectionCard';
import DataTable from '../components/DataTable';
import api from '../utils/api';
import { formatDate, formatPrice } from '../utils/helpers';
import { useNavigate } from 'react-router-dom';
import { 
  BarChart3, Box, ImageIcon, Megaphone, Leaf, 
  Award, Sparkles, Tag, Heart, Info, PlayCircle, 
  Mail, Link as LinkIcon, Gift, WifiOff, RefreshCcw
} from 'lucide-react';

const QUICK_ACTIONS = [
  { icon: Box,        label: 'Products',      path: '/products',      color: 'green' },
  { icon: ImageIcon,  label: 'Hero Slides',   path: '/hero',          color: 'warm'  },
  { icon: Megaphone,  label: 'Announcements', path: '/announcements', color: 'sale'  },
  { icon: Mail,       label: 'Subscribers',   path: '/newsletter',    color: 'dark'  },
  { icon: Gift,       label: 'Promo Codes',   path: '/offers',        color: 'warm'  },
  { icon: Heart,      label: 'About Strip',   path: '/about',         color: 'green' },
];

export default function DashboardPage() {
  const [stats, setStats] = useState({ products: 0, subscribers: 0, offers: 0, hero: 0 });
  const [recentProducts, setRecentProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchStats = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [prods, subs, offs, hero] = await Promise.allSettled([
        api.get('/products/admin/all'),
        api.get('/newsletter/subscribers'),
        api.get('/offers/admin/all'),
        api.get('/hero/admin/all')
      ]);
      setStats({
        products: prods.status === 'fulfilled' ? prods.value.data.length : 0,
        subscribers: subs.status === 'fulfilled' ? subs.value.data.length : 0,
        offers: offs.status === 'fulfilled' ? offs.value.data.filter(o => o.is_active).length : 0,
        hero: hero.status === 'fulfilled' ? hero.value.data.length : 0
      });
      if (prods.status === 'fulfilled') {
        setRecentProducts(prods.value.data.slice(0, 5));
      }
      // Check if ALL failed (likely offline)
      const allFailed = [prods, subs, offs, hero].every(r => r.status === 'rejected');
      if (allFailed) {
        setError('Unable to connect to server. Please check your connection.');
      }
    } catch (err) {
      console.error(err);
      setError('Unable to connect to server. Please check your connection.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchStats(); }, [fetchStats]);

  // Offline error banner
  if (error && recentProducts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 px-4 text-center animate-in fade-in duration-500">
        <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-brand-sale/10 flex items-center justify-center">
          <WifiOff size={36} className="text-brand-sale" />
        </div>
        <div>
          <h2 className="font-head text-xl sm:text-2xl font-black text-brand-dark mb-2">Connection Error</h2>
          <p className="text-brand-mid text-sm max-w-[300px] mx-auto">{error}</p>
        </div>
        <button 
          onClick={fetchStats}
          className="bg-brand-green hover:bg-brand-green-light text-white font-black rounded-full px-6 sm:px-8 py-3 text-xs sm:text-sm uppercase tracking-widest flex items-center gap-2 shadow-xl shadow-brand-green/30 transition-all hover:scale-105 active:scale-95"
        >
          <RefreshCcw size={16} /> Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 sm:space-y-8 lg:space-y-12">
      {/* Offline Warning Banner (partial data) */}
      {error && (
        <div className="bg-brand-sale/5 border border-brand-sale/20 rounded-2xl p-3 sm:p-4 flex items-center gap-3 animate-in slide-in-from-top duration-300">
          <WifiOff size={18} className="text-brand-sale shrink-0" />
          <p className="text-xs sm:text-sm text-brand-sale font-bold flex-1">Some data may be unavailable. Check your connection.</p>
          <button onClick={fetchStats} className="text-brand-sale hover:text-brand-dark transition-colors shrink-0">
            <RefreshCcw size={16} />
          </button>
        </div>
      )}

      {/* Stat Cards Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-8">
        <StatCard icon="📦" label="Total Products" value={loading ? '...' : stats.products} color="green" onClick={() => navigate('/products')} />
        <StatCard icon="📧" label="Subscribers" value={loading ? '...' : stats.subscribers} color="dark" onClick={() => navigate('/newsletter')} />
        <StatCard icon="🎁" label="Active Offers" value={loading ? '...' : stats.offers} color="warm" onClick={() => navigate('/offers')} />
        <StatCard icon="🖼️" label="Hero Slides" value={loading ? '...' : stats.hero} color="sale" onClick={() => navigate('/hero')} />
      </div>

      {/* Quick Actions Grid */}
      <div className="space-y-4 sm:space-y-6">
        <h3 className="font-head text-xl sm:text-2xl lg:text-3xl font-black text-brand-dark flex items-center gap-2 sm:gap-3">
          <Sparkles className="text-brand-warm" size={20} />
          Quick Actions
        </h3>
        <div className="grid grid-cols-3 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 lg:gap-6">
          {QUICK_ACTIONS.map(action => (
            <button
              key={action.path}
              onClick={() => navigate(action.path)}
              className="bg-white p-3 sm:p-4 lg:p-6 rounded-2xl sm:rounded-3xl shadow-sm border border-gray-100 flex flex-col items-center gap-2 sm:gap-3 lg:gap-4 group hover:shadow-xl hover:-translate-y-1 hover:border-brand-green/30 transition-all text-center active:scale-95"
            >
              <div className={`p-2.5 sm:p-3 lg:p-4 rounded-xl sm:rounded-2xl bg-brand-light transition-all group-hover:scale-110 ${action.color === 'green' ? 'text-brand-green' : action.color === 'warm' ? 'text-brand-warm' : action.color === 'sale' ? 'text-brand-sale' : 'text-brand-dark'}`}>
                <action.icon size={20} className="sm:w-6 sm:h-6 lg:w-7 lg:h-7" />
              </div>
              <span className="text-[9px] sm:text-[10px] lg:text-[11px] font-black uppercase tracking-wider sm:tracking-widest text-brand-mid group-hover:text-brand-dark transition-colors leading-tight">{action.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Recent Activity — mobile card view, desktop table */}
      <SectionCard title="Recently Updated Products" subtitle="Keep track of your catalog's freshness">
        {/* Desktop Table */}
        <div className="hidden md:block">
          <DataTable 
            data={recentProducts}
            searchable={false}
            columns={[
              { 
                header: 'Product', 
                render: (p) => (
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl border border-gray-100/50 bg-brand-light/50 p-1 flex items-center justify-center overflow-hidden">
                      <img src={p.images?.[0]} alt="" className="w-full h-full object-cover rounded-lg" />
                    </div>
                    <div>
                      <h5 className="text-[13px] font-black text-brand-dark line-clamp-1 leading-none">{p.name}</h5>
                      <p className="text-[10px] font-bold text-brand-mid/50 uppercase tracking-widest mt-1.5">{p.id}</p>
                    </div>
                  </div>
                )
              },
              { header: 'Price', render: (p) => <span className="text-brand-green font-black">{formatPrice(p.price)}</span> },
              { 
                header: 'Type', 
                render: (p) => (
                  <span className={`px-3 py-1 text-[10px] font-black uppercase tracking-widest rounded-full ${
                    p.type === 'buy' ? 'bg-brand-green/10 text-brand-green' : 
                    p.type === 'add' ? 'bg-brand-warm/10 text-brand-warm' : 
                    'bg-gray-100 text-brand-mid'
                  }`}>
                    {p.type}
                  </span>
                ) 
              },
              { header: 'Rating', render: (p) => <div className="text-brand-warm opacity-80">{'⭐'.repeat(p.rating)}</div> },
              { header: 'Last Updated', render: (p) => <span className="text-[11px] font-bold opacity-50">{formatDate(p.updatedAt)}</span> },
            ]}
          />
        </div>

        {/* Mobile Card View */}
        <div className="md:hidden space-y-3">
          {recentProducts.length === 0 ? (
            <p className="text-center text-brand-mid font-bold italic opacity-40 py-10">No products yet 🌿</p>
          ) : (
            recentProducts.map((p) => (
              <div key={p.id} className="flex items-center gap-3 bg-brand-light/30 rounded-2xl p-3 border border-gray-100/50">
                <div className="w-12 h-12 rounded-xl bg-white p-1 flex items-center justify-center overflow-hidden shrink-0 border border-gray-50">
                  <img src={p.images?.[0]} alt="" className="w-full h-full object-cover rounded-lg" />
                </div>
                <div className="flex-1 min-w-0">
                  <h5 className="text-[12px] font-black text-brand-dark line-clamp-1 leading-tight">{p.name}</h5>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-brand-green font-black text-[11px]">{formatPrice(p.price)}</span>
                    <span className={`px-2 py-0.5 text-[8px] font-black uppercase tracking-wider rounded-full ${
                      p.type === 'buy' ? 'bg-brand-green/10 text-brand-green' : 
                      p.type === 'add' ? 'bg-brand-warm/10 text-brand-warm' : 
                      'bg-gray-100 text-brand-mid'
                    }`}>{p.type}</span>
                  </div>
                </div>
                <div className="text-brand-warm text-[10px] shrink-0">{'⭐'.repeat(Math.min(p.rating, 3))}</div>
              </div>
            ))
          )}
        </div>

        <div className="mt-4 sm:mt-8 flex justify-center">
          <button 
            onClick={() => navigate('/products')}
            className="text-brand-green font-black text-xs sm:text-sm uppercase tracking-widest hover:underline flex items-center gap-2 group active:scale-95 transition-all"
          >
            VIEW ALL PRODUCTS
            <ChevronRight className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </SectionCard>
    </div>
  );
}

function ChevronRight(props) {
  return <svg {...props} width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
}
