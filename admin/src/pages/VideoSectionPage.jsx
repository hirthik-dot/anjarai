import { useState, useEffect } from 'react';
import SectionCard from '../components/SectionCard';
import ToggleSwitch from '../components/ToggleSwitch';
import ConfirmDialog from '../components/ConfirmDialog';
import api from '../utils/api';
import { useToast } from '../components/Toast';
import { getYouTubeThumbnail, extractYouTubeId } from '../utils/helpers';
import { Plus, Trash2, Edit2, GripVertical, Save, X, PlayCircle, Youtube } from 'lucide-react';
import { motion, Reorder } from 'framer-motion';

export default function VideoSectionPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [form, setForm] = useState({ title: '', youtube_url: '', is_active: true });
  
  const toast = useToast();

  const fetchItems = async () => {
    try {
      const res = await api.get('/videos/admin/all');
      setItems(res.data);
      setLoading(false);
    } catch (err) { toast.error('Load failed'); }
  };

  useEffect(() => { fetchItems(); }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.youtube_url) return toast.error('YouTube URL is required');
    if (!extractYouTubeId(form.youtube_url)) return toast.error('Invalid YouTube URL');
    try {
      if (editing) {
        await api.put(`/videos/${editing._id}`, form);
        toast.success('Video updated');
      } else {
        await api.post('/videos', form);
        toast.success('Video added');
      }
      setEditing(null);
      setForm({ title: '', youtube_url: '', is_active: true });
      fetchItems();
    } catch (err) { toast.error('Save failed'); }
  };

  const handleEdit = (item) => {
    setEditing(item);
    setForm(item);
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/videos/${deleteId}`);
      toast.success('Deleted');
      setDeleteId(null);
      fetchItems();
    } catch (err) { toast.error('Delete failed'); }
  };

  const handleReorder = async (newOrder) => {
    setItems(newOrder);
    try {
      await api.post('/videos/reorder', { order: newOrder.map(s => s._id) });
    } catch (err) { toast.error('Reorder sync failed'); }
  };

  return (
    <div className="space-y-12 animate-in fade-in duration-500">
      <h2 className="font-head text-4xl font-black text-brand-dark tracking-tight">📽️ YouTube Videos Section</h2>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Editor */}
        <div className="lg:col-span-1">
          <SectionCard title={editing ? "Edit Video" : "Add YouTube Video"} subtitle="Visual grid of video content">
            <form onSubmit={handleSave} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-brand-mid/50 ml-2">Video Title (Internal)</label>
                <input 
                  value={form.title} onChange={(e) => setForm(f => ({ ...f, title: e.target.value }))}
                  placeholder="e.g. How to use Ragi Powder"
                  className={inputClass}
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-brand-mid/50 ml-2">YouTube URL *</label>
                <div className="relative">
                   <Youtube className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-sale" size={18} />
                   <input 
                    value={form.youtube_url} onChange={(e) => setForm(f => ({ ...f, youtube_url: e.target.value }))}
                    placeholder="e.g. https://youtube.com/watch?v=..."
                    className={inputClass + " pl-12"}
                   />
                </div>
              </div>
              
              {/* Thumbnail Preview */}
              {extractYouTubeId(form.youtube_url) && (
                <div className="rounded-2xl overflow-hidden shadow-lg border border-gray-100 aspect-video bg-black relative flex items-center justify-center">
                    <img src={getYouTubeThumbnail(form.youtube_url)} className="w-full h-full object-cover opacity-60" />
                    <PlayCircle className="absolute text-white" size={48} />
                </div>
              )}

              <div className="p-4 bg-brand-light/50 rounded-2xl border border-gray-100 flex items-center justify-between">
                <ToggleSwitch checked={form.is_active} onChange={(v) => setForm(f => ({ ...f, is_active: v }))} label="Active" />
              </div>
              <div className="flex gap-4">
                <button type="submit" className="flex-1 bg-brand-green text-white font-black rounded-2xl py-4 uppercase tracking-widest flex items-center justify-center gap-2">
                  <Save size={18} /> {editing ? 'UPDATE' : 'ADD VIDEO'}
                </button>
                {editing && (
                  <button type="button" onClick={() => { setEditing(null); setForm({ title: '', youtube_url: '', is_active: true }); }} className="w-16 bg-gray-100 text-brand-mid rounded-2xl flex items-center justify-center hover:bg-brand-sale/10 hover:text-brand-sale transition-all">
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
             <PlayCircle className="text-brand-green" />
             Active Video List (Drag to Reorder)
          </h3>
          <Reorder.Group axis="y" values={items} onReorder={handleReorder} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {items.map(item => (
              <Reorder.Item 
                key={item._id} value={item}
                className="bg-white p-5 rounded-[40px] shadow-sm border border-gray-100 flex flex-col gap-5 group hover:shadow-xl transition-all cursor-grab active:cursor-grabbing overflow-hidden"
              >
                <div className="relative aspect-video rounded-[32px] overflow-hidden bg-brand-light border border-gray-100 group-hover:shadow-lg transition-transform duration-700">
                  <img src={getYouTubeThumbnail(item.youtube_url)} className="w-full h-full object-cover opacity-80" />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/10 transition-colors group-hover:bg-brand-green/10">
                    <PlayCircle className="text-white drop-shadow-xl" size={48} />
                  </div>
                </div>
                <div className="flex items-center justify-between px-4 pb-2">
                    <div className="flex items-center gap-3">
                        <div className="text-brand-mid/20 group-hover:text-brand-green transition-colors flex-shrink-0"><GripVertical size={20} /></div>
                        <div className={`w-2 h-2 rounded-full ${item.is_active ? 'bg-brand-green' : 'bg-gray-200'}`} />
                        <h4 className="font-bold text-brand-dark truncate max-w-[140px] leading-none mb-1">{item.title || 'Untitled Video'}</h4>
                    </div>
                    <div className="flex gap-2">
                        <button onClick={() => handleEdit(item)} className="w-10 h-10 rounded-2xl bg-brand-green-pale/30 text-brand-green hover:bg-brand-green hover:text-white transition-all flex items-center justify-center shadow-sm shadow-brand-green/20"><Edit2 size={16} /></button>
                        <button onClick={() => setDeleteId(item._id)} className="w-10 h-10 rounded-2xl bg-brand-sale/10 text-brand-sale hover:bg-brand-sale hover:text-white transition-all flex items-center justify-center shadow-sm shadow-brand-green/20"><Trash2 size={16} /></button>
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
        title="Remove Video?"
        message="This will remove the YouTube video from your homepage section."
      />
    </div>
  );
}

const inputClass = "w-full bg-brand-light/50 border-2 border-brand-green-pale rounded-2xl px-5 py-4 text-sm font-bold focus:border-brand-green focus:bg-white outline-none transition-all";
