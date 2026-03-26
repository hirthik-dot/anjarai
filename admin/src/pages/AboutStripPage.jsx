import { useState, useEffect } from 'react';
import SectionCard from '../components/SectionCard';
import ImageUploader from '../components/ImageUploader';
import TagsInput from '../components/TagsInput';
import api from '../utils/api';
import { useToast } from '../components/Toast';
import { Save, Heart, Sparkles } from 'lucide-react';

export default function AboutStripPage() {
  const [form, setForm] = useState({ image_url: '', title: '', body: '', badges: [], btn_text: '', btn_link: '' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const toast = useToast();

  useEffect(() => {
    api.get('/about').then(res => {
      setForm(res.data || { image_url: '', title: '', body: '', badges: [], btn_text: '', btn_link: '' });
      setLoading(false);
    });
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.put('/about', form);
      toast.success('About section updated!');
    } catch (err) { toast.error('Save failed'); }
    finally { setSaving(false); }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-12 animate-in fade-in duration-500 pb-20">
      <h2 className="font-head text-4xl font-black text-brand-dark tracking-tight">❤️ About Strip Section</h2>

      <SectionCard 
        title="Edit Homepage About Strip" 
        subtitle="Mid-page content section with large image"
        onSave={handleSave} saving={saving}
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Media */}
          <div className="space-y-6">
             <div className="space-y-4">
                <h4 className="text-[10px] font-black uppercase tracking-widest text-brand-mid/50 flex items-center gap-2">
                  <Sparkles size={14} className="text-brand-warm" /> Main Section Image
                </h4>
                <ImageUploader value={form.image_url} onChange={(v) => setForm(f => ({ ...f, image_url: v }))} />
             </div>
             <div className="space-y-4">
                <h4 className="text-[10px] font-black uppercase tracking-widest text-brand-mid/50 flex items-center gap-2">
                  <Heart size={14} className="text-brand-green" /> Key Badges
                </h4>
                <TagsInput value={form.badges} onChange={(v) => setForm(f => ({ ...f, badges: v }))} placeholder="Type badge and hit Enter..." />
             </div>
          </div>

          {/* Content */}
          <div className="space-y-6">
             <div className="grid grid-cols-1 gap-6">
                <div className="space-y-2">
                   <Label text="Section Title" />
                   <input 
                      value={form.title} onChange={(e) => setForm(f => ({ ...f, title: e.target.value }))}
                      className={inputClass} placeholder="e.g. Made for Babies, Trusted by Mothers"
                   />
                </div>
                <div className="space-y-2">
                   <Label text="Section Body Copy" />
                   <textarea 
                      value={form.body} onChange={(e) => setForm(f => ({ ...f, body: e.target.value }))}
                      className={inputClass} rows="6" placeholder="Describe your brand values..."
                   />
                </div>
                <div className="grid grid-cols-2 gap-4">
                   <div className="space-y-2">
                      <Label text="Button Text" />
                      <input 
                         value={form.btn_text} onChange={(e) => setForm(f => ({ ...f, btn_text: e.target.value }))}
                         className={inputClass} placeholder="e.g. Learn More"
                      />
                   </div>
                   <div className="space-y-2">
                      <Label text="Button Link" />
                      <input 
                         value={form.btn_link} onChange={(e) => setForm(f => ({ ...f, btn_link: e.target.value }))}
                         className={inputClass} placeholder="/about-us"
                      />
                   </div>
                </div>
             </div>
          </div>
        </div>

        {/* Desktop Preview */}
        <div className="mt-20 border-t-2 border-dashed border-gray-100 pt-20">
            <p className="text-[10px] font-black tracking-widest text-brand-mid/40 uppercase mb-10 text-center">LAYOUT PREVIEW</p>
            <div className="bg-white rounded-[60px] shadow-2xl overflow-hidden flex flex-col md:flex-row border border-gray-100">
               <div className="md:w-1/2 aspect-square md:aspect-auto">
                  <img src={form.image_url} alt="" className="w-full h-full object-cover" />
               </div>
               <div className="md:w-1/2 p-16 flex flex-col justify-center gap-8">
                  <h3 className="font-head text-4xl font-bold text-brand-dark">{form.title || 'YOUR TITLE HERE'}</h3>
                  <p className="text-brand-mid text-lg leading-relaxed opacity-80">{form.body || 'Your body text preview will appear here...'}</p>
                  <div className="flex flex-wrap gap-2">
                     {form.badges.map((b, i) => (
                        <span key={i} className="bg-brand-green-pale text-brand-green text-[10px] font-black uppercase px-3 py-1 rounded-full">{b}</span>
                     ))}
                  </div>
                  <button className="bg-brand-green text-white w-fit px-10 py-4 rounded-full font-black text-xs uppercase tracking-widest">{form.btn_text || 'CLICK ME'}</button>
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
