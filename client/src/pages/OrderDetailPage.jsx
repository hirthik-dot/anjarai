import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLang } from '../context/LanguageContext';

const OrderDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { isLoggedIn, openLogin, getAuthHeaders, API } = useAuth();
    const { t } = useLang();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!isLoggedIn) {
            openLogin();
            navigate('/');
            return;
        }
        let cancelled = false;
        (async () => {
            setLoading(true);
            setError('');
            try {
                const res = await fetch(`${API}/orders/my/${id}`, { headers: getAuthHeaders() });
                const data = await res.json();
                if (!res.ok) throw new Error(data.error || 'Order not found');
                if (!cancelled) setOrder(data);
            } catch (e) {
                if (!cancelled) setError(e.message || 'Failed to load order');
            } finally {
                if (!cancelled) setLoading(false);
            }
        })();
        return () => { cancelled = true; };
    }, [id, isLoggedIn, API, getAuthHeaders, navigate, openLogin]);

    if (!isLoggedIn) return null;

    if (loading) {
        return (
            <div className="min-h-[40vh] flex items-center justify-center text-green font-black text-xs uppercase tracking-widest animate-pulse">
                {t('Loading...')}
            </div>
        );
    }

    if (error || !order) {
        return (
            <div className="max-w-[600px] mx-auto px-4 py-16 text-center">
                <p className="text-red-500 mb-6">{error || t('Order not found.')}</p>
                <Link to="/orders" className="text-green font-black uppercase tracking-widest text-xs">
                    {t('Back to orders')}
                </Link>
            </div>
        );
    }

    const addr = order.shipping_address || {};

    return (
        <div className="max-w-[900px] mx-auto px-4 sm:px-6 py-10 sm:py-16 animate-in fade-in duration-500">
            <Link to="/orders" className="text-[11px] font-black uppercase tracking-widest text-green mb-6 inline-block">
                ← {t('Back to orders')}
            </Link>

            <h1 className="font-head text-2xl sm:text-4xl font-black text-dark mb-2">
                {t('Order')} #{String(order._id).slice(-8).toUpperCase()}
            </h1>
            <p className="text-mid text-sm mb-8">
                {new Date(order.createdAt).toLocaleString()}
            </p>

            <div className="flex flex-wrap gap-2 mb-10">
                <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full ${order.payment_status === 'PAID' ? 'bg-green/10 text-green' : 'bg-amber-50 text-amber-700'}`}>
                    {t('Payment')}: {order.payment_status}
                </span>
                <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full bg-gray-100 text-mid">
                    {t('Status')}: {order.order_status}
                </span>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-8">
                <h2 className="text-[11px] font-black uppercase tracking-widest text-mid px-5 sm:px-6 py-4 bg-gray-50 border-b border-gray-100">
                    {t('Items')}
                </h2>
                <ul className="divide-y divide-gray-50">
                    {(order.items || []).map((line, idx) => {
                        const img = line.image || line.product?.images?.[0];
                        const title = line.name || line.product?.name;
                        return (
                            <li key={idx} className="flex gap-4 px-5 sm:px-6 py-4">
                                {img && (
                                    <img src={img} alt="" className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl object-cover border border-gray-100 shrink-0" />
                                )}
                                <div className="flex-1 min-w-0">
                                    <p className="font-bold text-dark">{title}</p>
                                    {line.variant && line.variant !== 'default' && (
                                        <p className="text-xs text-mid mt-0.5">{line.variant}</p>
                                    )}
                                    <p className="text-sm text-mid mt-1">
                                        {t('Qty')}: {line.qty} × ₹{line.price}
                                    </p>
                                </div>
                                <p className="font-black text-green shrink-0">₹{line.qty * line.price}</p>
                            </li>
                        );
                    })}
                </ul>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sm:p-6 mb-8">
                <h2 className="text-[11px] font-black uppercase tracking-widest text-mid mb-4">
                    {t('Shipping address')}
                </h2>
                <p className="text-dark font-bold">{addr.name}</p>
                <p className="text-mid text-sm mt-1">{addr.phone}</p>
                <p className="text-mid text-sm mt-2 leading-relaxed">
                    {addr.address}, {addr.city}, {addr.state} {addr.pincode}
                </p>
            </div>

            <div className="bg-gray-50 rounded-2xl border border-gray-100 p-5 sm:p-6">
                <div className="flex justify-between text-sm mb-2">
                    <span className="text-mid">{t('Subtotal')}</span>
                    <span className="font-bold">₹{order.subtotal}</span>
                </div>
                <div className="flex justify-between text-sm mb-2">
                    <span className="text-mid">{t('Shipping')}</span>
                    <span className="font-bold">₹{order.shipping_fee}</span>
                </div>
                {order.discount_amount > 0 && (
                    <div className="flex justify-between text-sm mb-2">
                        <span className="text-mid font-bold">Discount</span>
                        <span className="font-bold text-brand-green">-₹{order.discount_amount}</span>
                    </div>
                )}
                <div className="flex justify-between text-lg font-black text-green pt-3 border-t border-gray-200 mt-3">
                    <span>{t('Total')}</span>
                    <span>₹{order.total_amount}</span>
                </div>
            </div>
        </div>
    );
};

export default OrderDetailPage;
