import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ImageUploader from './ImageUploader';
import TagsInput from './TagsInput';
import ToggleSwitch from './ToggleSwitch';
import { slugify } from '../utils/helpers';
import api from '../utils/api';
import { useToast } from './Toast';

export default function ProductFormModal({ isOpen, onClose, product, onSave }) {
  const [form, setForm]     = useState({
    id: '', slug: '', name: '', price: '', originalPrice: '', images: [],
    sale: false, rating: 5, reviews: 0, collections: ['all'], variants: [],
    type: 'buy', description: '', benefits: [], ingredients: '', howToUse: '',
    fssai: true, is_active: true
  });
  const [loading, setLoading] = useState(false);
  const [availableCollections, setAvailableCollections] = useState([]);
  const toast = useToast();

  useEffect(() => {
    const fetchCollections = async () => {
      try {
        const res = await api.get('/collections');
        setAvailableCollections(res.data);
      } catch (err) { console.error('Failed to load collections', err); }
    };
    fetchCollections();
  }, [isOpen]);

  useEffect(() => {
    if (product) {
      setForm({
        ...product,
        originalPrice: product.original_price || '',
        howToUse:      product.how_to_use || '',
      });
    } else {
      setForm({
        id: 'p' + Date.now(), slug: '', name: '', price: '', originalPrice: '', images: [],
        sale: false, rating: 5, reviews: 0, collections: ['all'], variants: [],
        type: 'buy', description: '', benefits: [], ingredients: '', howToUse: '',
        fssai: true, is_active: true
      });
    }
  }, [product, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(f => {
      const updated = { ...f, [name]: value };
      if (name === 'name' && !product) {
        updated.slug = slugify(value);
      }
      return updated;
    });
  };

  const handleToggle = (name, val) => setForm(f => ({ ...f, [name]: val }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.price || form.images.length === 0) {
      return toast.error('Please fill required fields (Name, Price, Image)');
    }
    setLoading(true);
    try {
      const payload = {
        ...form,
        price: Number(form.price),
        originalPrice: form.originalPrice ? Number(form.originalPrice) : null,
      };
      if (product) {
        await api.put(`/products/${product.id}`, payload);
        toast.success('Product updated!');
      } else {
        await api.post('/products', payload);
        toast.success('Product created!');
      }
      onSave();
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Save failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="fixed inset-0 bg-brand-dark/80 backdrop-blur-md z-[100]" />
          <motion.div 
            initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }} transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-x-0 bottom-0 top-10 bg-brand-light rounded-t-[40px] z-[101] overflow-hidden flex flex-col shadow-2xl"
          >
            <div className="px-10 py-6 border-b border-gray-100 flex justify-between items-center bg-white">
              <div>
                <h2 className="font-head text-3xl font-bold text-brand-dark">{product ? 'Edit Product' : 'Add New Product'}</h2>
                <p className="text-brand-mid text-xs font-bold uppercase tracking-widest mt-1">🌿 {form.slug || 'product-slug'}</p>
              </div>
              <button 
                onClick={onClose}
                className="w-12 h-12 rounded-full hover:bg-brand-light flex items-center justify-center text-3xl transition-colors group"
              >
                <span className="group-hover:rotate-90 transition-transform">×</span>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-10 py-10">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-7xl mx-auto">
                
                {/* COL 1: Basic Info */}
                <div className="space-y-8">
                  <Section title="BASIC INFORMATION" icon="📝">
                    <div className="space-y-4">
                      <Label text="Product Name *" />
                      <input name="name" value={form.name} onChange={handleChange} placeholder="e.g. Sprouted Ragi Powder" className={inputClass} required />
                      
                      <div className="flex gap-4">
                        <div className="flex-1">
                          <Label text="Slug *" />
                          <input name="slug" value={form.slug} onChange={handleChange} className={`${inputClass} font-mono`} required />
                        </div>
                        <div className="w-1/3">
                          <Label text="Sort Order" />
                          <input name="sort_order" type="number" value={form.sort_order} onChange={handleChange} className={inputClass} />
                        </div>
                      </div>

                      <Label text="Description" />
                      <textarea name="description" value={form.description} onChange={handleChange} rows="4" className={inputClass}></textarea>
                    </div>
                  </Section>

                  <Section title="PRICING & STATUS" icon="💰">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label text="Sale Price ₹ *" />
                        <input name="price" type="number" value={form.price} onChange={handleChange} className={inputClass} required />
                      </div>
                      <div>
                        <Label text="Original Price ₹" />
                        <input name="originalPrice" type="number" value={form.originalPrice} onChange={handleChange} className={inputClass} />
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-6 mt-4 p-4 bg-brand-green-pale/20 rounded-2xl border border-brand-green-pale/30">
                      <ToggleSwitch checked={form.sale} onChange={(v) => handleToggle('sale', v)} label="Show Sale Badge" />
                      <ToggleSwitch checked={form.fssai} onChange={(v) => handleToggle('fssai', v)} label="FSSAI Certified" />
                      <ToggleSwitch checked={form.is_active} onChange={(v) => handleToggle('is_active', v)} label="Published (Live)" />
                    </div>
                  </Section>

                  <Section title="PRODUCT DETAILS" icon="🌿">
                    <div className="space-y-4">
                      <Label text="Type" />
                      <div className="flex gap-2">
                        {['buy', 'add', 'sold'].map(t => (
                          <button 
                            key={t} type="button" onClick={() => handleToggle('type', t)}
                            className={`flex-1 py-2.5 rounded-xl font-bold text-xs uppercase transition-all ${
                              form.type === t ? 'bg-brand-green text-white shadow-lg' : 'bg-white border-2 border-brand-green-pale text-brand-mid hover:border-brand-green'
                            }`}
                          >
                            {t === 'buy' ? 'Buy Now' : t === 'add' ? 'Add To Bag' : 'Sold Out'}
                          </button>
                        ))}
                      </div>
                      
                      <Label text="Collections" />
                      <div className="flex flex-wrap gap-2">
                        {['all', ...availableCollections.map(c => c.slug)].map(c => (
                          <button 
                            key={c} type="button" onClick={() => {
                              const news = form.collections.includes(c) ? form.collections.filter(x => x !== c) : [...form.collections, c];
                              handleToggle('collections', news);
                            }}
                            className={`px-4 py-1.5 rounded-full text-[10px] font-black tracking-widest uppercase transition-all ${
                              form.collections.includes(c) ? 'bg-brand-warm text-white' : 'bg-gray-100 text-brand-mid font-bold'
                            }`}
                          >
                            {c === 'all' ? 'ALL' : (availableCollections.find(x => x.slug === c)?.name || c).toUpperCase()}
                          </button>
                        ))}
                      </div>

                      <Label text="Ingredients" />
                      <textarea name="ingredients" value={form.ingredients} onChange={handleChange} rows="2" className={inputClass}></textarea>
                      <Label text="How to Use" />
                      <textarea name="howToUse" value={form.howToUse} onChange={handleChange} rows="2" className={inputClass}></textarea>
                    </div>
                  </Section>
                </div>

                {/* COL 2: Media & Lists */}
                <div className="space-y-8">
                  <Section title="PRODUCT MEDIA" icon="🖼️">
                    <Label text="Images (Cloudinary Upload) *" />
                    <ImageUploader multiple={true} value={form.images} onChange={(v) => handleToggle('images', v)} />
                  </Section>

                  <Section title="VARIANTS & BENEFITS" icon="✨">
                    <Label text="Available Variants (e.g. 200g, 500g)" />
                    <TagsInput value={form.variants} onChange={(v) => handleToggle('variants', v)} placeholder="Type and hit Enter..." />
                    <div className="mt-4" />
                    <Label text="Key Benefits" />
                    <TagsInput value={form.benefits} onChange={(v) => handleToggle('benefits', v)} placeholder="Type benefit and hit Enter..." />
                  </Section>

                  <Section title="CUSTOM METRICS" icon="⭐">
                    <Label text="Manual Rating (1-5)" />
                    <div className="flex gap-2">
                      {[1,2,3,4,5].map(s => (
                        <button key={s} type="button" onClick={() => handleToggle('rating', s)} className="text-3xl filter hover:drop-shadow-[0_0_8px_gold] transition-all">
                          {form.rating >= s ? '⭐' : '☆'}
                        </button>
                      ))}
                    </div>
                    <div className="mt-4" />
                    <Label text="Review Count" />
                    <input name="reviews" type="number" value={form.reviews} onChange={handleChange} className={inputClass} />
                  </Section>
                </div>

              </div>
            </form>

            <div className="bg-white border-t border-gray-100 px-10 py-6 flex justify-between items-center shadow-[0_-10px_40px_rgba(0,0,0,0.05)]">
              <span className="text-brand-mid text-xs font-bold italic">* Required fields</span>
              <div className="flex gap-4">
                <button 
                  onClick={onClose} 
                  className="px-8 py-3 rounded-2xl font-bold text-brand-mid hover:bg-brand-light transition-colors"
                >
                  Discard Changes
                </button>
                <button 
                  onClick={handleSubmit} disabled={loading}
                  className="bg-brand-green hover:bg-brand-green-light text-white px-12 py-3 rounded-2xl font-black transition-all hover:scale-105"
                >
                  {loading ? 'SAVING...' : 'SAVE PRODUCT'}
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// Sub-components for cleaner structure
function Section({ title, subtitle, icon, children }) {
  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col group">
      <div className="flex items-center gap-3 mb-6">
        <span className="w-10 h-10 rounded-xl bg-brand-green-pale/30 flex items-center justify-center text-xl group-hover:scale-110 transition-transform">{icon}</span>
        <h3 className="font-head text-lg font-bold text-brand-dark tracking-tight">{title}</h3>
      </div>
      {children}
    </div>
  )
}

function Label({ text }) {
  return <label className="block text-[11px] font-black uppercase tracking-widest text-brand-mid/70 mb-1.5 ml-1">{text}</label>
}

const inputClass = "w-full bg-brand-light/20 border-2 border-brand-green-pale rounded-xl px-4 py-3 text-sm font-semibold focus:border-brand-green focus:bg-white outline-none transition-all placeholder:opacity-50";
