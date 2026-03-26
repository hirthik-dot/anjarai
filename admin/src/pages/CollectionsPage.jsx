import { useState, useEffect } from 'react';
import SectionCard from '../components/SectionCard';
import DataTable from '../components/DataTable';
import ImageUploader from '../components/ImageUploader';
import api from '../utils/api';
import { slugify } from '../utils/helpers';
import { useToast } from '../components/Toast';
import { Plus, Edit2, Trash2, Tag, Image as ImageIcon, Link as LinkIcon, Save, X } from 'lucide-react';

export default function CollectionsPage() {
  const [collections, setCollections] = useState([]);
  const [loading, setLoading]  = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: '', slug: '', description: '', image_url: '', is_active: true });
  
  const toast = useToast();

  const fetchCollections = async () => {
    try {
      const res = await api.get('/collections/admin/all');
      setCollections(res.data);
      setLoading(false);
    } catch (err) { toast.error('Failed to load collections'); }
  };

  useEffect(() => { fetchCollections(); }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      if (editing) {
        await api.put(`/collections/${editing._id}`, form);
        toast.success('Collection updated');
      } else {
        await api.post('/collections', form);
        toast.success('Collection created');
      }
      setModalOpen(false);
      fetchCollections();
    } catch (err) { toast.error('Operation failed'); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure?')) return;
    try {
      await api.delete(`/collections/${id}`);
      toast.success('Deleted');
      fetchCollections();
    } catch (err) { toast.error('Delete failed'); }
  };

  const handleNameChange = (e) => {
    const name = e.target.value;
    setForm(f => ({ 
      ...f, 
      name, 
      slug: editing ? f.slug : slugify(name) 
    }));
  };

  const openModal = (col = null) => {
    setEditing(col);
    setForm(col || { name: '', slug: '', description: '', image_url: '', is_active: true });
    setModalOpen(true);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="font-head text-4xl font-black text-brand-dark tracking-tight">🏷️ Collections</h2>
          <p className="text-brand-mid text-xs font-black uppercase tracking-[3px] mt-1.5 opacity-40">Manage product categories & groupings</p>
        </div>
        <button 
          onClick={() => openModal()}
          className="bg-brand-green hover:bg-brand-green-light text-white font-black rounded-full px-8 py-3.5 text-sm uppercase tracking-widest flex items-center gap-2 shadow-xl shadow-brand-green/30 transition-all hover:scale-105"
        >
          <Plus size={18} /> ADD COLLECTION
        </button>
      </div>

      <DataTable 
        data={collections}
        columns={[
          { header: 'Image', render: (c) => <img src={c.image_url} className="w-12 h-12 rounded-xl object-cover bg-gray-100" /> },
          { header: 'Name', render: (c) => <span className="font-black text-brand-dark">{c.name}</span> },
          { header: 'Slug', render: (c) => <code className="text-[10px] bg-gray-100 px-2 py-1 rounded-lg text-brand-mid">/collections/{c.slug}</code> },
          { 
            header: 'Status', 
            render: (c) => (
              <span className={`px-3 py-1 text-[9px] font-black uppercase tracking-widest rounded-full ${c.is_active ? 'bg-brand-green/10 text-brand-green' : 'bg-gray-100 text-brand-mid'}`}>
                {c.is_active ? 'Active' : 'Hidden'}
              </span>
            ) 
          },
          { 
            header: 'Actions', 
            render: (c) => (
              <div className="flex gap-2">
                <button onClick={() => openModal(c)} className="w-9 h-9 rounded-xl bg-brand-green-pale/20 text-brand-green hover:bg-brand-green hover:text-white transition-all flex items-center justify-center"><Edit2 size={14} /></button>
                <button onClick={() => handleDelete(c._id)} className="w-9 h-9 rounded-xl bg-brand-sale/10 text-brand-sale hover:bg-brand-sale hover:text-white transition-all flex items-center justify-center"><Trash2 size={14} /></button>
              </div>
            ) 
          }
        ]}
      />

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-brand-dark/40 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white rounded-[32px] w-full max-w-lg p-10 shadow-2xl relative overflow-hidden">
            <h3 className="font-head text-3xl font-black text-brand-dark mb-8 flex items-center gap-3">
              {editing ? '📝 Edit Collection' : '✨ New Collection'}
            </h3>
            
            <form onSubmit={handleSave} className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                  <label className="text-[10px] font-black uppercase tracking-widest text-brand-mid flex items-center gap-2">
                    🏷️ Collection Name
                  </label>
                  <input 
                    required type="text" value={form.name} onChange={handleNameChange}
                    placeholder="e.g., Best Sellers"
                    className="w-full bg-brand-light/50 border-2 border-brand-green-pale rounded-2xl px-5 py-3.5 text-sm font-bold focus:border-brand-green outline-none transition-all placeholder:text-brand-mid/30"
                  />
                </div>
                <div className="space-y-4">
                  <label className="text-[10px] font-black uppercase tracking-widest text-brand-mid flex items-center gap-2">
                    🔗 Slug (URL Link)
                  </label>
                  <input 
                    required type="text" value={form.slug} onChange={(e) => setForm({...form, slug: e.target.value})}
                    placeholder="e.g., best-sellers"
                    className="w-full bg-brand-light/50 border-2 border-brand-green-pale rounded-2xl px-5 py-3.5 text-sm font-bold focus:border-brand-green outline-none transition-all font-mono"
                  />
                  <p className="text-[9px] text-brand-mid/50 font-bold uppercase tracking-wider pl-1">This creates the link /collections/{form.slug || '...'}</p>
                </div>
              </div>

              <div className="space-y-4">
                <label className="text-[10px] font-black uppercase tracking-widest text-brand-mid flex items-center gap-2">
                   🖼️ Cover Image
                </label>
                <div className="bg-brand-light/20 p-4 rounded-[24px] border border-brand-green-pale/30">
                  <ImageUploader 
                    value={form.image_url} 
                    onChange={(val) => setForm({...form, image_url: val})} 
                    multiple={false} 
                  />
                  <p className="text-[9px] text-brand-mid/50 font-bold uppercase tracking-wider mt-3 pl-1">Select or upload a high-quality image for this category</p>
                </div>
              </div>

              <div className="flex items-center gap-3 bg-brand-light/30 p-4 rounded-2xl border border-brand-green-pale/30">
                <input 
                  type="checkbox" checked={form.is_active} onChange={(e) => setForm({...form, is_active: e.target.checked})}
                  id="col-active" className="w-5 h-5 accent-brand-green"
                />
                <label htmlFor="col-active" className="text-xs font-black uppercase tracking-widest text-brand-mid">Show in Store</label>
              </div>

              <div className="flex justify-end gap-4 pt-4">
                <button type="button" onClick={() => setModalOpen(false)} className="px-6 py-3 rounded-full text-xs font-black uppercase tracking-widest text-brand-mid hover:bg-gray-100 transition-all">Cancel</button>
                <button type="submit" className="bg-brand-green hover:bg-brand-green-light text-white font-black rounded-full px-8 py-3 text-xs uppercase tracking-widest shadow-lg shadow-brand-green/20 transition-all">Save Collection</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
