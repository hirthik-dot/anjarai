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

  // --- CALCULATIONS ---
  const invStats = {
    totalUnits: inventory.reduce((acc, curr) => acc + (curr.quantity || 0), 0),
    totalSKUs: inventory.length,
    lowStock: inventory.filter(i => i.quantity > 0 && i.quantity <= (i.reorder_level || 5)).length,
    outOfStock: inventory.filter(i => (i.quantity || 0) === 0).length,
  };

  const salesStats = {
    totalRevenue: orders.filter(o => o.payment_status === 'PAID').reduce((acc, o) => acc + o.total_amount, 0),
    totalOrders: orders.length,
    pendingPayments: orders.filter(o => o.payment_status === 'PENDING').length,
    avgOrderValue: orders.length ? (orders.reduce((acc, o) => acc + o.total_amount, 0) / orders.length) : 0
  };

  const shippingStats = {
    processing: orders.filter(o => o.order_status === 'PROCESSING').length,
    shipped: orders.filter(o => o.order_status === 'SHIPPED').length,
    delivered: orders.filter(o => o.order_status === 'DELIVERED').length,
    cancelled: orders.filter(o => o.order_status === 'CANCELLED').length
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
    link.setAttribute("download", `${filename}_${new Date().toLocaleDateString()}.csv`);
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
    exportToCSV(data, 'Inventory_Full_Report');
  };

  const handleDownloadIncome = () => {
    const data = orders.map(o => ({
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
    orders.forEach(o => {
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
    const data = orders.map(o => ({
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
    <div className="space-y-8 animate-in fade-in duration-700">
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

      {/* --- INVENTORY TAB --- */}
      {activeTab === 'inventory' && (
        <div className="space-y-8">
           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 animate-in slide-in-from-bottom-4 duration-500">
              <SummaryCard label="Total Units" value={invStats.totalUnits} icon={Package} color="blue" />
              <SummaryCard label="Healthy SKUs" value={invStats.totalSKUs - invStats.lowStock - invStats.outOfStock} icon={CheckCircle2} color="green" />
              <SummaryCard label="Low Stock" value={invStats.lowStock} icon={AlertTriangle} color="orange" />
              <SummaryCard label="Sold Out" value={invStats.outOfStock} icon={XCircle} color="red" />
           </div>
           <ReportSection 
              title="Inventory Reports" 
              actions={[
                { title: 'Full Stock Snapshot', desc: 'Current units for all products', onDownload: handleDownloadFullInventory },
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
              <SummaryCard label="Total Revenue" value={`₹${salesStats.totalRevenue.toLocaleString()}`} icon={IndianRupee} color="green" />
              <SummaryCard label="Orders Count" value={salesStats.totalOrders} icon={ShoppingBag} color="blue" />
              <SummaryCard label="Avg Order Value" value={`₹${Math.round(salesStats.avgOrderValue)}`} icon={BarChart3} color="orange" />
              <SummaryCard label="Unpaid Orders" value={salesStats.pendingPayments} icon={XCircle} color="red" />
           </div>
           
           <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <ReportActionCard 
                title="Financial Reports" 
                icon={<BarChart3 size={20} />}
                items={[
                  { title: 'Complete Income Report', desc: 'Financial breakdown of all orders & statuses', onDownload: handleDownloadIncome },
                  { title: 'Itemized Sales Analysis', desc: 'Detailed view of every product sold (Complete Data)', onDownload: handleDownloadDetailedOrders },
                  { title: 'Revenue by Product', desc: 'Summary of earnings per product SKU', onDownload: () => {
                      const revenues = {};
                      orders.filter(o => o.payment_status === 'PAID').forEach(o => {
                        o.items.forEach(it => {
                          const key = `${it.name} (${it.variant})`;
                          revenues[key] = (revenues[key] || 0) + (it.price * it.qty);
                        });
                      });
                      const data = Object.keys(revenues).map(k => ({ 'Product (Variant)': k, 'Total Earnings': `₹${revenues[k]}` }));
                      exportToCSV(data, 'Revenue_by_Product_Summary');
                  }}
                ]}
              />

              <div className="bg-white rounded-[40px] p-8 border border-brand-green/5 shadow-sm">
                 <h3 className="font-head text-xl font-black mb-6">Recent Sales Activity</h3>
                 <div className="space-y-4">
                    {orders.slice(0, 5).map((o, i) => (
                      <div key={i} className="flex justify-between items-center p-4 bg-brand-light/30 rounded-2xl">
                         <div>
                            <p className="text-sm font-bold">{o.user?.name || 'Guest User'}</p>
                            <p className="text-[10px] font-black text-brand-dark/30 uppercase">{new Date(o.createdAt).toLocaleDateString()}</p>
                         </div>
                         <div className="text-right">
                            <p className="text-sm font-black text-brand-green">₹{o.total_amount}</p>
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
                { title: 'Shipping Manifest', desc: 'Full list of recipient addresses and phone numbers', onDownload: handleDownloadShippingList },
                { title: 'Pending Fulfilment Report', desc: 'Orders strictly in PROCESSING state', onDownload: () => {
                    const data = orders.filter(o => o.order_status === 'PROCESSING').map(o => ({ 'Order ID': o._id, 'Name': o.shipping_address?.name, 'City': o.shipping_address?.city, 'Items': o.items.map(it => `${it.qty}x ${it.name}`).join(' | ') }));
                    exportToCSV(data, 'Pending_Fulfillment_Report');
                }},
                { title: 'Shipped Logs', desc: 'Tracking history of dispatched orders', onDownload: () => {
                    const data = orders.filter(o => o.order_status === 'SHIPPED').map(o => ({ 'Order ID': o._id, 'Customer': o.shipping_address?.name, 'Date': new Date(o.createdAt).toLocaleDateString() }));
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
      className={`flex items-center gap-2 px-6 py-3.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
        active ? 'bg-brand-green text-white shadow-lg' : 'text-brand-dark/40 hover:text-brand-green bg-transparent'
      }`}
    >
      <Icon size={16} />
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


