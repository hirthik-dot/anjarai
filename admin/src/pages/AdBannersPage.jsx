import { useState, useEffect } from 'react';
import SectionCard from '../components/SectionCard';
import ImageUploader from '../components/ImageUploader';
import ToggleSwitch from '../components/ToggleSwitch';
import ConfirmDialog from '../components/ConfirmDialog';
import api from '../utils/api';
import { useToast } from '../components/Toast';
import { Plus, Trash2, Edit2, GripVertical, Save, X, Info } from 'lucide-react';
import { motion, Reorder } from 'framer-motion';

export default function AdBannersPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [form, setForm] = useState({ 
    image_url: '', 
    title: '', 
    sticker: 'EXCLUSIVE OFFER',
    heading_1: 'THE MOTHERS',
    heading_2: 'CARE',
    subtitle: 'HOMEMADE WITH PURITY AND LOVE FOR YOUR LITTLE ONES. 🌿',
    btn_text: 'SHOP OFFERS →',
    btn_link: '/',
    footer_text: 'FSSAI CERTIFIED \nLAB APPROVED',
    is_active: true 
  });
  
  const toast = useToast();

  const fetchItems = async () => {
    try {
      const res = await api.get('/ads/admin/all');
      setItems(res.data);
      setLoading(false);
    } catch (err) { toast.error('Load failed'); }
  };

  useEffect(() => { fetchItems(); }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.image_url) return toast.error('Image is required');
    try {
      if (editing) {
        await api.put(`/ads/${editing._id}`, form);
        toast.success('Ad banner updated');
      } else {
        await api.post('/ads', form);
        toast.success('Ad banner added');
      }
      setEditing(null);
      setForm({ 
        image_url: '', 
        title: '', 
        sticker: 'EXCLUSIVE OFFER',
        heading_1: 'THE MOTHERS',
        heading_2: 'CARE',
        subtitle: 'HOMEMADE WITH PURITY AND LOVE FOR YOUR LITTLE ONES. 🌿',
        btn_text: 'SHOP OFFERS →',
        btn_link: '/',
        footer_text: 'FSSAI CERTIFIED \nLAB APPROVED',
        is_active: true 
      });
      fetchItems();
    } catch (err) { toast.error('Save failed'); }
  };

  const handleEdit = (item) => {
    setEditing(item);
    setForm(item);
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/ads/${deleteId}`);
      toast.success('Deleted');
      setDeleteId(null);
      fetchItems();
    } catch (err) { toast.error('Delete failed'); }
  };

  const handleReorder = async (newOrder) => {
    setItems(newOrder);
    try {
      await api.post('/ads/reorder', { order: newOrder.map(s => s._id) });
    } catch (err) { toast.error('Reorder sync failed'); }
  };

  return (
    <div className="space-y-12 animate-in fade-in duration-500">
      <h2 className="font-head text-4xl font-black text-brand-dark tracking-tight">ℹ️ Ad Banners Section</h2>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Editor */}
        <div className="lg:col-span-1">
          <SectionCard title={editing ? "Edit Ad" : "Add Ad Banner"} subtitle="Promotional strips throughout site">
            <form onSubmit={handleSave} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-brand-mid/50 ml-2">Banner Image *</label>
                <ImageUploader value={form.image_url} onChange={(v) => setForm(f => ({ ...f, image_url: v }))} />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-brand-mid/50 ml-2">Internal Title</label>
                  <input 
                    value={form.title} onChange={(e) => setForm(f => ({ ...f, title: e.target.value }))}
                    placeholder="Summer Offer" className="w-full bg-brand-light/50 border-2 border-brand-green-pale rounded-2xl px-4 py-3 text-sm font-bold outline-none focus:border-brand-green transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-brand-mid/50 ml-2">Sticker Text</label>
                  <input 
                    value={form.sticker} onChange={(e) => setForm(f => ({ ...f, sticker: e.target.value }))}
                    placeholder="EXCLUSIVE" className="w-full bg-brand-light/50 border-2 border-brand-green-pale rounded-2xl px-4 py-3 text-sm font-bold outline-none focus:border-brand-green transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-brand-mid/50 ml-2">Heading Line 1</label>
                    <input 
                      value={form.heading_1} onChange={(e) => setForm(f => ({ ...f, heading_1: e.target.value }))}
                      className="w-full bg-brand-light/50 border-2 border-brand-green-pale rounded-2xl px-4 py-3 text-sm font-bold outline-none focus:border-brand-green transition-all"
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-brand-mid/50 ml-2">Heading Line 2</label>
                    <input 
                      value={form.heading_2} onChange={(e) => setForm(f => ({ ...f, heading_2: e.target.value }))}
                      className="w-full bg-brand-light/50 border-2 border-brand-green-pale rounded-2xl px-4 py-3 text-sm font-bold outline-none focus:border-brand-green transition-all"
                    />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-brand-mid/50 ml-2">Description</label>
                <textarea 
                  value={form.subtitle} onChange={(e) => setForm(f => ({ ...f, subtitle: e.target.value }))}
                  rows={2} className="w-full bg-brand-light/50 border-2 border-brand-green-pale rounded-2xl px-4 py-3 text-sm font-bold outline-none focus:border-brand-green transition-all"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-brand-mid/50 ml-2">Button Text</label>
                  <input 
                    value={form.btn_text} onChange={(e) => setForm(f => ({ ...f, btn_text: e.target.value }))}
                    className="w-full bg-brand-light/50 border-2 border-brand-green-pale rounded-2xl px-4 py-3 text-sm font-bold outline-none focus:border-brand-green transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-brand-mid/50 ml-2">Button Link</label>
                  <input 
                    value={form.btn_link} onChange={(e) => setForm(f => ({ ...f, btn_link: e.target.value }))}
                    className="w-full bg-brand-light/50 border-2 border-brand-green-pale rounded-2xl px-4 py-3 text-sm font-bold outline-none focus:border-brand-green transition-all"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-brand-mid/50 ml-2">Footer Info (Use \n for line break)</label>
                <input 
                  value={form.footer_text} onChange={(e) => setForm(f => ({ ...f, footer_text: e.target.value }))}
                  className="w-full bg-brand-light/50 border-2 border-brand-green-pale rounded-2xl px-4 py-3 text-sm font-bold outline-none focus:border-brand-green transition-all"
                />
              </div>

              <div className="p-4 bg-brand-light/50 rounded-2xl border border-gray-100 flex items-center justify-between">
                <ToggleSwitch checked={form.is_active} onChange={(v) => setForm(f => ({ ...f, is_active: v }))} label="Active" />
              </div>
              <div className="flex gap-4">
                <button type="submit" className="flex-1 bg-brand-green text-white font-black rounded-2xl py-4 shadow-lg shadow-brand-green/20 uppercase tracking-widest flex items-center justify-center gap-2">
                  <Save size={18} /> {editing ? 'UPDATE' : 'ADD AD'}
                </button>
                {editing && (
                  <button type="button" onClick={() => { setEditing(null); setForm({ ...form, title: '', image_url: '', is_active: true }); }} className="w-16 bg-gray-100 text-brand-mid rounded-2xl flex items-center justify-center hover:bg-brand-sale/10 hover:text-brand-sale transition-all">
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
             <Info className="text-brand-green" />
             Active Ad Strips (Drag to Reorder)
          </h3>
          <Reorder.Group axis="y" values={items} onReorder={handleReorder} className="space-y-6">
            {items.map(item => (
              <Reorder.Item 
                key={item._id} value={item}
                className="bg-white p-6 rounded-[32px] shadow-sm border border-gray-100 flex flex-col gap-6 group hover:shadow-xl transition-all cursor-grab active:cursor-grabbing overflow-hidden"
              >
                <div className="flex items-center gap-6">
                    <div className="text-brand-mid/20 group-hover:text-brand-green transition-colors flex-shrink-0"><GripVertical size={24} /></div>
                    <div className="flex-1">
                        <div className="aspect-[21/9] rounded-2xl overflow-hidden bg-brand-light border border-gray-100 group-hover:shadow-lg transition-all duration-500">
                           <img src={item.image_url} className="w-full h-full object-cover" />
                        </div>
                    </div>
                </div>
                <div className="flex items-center justify-between px-4 pb-2">
                    <div className="flex items-center gap-4">
                        <div className={`w-2 h-2 rounded-full ${item.is_active ? 'bg-brand-green' : 'bg-gray-200'}`} />
                        <div>
                           <h4 className="font-bold text-brand-dark leading-none">{item.title || 'Untitled Banner'}</h4>
                           <p className="text-[10px] font-black uppercase tracking-widest text-brand-mid/30 mt-1">{item.btn_link || 'NO LINK'}</p>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <button onClick={() => handleEdit(item)} className="w-12 h-12 rounded-2xl bg-brand-green-pale/30 text-brand-green hover:bg-brand-green hover:text-white transition-all flex items-center justify-center"><Edit2 size={18} /></button>
                        <button onClick={() => setDeleteId(item._id)} className="w-12 h-12 rounded-2xl bg-brand-sale/10 text-brand-sale hover:bg-brand-sale hover:text-white transition-all flex items-center justify-center"><Trash2 size={18} /></button>
                    </div>
                </div>
              </Reorder.Item>
            ))}
          </Reorder.Group>
        </div>
      </div>

      <ConfirmDialog 
        isOpen={!!deleteId}
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
        title="Remove Ad Banner?"
        message="This will remove the promotional strip from your site."
      />
    </div>
  );
}
