import { useState, useEffect } from 'react';
import SectionCard from '../components/SectionCard';
import TagsInput from '../components/TagsInput';
import api from '../utils/api';
import { useToast } from '../components/Toast';
import { Save, Sparkles, MapPin, Phone, Instagram, Facebook, Youtube, Github, Link as LinkIcon, Info } from 'lucide-react';

export default function FooterPage() {
   const [form, setForm] = useState({
      brand_description: '', whatsapp_number: '', whatsapp_link: '',
      instagram_handle: '', instagram_url: '', facebook_url: '', youtube_url: '', threads_url: '',
      location: '', quick_links: [], category_links: [], copyright: '',
      powered_by_text: '', powered_by_link: ''
   });
   const [loading, setLoading] = useState(true);
   const [saving, setSaving] = useState(false);
   const toast = useToast();

   useEffect(() => {
      api.get('/footer').then(res => {
         setForm(res.data || {
            brand_description: '', whatsapp_number: '', whatsapp_link: '',
            instagram_handle: '', instagram_url: '', facebook_url: '', youtube_url: '', threads_url: '',
            location: '', quick_links: [], category_links: [], copyright: '',
            powered_by_text: '', powered_by_link: ''
         });
         setLoading(false);
      });
   }, []);

   const handleSave = async () => {
      setSaving(true);
      try {
         await api.put('/footer', form);
         toast.success('Footer configuration saved!');
      } catch (err) { toast.error('Save failed'); }
      finally { setSaving(false); }
   };

   const handleLinkChange = (section, index, field, value) => {
      const list = [...form[section]];
      list[index][field] = value;
      setForm(f => ({ ...f, [section]: list }));
   };

   const addLink = (section) => {
      setForm(f => ({ ...f, [section]: [...f[section], { label: '', href: '' }] }));
   };

   const removeLink = (section, index) => {
      setForm(f => ({ ...f, [section]: f[section].filter((_, i) => i !== index) }));
   };

   return (
      <div className="max-w-7xl mx-auto space-y-12 animate-in fade-in duration-500 pb-20">
         <div className="flex justify-between items-center bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex-wrap gap-4">
            <div>
               <h2 className="font-head text-4xl font-black text-brand-dark tracking-tight">🔗 Footer Config</h2>
               <p className="text-brand-mid text-xs font-black uppercase tracking-[3px] mt-1 opacity-40">Manage your site's anchor content</p>
            </div>
            <button
               onClick={handleSave} disabled={saving}
               className="bg-brand-green hover:bg-brand-green-light text-white font-black rounded-2xl px-12 py-4 uppercase tracking-widest transition-all hover:scale-105 shadow-xl shadow-brand-green/20"
            >
               {saving ? 'SAVING...' : 'SAVE ALL CHANGES'}
            </button>
         </div>

         <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* LEFT — Brand & Social */}
            <div className="space-y-8">
               <Section title="BRAND IDENTITY" icon="🌿">
                  <div className="space-y-4">
                     <Label text="Brand Description (Short Bio)" />
                     <textarea
                        value={form.brand_description} onChange={(e) => setForm(f => ({ ...f, brand_description: e.target.value }))}
                        className={inputClass} rows="4" placeholder="Homemade baby food powders crafted with love..."
                     />
                     <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                           <Label text="Display Location" />
                           <div className="relative">
                              <MapPin className={iconClass} size={14} />
                              <input value={form.location} onChange={(e) => setForm(f => ({ ...f, location: e.target.value }))} placeholder="City, State, India" className={inputClass + " pl-10"} />
                           </div>
                        </div>
                        <div className="space-y-2">
                           <Label text="WhatsApp Display Number" />
                           <div className="relative">
                              <Phone className={iconClass} size={14} />
                              <input value={form.whatsapp_number} onChange={(e) => setForm(f => ({ ...f, whatsapp_number: e.target.value }))} placeholder="+91 8940497627" className={inputClass + " pl-10"} />
                           </div>
                        </div>
                     </div>
                  </div>
               </Section>

               <Section title="SOCIAL LINKS" icon="📱">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <div className="space-y-2">
                        <Label text="Instagram Handle" />
                        <div className="relative">
                           <Instagram className={iconClass} size={14} />
                           <input value={form.instagram_handle} onChange={(e) => setForm(f => ({ ...f, instagram_handle: e.target.value }))} placeholder="@themothers_care" className={inputClass + " pl-10"} />
                        </div>
                     </div>
                     <div className="space-y-2">
                        <Label text="Instagram URL" />
                        <input value={form.instagram_url} onChange={(e) => setForm(f => ({ ...f, instagram_url: e.target.value }))} placeholder="https://..." className={inputClass} />
                     </div>
                     <div className="space-y-2">
                        <Label text="Facebook URL" />
                        <div className="relative">
                           <Facebook className={iconClass} size={14} />
                           <input value={form.facebook_url} onChange={(e) => setForm(f => ({ ...f, facebook_url: e.target.value }))} placeholder="https://..." className={inputClass + " pl-10"} />
                        </div>
                     </div>
                     <div className="space-y-2">
                        <Label text="YouTube URL" />
                        <div className="relative">
                           <Youtube className={iconClass} size={14} />
                           <input value={form.youtube_url} onChange={(e) => setForm(f => ({ ...f, youtube_url: e.target.value }))} placeholder="https://..." className={inputClass + " pl-10"} />
                        </div>
                     </div>
                  </div>
               </Section>

               <Section title="CREDITS & LEGAL" icon="⚖️">
                  <div className="space-y-4">
                     <Label text="Copyright Text" />
                     <input value={form.copyright} onChange={(e) => setForm(f => ({ ...f, copyright: e.target.value }))} placeholder="© 2026, The Anjaraipetti..." className={inputClass} />
                     <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                           <Label text="Powered By (Label)" />
                           <input value={form.powered_by_text} onChange={(e) => setForm(f => ({ ...f, powered_by_text: e.target.value }))} placeholder="Powered by Thirupathi G" className={inputClass} />
                        </div>
                        <div className="space-y-2">
                           <Label text="Powered By URL" />
                           <input value={form.powered_by_link} onChange={(e) => setForm(f => ({ ...f, powered_by_link: e.target.value }))} placeholder="https://..." className={inputClass} />
                        </div>
                     </div>
                  </div>
               </Section>
            </div>

            {/* RIGHT — Links Groups */}
            <div className="space-y-8">
               <LinkSection
                  title="QUICK LINKS"
                  icon={<LinkIcon size={18} />}
                  items={form.quick_links}
                  onAdd={() => addLink('quick_links')}
                  onRemove={(i) => removeLink('quick_links', i)}
                  onChange={(i, f, v) => handleLinkChange('quick_links', i, f, v)}
               />
               <LinkSection
                  title="SHOP CATEGORIES"
                  icon={<Sparkles size={18} />}
                  items={form.category_links}
                  onAdd={() => addLink('category_links')}
                  onRemove={(i) => removeLink('category_links', i)}
                  onChange={(i, f, v) => handleLinkChange('category_links', i, f, v)}
               />
            </div>
         </div>
      </div>
   );
}

function Section({ title, icon, children }) {
   return (
      <div className="bg-white rounded-[40px] p-8 shadow-sm border border-gray-100 flex flex-col hover:shadow-2xl transition-all duration-500">
         <div className="flex items-center gap-3 mb-8 border-b border-gray-50 pb-6">
            <span className="w-12 h-12 rounded-2xl bg-brand-green-pale/30 text-brand-green flex items-center justify-center text-2xl">{icon}</span>
            <h3 className="font-head text-xl font-bold text-brand-dark tracking-tight">{title}</h3>
         </div>
         {children}
      </div>
   )
}

function LinkSection({ title, icon, items, onAdd, onRemove, onChange }) {
   return (
      <div className="bg-white rounded-[40px] p-8 shadow-sm border border-gray-100 flex flex-col hover:shadow-2xl transition-all duration-500">
         <div className="flex items-center justify-between mb-8 border-b border-gray-50 pb-6">
            <div className="flex items-center gap-3">
               <span className="w-12 h-12 rounded-2xl bg-brand-warm/10 text-brand-warm flex items-center justify-center text-2xl">{icon}</span>
               <h3 className="font-head text-xl font-bold text-brand-dark tracking-tight">{title}</h3>
            </div>
            <button onClick={onAdd} className="bg-brand-green text-white w-10 h-10 rounded-xl flex items-center justify-center text-xl shadow-lg hover:scale-110 active:scale-95 transition-all">
               +
            </button>
         </div>
         <div className="space-y-3">
            {items.map((item, i) => (
               <div key={i} className="grid grid-cols-1 md:grid-cols-2 gap-3 group">
                  <div className="relative">
                     <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-brand-mid/40">Label</span>
                     <input value={item.label} onChange={(e) => onChange(i, 'label', e.target.value)} className={inputClass + " pl-14 py-3"} />
                  </div>
                  <div className="relative flex gap-2">
                     <div className="relative flex-1">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-brand-mid/40">Link</span>
                        <input value={item.href} onChange={(e) => onChange(i, 'href', e.target.value)} className={inputClass + " pl-12 py-3"} />
                     </div>
                     <button onClick={() => onRemove(i)} className="bg-brand-sale/10 text-brand-sale w-12 rounded-2xl flex items-center justify-center hover:bg-brand-sale hover:text-white transition-all">×</button>
                  </div>
               </div>
            ))}
            {items.length === 0 && <p className="text-center py-6 text-brand-mid/30 italic font-bold">No links added yet...</p>}
         </div>
      </div>
   )
}

function Label({ text }) {
   return <label className="text-[10px] font-black uppercase tracking-widest text-brand-mid/50 ml-2">{text}</label>
}

const inputClass = "w-full bg-brand-light/50 border-2 border-brand-green-pale rounded-2xl px-5 py-4 text-sm font-bold focus:border-brand-green focus:bg-white outline-none transition-all";
const iconClass = "absolute left-4 top-1/2 -translate-y-1/2 text-brand-mid/40 group-focus-within:text-brand-green transition-colors";
