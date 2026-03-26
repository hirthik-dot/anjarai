import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Package, AlertTriangle, XCircle, CheckCircle2, 
  ArrowUpRight, ArrowDownRight, RefreshCcw, Search, Filter, 
  Plus, History as HistoryIcon, Settings
} from 'lucide-react';
import { useToast } from '../components/Toast';

export default function InventoryPage() {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all'); // all, low, out, in
  const toast = useToast();

  const fetchInventory = async () => {
    try {
      setLoading(true);
      // axios is globally configured in AdminContext (axios.defaults.baseURL = API_BASE)
      const res = await axios.get('/inventory'); 
      setInventory(res.data);
    } catch (err) {
      toast.error('Error loading inventory');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  const stats = {
    total: inventory.length,
    low: inventory.filter(i => i.quantity > 0 && i.quantity <= i.reorder_level).length,
    out: inventory.filter(i => i.quantity === 0).length,
    in: inventory.filter(i => i.quantity > i.reorder_level).length
  };

  const filtered = inventory.filter(item => {
    const matchesSearch = item.product_id?.name?.toLowerCase().includes(searchTerm.toLowerCase());
    if (filter === 'low') return matchesSearch && item.quantity > 0 && item.quantity <= item.reorder_level;
    if (filter === 'out') return matchesSearch && item.quantity === 0;
    if (filter === 'in') return matchesSearch && item.quantity > item.reorder_level;
    return matchesSearch;
  });

  const handleAdjust = async (item, type) => {
    const amountStr = window.prompt(`Enter quantity to ${type === 'in' ? 'ADD' : 'REMOVE'} for ${item.product_id?.name}:`, '1');
    const amount = parseInt(amountStr);
    if (isNaN(amount) || amount <= 0) return;

    try {
      await axios.post('/inventory/adjust', {
        product_id: item.product_id?._id,
        variant: item.variant,
        transaction_type: type === 'in' ? 'restock' : 'sale',
        quantity_change: type === 'in' ? amount : -amount,
        notes: `Quick manual ${type} through dashboard`
      });
      toast.success(`Stock updated for ${item.product_id?.name}`);
      fetchInventory();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Adjustment failed');
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-head font-black text-brand-dark flex items-center gap-3">
            <Package className="text-brand-warm" size={32} />
            Inventory <span className="text-brand-green">Management</span>
          </h1>
          <p className="text-brand-dark/50 font-bold mt-1 uppercase tracking-widest text-[10px]">Track and manage your stock levels</p>
        </div>
        
        <div className="flex items-center gap-3">
          <button 
            onClick={fetchInventory}
            className="p-3 bg-white border border-brand-green/10 rounded-2xl text-brand-green hover:bg-brand-green/5 transition-colors shadow-sm"
          >
            <RefreshCcw size={20} />
          </button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total SKUs" value={stats.total} icon={Package} color="blue" />
        <StatCard label="In Stock" value={stats.in} icon={CheckCircle2} color="green" />
        <StatCard label="Low Stock" value={stats.low} icon={AlertTriangle} color="orange" isActive={filter === 'low'} onClick={() => setFilter('low')} />
        <StatCard label="Out of Stock" value={stats.out} icon={XCircle} color="red" isActive={filter === 'out'} onClick={() => setFilter('out')} />
      </div>

      {/* Filters & Table Card */}
      <div className="bg-white rounded-[32px] shadow-sm border border-brand-green/5 overflow-hidden">
        <div className="p-6 border-b border-brand-green/5 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-dark/30" size={18} />
            <input 
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-brand-green/5 border-none rounded-2xl py-3 pl-12 pr-4 text-sm font-bold placeholder:text-brand-dark/30 focus:ring-2 focus:ring-brand-warm transition-all"
            />
          </div>

          <div className="flex items-center gap-2">
            <Filter size={18} className="text-brand-dark/30 mr-1" />
            <FilterChip label="All" active={filter === 'all'} onClick={() => setFilter('all')} />
            <FilterChip label="In Stock" active={filter === 'in'} onClick={() => setFilter('in')} />
            <FilterChip label="Low" active={filter === 'low'} onClick={() => setFilter('low')} color="orange" />
            <FilterChip label="Sold Out" active={filter === 'out'} onClick={() => setFilter('out')} color="red" />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-brand-green/[0.02]">
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-brand-dark/40">Product</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-brand-dark/40 text-center">Current Qty</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-brand-dark/40">Status</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-brand-dark/40">Reorder Level</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-brand-dark/40">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-green/5">
              {loading ? (
                <tr><td colSpan="5" className="px-6 py-20 text-center text-brand-dark/30 font-bold italic">Loading inventory...</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan="5" className="px-6 py-20 text-center text-brand-dark/30 font-bold italic">No inventory matching filters</td></tr>
              ) : filtered.map((item) => (
                <tr key={item._id} className="hover:bg-brand-green/[0.01] transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-brand-green/5 overflow-hidden flex-shrink-0 border border-brand-green/5">
                        <img src={item.product_id?.images?.[0]} alt="" className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <p className="font-bold text-brand-dark text-sm">{item.product_id?.name || 'Unknown Product'}</p>
                        <p className="text-[10px] font-black text-brand-dark/40 uppercase tracking-tighter mt-0.5">{item.variant || 'Default Variant'}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`text-lg font-head font-black ${
                      item.quantity === 0 ? 'text-brand-sale' : 
                      item.quantity <= item.reorder_level ? 'text-brand-warm' : 
                      'text-brand-green'
                    }`}>
                      {item.quantity}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <StockStatusBadge quantity={item.quantity} reorderLevel={item.reorder_level} />
                  </td>
                  <td className="px-6 py-4 font-bold text-brand-dark/50 text-sm">
                    {item.reorder_level} units
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => handleAdjust(item, 'in')}
                        className="flex items-center gap-1 bg-brand-green/10 text-brand-green px-3 py-1.5 rounded-xl text-xs font-bold hover:bg-brand-green hover:text-white transition-all shadow-sm"
                      >
                        <ArrowUpRight size={14} />
                        In
                      </button>
                      <button 
                         onClick={() => handleAdjust(item, 'out')}
                        className="flex items-center gap-1 bg-brand-warm/10 text-brand-warm px-3 py-1.5 rounded-xl text-xs font-bold hover:bg-brand-warm hover:text-white transition-all shadow-sm"
                      >
                        <ArrowDownRight size={14} />
                        Out
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, icon: Icon, color, isActive, onClick }) {
  const colors = {
    blue:   'bg-blue-50 text-blue-600 border-blue-100',
    green:  'bg-emerald-50 text-emerald-600 border-emerald-100',
    orange: 'bg-orange-50 text-orange-600 border-orange-100',
    red:    'bg-rose-50 text-rose-600 border-rose-100'
  };

  return (
    <div 
      onClick={onClick}
      className={`bg-white p-6 rounded-[32px] border transition-all cursor-pointer ${
        isActive ? 'ring-2 ring-brand-warm shadow-lg scale-[1.02]' : 'border-brand-green/5 shadow-sm hover:translate-y-[-2px]'
      }`}
    >
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-2xl border ${colors[color]}`}>
          <Icon size={24} />
        </div>
        <div className={`text-lg font-head font-black ${colors[color].split(' ')[1]}`}>
          {value}
        </div>
      </div>
      <p className="text-[10px] font-black text-brand-dark/40 uppercase tracking-[2px]">{label}</p>
    </div>
  );
}

function FilterChip({ label, active, onClick, color = 'green' }) {
  const colors = {
    green:  active ? 'bg-brand-green text-white shadow-lg shadow-brand-green/20' : 'bg-brand-green/5 text-brand-green hover:bg-brand-green/10',
    orange: active ? 'bg-brand-warm text-white shadow-lg shadow-brand-warm/20' : 'bg-brand-warm/5 text-brand-warm hover:bg-brand-warm/10',
    red:    active ? 'bg-brand-sale text-white shadow-lg shadow-brand-sale/20' : 'bg-brand-sale/5 text-brand-sale hover:bg-brand-sale/10',
  };

  return (
    <button 
      onClick={onClick}
      className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${colors[color]}`}
    >
      {label}
    </button>
  );
}

function StockStatusBadge({ quantity, reorderLevel }) {
  if (quantity === 0) return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-brand-sale/10 text-brand-sale text-[10px] font-black uppercase rounded-full border border-brand-sale/20">
      <XCircle size={10} /> Sold Out
    </span>
  );
  if (quantity <= reorderLevel) return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-brand-warm/10 text-brand-warm text-[10px] font-black uppercase rounded-full border border-brand-warm/20">
      <AlertTriangle size={10} /> Low Stock
    </span>
  );
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-brand-green/10 text-brand-green text-[10px] font-black uppercase rounded-full border border-brand-green/20">
      <CheckCircle2 size={10} /> Active
    </span>
  );
}
