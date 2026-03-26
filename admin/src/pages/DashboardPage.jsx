import { useState, useEffect } from 'react';
import StatCard from '../components/StatCard';
import SectionCard from '../components/SectionCard';
import DataTable from '../components/DataTable';
import api from '../utils/api';
import { formatDate, formatPrice } from '../utils/helpers';
import { useNavigate } from 'react-router-dom';
import { 
  BarChart3, Box, ImageIcon, Megaphone, Leaf, 
  Award, Sparkles, Tag, Heart, Info, PlayCircle, 
  Mail, Link as LinkIcon, Gift
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
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [prods, subs, offs, hero] = await Promise.all([
          api.get('/products/admin/all'),
          api.get('/newsletter/subscribers'),
          api.get('/offers/admin/all'),
          api.get('/hero/admin/all')
        ]);
        setStats({
          products: prods.data.length,
          subscribers: subs.data.length,
          offers: offs.data.filter(o => o.is_active).length,
          hero: hero.data.length
        });
        setRecentProducts(prods.data.slice(0, 5));
        setLoading(false);
      } catch (err) { console.error(err); }
    };
    fetchStats();
  }, []);

  return (
    <div className="space-y-12">
      {/* Stat Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <StatCard icon="📦" label="Total Products" value={stats.products} color="green" onClick={() => navigate('/products')} />
        <StatCard icon="📧" label="Subscribers" value={stats.subscribers} color="dark" onClick={() => navigate('/newsletter')} />
        <StatCard icon="🎁" label="Active Offers" value={stats.offers} color="warm" onClick={() => navigate('/offers')} />
        <StatCard icon="🖼️" label="Hero Slides" value={stats.hero} color="sale" onClick={() => navigate('/hero')} />
      </div>

      {/* Quick Actions Grid */}
      <div className="space-y-6">
        <h3 className="font-head text-3xl font-black text-brand-dark flex items-center gap-3">
          <Sparkles className="text-brand-warm" />
          Quick Actions
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {QUICK_ACTIONS.map(action => (
            <button
              key={action.path}
              onClick={() => navigate(action.path)}
              className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col items-center gap-4 group hover:shadow-xl hover:-translate-y-1 hover:border-brand-green/30 transition-all text-center animate-in zoom-in-50 duration-500"
            >
              <div className={`p-4 rounded-2xl bg-brand-light transition-all group-hover:scale-110 ${action.color === 'green' ? 'text-brand-green' : action.color === 'warm' ? 'text-brand-warm' : action.color === 'sale' ? 'text-brand-sale' : 'text-brand-dark'}`}>
                <action.icon size={28} />
              </div>
              <span className="text-[11px] font-black uppercase tracking-widest text-brand-mid group-hover:text-brand-dark transition-colors">{action.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Recent Activity Table */}
      <SectionCard title="Recently Updated Products" subtitle="Keep track of your catalog's freshness">
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
        <div className="mt-8 flex justify-center">
          <button 
            onClick={() => navigate('/products')}
            className="text-brand-green font-black text-sm uppercase tracking-widest hover:underline flex items-center gap-2 group"
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
