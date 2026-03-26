// client/src/pages/OrderSuccessPage.jsx
import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const OrderSuccessPage = () => {
    const navigate = useNavigate();
    const { items, removeItem } = useCart();

    const cleared = useRef(false);
    useEffect(() => {
        if (cleared.current) return;
        cleared.current = true;
        const ids = items.map(i => i.id);
        ids.forEach(id => removeItem(id));
    }, []); // eslint-disable-line

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 sm:py-20 px-4 text-center">
            <div className="max-w-[400px] w-full bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-10 shadow-sm border border-gray-100 animate-in fade-in zoom-in duration-500">
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-green-pale/30 flex items-center justify-center text-4xl sm:text-5xl mx-auto mb-6 sm:mb-8 shadow-xl shadow-green/5">
                    🎉
                </div>
                
                <h1 className="font-head text-3xl sm:text-4xl font-bold text-dark mb-3 sm:mb-4 tracking-tight">
                    Order Placed!
                </h1>
                
                <p className="text-mid text-xs sm:text-sm font-bold leading-relaxed mb-8 sm:mb-10 opacity-70">
                    Thank you for your order! Your payment was successful and we're preparing your Anjaraipetti treats.
                </p>

                <div className="space-y-3 sm:space-y-4">
                    <button
                        onClick={() => navigate('/')}
                        className="w-full bg-green text-white rounded-xl sm:rounded-2xl py-4 sm:py-[18px] font-black text-[11px] sm:text-xs uppercase tracking-widest shadow-xl sm:shadow-2xl shadow-green/20 hover:bg-green-light active:scale-[0.98] transition-all"
                    >
                        Back to Home →
                    </button>
                    
                    <button
                        onClick={() => navigate('/collections/all')}
                        className="w-full bg-white text-green border-2 border-green rounded-xl sm:rounded-2xl py-4 sm:py-[18px] font-black text-[11px] sm:text-xs uppercase tracking-widest hover:bg-green-pale/20 active:scale-[0.98] transition-all"
                    >
                        Shop More
                    </button>
                </div>

                <div className="mt-8 sm:mt-10 pt-6 sm:pt-8 border-t border-gray-50 flex items-center justify-center gap-2 sm:gap-3">
                    <div className="flex -space-x-3">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-green border-2 border-white flex items-center justify-center text-[8px] sm:text-[10px] text-white font-black">
                                ✓
                            </div>
                        ))}
                    </div>
                    <p className="text-[9px] sm:text-[10px] text-mid font-black uppercase tracking-widest">
                        Verified Secure Order
                    </p>
                </div>
            </div>
        </div>
    );
};

export default OrderSuccessPage;
