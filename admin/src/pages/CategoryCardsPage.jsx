import { useState, useEffect } from 'react';
import SectionCard from '../components/SectionCard';
import ImageUploader from '../components/ImageUploader';
import ToggleSwitch from '../components/ToggleSwitch';
import ConfirmDialog from '../components/ConfirmDialog';
import api from '../utils/api';
import { useToast } from '../components/Toast';
import { Plus, Trash2, Edit2, GripVertical, Save, X, Tag } from 'lucide-react';
import { motion, Reorder } from 'framer-motion';

export default function CategoryCardsPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [form, setForm] = useState({ image_url: '', label: '', link: '', is_active: true });
  
  const toast = useToast();

  const fetchItems = async () => {
    try {
      const res = await api.get('/categories/admin/all');
      setItems(res.data);
      setLoading(false);
    } catch (err) { toast.error('Load failed'); }
  };

  useEffect(() => { fetchItems(); }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.image_url || !form.label) return toast.error('Image and Label are required');
    try {
      if (editing) {
        await api.put(`/categories/${editing._id}`, form);
        toast.success('Category updated');
      } else {
        await api.post('/categories', form);
        toast.success('Category added');
      }
      setEditing(null);
      setForm({ image_url: '', label: '', link: '', is_active: true });
      fetchItems();
    } catch (err) { toast.error('Save failed'); }
  };

  const handleEdit = (item) => {
    setEditing(item);
    setForm(item);
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/categories/${deleteId}`);
      toast.success('Deleted');
      setDeleteId(null);
      fetchItems();
    } catch (err) { toast.error('Delete failed'); }
  };

  const handleReorder = async (newOrder) => {
    setItems(newOrder);
    try {
      await api.post('/categories/reorder', { order: newOrder.map(s => s._id) });
    } catch (err) { toast.error('Reorder sync failed'); }
  };

  return (
    <div className="space-y-12 animate-in fade-in duration-500">
      <h2 className="font-head text-4xl font-black text-brand-dark tracking-tight">🏷️ Category Cards</h2>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Editor */}
        <div className="lg:col-span-1">
          <SectionCard title={editing ? "Edit Card" : "Add Category Card"} subtitle="Visual grid on homepage">
            <form onSubmit={handleSave} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-brand-mid/50 ml-2">Category Image *</label>
                <ImageUploader value={form.image_url} onChange={(v) => setForm(f => ({ ...f, image_url: v }))} />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-brand-mid/50 ml-2">Label *</label>
                <input 
                  value={form.label} onChange={(e) => setForm(f => ({ ...f, label: e.target.value }))}
                  placeholder="e.g. MEGA COMBO OFFERS"
                  className="w-full bg-brand-light/50 border-2 border-brand-green-pale rounded-2xl px-4 py-3 text-sm font-bold outline-none focus:border-brand-green transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-brand-mid/50 ml-2">Link *</label>
                <input 
                  value={form.link} onChange={(e) => setForm(f => ({ ...f, link: e.target.value }))}
                  placeholder="e.g. /collections/mega-combo-offers"
                  className="w-full bg-brand-light/50 border-2 border-brand-green-pale rounded-2xl px-4 py-3 text-sm font-bold outline-none focus:border-brand-green transition-all"
                />
              </div>
              <div className="p-4 bg-brand-light/50 rounded-2xl border border-gray-100 flex items-center justify-between">
                <ToggleSwitch checked={form.is_active} onChange={(v) => setForm(f => ({ ...f, is_active: v }))} label="Active" />
              </div>
              <div className="flex gap-4">
                <button type="submit" className="flex-1 bg-brand-green text-white font-black rounded-2xl py-4 shadow-lg shadow-brand-green/20 uppercase tracking-widest flex items-center justify-center gap-2">
                  <Save size={18} /> {editing ? 'UPDATE' : 'ADD CARD'}
                </button>
                {editing && (
                  <button type="button" onClick={() => { setEditing(null); setForm({ image_url: '', label: '', link: '', is_active: true }); }} className="w-16 bg-gray-100 text-brand-mid rounded-2xl flex items-center justify-center hover:bg-brand-sale/10 hover:text-brand-sale transition-all">
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
             <Tag className="text-brand-green" />
             Homepage Category Grid (Drag to Reorder)
          </h3>
          <Reorder.Group axis="y" values={items} onReorder={handleReorder} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {items.map(item => (
              <Reorder.Item 
                key={item._id} value={item}
                className="bg-white p-5 rounded-[40px] shadow-sm border border-gray-100 flex flex-col gap-6 group hover:shadow-xl transition-all cursor-grab active:cursor-grabbing"
              >
                <div className="relative aspect-square rounded-[32px] overflow-hidden bg-brand-light border border-gray-100">
                  <img src={item.image_url} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-8">
                     <h4 className="font-head text-2xl font-bold text-white mb-1 uppercase tracking-tight">{item.label}</h4>
                     <p className="text-white/50 text-[10px] font-black tracking-widest uppercase">{item.link}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between px-4 pb-2">
                    <div className="flex items-center gap-3">
                        <div className="text-brand-mid/20 group-hover:text-brand-green transition-colors"><GripVertical size={20} /></div>
                        <div className={`w-2 h-2 rounded-full ${item.is_active ? 'bg-brand-green' : 'bg-gray-200'}`} />
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
        title="Delete Category Card?"
        message="This will remove the visual card from your homepage grid."
      />
    </div>
  );
}
