import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ShoppingBag, RefreshCw } from 'lucide-react';
import { useToast } from '../components/Toast';

const STATUS_ORDER = ['PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'];

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);
  const toast = useToast();

  const load = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get('/orders/admin/all');
      setOrders(Array.isArray(data) ? data : []);
    } catch (e) {
      toast.error(e.response?.data?.error || 'Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const patchStatus = async (id, order_status) => {
    try {
      const { data } = await axios.patch(`/orders/admin/${id}`, { order_status });
      setOrders((prev) => prev.map((o) => (o._id === id ? data : o)));
      toast.success('Order updated');
    } catch (e) {
      toast.error(e.response?.data?.error || 'Update failed');
    }
  };

  return (
    <div className="p-4 sm:p-8 max-w-[1400px] mx-auto animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 sm:mb-10">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-brand-green/10 flex items-center justify-center text-brand-green">
              <ShoppingBag className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <h1 className="font-head text-2xl sm:text-4xl font-black text-brand-dark tracking-tight">Orders</h1>
          </div>
          <p className="text-brand-dark/50 font-bold mt-1 uppercase tracking-widest text-[10px]">Customer orders & payments</p>
        </div>
        <button
          type="button"
          onClick={() => load()}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-light border border-brand-green-pale text-brand-dark font-bold text-xs uppercase tracking-widest hover:bg-brand-green-pale/30 transition-colors"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {loading ? (
        <p className="text-brand-mid font-bold italic py-20 text-center">Loading orders…</p>
      ) : orders.length === 0 ? (
        <p className="text-brand-mid font-bold italic py-20 text-center">No orders yet.</p>
      ) : (
        <div className="space-y-4">
          {orders.map((o) => (
            <div
              key={o._id}
              className="bg-white rounded-2xl sm:rounded-3xl border border-gray-100/80 shadow-sm overflow-hidden"
            >
              <button
                type="button"
                onClick={() => setExpanded(expanded === o._id ? null : o._id)}
                className="w-full text-left px-4 sm:px-6 py-4 sm:py-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 hover:bg-brand-light/30 transition-colors"
              >
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-brand-mid">
                    #{String(o._id).slice(-8).toUpperCase()}
                  </p>
                  <p className="font-bold text-brand-dark mt-1">
                    {o.user?.name || 'Customer'} · {o.user?.email || '—'}
                  </p>
                  <p className="text-xs text-brand-mid mt-1">
                    {o.createdAt ? new Date(o.createdAt).toLocaleString() : ''}
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <span className="text-lg font-black text-brand-green">₹{o.total_amount}</span>
                  <span className={`text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full ${o.payment_status === 'PAID' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>
                    {o.payment_status}
                  </span>
                  <select
                    value={o.order_status}
                    onClick={(e) => e.stopPropagation()}
                    onChange={(e) => {
                      e.stopPropagation();
                      patchStatus(o._id, e.target.value);
                    }}
                    className="text-[10px] font-black uppercase tracking-widest border-2 border-brand-green-pale rounded-xl px-2 py-1.5 bg-white text-brand-dark outline-none focus:border-brand-green"
                  >
                    {STATUS_ORDER.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
              </button>

              {expanded === o._id && (
                <div className="px-4 sm:px-6 pb-5 pt-0 border-t border-gray-50 bg-brand-light/20">
                  <ul className="divide-y divide-gray-100/80 mt-4">
                    {(o.items || []).map((line, idx) => (
                      <li key={idx} className="py-3 flex gap-3 text-sm">
                        {line.image && (
                          <img src={line.image} alt="" className="w-14 h-14 rounded-xl object-cover border border-gray-100 shrink-0" />
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-brand-dark">{line.name}</p>
                          {line.variant && line.variant !== 'default' && (
                            <p className="text-xs text-brand-mid">{line.variant}</p>
                          )}
                          <p className="text-xs text-brand-mid mt-1">Qty {line.qty} × ₹{line.price}</p>
                        </div>
                        <span className="font-black text-brand-green shrink-0">₹{line.qty * line.price}</span>
                      </li>
                    ))}
                  </ul>
                  {o.shipping_address && (
                    <div className="mt-4 p-4 rounded-xl bg-white border border-gray-100 text-sm">
                      <p className="text-[10px] font-black uppercase tracking-widest text-brand-mid mb-2">Ship to</p>
                      <p className="font-bold">{o.shipping_address.name}</p>
                      <p className="text-brand-mid">{o.shipping_address.phone}</p>
                      <p className="text-brand-mid mt-2 leading-relaxed">
                        {o.shipping_address.address}, {o.shipping_address.city}, {o.shipping_address.state} {o.shipping_address.pincode}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
