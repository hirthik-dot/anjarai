import { useState, useRef } from 'react';
import api from '../utils/api';
import { useToast } from './Toast';

export default function ImageUploader({ value, onChange, multiple = false }) {
  const [activeTab, setActiveTab] = useState('URL'); // 'URL' or 'Upload'
  const [loading, setLoading]     = useState(false);
  const [urlInput, setUrlInput]   = useState('');
  const fileRef = useRef(null);
  const toast = useToast();

  const handleAddUrl = (e) => {
    e.preventDefault();
    if (!urlInput.trim()) return;
    if (multiple) {
      onChange([...(value || []), urlInput.trim()]);
    } else {
      onChange(urlInput.trim());
    }
    setUrlInput('');
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setLoading(true);
    const formData = new FormData();
    formData.append('image', file);
    try {
      const res = await api.post('/upload/image', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      if (multiple) {
        onChange([...(value || []), res.data.url]);
      } else {
        onChange(res.data.url);
      }
      toast.success('Image uploaded successfully!');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Upload failed');
    } finally {
      setLoading(false);
    }
  };

  const removeImage = (index) => {
    if (multiple) {
      onChange(value.filter((_, i) => i !== index));
    } else {
      onChange('');
    }
  };

  const images = multiple ? (value || []) : (value ? [value] : []);

  return (
    <div className="space-y-4">
      {/* Tabs */}
      <div className="flex gap-2 p-1 bg-brand-light/50 rounded-xl border border-gray-100">
        {['URL', 'Upload File'].map(tab => (
          <button
            key={tab} type="button"
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
              activeTab === tab ? 'bg-white text-brand-green shadow-sm' : 'text-brand-mid hover:text-brand-dark'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === 'URL' ? (
        <div className="flex gap-2">
          <input
            type="text" value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') handleAddUrl(e); }}
            placeholder="Paste image URL here..."
            className="flex-1 border-2 border-brand-green-pale rounded-xl px-4 py-2 text-sm focus:border-brand-green outline-none"
          />
          <button 
            type="button"
            onClick={handleAddUrl}
            className="bg-brand-green text-white px-4 rounded-xl font-bold text-sm hover:opacity-90"
          >
            Add
          </button>
        </div>
      ) : (
        <div 
          onClick={() => fileRef.current.click()}
          className={`border-2 border-dashed border-brand-green-pale rounded-2xl p-6 text-center cursor-pointer hover:bg-brand-green-pale/20 transition-all ${loading ? 'opacity-50' : ''}`}
        >
          <input 
            type="file" ref={fileRef} className="hidden" 
            accept="image/*" onChange={handleFileUpload} 
            disabled={loading}
          />
          {loading ? (
            <div className="flex flex-col items-center gap-2">
              <span className="animate-spin text-2xl">⏳</span>
              <p className="text-xs font-bold text-brand-green">Uploading to Cloudinary...</p>
            </div>
          ) : (
            <>
              <div className="text-2xl mb-1">🖼️</div>
              <p className="text-xs font-bold text-brand-mid">Click to upload or drag & drop</p>
              <p className="text-[10px] text-brand-mid/50 mt-1 uppercase">JPG, PNG, WEBP (Max 5MB)</p>
            </>
          )}
        </div>
      )}

      {/* Previews */}
      <div className="grid grid-cols-4 gap-3 mt-4">
        {images.map((img, i) => (
          <div key={i} className="relative group aspect-square rounded-xl overflow-hidden border border-gray-100 shadow-sm animate-in zoom-in-50 duration-200">
            <img src={img} alt="Preview" className="w-full h-full object-cover" />
            <button
              type="button" 
              onClick={() => removeImage(i)}
              className="absolute top-1 right-1 bg-brand-sale text-white w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold shadow-md hover:scale-110 transition-transform opacity-0 group-hover:opacity-100"
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
