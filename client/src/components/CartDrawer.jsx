import React, { useRef, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';

const CartDrawer = () => {
    const { items, total, count, isOpen, setIsOpen, removeItem, updateQty } = useCart();
    const navigate = useNavigate();
    const drawerRef = useRef();

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => (document.body.style.overflow = 'unset');
    }, [isOpen]);

    // Click outside to close
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (drawerRef.current && !drawerRef.current.contains(e.target)) {
                setIsOpen(false);
            }
        };
        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isOpen, setIsOpen]);

    return (
        <>
            <div
                className={`fixed inset-0 bg-black/40 z-[200] transition-opacity duration-350 ease-out 
          ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
            />

            <div
                ref={drawerRef}
                className={`fixed right-0 top-0 bottom-0 w-[100vw] sm:w-[400px] bg-white z-[201] shadow-2xl transition-transform duration-350 ease-[cubic-bezier(0.4,0,0.2,1)] flex flex-col
          ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
            >
                {/* Header */}
                <div className="flex justify-between items-center px-6 py-6 border-b border-gray-100">
                    <h3 className="font-head text-2xl font-bold tracking-tight text-dark flex items-center gap-3">
                        Your Cart <span className="text-xl">🛒</span>
                    </h3>
                    <button
                        onClick={() => setIsOpen(false)}
                        className="w-10 h-10 rounded-full flex items-center justify-center text-gray-400 hover:bg-gray-100 hover:text-dark transition-all"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto scrollbar-hide px-6 py-4">
                    {items.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-center gap-6 animate-in fade-in zoom-in duration-500">
                            <div className="w-24 h-24 rounded-full bg-green-pale/30 flex items-center justify-center text-5xl">
                                🛒
                            </div>
                            <div>
                                <p className="text-lg font-bold text-dark mb-1">Your cart is empty</p>
                                <p className="text-sm text-mid max-w-[200px] mx-auto opacity-70">
                                    Looks like you haven't added anything yet!
                                </p>
                            </div>
                            <button
                                onClick={() => {
                                    setIsOpen(false);
                                    navigate('/collections/all');
                                }}
                                className="bg-green text-white rounded-full px-8 py-3.5 font-black text-xs uppercase tracking-widest shadow-xl shadow-green/10 hover:bg-green-light transition-all active:scale-95"
                            >
                                Continue Shopping →
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {items.map((item) => (
                                <div key={item.id} className="flex gap-4 animate-in fade-in slide-in-from-right-4 duration-300">
                                    <div
                                        onClick={() => {
                                            setIsOpen(false);
                                            navigate(`/products/${item.slug}`);
                                        }}
                                        className="w-20 md:w-24 h-20 md:h-24 rounded-2xl bg-gray-50 overflow-hidden cursor-pointer shrink-0"
                                    >
                                        <img
                                            src={item.images[0]}
                                            alt={item.name}
                                            className="w-full h-full object-cover p-1"
                                        />
                                    </div>
                                    <div className="flex-1 min-w-0 py-1">
                                        <h4
                                            onClick={() => {
                                                setIsOpen(false);
                                                navigate(`/products/${item.slug}`);
                                            }}
                                            className="font-bold text-[13px] md:text-[14px] text-dark leading-tight line-clamp-2 cursor-pointer hover:text-green transition-colors"
                                        >
                                            {item.name}
                                        </h4>
                                        <p className="text-green font-black text-sm mt-1.5">
                                            ₹{item.price * item.qty}
                                        </p>

                                        <div className="flex items-center justify-between mt-3">
                                            <div className="flex items-center border-2 border-green-pale/50 rounded-full h-8 overflow-hidden">
                                                <button
                                                    onClick={() => updateQty(item.id, item.qty - 1)}
                                                    className="px-3 h-full hover:bg-green-pale/30 transition-colors text-green font-black"
                                                >
                                                    −
                                                </button>
                                                <span className="w-8 flex items-center justify-center text-[12px] font-black text-dark">
                                                    {item.qty}
                                                </span>
                                                <button
                                                    onClick={() => updateQty(item.id, item.qty + 1)}
                                                    className="px-3 h-full hover:bg-green-pale/30 transition-colors text-green font-black"
                                                >
                                                    +
                                                </button>
                                            </div>

                                            <button
                                                onClick={() => removeItem(item.id)}
                                                className="text-[10px] font-black uppercase text-sale tracking-widest hover:underline"
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Footer */}
                {items.length > 0 && (
                    <div className="px-6 py-6 border-t border-gray-100 bg-gray-50/50">
                        <div className="flex justify-between items-end mb-4">
                            <div>
                                <span className="text-mid text-[11px] font-black uppercase tracking-widest block mb-0.5">Subtotal</span>
                                <span className="text-gray-400 text-[10px]">Taxes and shipping calculated at checkout</span>
                            </div>
                            <span className="text-2xl font-black text-green">₹{total}</span>
                        </div>

                        <button 
                            onClick={() => {
                                setIsOpen(false);
                                navigate('/checkout');
                            }}
                            className="w-full bg-green text-white rounded-2xl py-4.5 font-black text-sm uppercase tracking-widest shadow-2xl shadow-green/20 hover:bg-green-light active:scale-[0.98] transition-all duration-300">
                            Proceed to Checkout →
                        </button>
                    </div>
                )}
            </div>
        </>
    );
};

export default CartDrawer;
