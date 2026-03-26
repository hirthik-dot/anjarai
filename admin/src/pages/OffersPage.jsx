import { useState, useEffect } from 'react';
import SectionCard from '../components/SectionCard';
import ImageUploader from '../components/ImageUploader';
import ToggleSwitch from '../components/ToggleSwitch';
import ConfirmDialog from '../components/ConfirmDialog';
import api from '../utils/api';
import { useToast } from '../components/Toast';
import { Plus, Trash2, Edit2, GripVertical, Save, X, Gift, Sparkles, Tag } from 'lucide-react';
import { motion, Reorder } from 'framer-motion';

export default function OffersPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [form, setForm] = useState({ image_url: '', title: '', subtitle: '', code: '', discount: '', link: '', is_active: true });
  
  const toast = useToast();

  const fetchItems = async () => {
    try {
      const res = await api.get('/offers/admin/all');
      setItems(res.data);
      setLoading(false);
    } catch (err) { toast.error('Load failed'); }
  };

  useEffect(() => { fetchItems(); }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.title || !form.image_url) return toast.error('Title and Image are required');
    try {
      if (editing) {
        await api.put(`/offers/${editing._id}`, form);
        toast.success('Offer updated');
      } else {
        await api.post('/offers', form);
        toast.success('Offer created');
      }
      setEditing(null);
      setForm({ image_url: '', title: '', subtitle: '', code: '', discount: '', link: '', is_active: true });
      fetchItems();
    } catch (err) { toast.error('Save failed'); }
  };

  const handleEdit = (item) => {
    setEditing(item);
    setForm(item);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/offers/${deleteId}`);
      toast.success('Deleted');
      setDeleteId(null);
      fetchItems();
    } catch (err) { toast.error('Delete failed'); }
  };

  const handleReorder = async (newOrder) => {
    setItems(newOrder);
    try {
      await api.post('/offers/reorder', { order: newOrder.map(s => s._id) });
    } catch (err) { toast.error('Reorder sync failed'); }
  };

  return (
    <div className="space-y-12 animate-in fade-in duration-500 pb-20">
      <h2 className="font-head text-4xl font-black text-brand-dark tracking-tight">🎁 Mega Combo Offers</h2>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Editor */}
        <div className="lg:col-span-1">
          <SectionCard title={editing ? "Edit Offer" : "Add New Offer"} subtitle="Promotional cards for shop page">
            <form onSubmit={handleSave} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-brand-mid/50 ml-2">Offer Image *</label>
                <ImageUploader value={form.image_url} onChange={(v) => setForm(f => ({ ...f, image_url: v }))} />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-brand-mid/50 ml-2">Offer Title *</label>
                <input 
                  value={form.title} onChange={(e) => setForm(f => ({ ...f, title: e.target.value }))}
                  placeholder="e.g. Summer Mega Pack"
                  className={inputClass}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                 <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-brand-mid/50 ml-2">Promo Code</label>
                    <div className="relative">
                       <Tag className="absolute left-4 top-1/2 -translate-y-1/2 opacity-30" size={14} />
                       <input value={form.code} onChange={(e) => setForm(f => ({ ...f, code: e.target.value }))} placeholder="SUMMER20" className={inputClass + " pl-10 font-mono"} />
                    </div>
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-brand-mid/50 ml-2">Discount Text</label>
                    <input value={form.discount} onChange={(e) => setForm(f => ({ ...f, discount: e.target.value }))} placeholder="20% OFF" className={inputClass} />
                 </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-brand-mid/50 ml-2">Subtitle</label>
                <textarea 
                  value={form.subtitle} onChange={(e) => setForm(f => ({ ...f, subtitle: e.target.value }))}
                  placeholder="e.g. Save extra on our best-selling combos"
                  className={inputClass + " min-h-[80px]"}
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-brand-mid/50 ml-2">Link Url</label>
                <input 
                  value={form.link} onChange={(e) => setForm(f => ({ ...f, link: e.target.value }))}
                  placeholder="/collections/mega-combo-offers"
                  className={inputClass}
                />
              </div>
              <div className="p-4 bg-brand-light/50 rounded-2xl border border-gray-100 flex items-center justify-between">
                <ToggleSwitch checked={form.is_active} onChange={(v) => setForm(f => ({ ...f, is_active: v }))} label="Active" />
              </div>
              <div className="flex gap-4">
                <button type="submit" className="flex-1 bg-brand-green text-white font-black rounded-2xl py-4 shadow-lg shadow-brand-green/20 uppercase tracking-widest flex items-center justify-center gap-2 transition-all hover:scale-105 active:scale-95">
                  <Save size={18} /> {editing ? 'UPDATE OFFER' : 'CREATE OFFER'}
                </button>
                {editing && (
                  <button type="button" onClick={() => { setEditing(null); setForm({ image_url: '', title: '', subtitle: '', code: '', discount: '', link: '', is_active: true }); }} className="w-16 bg-gray-100 text-brand-mid rounded-2xl flex items-center justify-center hover:bg-brand-sale/10 hover:text-brand-sale transition-all">
                    <X size={24} />
                  </button>
                )}
              </div>
            </form>
          </SectionCard>
        </div>

        {/* List */}
        <div className="lg:col-span-2">
          <h3 className="text-xl font-black text-brand-dark mb-6 flex items-center gap-3">
             <Gift className="text-brand-warm" />
             Store Promo Cards (Drag to Reorder)
          </h3>
          <Reorder.Group axis="y" values={items} onReorder={handleReorder} className="space-y-6">
            {items.map(item => (
              <Reorder.Item 
                key={item._id} value={item}
                className="bg-white p-6 rounded-[40px] shadow-sm border border-gray-100 flex flex-col md:flex-row gap-6 group hover:shadow-xl transition-all cursor-grab active:cursor-grabbing overflow-hidden"
              >
                <div className="w-40 aspect-square rounded-[32px] overflow-hidden bg-brand-light border border-gray-100 flex-shrink-0 group-hover:shadow-lg transition-all duration-700">
                    <img src={item.image_url} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                </div>
                <div className="flex-1 min-w-0 flex flex-col justify-center gap-2">
                    <div className="flex items-center gap-2">
                       <span className={`w-2 h-2 rounded-full ${item.is_active ? 'bg-brand-green' : 'bg-gray-200'}`} />
                       <span className="text-[10px] font-black uppercase tracking-widest opacity-30">{item.code || 'NO PROMO CODE'}</span>
                    </div>
                    <h4 className="font-head text-2xl font-bold text-brand-dark leading-tight">{item.title}</h4>
                    <p className="text-xs text-brand-mid opacity-60 leading-relaxed font-bold line-clamp-2">{item.subtitle}</p>
                    <div className="mt-2">
                       <span className="bg-brand-sale/10 text-brand-sale text-[10px] font-black uppercase px-3 py-1 rounded-full">{item.discount || 'LIMITED TIME'}</span>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <div className="text-brand-mid/20 group-hover:text-brand-green transition-colors flex-shrink-0"><GripVertical size={24} /></div>
                    <div className="flex flex-col gap-2">
                        <button onClick={() => handleEdit(item)} className="w-12 h-12 rounded-2xl bg-brand-green-pale/30 text-brand-green hover:bg-brand-green hover:text-white transition-all flex items-center justify-center"><Edit2 size={18} /></button>
                        <button onClick={() => setDeleteId(item._id)} className="w-12 h-12 rounded-2xl bg-brand-sale/10 text-brand-sale hover:bg-brand-sale hover:text-white transition-all flex items-center justify-center"><Trash2 size={18} /></button>
                    </div>
                </div>
              </Reorder.Item>
            ))}
            {items.length === 0 && <p className="text-center py-20 text-brand-mid/20 italic font-black text-2xl">No active offers found... 🎁</p>}
          </Reorder.Group>
        </div>
      </div>

      <ConfirmDialog 
        isOpen={!!deleteId}
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
        title="Delete Offer?"
        message="This will remove the offer card from your store frontend."
      />
    </div>
  );
}

const inputClass = "w-full bg-brand-light/50 border-2 border-brand-green-pale rounded-2xl px-5 py-4 text-sm font-bold focus:border-brand-green focus:bg-white outline-none transition-all";
