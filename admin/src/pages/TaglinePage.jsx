import { useState, useEffect } from 'react';
import SectionCard from '../components/SectionCard';
import api from '../utils/api';
import { useToast } from '../components/Toast';
import { Save, Sparkles, Leaf } from 'lucide-react';

export default function TaglinePage() {
  const [form, setForm] = useState({ left_text: '', right_text: '' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const toast = useToast();

  useEffect(() => {
    api.get('/tagline').then(res => {
      setForm(res.data || { left_text: '', right_text: '' });
      setLoading(false);
    });
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.put('/tagline', form);
      toast.success('Tagline updated successfully');
    } catch (err) { toast.error('Save failed'); }
    finally { setSaving(false); }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-12 animate-in fade-in duration-500">
      <h2 className="font-head text-4xl font-black text-brand-dark tracking-tight">🏷️ Tagline Bar</h2>

      <SectionCard 
        title="Edit Site Taglines" 
        subtitle="Floating bar above header"
        onSave={handleSave} saving={saving}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <h4 className="text-[10px] font-black uppercase tracking-widest text-brand-mid/50 flex items-center gap-2">
              <Sparkles size={14} className="text-brand-warm" /> Left Text
            </h4>
            <input 
              value={form.left_text} onChange={(e) => setForm(f => ({ ...f, left_text: e.target.value }))}
              placeholder="e.g. Sip Your Way To Health"
              className="w-full bg-brand-light/50 border-2 border-brand-green-pale rounded-2xl px-6 py-4 text-sm font-bold focus:border-brand-green outline-none"
            />
          </div>
          <div className="space-y-4">
            <h4 className="text-[10px] font-black uppercase tracking-widest text-brand-mid/50 flex items-center gap-2">
              <Leaf size={14} className="text-brand-green" /> Right Text
            </h4>
            <input 
              value={form.right_text} onChange={(e) => setForm(f => ({ ...f, right_text: e.target.value }))}
              placeholder="e.g. 🎖️ FSSAI Certified & Lab Approved"
              className="w-full bg-brand-light/50 border-2 border-brand-green-pale rounded-2xl px-6 py-4 text-sm font-bold focus:border-brand-green outline-none"
            />
          </div>
        </div>

        {/* Live Preview Wrapper */}
        <div className="mt-12 p-10 bg-brand-light/50 rounded-[40px] border-2 border-dashed border-brand-green-pale flex flex-col items-center">
            <p className="text-[10px] font-black tracking-widest text-brand-mid/40 uppercase mb-8">LIVE PREVIEW ON STORE</p>
            <div className="w-full max-w-2xl bg-white rounded-full py-2.5 px-8 shadow-2xl flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-brand-dark overflow-hidden">
                <span className="flex items-center gap-2">{form.left_text || 'LEFT TEXT HERE'}</span>
                <div className="h-4 w-px bg-gray-100" />
                <span className="flex items-center gap-2 text-brand-green">{form.right_text || 'RIGHT TEXT HERE'}</span>
            </div>
        </div>
      </SectionCard>
    </div>
  );
}
