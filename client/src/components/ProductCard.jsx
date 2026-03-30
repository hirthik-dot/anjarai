import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useLang } from '../context/LanguageContext';

const ProductCard = ({ product }) => {
    const navigate = useNavigate();
    const { addItem, addedItemName } = useCart();
    const { t } = useLang();
    const [showVariants, setShowVariants] = useState(false);

    if (!product) return null;

    const {
        id,
        slug,
        name,
        price,
        original_price: originalPrice,
        images,
        sale,
        rating,
        reviews,
        type,
        category,
        variants,
        stock_total: stockTotalRaw,
        is_veg,
        veg,
        isVeg,
        isVegatable,
        weight,
    } = product;

    const imagesArr = Array.isArray(images) ? images : [];
    const mainImage = imagesArr[0];

    const stockTotal = stockTotalRaw ?? 0;
    const outOfStock = type === 'sold' || stockTotal === 0;
    const lowStock = stockTotal > 0 && stockTotal <= 5;

    const numericPrice = Number(price ?? 0);
    const numericOriginal = originalPrice != null ? Number(originalPrice) : null;
    const discountPct =
        numericOriginal && numericOriginal > 0 && numericPrice > 0
            ? Math.max(0, Math.round((1 - numericPrice / numericOriginal) * 100))
            : null;

    const hasVariants = Array.isArray(variants) && variants.length > 0;
    const isAdded = addedItemName === id;

    const isVegDish = Boolean(is_veg || veg || isVeg || type === 'veg' || type === 'veg');
    const categoryLabel = category || (Array.isArray(product.collections) ? product.collections[0] : '') || '';

    const handleAddToCart = (selectedVariant) => {
        if (outOfStock) return;

        if (selectedVariant) {
            const vName = typeof selectedVariant === 'object' ? selectedVariant.name : selectedVariant;
            const vPrice =
                typeof selectedVariant === 'object' && selectedVariant.price != null
                    ? selectedVariant.price
                    : numericPrice;

            const addedName = vName ? `${name} - ${vName}` : `${name}`;
            addItem(
                { ...product, price: vPrice, name: addedName, selectedVariant },
                1,
                false,
            );
        } else {
            addItem(product, 1, false);
        }
    };

    const handleButtonClick = (e) => {
        e.stopPropagation();
        if (outOfStock) return;

        if (hasVariants) {
            setShowVariants(true);
            return;
        }

        if (!isAdded) handleAddToCart();
    };

    return (
        <div
            onClick={() => navigate(`/products/${slug}`)}
            className="bg-white border border-[color:var(--brand-border)] rounded-[var(--radius-lg)] overflow-hidden shadow-[var(--shadow-card)] hover:-translate-y-[4px] hover:shadow-[var(--shadow-green)] transition-all duration-200 flex flex-col cursor-pointer h-full"
        >
            <div className="relative aspect-square bg-[rgba(216,243,220,0.4)] overflow-hidden">
                {mainImage ? (
                    <img
                        src={mainImage}
                        alt={name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                        loading="lazy"
                    />
                ) : null}

                {/* Veg badge */}
                {isVegDish && (
                    <div className="absolute top-3 left-3 flex items-center gap-2 z-10">
                        <span
                            className="w-2.5 h-2.5 rounded-full"
                            style={{ background: 'var(--brand-primary)' }}
                        />
                        <span
                            className="px-2 py-0.5 rounded-full text-[10px] font-black text-white uppercase tracking-widest"
                            style={{ background: 'var(--brand-primary)' }}
                        >
                            VEG
                        </span>
                    </div>
                )}

                {/* Wishlist (visual only) */}
                <div className="absolute top-3 right-3 z-10">
                    <button
                        type="button"
                        onClick={(e) => e.stopPropagation()}
                        className="w-10 h-10 rounded-full bg-white/80 backdrop-blur flex items-center justify-center"
                        aria-label="Wishlist"
                    >
                        <span style={{ color: 'var(--brand-primary)' }}>♥</span>
                    </button>
                </div>

                {/* Category pill */}
                {categoryLabel ? (
                    <div className="absolute bottom-3 left-3 z-10">
                        <span
                            className="px-2.5 py-1 rounded-full text-[11px] font-black uppercase tracking-widest"
                            style={{
                                border: '2px solid var(--brand-primary)',
                                color: 'var(--brand-primary)',
                                background: 'rgba(255,255,255,0.85)',
                            }}
                        >
                            {categoryLabel}
                        </span>
                    </div>
                ) : null}

                {/* Sale badge */}
                {sale && numericOriginal && discountPct != null && discountPct > 0 && (
                    <div className="absolute top-3 left-3 z-10 mt-10">
                        <span
                            className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest text-white"
                            style={{ background: 'var(--brand-gold-dark)' }}
                        >
                            {discountPct}% OFF
                        </span>
                    </div>
                )}

                {/* Out of stock overlay */}
                {outOfStock && (
                    <div className="absolute inset-0 bg-black/30 backdrop-blur-[2px] flex flex-col items-center justify-center gap-4 px-6">
                        <div className="w-[72px] h-[72px] rounded-full bg-[rgba(0,0,0,0.10)] flex items-center justify-center">
                            <i className="fa-solid fa-box text-[34px]" style={{ color: 'rgba(255,255,255,0.9)' }} />
                        </div>
                        <button
                            type="button"
                            onClick={(e) => {
                                e.stopPropagation();
                            }}
                            className="h-[44px] rounded-full px-6 font-black text-sm uppercase tracking-widest"
                            style={{
                                background: 'rgba(255,255,255,0.18)',
                                color: 'rgba(255,255,255,0.95)',
                                border: '1px solid rgba(255,255,255,0.35)',
                            }}
                        >
                            Notify Me
                        </button>
                    </div>
                )}

                {/* Low stock badge */}
                {!outOfStock && lowStock && (
                    <div className="absolute top-3 right-3 z-10">
                        <span
                            className="px-2 py-1 rounded-full text-[10px] font-black uppercase tracking-widest text-white"
                            style={{ background: 'var(--brand-gold-dark)' }}
                        >
                            {t('Only {{n}} left').replace('{{n}}', String(stockTotal))}
                        </span>
                    </div>
                )}
            </div>

            <div className="p-3 flex flex-col flex-1">
                {/* Title */}
                <h3 className="font-head text-[15px] leading-tight line-clamp-2 text-dark font-bold mb-1.5">
                    {name}
                </h3>

                {/* Weight / variant line */}
                <div className="text-[13px] text-mid opacity-70 line-clamp-1 mb-2">
                    {weight ? weight : hasVariants ? t('Select weight') : t('') || ''}
                </div>

                {/* Rating row */}
                <div className="flex items-center justify-between gap-3 mb-2">
                    <div className="flex items-center gap-1 text-[12px]">
                        <span style={{ color: 'var(--brand-gold)' }} className="font-black">
                            ★
                        </span>
                        <span className="text-[12px] font-black" style={{ color: 'var(--brand-gold)' }}>
                            {Number(rating ?? 0).toFixed(1)}
                        </span>
                        <span className="text-mid text-[11px] font-semibold opacity-70">({reviews ?? 0})</span>
                    </div>
                </div>

                {/* Price row */}
                <div className="flex items-baseline gap-2 mb-3">
                    <span
                        className="text-[20px] font-head font-black"
                        style={{ color: 'var(--brand-primary)' }}
                    >
                        ₹{numericPrice}
                    </span>
                    {numericOriginal ? (
                        <span className="text-[12px] text-mid line-through opacity-60 font-semibold">
                            ₹{numericOriginal}
                        </span>
                    ) : null}
                    {discountPct != null && discountPct > 0 ? (
                        <span
                            className="px-2 py-0.5 rounded-full text-[12px] font-black"
                            style={{ background: 'rgba(230,57,70,0.12)', color: '#E63946' }}
                        >
                            {discountPct}% OFF
                        </span>
                    ) : null}
                </div>

                {/* Variants Overlay */}
                <div className="relative">
                    {showVariants && hasVariants && (
                        <div className="absolute left-0 right-0 bottom-[110%] bg-white shadow-[0_10px_40px_rgba(0,0,0,0.15)] rounded-xl border border-gray-100 p-2 z-20 max-h-[190px] overflow-y-auto">
                            <div className="flex items-center justify-between px-2 pb-2 border-b border-gray-50 mb-2">
                                <span className="text-[11px] font-black text-mid/70 uppercase tracking-widest">
                                    {t('Select Weight:')}
                                </span>
                                <button
                                    type="button"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setShowVariants(false);
                                    }}
                                    className="text-dark font-black"
                                >
                                    ✕
                                </button>
                            </div>
                            <div className="flex flex-col gap-1 relative z-20">
                                {variants.map((v, idx) => {
                                    const vName = typeof v === 'object' ? v.name : v;
                                    const vPrice =
                                        typeof v === 'object' && v.price != null ? v.price : numericPrice;
                                    return (
                                        <button
                                            key={idx}
                                            type="button"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleAddToCart(v);
                                                setShowVariants(false);
                                            }}
                                            className="flex justify-between items-center w-full px-3 py-2 hover:bg-[rgba(76,175,80,0.12)] rounded-lg transition-colors text-left"
                                        >
                                            <span className="text-[12px] font-bold text-dark">{vName}</span>
                                            <span className="text-[12px] font-black" style={{ color: 'var(--brand-primary)' }}>
                                                ₹{vPrice}
                                            </span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* Add to Cart button */}
                    <button
                        type="button"
                        onClick={handleButtonClick}
                        disabled={outOfStock}
                        className="w-full h-[44px] rounded-[14px] font-black text-[14px] uppercase tracking-widest transition-transform active:scale-[0.96]"
                        style={{
                            background: 'var(--brand-gold)',
                            color: 'var(--brand-primary-dark)',
                        }}
                    >
                        {outOfStock
                            ? 'Notify Me'
                            : isAdded
                              ? t('Added!')
                              : hasVariants
                                ? t('Select Options')
                                : t('Add to Cart')}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;
