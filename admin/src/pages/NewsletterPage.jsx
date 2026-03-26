import { useState, useEffect } from 'react';
import SectionCard from '../components/SectionCard';
import DataTable from '../components/DataTable';
import ConfirmDialog from '../components/ConfirmDialog';
import api from '../utils/api';
import { useToast } from '../components/Toast';
import { formatDate } from '../utils/helpers';
import { Download, Mail, Trash2, Search, Sparkles } from 'lucide-react';

export default function NewsletterPage() {
  const [subs, setSubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState(null);
  const toast = useToast();

  const fetchSubs = async () => {
    try {
      const res = await api.get('/newsletter/subscribers');
      setSubs(res.data);
      setLoading(false);
    } catch (err) { toast.error('Failed to load subscribers'); }
  };

  useEffect(() => { fetchSubs(); }, []);

  const handleDelete = async () => {
    try {
      await api.delete(`/newsletter/subscribers/${deleteId}`);
      toast.success('Subscriber removed');
      setDeleteId(null);
      fetchSubs();
    } catch (err) { toast.error('Delete failed'); }
  };

  const handleExport = async () => {
    try {
      const res = await api.get('/newsletter/subscribers/export.csv', { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `subscribers_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success('Export started!');
    } catch (err) { toast.error('Export failed'); }
  };

  return (
    <div className="space-y-12 animate-in fade-in duration-500">
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div>
          <h2 className="font-head text-4xl font-black text-brand-dark tracking-tight">📧 Newsletter Subscribers</h2>
          <p className="text-brand-mid text-xs font-black uppercase tracking-[3px] mt-1.5 opacity-40">Manage your growing community ({subs.length})</p>
        </div>
        <button 
          onClick={handleExport}
          className="bg-brand-green hover:bg-brand-green-light text-white font-black rounded-full px-8 py-3.5 text-sm uppercase tracking-widest flex items-center gap-2 shadow-xl shadow-brand-green/30 transition-all hover:scale-105 active:scale-95"
        >
          <Download size={18} /> EXPORT TO CSV
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
         {/* Stats */}
         <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm flex flex-col items-center text-center group hover:shadow-xl transition-all">
               <div className="w-16 h-16 rounded-2xl bg-brand-green-pale flex items-center justify-center text-brand-green text-3xl group-hover:scale-110 transition-transform">📧</div>
               <h4 className="mt-4 font-black text-brand-dark uppercase tracking-widest text-[11px] opacity-40">Total List</h4>
               <p className="text-5xl font-black font-head text-brand-dark mt-2">{subs.length}</p>
            </div>
            <div className="bg-brand-green p-8 rounded-3xl shadow-xl shadow-brand-green/20 relative overflow-hidden group">
               <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] bg-[length:10px_10px]" />
               <Sparkles className="text-white/20 absolute -top-4 -right-4 w-24 h-24 rotate-12" />
               <h3 className="text-white font-head text-2xl font-bold relative z-10 leading-tight">Grow Your Audience 🚀</h3>
               <p className="text-white/70 text-sm mt-4 relative z-10 font-bold leading-relaxed">Send regular updates to keep your customers engaged and increase sales.</p>
            </div>
         </div>

         {/* List */}
         <div className="lg:col-span-3">
            <DataTable 
              data={subs}
              placeholder="Search by email..."
              columns={[
                { 
                  header: 'Subscriber Email', 
                  render: (s) => (
                    <div className="flex items-center gap-4">
                       <div className="w-8 h-8 rounded-lg bg-brand-light flex items-center justify-center text-brand-mid opacity-40"><Mail size={14} /></div>
                       <span className="font-bold text-brand-dark">{s.email}</span>
                    </div>
                  )
                },
                { 
                  header: 'Subscribed Date', 
                  render: (s) => <span className="text-[11px] font-black uppercase tracking-widest text-brand-mid opacity-50">{formatDate(s.createdAt)}</span>
                },
                { 
                  header: 'Actions', 
                  render: (s) => (
                    <button 
                      onClick={() => setDeleteId(s._id)} 
                      className="w-10 h-10 rounded-xl bg-brand-sale/10 text-brand-sale hover:bg-brand-sale hover:text-white transition-all flex items-center justify-center shadow-sm"
                    >
                      <Trash2 size={16} />
                    </button>
                  )
                }
              ]}
            />
         </div>
      </div>

      <ConfirmDialog 
        isOpen={!!deleteId}
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
        title="Unsubscribe User?"
        message="This will remove the email address from your newsletter database."
      />
    </div>
  );
}
