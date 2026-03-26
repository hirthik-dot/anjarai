import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { History as HistoryIcon, ArrowUpRight, ArrowDownRight, RefreshCcw, Search, Clock, User as UserIcon } from 'lucide-react';
import { useToast } from '../components/Toast';

export default function InventoryHistoryPage() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/inventory/history');
      setHistory(res.data);
    } catch (err) {
      toast.error('Error loading history');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-head font-black text-brand-dark flex items-center gap-3">
            <HistoryIcon className="text-brand-warm" size={32} />
            Stock <span className="text-brand-green">Movement Log</span>
          </h1>
          <p className="text-brand-dark/50 font-bold mt-1 uppercase tracking-widest text-[10px]">Real-time history of all inventory changes</p>
        </div>
        
        <button 
          onClick={fetchHistory}
          className="p-3 bg-white border border-brand-green/10 rounded-2xl text-brand-green hover:bg-brand-green/5 transition-colors shadow-sm flex items-center gap-2 font-bold text-xs"
        >
          <RefreshCcw size={18} /> Refresh Logs
        </button>
      </div>

      <div className="bg-white rounded-[40px] shadow-sm border border-brand-green/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-brand-green/[0.02]">
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-brand-dark/40">Timestamp</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-brand-dark/40">Product</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-brand-dark/40">Type</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-brand-dark/40 text-center">Change</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-brand-dark/40">Final Stock</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-brand-dark/40">Admin</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-green/5">
              {loading ? (
                <tr><td colSpan="6" className="px-8 py-20 text-center text-brand-dark/30 font-bold italic">Loading logs...</td></tr>
              ) : history.length === 0 ? (
                <tr><td colSpan="6" className="px-8 py-20 text-center text-brand-dark/30 font-bold italic">No stock movements recorded yet. Try adjusting inventory.</td></tr>
              ) : history.map((tx) => (
                <tr key={tx._id} className="hover:bg-brand-green/[0.01] transition-colors group">
                  <td className="px-8 py-5 whitespace-nowrap">
                    <div className="flex items-center gap-2 text-brand-dark/50 font-bold text-xs">
                       <Clock size={14} className="opacity-50" />
                       {new Date(tx.created_at || tx.createdAt).toLocaleString('en-IN', {
                         day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit'
                       })}
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-4">
                      {tx.product_id?.images?.[0] && (
                        <img src={tx.product_id?.images?.[0]} className="w-8 h-8 rounded-lg object-cover bg-brand-green/5" alt="" />
                      )}
                      <div>
                        <p className="font-bold text-brand-dark text-[13px] leading-none mb-1">{tx.product_id?.name || 'Deleted Product'}</p>
                        <p className="text-[10px] font-black text-brand-dark/30 uppercase tracking-widest">{tx.variant}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <span className={`text-[10px] font-black uppercase px-2.5 py-1 rounded-full border ${
                      tx.transaction_type === 'restock' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                      tx.transaction_type === 'sale' ? 'bg-orange-50 text-orange-600 border-orange-100' :
                      'bg-gray-50 text-gray-500 border-gray-100'
                    }`}>
                      {tx.transaction_type}
                    </span>
                  </td>
                  <td className="px-8 py-5 text-center">
                    <div className={`flex items-center justify-center gap-1.5 font-head font-black text-base ${
                      tx.quantity_change > 0 ? 'text-emerald-500' : 'text-rose-500'
                    }`}>
                      {tx.quantity_change > 0 ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
                      {Math.abs(tx.quantity_change)}
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <p className="font-bold text-brand-dark text-sm">{tx.quantity_after} units</p>
                    <p className="text-[10px] font-black text-brand-dark/20 uppercase">Before: {tx.quantity_before}</p>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-2 text-brand-dark/50 font-bold text-xs">
                       <UserIcon size={14} />
                       {tx.performed_by}
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
