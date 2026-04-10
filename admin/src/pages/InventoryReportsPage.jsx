import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { 
  ClipboardList, Download, FileText, AlertTriangle, 
  CheckCircle2, XCircle, Package, TrendingUp, TrendingDown,
  ChevronRight, Calendar, Filter, ShoppingBag, Truck, IndianRupee,
  Users, BarChart3, PieChart, Box
} from 'lucide-react';
import { useToast } from '../components/Toast';

export default function InventoryReportsPage() {
  const [inventory, setInventory] = useState([]);
  const [history, setHistory] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('inventory'); // inventory, sales, shipping
  const [activeSubReport, setActiveSubReport] = useState('summary'); 
  const [dateFilter, setDateFilter] = useState('all'); // all, month, today, custom
  const [customDate, setCustomDate] = useState(new Date().toISOString().split('T')[0]);
  const toast = useToast();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [invRes, histRes, orderRes] = await Promise.all([
          api.get('/inventory'),
          api.get('/inventory/history'),
          api.get('/orders/admin/all')
        ]);
        setInventory(invRes.data);
        setHistory(histRes.data);
        setOrders(orderRes.data || []);
      } catch (err) {
        toast.error('Error loading report data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // --- FILTERING LOGIC ---
  const getFilteredData = (data, dateKey) => {
    if (dateFilter === 'all') return data;
    const now = new Date();
    const today = new Date().toDateString();

    return data.filter(item => {
      const itemDate = new Date(item[dateKey]);
      if (dateFilter === 'today') return itemDate.toDateString() === today;
      if (dateFilter === 'month') {
        const lastMonth = new Date();
        lastMonth.setMonth(now.getMonth() - 1);
        return itemDate >= lastMonth;
      }
      if (dateFilter === 'custom') {
        const selected = new Date(customDate).toDateString();
        return itemDate.toDateString() === selected;
      }
      return true;
    });
  };

  const filteredOrders = getFilteredData(orders, 'createdAt');
  const filteredHistory = getFilteredData(history, 'created_at');

  // --- CALCULATIONS ---
  const invStats = {
    totalUnits: inventory.reduce((acc, curr) => acc + (curr.quantity || 0), 0),
    totalSKUs: inventory.length,
    lowStock: inventory.filter(i => i.quantity > 0 && i.quantity <= (i.reorder_level || 5)).length,
    outOfStock: inventory.filter(i => (i.quantity || 0) === 0).length,
  };

  const salesStats = {
    totalRevenue: filteredOrders.filter(o => o.payment_status === 'PAID').reduce((acc, o) => acc + o.total_amount, 0),
    totalOrders: filteredOrders.length,
    pendingPayments: filteredOrders.filter(o => o.payment_status === 'PENDING').length,
    avgOrderValue: filteredOrders.length ? (filteredOrders.reduce((acc, o) => acc + o.total_amount, 0) / filteredOrders.length) : 0
  };

  const shippingStats = {
    processing: filteredOrders.filter(o => o.order_status === 'PROCESSING').length,
    shipped: filteredOrders.filter(o => o.order_status === 'SHIPPED').length,
    delivered: filteredOrders.filter(o => o.order_status === 'DELIVERED').length,
    cancelled: filteredOrders.filter(o => o.order_status === 'CANCELLED').length
  };

  // --- EXPORTERS ---
  const exportToCSV = (data, filename) => {
    if (!data || !data.length) return toast.error('No data to export');
    const headers = Object.keys(data[0]).join(',');
    const rows = data.map(obj => 
      Object.values(obj).map(val => 
        typeof val === 'string' ? `"${val.replace(/"/g, '""')}"` : val
      ).join(',')
    ).join('\n');
    const csvContent = "data:text/csv;charset=utf-8," + headers + "\n" + rows;
    const link = document.createElement("a");
    link.setAttribute("href", encodeURI(csvContent));
    const finalName = dateFilter === 'all' ? filename : `${filename}_${dateFilter}_${customDate}`;
    link.setAttribute("download", `${finalName}_${new Date().toLocaleDateString()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownloadFullInventory = () => {
    const data = inventory.map(item => ({
      'Product Name': item.product_id?.name || 'Unknown',
      'Variant': item.variant || 'Default',
      'Qty': item.quantity,
      'Reorder Level': item.reorder_level,
      'Status': item.quantity === 0 ? 'Out of Stock' : (item.quantity <= item.reorder_level ? 'Low' : 'Healthy')
    }));
    exportToCSV(data, 'Inventory_Full_Snapshot');
  };

  const handleDownloadMovementLogs = () => {
    const data = filteredHistory.map(h => ({
      'Date': new Date(h.created_at).toLocaleString(),
      'Product': h.product_id?.name || 'Unknown',
      'Variant': h.variant,
      'Type': h.transaction_type,
      'Change': h.quantity_change,
      'Before': h.quantity_before,
      'After': h.quantity_after,
      'By': h.performed_by,
      'Notes': h.notes || ''
    }));
    exportToCSV(data, 'Inventory_Movement_Report');
  }

  const handleDownloadIncome = () => {
    const data = filteredOrders.map(o => ({
      'Order ID': o._id,
      'Date': new Date(o.createdAt).toLocaleString(),
      'Customer': o.user?.name || 'Guest',
      'Subtotal': o.subtotal,
      'Shipping': o.shipping_fee,
      'Discount': o.discount_amount,
      'Total Amount': o.total_amount,
      'Payment Status': o.payment_status,
      'Method': o.payment_method
    }));
    exportToCSV(data, 'Income_and_Sales_Report');
  };

  const handleDownloadDetailedOrders = () => {
    const data = [];
    filteredOrders.forEach(o => {
      o.items.forEach(item => {
        data.push({
          'Order ID': o._id,
          'Date': new Date(o.createdAt).toLocaleDateString(),
          'Product': item.name,
          'Variant': item.variant,
          'Qty': item.qty,
          'Price': item.price,
          'Item Total': item.qty * item.price,
          'Status': o.order_status,
          'Customer': o.user?.name,
          'City': o.shipping_address?.city
        });
      });
    });
    exportToCSV(data, 'Detailed_Orders_Items_Report');
  };

  const handleDownloadShippingList = () => {
    const data = filteredOrders.map(o => ({
      'Order ID': o._id,
      'Date': new Date(o.createdAt).toLocaleDateString(),
      'Status': o.order_status,
      'Recipient': o.shipping_address?.name,
      'Phone': o.shipping_address?.phone,
      'Address': `${o.shipping_address?.address}, ${o.shipping_address?.city}, ${o.shipping_address?.state} - ${o.shipping_address?.pincode}`
    }));
    exportToCSV(data, 'Shipping_Checklist_Report');
  };

  if (loading) return <div className="p-20 text-center font-bold text-brand-dark/30 italic px-4">Generating Advanced Reports...</div>;

  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-20">
      {/* Page Title & Main Tabs */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-head font-black text-brand-dark flex items-center gap-3">
            <ClipboardList className="text-brand-green" size={32} />
            Business <span className="text-brand-green">Insights</span>
          </h1>
          <p className="text-brand-dark/50 font-bold mt-1 uppercase tracking-widest text-[10px]">Complete Financial & Logistics Reporting</p>
        </div>

        <div className="flex bg-white p-1 rounded-2xl shadow-sm border border-brand-green/5 overflow-x-auto scrollbar-hide">
          <MainTab active={activeTab === 'inventory'} icon={Package} label="Inventory" onClick={() => { setActiveTab('inventory'); setActiveSubReport('summary'); }} />
          <MainTab active={activeTab === 'sales'} icon={IndianRupee} label="Income & Sales" onClick={() => { setActiveTab('sales'); setActiveSubReport('summary'); }} />
          <MainTab active={activeTab === 'shipping'} icon={Truck} label="Logistics" onClick={() => { setActiveTab('shipping'); setActiveSubReport('summary'); }} />
        </div>
      </div>

      {/* --- FILTER BAR --- */}
      <div className="flex flex-wrap gap-4 items-center bg-white p-6 rounded-[32px] border border-brand-green/5 shadow-sm">
        <div className="flex items-center gap-2 text-brand-dark font-black uppercase tracking-widest text-[10px] bg-brand-light/50 px-4 py-2 rounded-xl">
           <Filter size={14} className="text-brand-green" /> Filter Reports:
        </div>
        <div className="flex bg-brand-light/20 p-1 rounded-2xl border border-brand-green/5">
           <FilterBtn active={dateFilter === 'all'} label="All History" onClick={() => setDateFilter('all')} />
           <FilterBtn active={dateFilter === 'month'} label="Past Month" onClick={() => setDateFilter('month')} />
           <FilterBtn active={dateFilter === 'today'} label="Today" onClick={() => setDateFilter('today')} />
           <FilterBtn active={dateFilter === 'custom'} label="Specific Day" onClick={() => setDateFilter('custom')} />
        </div>
        {dateFilter === 'custom' && (
          <div className="flex items-center gap-3 animate-in slide-in-from-left-4 duration-300">
             <Calendar size={16} className="text-brand-green" />
             <input 
               type="date" 
               value={customDate} 
               onChange={(e) => setCustomDate(e.target.value)}
               className="bg-brand-light/50 border-none rounded-2xl px-5 py-2 text-sm font-bold text-brand-dark outline-none focus:ring-2 ring-brand-green/20"
             />
          </div>
        )}
      </div>

      {/* --- INVENTORY TAB --- */}
      {activeTab === 'inventory' && (
        <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <SummaryCard label="Total Units" value={invStats.totalUnits} icon={Package} color="blue" />
              <SummaryCard label="Healthy SKUs" value={invStats.totalSKUs - invStats.lowStock - invStats.outOfStock} icon={CheckCircle2} color="green" />
              <SummaryCard label="Low Stock" value={invStats.lowStock} icon={AlertTriangle} color="orange" />
              <SummaryCard label="Sold Out" value={invStats.outOfStock} icon={XCircle} color="red" />
           </div>
           <ReportSection 
              title="Inventory Reports" 
              actions={[
                { title: 'Full Stock Snapshot', desc: 'Current units for all products (Live)', onDownload: handleDownloadFullInventory },
                { title: 'Inventory Movement Logs', desc: 'Stock In/Out activity for the selected period', onDownload: handleDownloadMovementLogs },
                { title: 'Restock Action List', desc: 'Items currently under reorder level', onDownload: () => {
                    const data = inventory.filter(i => i.quantity <= i.reorder_level).map(i => ({ Product: i.product_id?.name, Variant: i.variant, Stock: i.quantity, Reorder: i.reorder_level }));
                    exportToCSV(data, 'Low_Stock_Action_List');
                }}
              ]}
           />
        </div>
      )}

      {/* --- SALES & INCOME TAB --- */}
      {activeTab === 'sales' && (
        <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <SummaryCard label="Total Revenue" value={`\u20b9${salesStats.totalRevenue.toLocaleString()}`} icon={IndianRupee} color="green" />
              <SummaryCard label="Orders Count" value={salesStats.totalOrders} icon={ShoppingBag} color="blue" />
              <SummaryCard label="Avg Order Value" value={`\u20b9${Math.round(salesStats.avgOrderValue)}`} icon={BarChart3} color="orange" />
              <SummaryCard label="Unpaid Orders" value={salesStats.pendingPayments} icon={XCircle} color="red" />
           </div>
           
           <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <ReportActionCard 
                title="Financial Reports" 
                icon={<BarChart3 size={20} />}
                items={[
                  { title: 'Complete Income Report', desc: 'Financial breakdown of orders in selected period', onDownload: handleDownloadIncome },
                  { title: 'Itemized Sales Analysis', desc: 'Every product sold during this timeframe', onDownload: handleDownloadDetailedOrders },
                  { title: 'Revenue by Product', desc: 'Summary of earnings per product SKU (Filtered)', onDownload: () => {
                      const revenues = {};
                      filteredOrders.filter(o => o.payment_status === 'PAID').forEach(o => {
                        o.items.forEach(it => {
                          const key = `${it.name} (${it.variant})`;
                          revenues[key] = (revenues[key] || 0) + (it.price * it.qty);
                        });
                      });
                      const data = Object.keys(revenues).map(k => ({ 'Product (Variant)': k, 'Total Earnings': `\u20b9${revenues[k]}` }));
                      exportToCSV(data, 'Revenue_by_Product_Summary');
                  }}
                ]}
              />

              <div className="bg-white rounded-[40px] p-8 border border-brand-green/5 shadow-sm">
                 <h3 className="font-head text-xl font-black mb-6 flex items-center gap-2">
                    <TrendingUp className="text-brand-green" size={20} /> Latest Activity ({dateFilter})
                 </h3>
                 <div className="space-y-4">
                    {filteredOrders.length === 0 && <div className="p-8 text-center text-brand-dark/20 font-black italic uppercase text-xs">No records found for this period</div>}
                    {filteredOrders.slice(0, 5).map((o, i) => (
                      <div key={i} className="flex justify-between items-center p-4 bg-brand-light/30 rounded-2xl hover:bg-brand-light/50 transition-colors">
                         <div>
                            <p className="text-sm font-bold">{o.user?.name || 'Guest User'}</p>
                            <p className="text-[10px] font-black text-brand-dark/30 uppercase">{new Date(o.createdAt).toLocaleDateString()}</p>
                         </div>
                         <div className="text-right">
                            <p className="text-sm font-black text-brand-green">\u20b9{o.total_amount}</p>
                            <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded-full ${o.payment_status === 'PAID' ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-500'}`}>{o.payment_status}</span>
                         </div>
                      </div>
                    ))}
                 </div>
              </div>
           </div>
        </div>
      )}

      {/* --- LOGISTICS TAB --- */}
      {activeTab === 'shipping' && (
        <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <SummaryCard label="Needs Shipping" value={shippingStats.processing} icon={Box} color="orange" />
              <SummaryCard label="Shipped" value={shippingStats.shipped} icon={Truck} color="blue" />
              <SummaryCard label="Delivered" value={shippingStats.delivered} icon={CheckCircle2} color="green" />
              <SummaryCard label="Cancelled" value={shippingStats.cancelled} icon={XCircle} color="red" />
           </div>

           <ReportSection 
              title="Shipping & Fulfillment" 
              actions={[
                { title: 'Shipping Manifest', desc: 'Recipient addresses for current period', onDownload: handleDownloadShippingList },
                { title: 'Pending Fulfilment Report', desc: 'Orders in PROCESSING state (Filtered)', onDownload: () => {
                    const data = filteredOrders.filter(o => o.order_status === 'PROCESSING').map(o => ({ 'Order ID': o._id, 'Name': o.shipping_address?.name, 'City': o.shipping_address?.city, 'Items': o.items.map(it => `${it.qty}x ${it.name}`).join(' | ') }));
                    exportToCSV(data, 'Pending_Fulfillment_Report');
                }},
                { title: 'Dispatch History', desc: 'Tracking history of orders in this timeframe', onDownload: () => {
                    const data = filteredOrders.filter(o => o.order_status === 'SHIPPED').map(o => ({ 'Order ID': o._id, 'Customer': o.shipping_address?.name, 'Date': new Date(o.createdAt).toLocaleDateString() }));
                    exportToCSV(data, 'Shipped_Orders_Report');
                }}
              ]}
           />
        </div>
      )}
    </div>
  );
}

// --- SMALL COMPONENTS ---

function MainTab({ active, icon: Icon, label, onClick }) {
  return (
    <button 
      onClick={onClick}
      className={`flex items-center gap-3 px-8 py-4 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all ${
        active ? 'bg-brand-green text-white shadow-xl' : 'text-brand-dark/40 hover:text-brand-green bg-transparent hover:bg-brand-light/50'
      }`}
    >
      <Icon size={18} />
      {label}
    </button>
  );
}

function FilterBtn({ active, label, onClick }) {
  return (
    <button 
      onClick={onClick}
      className={`px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
        active ? 'bg-white text-brand-green shadow-sm' : 'text-brand-dark/30 hover:text-brand-dark bg-transparent'
      }`}
    >
      {label}
    </button>
  );
}

function SummaryCard({ label, value, icon: Icon, color }) {
  const colors = {
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-green-50 text-green-600',
    orange: 'bg-orange-50 text-orange-600',
    red: 'bg-red-50 text-red-600'
  };
  return (
    <div className="bg-white p-8 rounded-[40px] border border-brand-green/5 shadow-sm hover:scale-[1.03] transition-all">
      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-6 ${colors[color]}`}>
        <Icon size={24} />
      </div>
      <h4 className="text-4xl font-head font-black mb-1">{value}</h4>
      <p className="text-[10px] font-black text-brand-dark uppercase tracking-widest opacity-40">{label}</p>
    </div>
  );
}

function ReportSection({ title, actions }) {
  return (
    <div className="bg-white rounded-[40px] p-8 border border-brand-green/5 shadow-sm">
       <h3 className="font-head text-2xl font-black mb-8 flex items-center gap-3">
          <Download className="text-brand-green" size={24} /> {title}
       </h3>
       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {actions.map((act, i) => (
            <div key={i} className="p-6 bg-brand-green/[0.03] rounded-3xl border border-brand-green/5 group hover:bg-white hover:border-brand-green/20 transition-all flex flex-col justify-between">
               <div>
                  <h5 className="text-sm font-black text-brand-dark mb-1">{act.title}</h5>
                  <p className="text-[10px] font-medium text-brand-dark/40 mb-6">{act.desc}</p>
               </div>
               <button 
                  onClick={act.onDownload} 
                  className="flex items-center gap-2 text-brand-green text-[10px] font-black uppercase tracking-widest group-hover:gap-3 transition-all"
                >
                  Download CSV <ChevronRight size={14} />
               </button>
            </div>
          ))}
       </div>
    </div>
  );
}

function ReportActionCard({ title, icon, items }) {
  return (
    <div className="bg-white rounded-[40px] p-8 border border-brand-green/5 shadow-sm h-fit">
      <h3 className="font-head text-xl font-black mb-8 flex items-center gap-2">
        {icon} {title}
      </h3>
      <div className="space-y-4">
        {items.map((item, i) => (
          <div key={i} className="flex items-center justify-between p-4 bg-brand-green/[0.03] rounded-2xl border border-brand-green/5 group hover:bg-white hover:border-brand-green/20 transition-all">
            <div>
              <h5 className="text-sm font-bold text-brand-dark">{item.title}</h5>
              <p className="text-[10px] font-medium text-brand-dark/40">{item.desc}</p>
            </div>
            <button onClick={item.onDownload} className="w-10 h-10 rounded-xl flex items-center justify-center bg-brand-green text-white shadow-lg hover:scale-110 active:scale-95 transition-all">
              <Download size={18} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}


