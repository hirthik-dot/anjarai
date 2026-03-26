import { useState, useEffect } from 'react';
import SectionCard from '../components/SectionCard';
import ImageUploader from '../components/ImageUploader';
import api from '../utils/api';
import { useToast } from '../components/Toast';
import { Save, Sparkles } from 'lucide-react';

export default function ClosingBannerPage() {
  const [form, setForm] = useState({ image_url: '', title: '', subtitle: '', btn_text: '', btn_link: '' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const toast = useToast();

  useEffect(() => {
    api.get('/closing-banner').then(res => {
      setForm(res.data || { image_url: '', title: '', subtitle: '', btn_text: '', btn_link: '' });
      setLoading(false);
    });
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.put('/closing-banner', form);
      toast.success('Closing banner updated!');
    } catch (err) { toast.error('Save failed'); }
    finally { setSaving(false); }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-12 animate-in fade-in duration-500 pb-20">
      <h2 className="font-head text-4xl font-black text-brand-dark tracking-tight">🖼️ Closing Banner Section</h2>

      <SectionCard 
        title="Edit Homepage Closing Banner" 
        subtitle="Large call-to-action banner at the bottom"
        onSave={handleSave} saving={saving}
      >
        <div className="grid grid-cols-1 gap-12">
           <div className="space-y-4">
              <h4 className="text-[10px] font-black uppercase tracking-widest text-brand-mid/50 flex items-center gap-2">
                <Sparkles size={14} className="text-brand-warm" /> Banner Image
              </h4>
              <ImageUploader value={form.image_url} onChange={(v) => setForm(f => ({ ...f, image_url: v }))} />
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                 <Label text="Banner Title" />
                 <input 
                    value={form.title} onChange={(e) => setForm(f => ({ ...f, title: e.target.value }))}
                    className={inputClass} placeholder="e.g. From Our Family to Yours"
                 />
              </div>
              <div className="space-y-4">
                 <Label text="Banner Subtitle" />
                 <input 
                    value={form.subtitle} onChange={(e) => setForm(f => ({ ...f, subtitle: e.target.value }))}
                    className={inputClass} placeholder="e.g. Pure. Organic. Made with Love."
                 />
              </div>
              <div className="space-y-4">
                 <Label text="Button Text" />
                 <input 
                    value={form.btn_text} onChange={(e) => setForm(f => ({ ...f, btn_text: e.target.value }))}
                    className={inputClass} placeholder="e.g. Shop All Products →"
                 />
              </div>
              <div className="space-y-4">
                 <Label text="Button Link" />
                 <input 
                    value={form.btn_link} onChange={(e) => setForm(f => ({ ...f, btn_link: e.target.value }))}
                    className={inputClass} placeholder="/collections/all"
                 />
              </div>
           </div>
        </div>

        {/* Live Preview */}
        <div className="mt-20 border-t-2 border-dashed border-gray-100 pt-20">
            <p className="text-[10px] font-black tracking-widest text-brand-mid/40 uppercase mb-10 text-center">LAYOUT PREVIEW</p>
            <div className="relative aspect-[21/9] rounded-[60px] overflow-hidden shadow-2xl border border-gray-100 group">
                <img src={form.image_url} alt="" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
                <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] flex flex-col items-center justify-center p-12 text-center text-white">
                   <h3 className="font-head text-5xl md:text-6xl font-bold mb-4 drop-shadow-lg">{form.title || 'TITLE'}</h3>
                   <p className="text-white/80 text-lg md:text-xl font-bold mb-10 drop-shadow-md">{form.subtitle || 'SUBTITLE'}</p>
                   <button className="bg-brand-green text-white px-12 py-5 rounded-full font-black text-xs uppercase tracking-widest shadow-2xl shadow-black/20 hover:scale-105 transition-transform">{form.btn_text || 'ACTION BUTTON'}</button>
                </div>
            </div>
        </div>
      </SectionCard>
    </div>
  );
}

function Label({ text }) {
  return <label className="text-[10px] font-black uppercase tracking-widest text-brand-mid/50 ml-2">{text}</label>
}

const inputClass = "w-full bg-brand-light/50 border-2 border-brand-green-pale rounded-2xl px-5 py-4 text-sm font-bold focus:border-brand-green focus:bg-white outline-none transition-all";
