import { useState, useEffect } from 'react';
import SectionCard from '../components/SectionCard';
import api from '../utils/api';
import { useToast } from '../components/Toast';
import { Save, Plus, Trash2, Layout, Link as LinkIcon, Type, Phone, GripVertical } from 'lucide-react';
import { motion, Reorder } from 'framer-motion';

export default function NavbarPage() {
  const [form, setForm] = useState({
    logo_text: '',
    logo_sub: '',
    contact_text: '',
    contact_num: '',
    nav_links: []
  });
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  useEffect(() => {
    const fetchNavbar = async () => {
      try {
        const res = await api.get('/navbar');
        if (res.data) {
            setForm(prev => ({
                ...prev,
                ...res.data,
                nav_links: res.data.nav_links || []
            }));
        }
        setLoading(false);
      } catch (err) { toast.error('Failed to load navbar config'); }
    };
    fetchNavbar();
  }, []);

  const handleSave = async () => {
    try {
      await api.put('/navbar', form);
      toast.success('Navbar updated successfully');
    } catch (err) { toast.error('Update failed'); }
  };

  const addLink = () => {
    setForm(f => ({ ...f, nav_links: [...f.nav_links, { label: 'New Link', link: '/' }] }));
  };

  const removeLink = (index) => {
    setForm(f => ({ ...f, nav_links: f.nav_links.filter((_, i) => i !== index) }));
  };

  const updateLink = (index, field, value) => {
    setForm(f => {
      const newLinks = [...f.nav_links];
      newLinks[index] = { ...newLinks[index], [field]: value };
      return { ...f, nav_links: newLinks };
    });
  };

  const handleReorder = (newLinks) => {
    setForm(f => ({ ...f, nav_links: newLinks }));
  };

  if (loading) return null;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-center gap-4 flex-wrap">
        <div>
          <h2 className="font-head text-4xl font-black text-brand-dark tracking-tight">🧭 Navbar Setup</h2>
          <p className="text-brand-mid text-xs font-black uppercase tracking-[3px] mt-1.5 opacity-40">Manage logo, links and contact info</p>
        </div>
        <button 
          onClick={handleSave}
          className="bg-brand-green hover:bg-brand-green-light text-white font-black rounded-full px-8 py-3.5 text-sm uppercase tracking-widest flex items-center gap-2 shadow-xl shadow-brand-green/30 transition-all hover:scale-105"
        >
          <Save size={18} /> SAVE CHANGES
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Branding & Contact */}
        <SectionCard title="Branding & Call Support" subtitle="Logo text and header contact information">
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-brand-mid flex items-center gap-2">
                <Type size={12} /> Logo Main Text
              </label>
              <input 
                type="text" value={form.logo_text} onChange={(e) => setForm({...form, logo_text: e.target.value})}
                className="w-full bg-brand-light/50 border-2 border-brand-green-pale rounded-2xl px-5 py-3 text-sm font-bold focus:border-brand-green outline-none transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-brand-mid flex items-center gap-2">
                <Layout size={12} /> Logo Subtext / Slogan
              </label>
              <input 
                type="text" value={form.logo_sub} onChange={(e) => setForm({...form, logo_sub: e.target.value})}
                className="w-full bg-brand-light/50 border-2 border-brand-green-pale rounded-2xl px-5 py-3 text-sm font-bold focus:border-brand-green outline-none transition-all"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-gray-100">
                <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-brand-mid flex items-center gap-2">
                        <Phone size={12} /> Contact Label
                    </label>
                    <input 
                        type="text" value={form.contact_text} onChange={(e) => setForm({...form, contact_text: e.target.value})}
                        className="w-full bg-brand-light/50 border-2 border-brand-green-pale rounded-2xl px-5 py-3 text-sm font-bold focus:border-brand-green outline-none transition-all"
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-brand-mid flex items-center gap-2">
                        <Phone size={12} /> Contact Number
                    </label>
                    <input 
                        type="text" value={form.contact_num} onChange={(e) => setForm({...form, contact_num: e.target.value})}
                        className="w-full bg-brand-light/50 border-2 border-brand-green-pale rounded-2xl px-5 py-3 text-sm font-bold focus:border-brand-green outline-none transition-all"
                    />
                </div>
            </div>
          </div>
        </SectionCard>

        {/* Links */}
        <SectionCard title="Navigation Links" subtitle="Header navigation menu items (Drag to reorder)">
          <div className="space-y-4">
            <Reorder.Group axis="y" values={form.nav_links} onReorder={handleReorder} className="space-y-3">
              {(form.nav_links || []).map((link, idx) => (
                <Reorder.Item key={link._id || idx} value={link} className="flex gap-4 items-center bg-brand-light/30 p-4 rounded-2xl border border-brand-green-pale/30 group cursor-grab active:cursor-grabbing">
                  <div className="text-brand-mid/20 group-hover:text-brand-green transition-colors"><GripVertical size={20} /></div>
                  <div className="flex-1 grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                          <input 
                              placeholder="Label" value={link.label} onChange={(e) => updateLink(idx, 'label', e.target.value)}
                              className="w-full bg-white border border-gray-100 rounded-xl px-4 py-2 text-xs font-bold focus:border-brand-green outline-none transition-all"
                          />
                      </div>
                      <div className="space-y-1">
                          <input 
                              placeholder="Link (e.g. /products)" value={link.link} onChange={(e) => updateLink(idx, 'link', e.target.value)}
                              className="w-full bg-white border border-gray-100 rounded-xl px-4 py-2 text-xs font-bold focus:border-brand-green outline-none transition-all"
                          />
                      </div>
                  </div>
                  <button 
                    onClick={() => removeLink(idx)}
                    className="w-9 h-9 rounded-xl bg-brand-sale/10 text-brand-sale hover:bg-brand-sale hover:text-white transition-all flex items-center justify-center opacity-0 group-hover:opacity-100"
                  >
                    <Trash2 size={16} />
                  </button>
                </Reorder.Item>
              ))}
            </Reorder.Group>
            <button 
              onClick={addLink}
              className="w-full py-4 rounded-2xl border-2 border-dashed border-brand-green-pale text-brand-mid hover:border-brand-green hover:text-brand-green transition-all flex items-center justify-center gap-2 text-xs font-black uppercase tracking-widest"
            >
              <Plus size={16} /> ADD LINK
            </button>
          </div>
        </SectionCard>
      </div>
    </div>
  );
}
