import { useState, useEffect } from 'react';
import SectionCard from '../components/SectionCard';
import ToggleSwitch from '../components/ToggleSwitch';
import ConfirmDialog from '../components/ConfirmDialog';
import api from '../utils/api';
import { useToast } from '../components/Toast';
import { Plus, Trash2, Edit2, GripVertical, Save, X, Sparkles } from 'lucide-react';
import { motion, Reorder } from 'framer-motion';

export default function MarqueePage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [form, setForm] = useState({ text: '', is_active: true });
  
  const toast = useToast();

  const fetchItems = async () => {
    try {
      const res = await api.get('/marquee/admin/all');
      setItems(res.data);
      setLoading(false);
    } catch (err) { toast.error('Load failed'); }
  };

  useEffect(() => { fetchItems(); }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.text) return toast.error('Text is required');
    try {
      if (editing) {
        await api.put(`/marquee/${editing._id}`, form);
        toast.success('Marquee item updated');
      } else {
        await api.post('/marquee', form);
        toast.success('Marquee item added');
      }
      setEditing(null);
      setForm({ text: '', is_active: true });
      fetchItems();
    } catch (err) { toast.error('Save failed'); }
  };

  const handleEdit = (item) => {
    setEditing(item);
    setForm(item);
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/marquee/${deleteId}`);
      toast.success('Deleted');
      setDeleteId(null);
      fetchItems();
    } catch (err) { toast.error('Delete failed'); }
  };

  const handleReorder = async (newOrder) => {
    setItems(newOrder);
    try {
      await api.post('/marquee/reorder', { order: newOrder.map(s => s._id) });
    } catch (err) { toast.error('Reorder sync failed'); }
  };

  return (
    <div className="space-y-12 animate-in fade-in duration-500">
      <h2 className="font-head text-4xl font-black text-brand-dark tracking-tight">✨ Marquee Strip</h2>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Editor */}
        <div className="lg:col-span-1">
          <SectionCard title={editing ? "Edit Text" : "Add Marquee Text"} subtitle="Scrolling bar below hero slider">
            <form onSubmit={handleSave} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-brand-mid/50 ml-2">Marquee Text *</label>
                <input 
                  value={form.text} onChange={(e) => setForm(f => ({ ...f, text: e.target.value }))}
                  placeholder="e.g. 100% Homemade"
                  className="w-full bg-brand-light/50 border-2 border-brand-green-pale rounded-2xl px-4 py-3 text-sm font-bold outline-none focus:border-brand-green transition-all"
                />
              </div>
              <div className="p-4 bg-brand-light/50 rounded-2xl border border-gray-100 flex items-center justify-between">
                <ToggleSwitch checked={form.is_active} onChange={(v) => setForm(f => ({ ...f, is_active: v }))} label="Active" />
              </div>
              <div className="flex gap-4">
                <button type="submit" className="flex-1 bg-brand-green text-white font-black rounded-2xl py-4 shadow-lg shadow-brand-green/20 uppercase tracking-widest flex items-center justify-center gap-2">
                  <Save size={18} /> {editing ? 'UPDATE' : 'ADD TEXT'}
                </button>
                {editing && (
                  <button type="button" onClick={() => { setEditing(null); setForm({ text: '', is_active: true }); }} className="w-16 bg-gray-100 text-brand-mid rounded-2xl flex items-center justify-center hover:bg-brand-sale/10 hover:text-brand-sale transition-all">
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
             <Sparkles className="text-brand-warm" />
             Active Items (Drag to Reorder)
          </h3>
          <Reorder.Group axis="y" values={items} onReorder={handleReorder} className="space-y-4">
            {items.map(item => (
              <Reorder.Item 
                key={item._id} value={item}
                className="bg-white p-5 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-6 group hover:shadow-xl transition-all cursor-grab active:cursor-grabbing"
              >
                <div className="text-brand-mid/20 group-hover:text-brand-green transition-colors"><GripVertical size={24} /></div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-[15px] font-black text-brand-dark uppercase tracking-widest">{item.text}</h4>
                </div>
                <div className="flex items-center gap-4">
                    <div className={`w-2 h-2 rounded-full ${item.is_active ? 'bg-brand-green' : 'bg-gray-200'}`} />
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
        title="Remove Marquee Text?"
        message="This will remove the text from the scrolling marquee strip."
      />
    </div>
  );
}
