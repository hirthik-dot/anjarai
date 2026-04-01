import { useState, useEffect, useMemo } from 'react';
import SectionCard from '../components/SectionCard';
import ProductFormModal from '../components/ProductFormModal';
import ToggleSwitch from '../components/ToggleSwitch';
import ConfirmDialog from '../components/ConfirmDialog';
import DataTable from '../components/DataTable';
import api from '../utils/api';
import { formatPrice } from '../utils/helpers';
import { useToast } from '../components/Toast';
import { Plus, Search, Grid, List as ListIcon, Trash2, Edit2, Filter } from 'lucide-react';

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [view,     setView]     = useState('grid'); // 'grid' or 'list'
  const [search,   setSearch]   = useState('');
  const [filter,   setFilter]   = useState({ collection: 'all', type: 'all', status: 'all' });
  const [availableCollections, setAvailableCollections] = useState([]);
  
  const [modalOpen, setModalOpen]     = useState(false);
  const [editing,   setEditing]       = useState(null);
  const [deleteId,  setDeleteId]      = useState(null);

  const toast = useToast();

  const fetchProducts = async () => {
    try {
      const res = await api.get('/products/admin/all');
      setProducts(res.data);
      setLoading(false);
    } catch (err) { toast.error('Failed to load products'); }
  };

  useEffect(() => {
    fetchProducts();
    // Fetch collections for filter dropdown
    api.get('/collections').then(res => setAvailableCollections(res.data)).catch(() => {});
  }, []);

  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.id.toLowerCase().includes(search.toLowerCase());
      const matchColl   = filter.collection === 'all' || (p.collections && p.collections.includes(filter.collection));
      const matchType   = filter.type === 'all' || p.type === filter.type;
      const matchStatus = filter.status === 'all' || (filter.status === 'active' ? p.is_active : !p.is_active);
      return matchSearch && matchColl && matchType && matchStatus;
    });
  }, [products, search, filter]);

  const handleDelete = async () => {
    try {
      await api.delete(`/products/${deleteId}`);
      toast.success('Product deleted');
      setDeleteId(null);
      fetchProducts();
    } catch (err) { toast.error('Delete failed'); }
  };

  const handleToggleStatus = async (id, current) => {
    try {
      await api.put(`/products/${id}`, { is_active: !current });
      toast.success('Status updated');
      fetchProducts();
    } catch (err) { toast.error('Update failed'); }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h2 className="font-head text-2xl sm:text-4xl font-black text-brand-dark tracking-tight">📦 Products</h2>
          <p className="text-brand-mid text-[10px] sm:text-xs font-black uppercase tracking-[2px] sm:tracking-[3px] mt-1 sm:mt-1.5 opacity-40">Manage your product catalog ({products.length})</p>
        </div>
        <button 
          onClick={() => { setEditing(null); setModalOpen(true); }}
          className="bg-brand-green hover:bg-brand-green-light text-white font-black rounded-full px-6 sm:px-8 py-3 sm:py-3.5 text-xs sm:text-sm uppercase tracking-widest flex items-center justify-center gap-2 shadow-xl shadow-brand-green/30 transition-all hover:scale-105 active:scale-95 w-full sm:w-auto"
        >
          <Plus size={18} /> ADD NEW PRODUCT
        </button>
      </div>

      {/* Toolbar */}
      <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-sm border border-gray-100 flex flex-col gap-4 sm:gap-6">
        <div className="relative flex-1 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-mid group-focus-within:text-brand-green transition-colors" size={18} />
          <input 
            type="text" value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or ID..."
            className="w-full bg-brand-light/50 border-2 border-brand-green-pale rounded-xl sm:rounded-2xl pl-12 pr-4 py-2.5 sm:py-3 text-xs sm:text-sm font-bold focus:border-brand-green outline-none transition-all"
          />
        </div>

        <div className="flex gap-2 sm:gap-4 items-center flex-wrap">
          <select 
            value={filter.collection} onChange={(e) => setFilter(f => ({ ...f, collection: e.target.value }))}
            className="bg-brand-light/50 border-2 border-brand-green-pale rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 text-[10px] sm:text-xs font-black uppercase tracking-wider sm:tracking-widest outline-none text-brand-mid focus:border-brand-green transition-all flex-1 sm:flex-none min-w-0"
          >
            <option value="all">Categories: ALL</option>
            {availableCollections.map(c => (
              <option key={c.slug} value={c.slug}>{c.name.toUpperCase()}</option>
            ))}
          </select>
          <select 
            value={filter.status} onChange={(e) => setFilter(f => ({ ...f, status: e.target.value }))}
            className="bg-brand-light/50 border-2 border-brand-green-pale rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 text-[10px] sm:text-xs font-black uppercase tracking-wider sm:tracking-widest outline-none text-brand-mid focus:border-brand-green transition-all flex-1 sm:flex-none min-w-0"
          >
            <option value="all">Status: ALL</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>

          <div className="flex bg-brand-light p-1 rounded-xl">
            <button onClick={() => setView('grid')} className={`p-2 rounded-lg transition-all ${view === 'grid' ? 'bg-white text-brand-green shadow-sm' : 'text-brand-mid/50 hover:text-brand-mid'}`}><Grid size={20} /></button>
            <button onClick={() => setView('list')} className={`p-2 rounded-lg transition-all ${view === 'list' ? 'bg-white text-brand-green shadow-sm' : 'text-brand-mid/50 hover:text-brand-mid'}`}><ListIcon size={20} /></button>
          </div>
        </div>
      </div>

      {/* Content */}
      {view === 'grid' ? (
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-8 pb-10">
          {filteredProducts.map(p => (
            <ProductCard 
              key={p.id} product={p} 
              onEdit={() => { setEditing(p); setModalOpen(true); }}
              onDelete={() => setDeleteId(p.id)}
              onToggleStatus={() => handleToggleStatus(p.id, p.is_active)}
            />
          ))}
        </div>
      ) : (
        <DataTable 
          data={filteredProducts}
          columns={[
            { header: 'Image', render: (p) => <img src={p.images?.[0]} className="w-12 h-12 rounded-xl object-cover bg-gray-100" /> },
            { header: 'Name', render: (p) => <span className="font-black text-brand-dark">{p.name}</span> },
            { header: 'Price', render: (p) => <span className="text-brand-green font-black">{formatPrice(p.price)}</span> },
            { 
              header: 'Status', 
              render: (p) => (
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${p.is_active ? 'bg-brand-green' : 'bg-gray-300'}`} />
                  <span className={`text-[10px] font-black uppercase tracking-widest ${p.is_active ? 'text-brand-green' : 'text-brand-mid opacity-40'}`}>{p.is_active ? 'Active' : 'Draft'}</span>
                </div>
              ) 
            },
            { 
              header: 'Actions', 
              render: (p) => (
                <div className="flex gap-2">
                  <button onClick={() => { setEditing(p); setModalOpen(true); }} className="w-10 h-10 rounded-xl bg-brand-green-pale/20 text-brand-green hover:bg-brand-green hover:text-white transition-all flex items-center justify-center"><Edit2 size={16} /></button>
                  <button onClick={() => setDeleteId(p.id)} className="w-10 h-10 rounded-xl bg-brand-sale/10 text-brand-sale hover:bg-brand-sale hover:text-white transition-all flex items-center justify-center"><Trash2 size={16} /></button>
                </div>
              ) 
            }
          ]}
        />
      )}

      {/* Modals & Dialogs */}
      <ProductFormModal 
        isOpen={modalOpen} 
        onClose={() => setModalOpen(false)} 
        product={editing} 
        onSave={fetchProducts}
      />

      <ConfirmDialog 
        isOpen={!!deleteId}
        title="Delete Product?"
        message="This will permanently remove the product from your store and cannot be undone."
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
}

function ProductCard({ product, onEdit, onDelete, onToggleStatus }) {
  return (
    <div className="bg-white rounded-[20px] sm:rounded-[32px] overflow-hidden border border-gray-100/50 shadow-sm hover:shadow-2xl transition-all group flex flex-col h-full shadow-brand-green/5">
      <div className="relative aspect-[4/3] bg-brand-light/50 p-2 sm:p-4">
        <img 
          src={product.images?.[0]} 
          alt={product.name} 
          className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-700" 
        />
        {product.sale && <span className="absolute top-4 left-4 bg-brand-sale text-white text-[9px] font-black uppercase px-3 py-1 rounded-full shadow-lg shadow-brand-sale/20">HOT SALE</span>}
        <div className={`absolute top-4 right-4 text-brand-green text-xs font-black bg-white rounded-full px-3 py-1 shadow-sm border border-gray-50 flex items-center gap-1.5`}>
          {product.rating} ⭐
        </div>
      </div>
      
      <div className="p-3 sm:p-6 flex-1 flex flex-col gap-2 sm:gap-3">
        <div className="flex flex-wrap gap-1">
          {product.collections.slice(0, 2).map(c => (
            <span key={c} className="text-[7px] sm:text-[9px] font-black uppercase tracking-wider sm:tracking-widest text-brand-mid/50 bg-gray-50 px-1.5 sm:px-2 py-0.5 rounded-full">{c.replace(/-/g, ' ')}</span>
          ))}
        </div>
        <h3 className="font-head text-sm sm:text-lg font-bold text-brand-dark leading-snug line-clamp-2 min-h-[2.5rem] sm:min-h-[3.5rem]">{product.name}</h3>
        
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mt-auto gap-2">
          <div className="flex flex-col">
            <span className="text-lg sm:text-2xl font-black text-brand-green font-head tracking-tight">{formatPrice(product.price)}</span>
            {product.original_price && <span className="text-[10px] sm:text-xs text-brand-mid/40 line-through font-bold">{formatPrice(product.original_price)}</span>}
          </div>
          <div className={`px-2 sm:px-4 py-1 sm:py-1.5 rounded-lg sm:rounded-xl text-[8px] sm:text-[10px] font-black uppercase tracking-wider sm:tracking-widest border-2 text-center ${
            product.type === 'buy' ? 'border-brand-green/20 text-brand-green bg-brand-green/5' : 
            product.type === 'add' ? 'border-brand-warm/20 text-brand-warm bg-brand-warm/5' : 
            'border-gray-100 text-brand-mid/40 bg-gray-50'
          }`}>
            {product.type === 'buy' ? 'Buy Now' : product.type === 'add' ? 'Add To Bag' : 'Sold Out'}
          </div>
        </div>
      </div>

      <div className="px-3 sm:px-6 py-3 sm:py-5 bg-brand-light/20 flex items-center justify-between border-t border-gray-50 group-hover:bg-brand-green-pale/10 transition-colors">
        <ToggleSwitch checked={product.is_active} onChange={onToggleStatus} />
        <div className="flex gap-1.5 sm:gap-2">
          <button onClick={onEdit} className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-white border border-gray-100 text-brand-mid hover:text-brand-green hover:border-brand-green transition-all flex items-center justify-center shadow-sm active:scale-90"><Edit2 size={14} /></button>
          <button onClick={onDelete} className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-white border border-gray-100 text-brand-mid hover:text-brand-sale hover:border-brand-sale transition-all flex items-center justify-center shadow-sm active:scale-90"><Trash2 size={14} /></button>
        </div>
      </div>
    </div>
  );
}
