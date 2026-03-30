// client/src/pages/CheckoutPage.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const CheckoutPage = () => {
    const { items, total, setIsOpen } = useCart();
    const { user, isLoggedIn, openLogin, getAuthHeaders, API } = useAuth();
    const navigate = useNavigate();

    const [form, setForm] = useState({
        name: user?.name || '',
        phone: '',
        address: '',
        city: '',
        state: 'Tamil Nadu',
        pincode: ''
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [promoCode, setPromoCode] = useState('');
    const [promo, setPromo] = useState(null); // { offer, discount_amount, total_after_discount }
    const [promoLoading, setPromoLoading] = useState(false);
    const [promoError, setPromoError] = useState('');
    const promoFromStorageRef = useRef(false);

    const shippingFee = total > 499 ? 0 : 50;
    const grandTotal = promo
        ? promo.total_after_discount
        : shippingFee === 0
          ? total
          : total + shippingFee;

    useEffect(() => {
        if (!isLoggedIn) {
            openLogin();
            // navigate('/') // Optionally go home if not logged in
        }
        // Ensure cart is not empty
        if (items.length === 0) {
            navigate('/');
        }
    }, [isLoggedIn, items, navigate, openLogin]);

    // Prefill promo code when user clicks "Use code" from the promo page.
    useEffect(() => {
        try {
            const stored = localStorage.getItem('tmc_promo_code');
            if (stored) {
                promoFromStorageRef.current = true;
                setPromoCode(String(stored).trim().toUpperCase());
            }
        } catch (_) {}
    }, []);

    const handleInput = (e) => {
        setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handlePayment = async (e) => {
        e.preventDefault();
        if (!isLoggedIn) return openLogin();
        
        setError('');
        setLoading(true);

        try {
            // 1. Create Order in Backend
            const res = await fetch(`${API}/orders/create`, {
                method: 'POST',
                headers: getAuthHeaders(),
                body: JSON.stringify({
                    items: items.map(i => {
                        const variantName = typeof i.selectedVariant === 'object' && i.selectedVariant?.name
                            ? i.selectedVariant.name
                            : (typeof i.selectedVariant === 'string' ? i.selectedVariant : null);
                        return {
                            product: i.id,
                            variant: variantName || undefined,
                            name: i.name,
                            price: i.price,
                            qty: i.qty,
                            image: i.images?.[0]
                        };
                    }),
                    shipping_address: form,
                    promo_code: promo?.offer?.code || (promoCode.trim() ? promoCode.trim() : undefined)
                })
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Failed to create order');

            // 2. Open Razorpay Popup
            const options = {
                key: data.key_id,
                amount: data.amount * 100,
                currency: "INR",
                name: "Anjaraipetti",
                description: "Order Payment",
                order_id: data.razorpay_order_id,
                handler: async (response) => {
                    // 3. Verify Payment
                    try {
                        const verifyRes = await fetch(`${API}/orders/verify`, {
                            method: 'POST',
                            headers: getAuthHeaders(),
                            body: JSON.stringify({
                                razorpay_order_id: response.razorpay_order_id,
                                razorpay_payment_id: response.razorpay_payment_id,
                                razorpay_signature: response.razorpay_signature,
                                order_id: data.order._id
                            })
                        });
                        const verifyData = await verifyRes.json();
                        if (verifyData.success) {
                            navigate('/order-success');
                        } else {
                            setError('Payment verification failed. Please contact support.');
                        }
                    } catch (err) {
                        setError('Error verifying payment.');
                    }
                },
                prefill: {
                    name: form.name,
                    email: user.email,
                    contact: form.phone
                },
                theme: { color: "#2d6a4f" }
            };

            if (!window.Razorpay) {
              setError('Payment system unavailable. Please contact support or refresh.');
              setLoading(false);
              return;
            }

            const rzp = new window.Razorpay(options);
            rzp.on('payment.failed', function (response){
                setError(response.error.description);
            });
            rzp.open();

        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const applyPromoCode = async (code) => {
        const clean = String(code || '').trim().toUpperCase();
        if (!clean) return;

        setPromoLoading(true);
        setPromoError('');
        try {
            const shippingFee = total > 499 ? 0 : 50;
            const res = await fetch(`${API}/offers/promo/validate`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    code: clean,
                    subtotal: total,
                    shipping_fee: shippingFee,
                }),
            });
            const data = await res.json();
            if (!res.ok || !data.valid) {
                setPromo(null);
                setPromoError(data.error || 'Promo code is not valid');
                return;
            }

            setPromo({
                offer: data.offer,
                discount_amount: data.discount_amount,
                total_after_discount: data.total_after_discount,
            });
            try { localStorage.removeItem('tmc_promo_code'); } catch (_) {}
        } catch (e) {
            setPromo(null);
            setPromoError('Failed to apply promo code');
        } finally {
            setPromoLoading(false);
        }
    };

    // Auto-apply once if code came from localStorage.
    useEffect(() => {
        if (!promoFromStorageRef.current) return;
        if (promo) return;
        if (!promoCode.trim()) return;
        if (items.length === 0) return;
        promoFromStorageRef.current = false;
        applyPromoCode(promoCode);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [promoCode, promo, items.length]);

    if (!isLoggedIn) return <div className="min-h-screen flex items-center justify-center">Please login to continue...</div>;

    return (
        <div className="bg-gray-50 min-h-screen pb-16 sm:pb-20 pt-6 sm:pt-10">
            <div className="max-w-[1200px] mx-auto px-4 sm:px-6 grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-10">
                
                {/* Shipping Details */}
                <div className="lg:col-span-7">
                    <div className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-100">
                        <h2 className="font-head text-2xl sm:text-3xl font-bold text-dark mb-6 sm:mb-8 flex items-center gap-2 sm:gap-3">
                            <span className="text-xl sm:text-2xl text-green-600"><i className="fa-solid fa-location-dot"></i></span> Shipping Details
                        </h2>
                        
                        <form onSubmit={handlePayment} className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
                            <div className="md:col-span-2">
                                <label className="block text-[11px] sm:text-xs font-black uppercase text-mid tracking-widest mb-1.5 sm:mb-2">Recipient Name</label>
                                <input 
                                    type="text" name="name" value={form.name} onChange={handleInput} required placeholder="Full name of receiver"
                                    className="w-full border-2 border-gray-100 rounded-xl sm:rounded-2xl px-4 sm:px-5 py-3.5 sm:py-4 text-xs sm:text-sm outline-none focus:border-green transition-all"
                                />
                            </div>
                            <div>
                                <label className="block text-[11px] sm:text-xs font-black uppercase text-mid tracking-widest mb-1.5 sm:mb-2">Phone Number</label>
                                <input 
                                    type="tel" name="phone" value={form.phone} onChange={handleInput} required placeholder="10-digit mobile"
                                    className="w-full border-2 border-gray-100 rounded-xl sm:rounded-2xl px-4 sm:px-5 py-3.5 sm:py-4 text-xs sm:text-sm outline-none focus:border-green transition-all"
                                />
                            </div>
                            <div>
                                <label className="block text-[11px] sm:text-xs font-black uppercase text-mid tracking-widest mb-1.5 sm:mb-2">Pincode</label>
                                <input 
                                    type="text" name="pincode" value={form.pincode} onChange={handleInput} required placeholder="6-digit code"
                                    className="w-full border-2 border-gray-100 rounded-xl sm:rounded-2xl px-4 sm:px-5 py-3.5 sm:py-4 text-xs sm:text-sm outline-none focus:border-green transition-all"
                                />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-[11px] sm:text-xs font-black uppercase text-mid tracking-widest mb-1.5 sm:mb-2">Detailed Address</label>
                                <textarea 
                                    name="address" value={form.address} onChange={handleInput} required rows="3" placeholder="House no, Street name, Area..."
                                    className="w-full border-2 border-gray-100 rounded-xl sm:rounded-2xl px-4 sm:px-5 py-3.5 sm:py-4 text-xs sm:text-sm outline-none focus:border-green transition-all"
                                />
                            </div>
                            <div>
                                <label className="block text-[11px] sm:text-xs font-black uppercase text-mid tracking-widest mb-1.5 sm:mb-2">City</label>
                                <input 
                                    type="text" name="city" value={form.city} onChange={handleInput} required placeholder="Your city"
                                    className="w-full border-2 border-gray-100 rounded-xl sm:rounded-2xl px-4 sm:px-5 py-3.5 sm:py-4 text-xs sm:text-sm outline-none focus:border-green transition-all"
                                />
                            </div>
                            <div>
                                <label className="block text-[11px] sm:text-xs font-black uppercase text-mid tracking-widest mb-1.5 sm:mb-2">State</label>
                                <input 
                                    type="text" name="state" value={form.state} onChange={handleInput} required
                                    className="w-full border-2 border-gray-100 rounded-xl sm:rounded-2xl px-4 sm:px-5 py-3.5 sm:py-4 text-xs sm:text-sm outline-none focus:border-green transition-all"
                                />
                            </div>

                            {error && (
                                <div className="md:col-span-2 bg-red-50 text-red-600 text-sm font-bold p-3 sm:p-4 rounded-xl sm:rounded-2xl border border-red-100">
                                    ⚠️ {error}
                                </div>
                            )}

                            <div className="md:col-span-2 mt-2 sm:mt-4">
                                <button
                                    type="submit"
                                    disabled={loading}
                            className="w-full rounded-xl sm:rounded-2xl font-black text-[18px] leading-none transition-all active:scale-[0.98] disabled:opacity-50"
                            style={{
                                background: 'var(--brand-gold)',
                                color: 'var(--brand-primary-dark)',
                                height: 56,
                            }}
                                >
                            {loading ? 'Processing...' : `Pay ₹${grandTotal} Securely`}
                                </button>
                        <div className="mt-2 text-[12px] opacity-70 text-mid text-center flex items-center justify-center gap-2">
                            🔒 100% Secure · Powered by Razorpay
                        </div>
                        <div className="mt-2 text-[11px] opacity-60 text-mid text-center">Razorpay</div>
                            </div>
                        </form>
                    </div>
                </div>

                {/* Summary */}
                <div className="lg:col-span-5">
                    <div className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-100 sticky top-20 sm:top-24">
                        <h2 className="font-head text-xl sm:text-2xl font-bold text-dark mb-6 sm:mb-8">Order Summary</h2>
                        
                        <div className="space-y-4 sm:space-y-6 mb-6 sm:mb-8 overflow-y-auto max-h-[300px] sm:max-h-[400px] scrollbar-hide pr-2">
                            {items.map((item, index) => (
                                <div key={item.cartItemId || `${item.id}-${index}`} className="flex gap-3 sm:gap-4">
                                    <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-gray-50 overflow-hidden shrink-0 border border-gray-50">
                                        <img src={item.images[0]} className="w-full h-full object-contain p-1.5 sm:p-2" alt={item.name} />
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="text-xs sm:text-sm font-bold text-dark leading-snug">{item.name}</h4>
                                        <p className="text-[11px] sm:text-xs text-mid mt-1">Qty: {item.qty} × ₹{item.price}</p>
                                    </div>
                                    <span className="text-xs sm:text-sm font-black text-green">₹{item.price * item.qty}</span>
                                </div>
                            ))}
                        </div>

                        <div className="mb-6 sm:mb-8">
                            <div className="flex items-start gap-2">
                                <div className="flex-1">
                                    <label className="block text-[10px] sm:text-xs font-black uppercase text-mid tracking-widest mb-1.5 sm:mb-2">
                                        Promo Code
                                    </label>
                                    <input
                                        value={promoCode}
                                        onChange={(e) => {
                                            setPromoCode(e.target.value);
                                            setPromoError('');
                                            setPromo(null);
                                        }}
                                        placeholder="e.g. SUMMER20"
                                        className="w-full border-2 border-gray-100 rounded-xl sm:rounded-2xl px-4 sm:px-5 py-3.5 sm:py-4 text-xs sm:text-sm outline-none focus:border-green transition-all font-bold"
                                    />
                                </div>
                                <button
                                    type="button"
                                    disabled={promoLoading}
                                    onClick={async () => {
                                        await applyPromoCode(promoCode);
                                    }}
                                    className="mt-6 sm:mt-[34px] w-[110px] bg-green text-white rounded-xl sm:rounded-2xl py-3 sm:py-4 font-black text-xs uppercase tracking-[0.2em] shadow-xl sm:shadow-2xl shadow-green/20 hover:bg-green-light active:scale-[0.98] transition-all disabled:opacity-60"
                                >
                                    {promoLoading ? '...' : 'Apply'}
                                </button>
                            </div>
                            {promoError && <p className="text-red-500 text-xs sm:text-sm font-bold mt-2">{promoError}</p>}
                            {promo && (
                                <p className="text-green-700 text-xs sm:text-sm font-bold mt-2">
                                    Promo applied: -₹{promo.discount_amount}
                                </p>
                            )}
                        </div>

                        <div className="space-y-3 sm:space-y-4 border-t border-gray-100 pt-5 sm:pt-6">
                            <div className="flex justify-between text-xs sm:text-sm">
                                <span className="text-mid font-bold">Subtotal</span>
                                <span className="text-dark font-black">₹{total}</span>
                            </div>
                            <div className="flex justify-between text-xs sm:text-sm">
                                <span className="text-mid font-bold">Shipping (Free above ₹499)</span>
                                <span className="text-dark font-black">{total > 499 ? <span className="text-green-600">FREE</span> : `₹50`}</span>
                            </div>
                            {promo && promo.discount_amount > 0 && (
                                <div className="flex justify-between text-xs sm:text-sm">
                                    <span className="text-mid font-bold">Discount</span>
                                    <span className="text-brand-green font-black">-₹{promo.discount_amount}</span>
                                </div>
                            )}
                            <div className="flex justify-between pt-3 sm:pt-4 border-t border-gray-100">
                                <span className="text-base sm:text-lg font-bold text-dark">Grand Total</span>
                                <span className="text-xl sm:text-2xl font-black text-green">
                                    ₹{promo ? promo.total_after_discount : (total > 499 ? total : total + 50)}
                                </span>
                            </div>
                        </div>

                        <div className="mt-6 sm:mt-8 bg-green-pale/30 border border-green/10 rounded-xl sm:rounded-2xl p-3 sm:p-4 flex gap-2 sm:gap-3">
                            <span className="text-lg sm:text-xl text-green-600"><i className="fa-solid fa-credit-card"></i></span>
                            <p className="text-[10px] sm:text-[11px] text-green-800 font-bold leading-relaxed">
                                Secure encrypted checkout via Razorpay. Support for UPI, Cards, Netbanking & Wallets.
                            </p>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default CheckoutPage;
