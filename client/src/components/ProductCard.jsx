import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const ProductCard = ({ product }) => {
    const navigate = useNavigate();
    const { addItem, addedItemName } = useCart();
    const { id, slug, name, price, originalPrice, images, sale, rating, reviews, type } = product;

    const isAdded = addedItemName === id;

    const handleAction = (e) => {
        e.stopPropagation();
        if (type !== 'sold') {
            addItem(product);
        }
    };

    return (
        <div
            onClick={() => navigate(`/products/${slug}`)}
            className="bg-white rounded-[16px] sm:rounded-[22px] overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,.08)] hover:-translate-y-1 hover:shadow-[0_10px_30px_rgba(0,0,0,.13)] transition-all duration-250 flex flex-col cursor-pointer border border-gray-50 h-full"
        >
            {/* Image Area */}
            <div className="h-[160px] sm:h-[180px] lg:h-[210px] bg-green-pale/30 overflow-hidden relative shrink-0">
                <img
                    src={images[0]}
                    alt={name}
                    className="w-full h-full object-cover hover:scale-[1.04] transition-transform duration-500"
                    loading="lazy"
                />

                {sale && (
                    <div className="absolute top-2 left-2 sm:top-4 sm:left-4 bg-sale text-white text-[9px] sm:text-[10px] font-black px-2 sm:px-3 py-0.5 sm:py-1 rounded-full uppercase tracking-widest shadow-lg shadow-sale/30">
                        SALE
                    </div>
                )}

                {/* Quick Add Button (Desktop only hover) */}
                <div className="absolute inset-0 bg-black/5 opacity-0 lg:group-hover:opacity-100 transition-opacity hidden lg:flex items-center justify-center">
                    <button
                        onClick={handleAction}
                        className={`transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 bg-white/90 backdrop-blur-md text-green font-black text-xs uppercase tracking-widest px-6 py-3 rounded-full shadow-xl hover:bg-green hover:text-white ${type === 'sold' && 'hidden'}`}
                    >
                        Quick Add
                    </button>
                </div>
            </div>

            {/* Body */}
            <div className="p-3 sm:p-5 flex flex-col flex-1">
                <div className="flex-1">
                    <h3 className="font-bold text-[12px] sm:text-[13.5px] text-dark leading-[1.4] line-clamp-2 mb-1.5 sm:mb-2 group-hover:text-green transition-colors">
                        {name}
                    </h3>

                    <div className="flex items-center gap-1 mb-2">
                        <div className="flex text-warm text-[10px] sm:text-xs">
                            {[...Array(5)].map((_, i) => (
                                <span key={i} className={i < rating ? 'opacity-100' : 'opacity-20'}>★</span>
                            ))}
                        </div>
                        <span className="text-mid text-[10px] sm:text-[11px] font-semibold">({reviews})</span>
                    </div>
                </div>

                <div className="mt-auto">
                    <div className="flex flex-col sm:flex-row sm:items-end gap-0.5 sm:gap-2 mb-2.5 sm:mb-3">
                        <span className="text-green text-[14px] sm:text-base font-black">
                            From ₹{price}
                        </span>
                        {originalPrice && (
                            <span className="text-gray-300 text-[10px] sm:text-xs line-through font-medium mb-0.5">
                                ₹{originalPrice}
                            </span>
                        )}
                    </div>

                    {/* Action Button */}
                    <button
                        onClick={handleAction}
                        disabled={type === 'sold'}
                        className={`w-full rounded-lg sm:rounded-xl py-2 sm:py-2.5 text-[11px] sm:text-xs font-black uppercase tracking-widest transition-all duration-300 relative overflow-hidden group/btn
              ${type === 'buy' ? 'bg-green text-white hover:bg-green-light shadow-lg shadow-green/10' :
                                type === 'add' ? 'bg-transparent text-green border-2 border-green hover:bg-green hover:text-white' :
                                    'bg-gray-100 text-gray-400 cursor-not-allowed'}`}
                    >
                        {isAdded ? (
                            <span className="animate-in fade-in zoom-in duration-300 flex items-center justify-center gap-1.5">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 sm:h-4 sm:w-4" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                                Added!
                            </span>
                        ) : (
                            <span>{type === 'sold' ? 'Sold Out' : 'Select Options'}</span>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;
