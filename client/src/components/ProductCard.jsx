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
        variants,
        stock_total: stockTotalRaw,
        weight,
    } = product;

    const imagesArr = Array.isArray(images) ? images : [];
    const mainImage = imagesArr[0];

    const stockTotal = stockTotalRaw ?? 0;
    const outOfStock = type === 'sold' || stockTotal === 0;

    const numericPrice = Number(price ?? 0);
    const numericOriginal = originalPrice != null ? Number(originalPrice) : null;
    const discountPct =
        numericOriginal && numericOriginal > 0 && numericPrice > 0
            ? Math.max(0, Math.round((1 - numericPrice / numericOriginal) * 100))
            : null;

    const hasVariants = Array.isArray(variants) && variants.length > 0;
    const isAdded = addedItemName === id;

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

    // Calculate tomorrow date for generic delivery text
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const deliveryDate = tomorrow.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' });

    // Format numbers like ₹50,499
    const formattedPrice = numericPrice?.toLocaleString('en-IN');
    const formattedOriginal = numericOriginal?.toLocaleString('en-IN');

    return (
        <div
            onClick={() => navigate(`/products/${slug}`)}
            className="flex flex-row bg-white border border-gray-200 hover:shadow-[0_4px_12px_rgba(0,0,0,0.1)] transition-shadow cursor-pointer w-full rounded-xl overflow-visible relative group h-full"
        >
            {/* Left Image Area */}
            <div className="w-[120px] sm:w-[160px] md:w-[200px] flex-shrink-0 bg-gray-50/50 p-2 sm:p-4 flex flex-col items-center justify-center relative rounded-l-xl overflow-hidden border-r border-gray-100">
                {mainImage ? (
                    <img
                        src={mainImage}
                        alt={name}
                        className="w-full h-full object-contain mix-blend-multiply group-hover:scale-[1.03] transition-transform duration-300"
                        loading="lazy"
                    />
                ) : null}
            </div>

            {/* Right Info Area */}
            <div className="flex-1 p-3 sm:p-4 md:p-5 flex flex-col overflow-hidden justify-between">
                <div>
                    {/* Title */}
                    <h3 className="text-[14px] sm:text-[16px] md:text-[18px] text-[#0f1111] leading-tight line-clamp-3 hover:text-[#c45500] transition-colors" style={{fontFamily: 'sans-serif'}}>
                        {name}
                    </h3>

                    {/* Weight/Variant Info */}
                    <div className="mt-1 flex gap-2 text-xs sm:text-sm text-gray-500 font-sans">
                        {weight ? <span>{weight}</span> : hasVariants ? <span className="text-[#007185] italic font-medium">{t('Multiple options available')}</span> : null}
                    </div>

                    {/* Rating */}
                    <div className="flex items-center gap-1.5 mt-1 sm:mt-1.5 flex-wrap">
                        <span className="text-[#de7921] text-sm sm:text-base leading-none">
                            {'★'.repeat(Math.round(rating || 4))}{'☆'.repeat(5 - Math.round(rating || 4))}
                        </span>
                        <span className="text-[#007185] text-xs sm:text-sm hover:underline leading-none pt-0.5">
                            {reviews || 0}
                        </span>
                        <span className="text-[10px] sm:text-xs text-gray-500 hidden sm:inline ml-1">• 1K+ bought in past month</span>
                    </div>

                    {/* Price */}
                    <div className="mt-2 flex items-baseline flex-wrap gap-1.5 sm:gap-2">
                        <span className="text-[20px] sm:text-[26px] font-medium text-[#0f1111] flex items-start leading-[1]">
                            <span className="text-[12px] sm:text-[14px] mt-1 mr-0.5">₹</span>
                            {formattedPrice}
                        </span>
                        {numericOriginal && numericOriginal > numericPrice ? (
                            <span className="text-[#565959] text-[11px] sm:text-[13px] leading-none flex gap-[3px] items-center pt-1 mt-auto">
                                <span className="opacity-80">M.R.P:</span>
                                <span className="line-through">₹{formattedOriginal}</span>
                                {discountPct && <span className="hidden sm:inline">({discountPct}% off)</span>}
                            </span>
                        ) : null}
                    </div>
                    {discountPct > 0 && <div className="sm:hidden text-green-700 text-[11px] font-bold mt-0.5">{discountPct}% off - Deal</div>}

                    {/* Delivery details (Amazon style) */}
                    <div className="mt-1 sm:mt-2">
                        <p className="text-[11px] sm:text-[13px] text-[#0f1111]">
                            <span className="text-[#007185] font-medium">FREE delivery</span> <span className="font-bold">{deliveryDate}</span>
                        </p>
                        <p className="text-[10px] sm:text-[12px] text-[#565959] mt-0.5">Or fastest delivery <b className="text-gray-900">Tomorrow</b></p>
                    </div>
                </div>

                {/* Add to Cart Area */}
                <div className="mt-4 relative w-full sm:w-auto sm:self-start">
                    {/* Variants Popover */}
                    {showVariants && hasVariants && (
                        <div className="absolute bottom-[calc(100%+5px)] left-0 w-[200px] sm:w-[240px] bg-white shadow-[0_4px_24px_rgba(0,0,0,0.15)] rounded-2xl border border-gray-100 p-2 z-20 max-h-[190px] overflow-y-auto font-sans animate-in fade-in zoom-in-95 duration-200">
                            <div className="flex items-center justify-between px-2 pb-2 border-b border-gray-100 mb-2">
                                <span className="text-[11px] font-bold text-gray-500 uppercase tracking-widest">
                                    {t('Select Variant')}
                                </span>
                                <button
                                    type="button"
                                    onClick={(e) => { e.stopPropagation(); setShowVariants(false); }}
                                    className="text-gray-400 font-bold hover:text-black hover:bg-gray-100 rounded-full w-6 h-6 flex items-center justify-center transition-colors"
                                >✕</button>
                            </div>
                            <div className="flex flex-col gap-1">
                                {variants.map((v, idx) => {
                                    const vName = typeof v === 'object' ? v.name : v;
                                    const vPrice = typeof v === 'object' && v.price != null ? v.price : numericPrice;
                                    return (
                                        <button
                                            key={idx}
                                            type="button"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleAddToCart(v);
                                                setShowVariants(false);
                                            }}
                                            className="flex flex-col sm:flex-row justify-between sm:items-center w-full px-3 py-2 hover:bg-gray-50 rounded-lg transition-colors text-left gap-1"
                                        >
                                            <span className="text-[13px] font-medium text-[#0f1111]">{vName}</span>
                                            <span className="text-[13px] font-bold text-[#B12704]">₹{vPrice?.toLocaleString('en-IN')}</span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {!outOfStock ? (
                        <button
                            type="button"
                            onClick={handleButtonClick}
                            className={`px-5 sm:px-6 py-2 rounded-full font-sans text-xs sm:text-[14px] text-[#0f1111] shadow-sm transition-all focus:ring-2 focus:ring-[#e77600] active:ring-transparent ${isAdded ? 'bg-green-100 hover:bg-green-200 border border-green-300' : 'bg-[#ffd814] hover:bg-[#F7CA00] border border-[#FCD200]'}`}
                        >
                            {isAdded ? "Added to cart" : hasVariants ? "See Options" : "Add to cart"}
                        </button>
                    ) : (
                        <div className="text-[#cc0c39] font-bold text-sm">
                            Currently unavailable.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProductCard;
