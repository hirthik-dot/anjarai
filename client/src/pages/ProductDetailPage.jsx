import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { useCart } from '../context/CartContext';
import { useLang } from '../context/LanguageContext';
import ProductGrid from '../components/ProductGrid';

function stockForVariant(product, selectedVariant) {
    const map = product.stock_by_variant || {};
    const key =
        typeof selectedVariant === 'object' && selectedVariant?.name
            ? selectedVariant.name
            : typeof selectedVariant === 'string'
              ? selectedVariant
              : 'default';
    if (map[key] !== undefined) return map[key];
    if (map.default !== undefined) return map.default;
    return product.stock_total ?? 0;
}

const ProductDetailPage = () => {
    const { getBySlug, products } = useData();
    const { slug } = useParams();
    const navigate = useNavigate();
    const { addItem, addedItemName } = useCart();
    const { t } = useLang();
    const [product, setProduct] = useState(null);
    const [mainImg, setMainImg] = useState('');
    const [qty, setQty] = useState(1);
    const [selectedVariant, setSelectedVariant] = useState('');

    useEffect(() => {
        const p = getBySlug(slug);
        if (!p) {
            navigate('/404');
            return;
        }
        setProduct(p);
        setMainImg(p.images[0]);
        if (p.variants && p.variants.length > 0) {
            setSelectedVariant(p.variants[0]);
        }
        window.scrollTo(0, 0);
    }, [slug, navigate, getBySlug]);

    const lineStock = useMemo(
        () => (product ? stockForVariant(product, selectedVariant) : 0),
        [product, selectedVariant]
    );
    const outOfStock = lineStock === 0;
    const lowStock = lineStock > 0 && lineStock <= 5;

    useEffect(() => {
        if (lineStock > 0 && qty > lineStock) setQty(lineStock);
    }, [lineStock, qty]);

    if (!product) return null;

    const isAdded = addedItemName === product.id;

    const handleAddToCart = () => {
        if (product.type !== 'sold' && !outOfStock) {
            const addedPrice = typeof selectedVariant === 'object' && selectedVariant.price ? selectedVariant.price : product.price;
            const addedName = typeof selectedVariant === 'object' && selectedVariant.name ? `${product.name} - ${selectedVariant.name}` : product.name;
            addItem({ ...product, price: addedPrice, name: addedName, selectedVariant }, qty, false);
        }
    };

    const handleBuyNow = () => {
        if (product.type === 'sold' || outOfStock) return;
        const addedPrice = typeof selectedVariant === 'object' && selectedVariant.price ? selectedVariant.price : product.price;
        const addedName = typeof selectedVariant === 'object' && selectedVariant.name ? `${product.name} - ${selectedVariant.name}` : product.name;
        // Don't open the cart drawer; go straight to checkout.
        addItem({ ...product, price: addedPrice, name: addedName, selectedVariant }, qty, false);
        navigate('/checkout');
    };

    return (
        <div className="animate-in fade-in duration-700 bg-white">
            <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-14 py-6 sm:py-12 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-24">

                {/* Left Column - Gallery */}
                <div className="space-y-4 sm:space-y-8">
                    <div className="relative rounded-2xl sm:rounded-[32px] overflow-hidden shadow-2xl shadow-green/5 ring-1 ring-gray-100 group">
                        <img
                            src={mainImg}
                            alt={product.name}
                            className="w-full aspect-square md:aspect-auto object-cover group-hover:scale-105 transition-transform duration-700"
                        />
                        {product.sale && (
                            <div className="absolute top-4 left-4 sm:top-8 sm:left-8 bg-sale text-white text-[9px] sm:text-[11px] font-black px-3 sm:px-4 py-1 sm:py-1.5 rounded-full uppercase tracking-[0.2em] shadow-xl shadow-sale/30">
                                SALE
                            </div>
                        )}
                    </div>

                    <div className="flex gap-3 sm:gap-6 overflow-x-auto scrollbar-hide py-2 px-1">
                        {product.images.map((img, idx) => (
                            <button
                                key={idx}
                                onClick={() => setMainImg(img)}
                                className={`w-16 h-16 sm:w-20 sm:h-20 md:w-28 md:h-28 rounded-xl sm:rounded-2xl overflow-hidden border-4 transition-all duration-300 shrink-0 ${mainImg === img ? 'border-green scale-105 shadow-lg' : 'border-transparent opacity-60 hover:opacity-100'}`}
                            >
                                <img src={img} alt="" className="w-full h-full object-cover" />
                            </button>
                        ))}
                    </div>
                </div>

                {/* Right Column - Info */}
                <div className="flex flex-col">
                    <nav className="flex items-center gap-2 sm:gap-3 text-[10px] sm:text-[12px] font-black uppercase tracking-[0.3em] mb-4 sm:mb-8 text-black/30">
                        <span onClick={() => navigate('/')} className="hover:text-green cursor-pointer">Home</span>
                        <span>/</span>
                        <span onClick={() => navigate('/collections/all')} className="hover:text-green cursor-pointer hidden sm:inline">Products</span>
                        <span className="hidden sm:inline">/</span>
                        <span className="text-green truncate max-w-[150px] sm:max-w-[none]">{product.name}</span>
                    </nav>

                    <span className="text-green text-[11px] sm:text-[14px] font-black uppercase tracking-[0.4em] mb-2 sm:mb-4">ANJARAIPETTI</span>
                    <h1 className="font-head text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-black text-dark leading-tight mb-4 sm:mb-8 tracking-tight">
                        {product.name}
                    </h1>

                    <div className="flex items-center gap-2 mb-6 sm:mb-12">
                        <div className="flex text-warm text-xs sm:text-sm">
                            {[...Array(5)].map((_, i) => (
                                <span key={i} className={i < product.rating ? 'opacity-100' : 'opacity-20'}>★</span>
                            ))}
                        </div>
                        <span className="text-mid text-[11px] sm:text-[14px] font-bold opacity-60">({product.reviews} customer reviews)</span>
                    </div>

                    {(outOfStock || lowStock) && (
                        <p className={`text-[11px] sm:text-sm font-black uppercase tracking-[0.2em] mb-4 ${outOfStock ? 'text-dark/50' : 'text-warm'}`}>
                            {outOfStock ? t('Out of stock') : t('Only {{n}} left').replace('{{n}}', String(lineStock))}
                        </p>
                    )}

                    <div className="flex flex-wrap items-center gap-3 sm:gap-8 mb-8 sm:mb-14">
                        <span className="text-3xl sm:text-4xl md:text-5xl font-black text-green tracking-tighter">
                            ₹{typeof selectedVariant === 'object' && selectedVariant.price ? selectedVariant.price : product.price}
                        </span>
                        {(typeof selectedVariant === 'object' && selectedVariant.original_price ? selectedVariant.original_price : product.original_price) ? (
                            <span className="text-lg sm:text-xl md:text-2xl text-gray-300 line-through font-bold">
                                ₹{typeof selectedVariant === 'object' && selectedVariant.original_price ? selectedVariant.original_price : product.original_price}
                            </span>
                        ) : null}
                        <span className="w-full sm:w-auto text-[10px] sm:text-[14px] font-black text-mid opacity-40 uppercase tracking-widest mt-1 sm:mt-2">Inclusive of all taxes</span>
                    </div>

                    {/* Variants */}
                    {product.variants && product.variants.length > 0 && (
                        <div className="mb-8 sm:mb-14">
                            <label className="block text-[11px] sm:text-[14px] font-black uppercase tracking-[0.2em] text-dark/40 mb-3 sm:mb-5">Select Weight:</label>
                            <div className="flex flex-wrap gap-2.5 sm:gap-4">
                                {product.variants.map((v, idx) => {
                                    const vName = typeof v === 'object' ? v.name : v;
                                    const isSelected = selectedVariant === v || (typeof selectedVariant === 'object' && selectedVariant.name === vName);
                                    return (
                                        <button
                                            key={idx}
                                            onClick={() => setSelectedVariant(v)}
                                            className={`px-5 sm:px-10 py-2 sm:py-4 rounded-lg sm:rounded-xl text-[10px] sm:text-sm font-black uppercase tracking-[0.1em] border-2 transition-all duration-300 ${isSelected ? 'border-green bg-green-pale/30 text-green shadow-lg sm:shadow-xl shadow-green/10' : 'border-gray-100 text-gray-400 hover:border-green/20 hover:text-dark'}`}
                                        >
                                            {vName}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* Qty & Add to Cart */}
                    <div className="flex flex-col sm:flex-row gap-3 sm:gap-5 mb-10 sm:mb-16">
                        <div className="flex items-center border-2 border-green-pale/50 rounded-xl sm:rounded-2xl h-[50px] sm:h-[70px] px-2 sm:px-4">
                            <button
                                onClick={() => setQty(Math.max(1, qty - 1))}
                                className="w-10 h-full flex items-center justify-center text-green text-xl sm:text-2xl font-black hover:bg-green-pale/20 transition-colors"
                            >
                                −
                            </button>
                            <input
                                type="number"
                                value={qty}
                                onChange={(e) => {
                                    const n = parseInt(e.target.value, 10) || 1;
                                    const max = lineStock > 0 ? lineStock : 999;
                                    setQty(Math.min(Math.max(1, n), max));
                                }}
                                className="w-12 sm:w-16 h-full text-center font-black text-base sm:text-lg outline-none bg-transparent"
                            />
                            <button
                                onClick={() => {
                                    const max = lineStock > 0 ? lineStock : 999;
                                    setQty(Math.min(qty + 1, max));
                                }}
                                className="w-10 h-full flex items-center justify-center text-green text-xl sm:text-2xl font-black hover:bg-green-pale/20 transition-colors"
                            >
                                +
                            </button>
                        </div>

                        <button
                            onClick={handleAddToCart}
                            disabled={product.type === 'sold' || outOfStock}
                            className={`flex-1 flex items-center justify-center gap-3 sm:gap-4 h-[50px] sm:h-[70px] rounded-xl sm:rounded-2xl font-black text-[11px] sm:text-sm uppercase tracking-[0.3em] transition-all duration-300 shadow-xl sm:shadow-2xl relative overflow-hidden group/btn ${product.type === 'sold' || outOfStock ? 'bg-gray-100 text-gray-300 cursor-not-allowed' : 'bg-green text-white hover:bg-warm hover:shadow-warm/30 hover:-translate-y-1'}`}
                        >
                            {isAdded ? (
                                <span className="flex items-center gap-2 sm:gap-3 animate-in zoom-in duration-300">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                    Item Added!
                                </span>
                            ) : (
                                <span>{product.type === 'sold' || outOfStock ? t('Sold Out') : 'Add To Cart —'} <span className="opacity-40">₹{(typeof selectedVariant === 'object' && selectedVariant.price ? selectedVariant.price : product.price) * qty}</span></span>
                            )}
                        </button>
                    </div>

                    {/* Description Sections */}
                    <div className="space-y-4 sm:space-y-8">
                        <Section title="Product Description" content={product.description} defaultOpen={true} />
                        <Section title="Key Benefits" content={
                            product.benefits && product.benefits.length > 0 ? (
                                <ul className="list-disc pl-5 space-y-2">
                                    {product.benefits.map((b, i) => <li key={i}>{b}</li>)}
                                </ul>
                            ) : null
                        } />
                        <Section title="Ingredients" content={product.ingredients} />
                        <Section title="How to Use" content={product.how_to_use} />
                    </div>
                </div>
            </div>

            {/* Sticky mobile action bar (above BottomNav) */}
            <div
                className="md:hidden fixed left-0 right-0 z-[1005] bg-white/95 backdrop-blur border-t border-gray-100 shadow-[0_-4px_12px_rgba(0,0,0,0.08)]"
                style={{ bottom: 'calc(64px + env(safe-area-inset-bottom, 0px))' }}
            >
                <div className="grid grid-cols-2 gap-3 px-3 py-2">
                    <button
                        type="button"
                        onClick={handleAddToCart}
                        disabled={product.type === 'sold' || outOfStock}
                        className="h-[48px] rounded-xl font-black text-[12px] tracking-[0.2em] uppercase border-2 border-[color:var(--brand-gold)] text-[color:var(--brand-primary-dark)] bg-white active:scale-[0.98] disabled:opacity-60"
                        style={{ color: 'var(--brand-primary-dark)' }}
                    >
                        Add to Cart
                    </button>
                    <button
                        type="button"
                        onClick={handleBuyNow}
                        disabled={product.type === 'sold' || outOfStock}
                        className="h-[48px] rounded-xl font-black text-[12px] tracking-[0.2em] uppercase bg-[color:var(--brand-gold)] text-[color:var(--brand-primary-dark)] active:scale-[0.98] disabled:opacity-60"
                    >
                        Buy Now
                    </button>
                </div>
            </div>

            {/* You Might Also Like */}
            {products && products.length > 0 && (
                <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-14 py-16 border-t border-gray-100 mt-10">
                    <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-dark mb-8 text-left">You might also like <span className="text-gray-400 font-normal text-sm ml-2">Sponsored ⓘ</span></h2>
                    <ProductGrid products={products.filter(p => p.id !== product.id && p.category === product.category).slice(0, 4)} />
                </div>
            )}

            {/* Reviews Section Placeholder */}
            <div className="bg-light py-16 sm:py-24 md:py-36">
                <div className="w-full max-w-[1000px] mx-auto px-4 sm:px-6 text-center">
                    <h2 className="font-head text-2xl sm:text-3xl md:text-5xl font-black text-dark mb-10 sm:mb-16 md:mb-24 underline decoration-green-pale/50 decoration-4 sm:decoration-8 underline-offset-8 sm:underline-offset-12">Customer Reviews</h2>
                    {product.reviews_data ? (
                        product.reviews_data.map((r, i) => (
                            <div key={i} className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-10 md:p-14 shadow-xl sm:shadow-2xl shadow-black/5 text-left mb-6 sm:mb-10 group">
                                <div className="flex items-center gap-4 sm:gap-6 mb-6 sm:mb-8">
                                    <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-green text-white flex items-center justify-center text-lg sm:text-xl font-black shadow-lg sm:shadow-xl shadow-green/20">
                                        {r.name[0]}
                                    </div>
                                    <div>
                                        <h4 className="text-base sm:text-lg md:text-xl font-black text-dark">{r.name}</h4>
                                        <div className="flex text-warm text-xs sm:text-sm mt-1">
                                            {[...Array(5)].map((_, i) => <span key={i}>★</span>)}
                                        </div>
                                    </div>
                                </div>
                                <h5 className="text-lg sm:text-xl font-black text-dark mb-3 sm:mb-4">{r.title}</h5>
                                <p className="text-mid text-sm sm:text-base md:text-lg leading-relaxed opacity-70 mb-6 sm:mb-8 font-medium">"{r.text}"</p>
                                {r.reply && (
                                    <div className="bg-green-pale/30 border-l-4 border-green p-5 sm:p-8 rounded-xl sm:rounded-2xl">
                                        <span className="block text-[10px] sm:text-[11px] font-black uppercase tracking-[0.2em] text-green/60 mb-2 sm:mb-3">Store Response</span>
                                        <p className="text-green text-xs sm:text-sm md:text-base font-black italic">"{r.reply}"</p>
                                    </div>
                                )}
                            </div>
                        ))
                    ) : (
                        <div className="bg-white rounded-2xl sm:rounded-3xl p-10 sm:p-16 md:p-24 shadow-xl sm:shadow-2xl shadow-black/5">
                            <p className="text-mid text-sm sm:text-lg font-black opacity-30 uppercase tracking-[0.4em]">No reviews yet</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

const Section = ({ title, content }) => {
    if (!content) return null;
    const isContentEmpty = typeof content === 'string' && content.trim() === '';
    const isArrayEmpty = Array.isArray(content) && content.length === 0;
    // Fast check for the benefits ul case
    const isReactEmpty = content?.props?.children?.length === 0;
    
    if (isContentEmpty || isArrayEmpty || isReactEmpty) return null;

    return (
        <div className="border-b border-gray-100 pb-4 sm:pb-6 group">
            <h4 className="font-head text-base sm:text-lg md:text-xl font-black text-dark tracking-tight mb-3 sm:mb-4">{title}</h4>
            <div className="text-mid text-[13px] sm:text-sm md:text-base leading-relaxed opacity-80 font-medium pb-2">
                {content}
            </div>
        </div>
    );
};

export default ProductDetailPage;
