import { useState, useEffect } from 'react';
import SectionCard from '../components/SectionCard';
import ImageUploader from '../components/ImageUploader';
import ToggleSwitch from '../components/ToggleSwitch';
import ConfirmDialog from '../components/ConfirmDialog';
import api from '../utils/api';
import { useToast } from '../components/Toast';
import { Plus, Trash2, Edit2, GripVertical, Save, X } from 'lucide-react';
import { motion, Reorder } from 'framer-motion';

export default function HeroSlidesPage() {
  const [slides, setSlides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [form, setForm] = useState({ image_url: '', tag: '', title: '', subtitle: '', btn_text: 'Shop Now →', btn_link: '/collections/all', is_active: true });
  
  const toast = useToast();

  const fetchSlides = async () => {
    try {
      const res = await api.get('/hero/admin/all');
      setSlides(res.data);
      setLoading(false);
    } catch (err) { toast.error('Load failed'); }
  };

  useEffect(() => { fetchSlides(); }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.image_url || !form.title) return toast.error('Image and Title are required');
    try {
      if (editing) {
        await api.put(`/hero/${editing._id}`, form);
        toast.success('Slide updated');
      } else {
        await api.post('/hero', form);
        toast.success('Slide created');
      }
      setEditing(null);
      setForm({ image_url: '', tag: '', title: '', subtitle: '', btn_text: 'Shop Now →', btn_link: '/collections/all', is_active: true });
      fetchSlides();
    } catch (err) { toast.error('Save failed'); }
  };

  const handleEdit = (slide) => {
    setEditing(slide);
    setForm(slide);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/hero/${deleteId}`);
      toast.success('Slide deleted');
      setDeleteId(null);
      fetchSlides();
    } catch (err) { toast.error('Delete failed'); }
  };

  const handleReorder = async (newOrder) => {
    setSlides(newOrder);
    try {
      await api.post('/hero/reorder', { order: newOrder.map(s => s._id) });
    } catch (err) { toast.error('Reorder sync failed'); }
  };

  return (
    <div className="space-y-12 animate-in fade-in duration-500">
      <h2 className="font-head text-4xl font-black text-brand-dark tracking-tight">🖼️ Hero Slides</h2>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Editor */}
        <div className="lg:col-span-1">
          <SectionCard title={editing ? "Edit Slide" : "Add New Slide"} subtitle="Visual banners for homepage">
            <form onSubmit={handleSave} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-brand-mid/50 ml-2">Slide Image *</label>
                <ImageUploader value={form.image_url} onChange={(v) => setForm(f => ({ ...f, image_url: v }))} />
              </div>
              <Input label="Tag Pill (e.g. New Arrival)" value={form.tag} onChange={(v) => setForm(f => ({ ...f, tag: v }))} />
              <Input label="Main Title *" value={form.title} onChange={(v) => setForm(f => ({ ...f, title: v }))} />
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-brand-mid/50 ml-2">Subtitle</label>
                <textarea 
                  value={form.subtitle} onChange={(e) => setForm(f => ({ ...f, subtitle: e.target.value }))}
                  className="w-full bg-brand-light/50 border-2 border-brand-green-pale rounded-2xl px-4 py-3 text-sm font-bold focus:border-brand-green outline-none min-h-[80px]"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Input label="Button Text" value={form.btn_text} onChange={(v) => setForm(f => ({ ...f, btn_text: v }))} />
                <Input label="Button Link" value={form.btn_link} onChange={(v) => setForm(f => ({ ...f, btn_link: v }))} />
              </div>
              <div className="p-4 bg-brand-light/50 rounded-2xl border border-gray-100 flex items-center justify-between">
                <ToggleSwitch checked={form.is_active} onChange={(v) => setForm(f => ({ ...f, is_active: v }))} label="Active" />
              </div>
              <div className="flex gap-4">
                <button type="submit" className="flex-1 bg-brand-green text-white font-black rounded-2xl py-4 shadow-lg shadow-brand-green/20 uppercase tracking-widest flex items-center justify-center gap-2">
                  <Save size={18} /> {editing ? 'UPDATE SLIDE' : 'CREATE SLIDE'}
                </button>
                {editing && (
                  <button type="button" onClick={() => { setEditing(null); setForm({ image_url: '', tag: '', title: '', subtitle: '', btn_text: 'Shop Now →', btn_link: '/collections/all', is_active: true }); }} className="w-16 bg-gray-100 text-brand-mid rounded-2xl flex items-center justify-center hover:bg-brand-sale/10 hover:text-brand-sale transition-all">
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
            <span className="w-10 h-10 rounded-xl bg-brand-green text-white flex items-center justify-center">☰</span>
            Current Slides (Drag to Reorder)
          </h3>
          <Reorder.Group axis="y" values={slides} onReorder={handleReorder} className="space-y-4">
            {slides.map(slide => (
              <Reorder.Item 
                key={slide._id} value={slide}
                className="bg-white p-5 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-6 group hover:shadow-xl transition-all cursor-grab active:cursor-grabbing"
              >
                <div className="text-brand-mid/20 group-hover:text-brand-green transition-colors"><GripVertical size={24} /></div>
                <div className="w-40 aspect-video rounded-2xl overflow-hidden bg-brand-light flex-shrink-0 border border-gray-100">
                  <img src={slide.image_url} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    {slide.tag && <span className="text-[9px] font-black bg-brand-warm text-white px-2 py-0.5 rounded-full uppercase">{slide.tag}</span>}
                    <div className={`w-2 h-2 rounded-full ${slide.is_active ? 'bg-brand-green' : 'bg-gray-200'}`} />
                  </div>
                  <h4 className="font-head text-lg font-bold text-brand-dark line-clamp-1">{slide.title}</h4>
                  <p className="text-xs text-brand-mid opacity-60 line-clamp-1">{slide.subtitle}</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handleEdit(slide)} className="w-12 h-12 rounded-2xl bg-brand-green-pale/30 text-brand-green hover:bg-brand-green hover:text-white transition-all flex items-center justify-center"><Edit2 size={18} /></button>
                  <button onClick={() => setDeleteId(slide._id)} className="w-12 h-12 rounded-2xl bg-brand-sale/10 text-brand-sale hover:bg-brand-sale hover:text-white transition-all flex items-center justify-center"><Trash2 size={18} /></button>
                </div>
              </Reorder.Item>
            ))}
          </Reorder.Group>
        </div>
      </div>

      <ConfirmDialog 
        isOpen={!!deleteId}
        title="Delete Slide?"
        message="This will remove the slide from your homepage slider."
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
}

function Input({ label, value, onChange }) {
  return (
    <div className="space-y-2">
      <label className="text-[10px] font-black uppercase tracking-widest text-brand-mid/50 ml-2">{label}</label>
      <input 
        type="text" value={value} onChange={(e) => onChange(e.target.value)}
        className="w-full bg-brand-light/50 border-2 border-brand-green-pale rounded-2xl px-4 py-3 text-sm font-bold focus:border-brand-green outline-none transition-all"
      />
    </div>
  )
}
