import React, { useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import { useLang } from '../context/LanguageContext';

const CartDrawer = () => {
    const { items, total, count, isOpen, setIsOpen, removeItem, updateQty } = useCart();
    const navigate = useNavigate();
    const { t } = useLang();

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => (document.body.style.overflow = 'unset');
    }, [isOpen]);

    return (
        <>
            <div
                className={`fixed inset-0 bg-black/40 z-[200] transition-opacity duration-350 ease-out
          ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                onClick={() => setIsOpen(false)}
            />

            {/* Mobile: full-height bottom sheet */}
            <div
                className={`fixed left-0 right-0 bottom-0 z-[201] md:hidden h-full bg-white shadow-2xl transition-transform duration-350 ease-[cubic-bezier(0.4,0,0.2,1)] flex flex-col
          ${isOpen ? 'translate-y-0' : 'translate-y-full'}`}
                style={{ borderTopLeftRadius: 24, borderTopRightRadius: 24 }}
            >
                <div className="pt-3 pb-2 flex justify-center shrink-0">
                    <div className="w-[40px] h-[4px] bg-[rgba(0,0,0,0.18)] rounded-full" />
                </div>

                {/* Header */}
                <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100 shrink-0">
                    <h3 className="font-head text-[18px] font-bold text-dark tracking-tight flex items-center gap-3">
                        {t('Your Cart')} <span className="text-[16px] text-[color:var(--brand-primary)] font-black">({count} items)</span>
                    </h3>
                    <button
                        onClick={() => setIsOpen(false)}
                        className="w-10 h-10 rounded-full flex items-center justify-center text-gray-400 hover:bg-gray-100 hover:text-dark transition-all"
                        aria-label="Close cart"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto scrollbar-hide px-6 py-4 overscroll-contain">
                    {items.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-center gap-6 animate-in fade-in zoom-in duration-500">
                            <div className="w-24 h-24 rounded-full bg-[rgba(46,125,50,0.12)] flex items-center justify-center text-5xl">
                                <i className="fa-solid fa-cart-shopping text-4xl mb-3 text-gray-300" />
                            </div>
                            <div>
                                <p className="text-lg font-bold text-dark mb-1">{t('Your cart is empty')}</p>
                                <p className="text-sm text-mid max-w-[200px] mx-auto opacity-70">
                                    {t('Looks like you haven\'t added anything yet.')}
                                </p>
                            </div>
                            <button
                                onClick={() => {
                                    setIsOpen(false);
                                    navigate('/collections/all');
                                }}
                                className="bg-[color:var(--brand-primary)] text-white rounded-full px-8 py-3.5 font-black text-xs uppercase tracking-widest shadow-[var(--shadow-green)] hover:bg-[color:var(--brand-primary-light)] transition-all active:scale-95"
                            >
                                {t('Continue Shopping')} →
                            </button>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-4 safe-bottom pb-4">
                            {items.map((item, index) => (
                                <div
                                    key={item.cartItemId || `${item.id}-${index}`}
                                    className="flex gap-4 animate-in fade-in duration-300"
                                >
                                    <div
                                        onClick={() => {
                                            setIsOpen(false);
                                            navigate(`/products/${item.slug}`);
                                        }}
                                        className="w-20 h-20 rounded-2xl bg-gray-50 overflow-hidden cursor-pointer shrink-0"
                                    >
                                        <img
                                            src={item.images[0]}
                                            alt={item.name}
                                            className="w-full h-full object-cover p-1"
                                            loading="lazy"
                                        />
                                    </div>
                                    <div className="flex-1 min-w-0 py-1">
                                        <h4
                                            onClick={() => {
                                                setIsOpen(false);
                                                navigate(`/products/${item.slug}`);
                                            }}
                                            className="font-bold text-[13px] text-dark leading-tight line-clamp-2 cursor-pointer hover:text-[color:var(--brand-primary)] transition-colors"
                                        >
                                            {item.name}
                                        </h4>
                                        <p className="text-[color:var(--brand-primary)] font-black text-sm mt-1.5">
                                            ₹{item.price * item.qty}
                                        </p>

                                        <div className="flex items-center justify-between mt-3">
                                            <div className="flex items-center border border-[color:var(--brand-border)] rounded-full h-10 overflow-hidden">
                                                <button
                                                    onClick={() => updateQty(item.cartItemId || item.id, item.qty - 1)}
                                                    className="w-10 h-10 flex items-center justify-center hover:bg-[rgba(76,175,80,0.12)] transition-colors text-[color:var(--brand-primary)] font-black text-lg"
                                                >
                                                    −
                                                </button>
                                                <span className="w-10 flex items-center justify-center text-[12px] font-black text-dark">
                                                    {item.qty}
                                                </span>
                                                <button
                                                    onClick={() => updateQty(item.cartItemId || item.id, item.qty + 1)}
                                                    className="w-10 h-10 flex items-center justify-center hover:bg-[rgba(76,175,80,0.12)] transition-colors text-[color:var(--brand-primary)] font-black text-lg"
                                                >
                                                    +
                                                </button>
                                            </div>

                                            <button
                                                onClick={() => removeItem(item.cartItemId || item.id)}
                                                className="text-[10px] font-black uppercase text-sale tracking-widest hover:underline"
                                            >
                                                {t('Remove')}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Sticky footer */}
                {items.length > 0 && (
                    <div className="px-6 py-4 border-t border-gray-100 bg-white/95 backdrop-blur safe-bottom shrink-0">
                        <div className="flex justify-between items-end mb-3">
                            <div>
                                <span className="text-[11px] font-black uppercase tracking-widest block mb-0.5">
                                    {t('Subtotal')}
                                </span>
                                <span className="text-gray-400 text-[10px]">Taxes and shipping calculated at checkout</span>
                            </div>
                            <span className="text-2xl font-black" style={{ color: 'var(--brand-primary)' }}>
                                ₹{total}
                            </span>
                        </div>

                        <button
                            onClick={() => {
                                setIsOpen(false);
                                navigate('/checkout');
                            }}
                            className="w-full rounded-2xl font-black text-[18px] transition-all duration-200 active:scale-[0.98]"
                            style={{
                                background: 'var(--brand-gold)',
                                color: 'var(--brand-primary-dark)',
                                height: 60,
                            }}
                        >
                            Proceed to Pay
                        </button>
                    </div>
                )}
            </div>

            {/* Desktop: side drawer */}
            <div
                className={`fixed right-0 top-0 bottom-0 w-[400px] z-[201] hidden md:flex bg-white shadow-2xl transition-transform duration-350 ease-[cubic-bezier(0.4,0,0.2,1)] flex-col
          ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
            >
                {/* Header */}
                <div className="flex justify-between items-center px-6 py-6 border-b border-gray-100 shrink-0">
                    <h3 className="font-head text-2xl font-bold tracking-tight text-dark flex items-center gap-3">
                        {t('Your Cart')} <span className="text-xl" style={{ color: 'var(--brand-primary)' }}>({count})</span>
                    </h3>
                    <button
                        onClick={() => setIsOpen(false)}
                        className="w-10 h-10 rounded-full flex items-center justify-center text-gray-400 hover:bg-gray-100 hover:text-dark transition-all"
                        aria-label="Close cart"
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
                            <div className="w-24 h-24 rounded-full bg-[rgba(46,125,50,0.12)] flex items-center justify-center text-5xl">
                                <i className="fa-solid fa-cart-shopping text-4xl mb-3 text-gray-300" />
                            </div>
                            <div>
                                <p className="text-lg font-bold text-dark mb-1">{t('Your cart is empty')}</p>
                                <p className="text-sm text-mid max-w-[200px] mx-auto opacity-70">
                                    {t('Looks like you haven\'t added anything yet.')}
                                </p>
                            </div>
                            <button
                                onClick={() => {
                                    setIsOpen(false);
                                    navigate('/collections/all');
                                }}
                                className="bg-[color:var(--brand-primary)] text-white rounded-full px-8 py-3.5 font-black text-xs uppercase tracking-widest shadow-[var(--shadow-green)] hover:bg-[color:var(--brand-primary-light)] transition-all active:scale-95"
                            >
                                {t('Continue Shopping')} →
                            </button>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-4 safe-bottom min-h-[50vh] overscroll-contain pb-4">
                            {items.map((item, index) => (
                                <div key={item.cartItemId || `${item.id}-${index}`} className="flex gap-4 animate-in fade-in duration-300">
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
                                            loading="lazy"
                                        />
                                    </div>
                                    <div className="flex-1 min-w-0 py-1">
                                        <h4
                                            onClick={() => {
                                                setIsOpen(false);
                                                navigate(`/products/${item.slug}`);
                                            }}
                                            className="font-bold text-[13px] md:text-[14px] text-dark leading-tight line-clamp-2 cursor-pointer hover:text-[color:var(--brand-primary)] transition-colors"
                                        >
                                            {item.name}
                                        </h4>
                                        <p className="text-[color:var(--brand-primary)] font-black text-sm mt-1.5">
                                            ₹{item.price * item.qty}
                                        </p>

                                        <div className="flex items-center justify-between mt-3">
                                            <div className="flex items-center border border-[color:var(--brand-border)] rounded-full h-10 overflow-hidden">
                                                <button
                                                    onClick={() => updateQty(item.cartItemId || item.id, item.qty - 1)}
                                                    className="w-10 h-10 flex items-center justify-center hover:bg-[rgba(76,175,80,0.12)] transition-colors text-[color:var(--brand-primary)] font-black text-lg"
                                                >
                                                    −
                                                </button>
                                                <span className="w-10 flex items-center justify-center text-[12px] font-black text-dark">
                                                    {item.qty}
                                                </span>
                                                <button
                                                    onClick={() => updateQty(item.cartItemId || item.id, item.qty + 1)}
                                                    className="w-10 h-10 flex items-center justify-center hover:bg-[rgba(76,175,80,0.12)] transition-colors text-[color:var(--brand-primary)] font-black text-lg"
                                                >
                                                    +
                                                </button>
                                            </div>

                                            <button
                                                onClick={() => removeItem(item.cartItemId || item.id)}
                                                className="text-[10px] font-black uppercase text-sale tracking-widest hover:underline"
                                            >
                                                {t('Remove')}
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
                    <div className="px-6 py-6 border-t border-gray-100 bg-gray-50/50 shrink-0">
                        <div className="flex justify-between items-end mb-4">
                            <div>
                                <span className="text-mid text-[11px] font-black uppercase tracking-widest block mb-0.5">{t('Subtotal')}</span>
                                <span className="text-gray-400 text-[10px]">Taxes and shipping calculated at checkout</span>
                            </div>
                            <span className="text-2xl font-black" style={{ color: 'var(--brand-primary)' }}>₹{total}</span>
                        </div>

                        <button
                            onClick={() => {
                                setIsOpen(false);
                                navigate('/checkout');
                            }}
                            className="w-full rounded-2xl font-black text-sm uppercase tracking-widest transition-all duration-200 active:scale-[0.98]"
                            style={{
                                background: 'var(--brand-gold)',
                                color: 'var(--brand-primary-dark)',
                                height: 60,
                            }}
                        >
                            Proceed to Pay
                        </button>
                    </div>
                )}
            </div>
        </>
    );
};

export default CartDrawer;
