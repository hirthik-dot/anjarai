import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLang } from '../context/LanguageContext';

const MyOrdersPage = () => {
    const { isLoggedIn, openLogin, getAuthHeaders, API } = useAuth();
    const { t } = useLang();
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
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
                const res = await fetch(`${API}/orders/my`, { headers: getAuthHeaders() });
                const data = await res.json();
                if (!res.ok) throw new Error(data.error || 'Failed to load orders');
                if (!cancelled) setOrders(Array.isArray(data) ? data : []);
            } catch (e) {
                if (!cancelled) setError(e.message || 'Failed to load orders');
            } finally {
                if (!cancelled) setLoading(false);
            }
        })();
        return () => { cancelled = true; };
    }, [isLoggedIn, API, getAuthHeaders, navigate, openLogin]);

    if (!isLoggedIn) return null;

    return (
        <div className="max-w-[900px] mx-auto px-4 sm:px-6 py-10 sm:py-16 animate-in fade-in duration-500">
            <h1 className="font-head text-2xl sm:text-4xl font-black text-dark mb-2">My orders</h1>
            <p className="text-mid text-sm mb-8 sm:mb-10">{t('View and track your purchases.')}</p>

            {loading && (
                <p className="text-green font-black uppercase tracking-widest text-xs animate-pulse">
                    {t('Loading...')}
                </p>
            )}
            {error && (
                <p className="text-red-500 text-sm font-medium">
                    {error}
                </p>
            )}
            {!loading && !error && orders.length === 0 && (
                <div className="bg-gray-50 rounded-2xl border border-gray-100 p-10 sm:p-14 text-center">
                    <p className="text-mid font-medium mb-6">{t('No orders yet.')}</p>
                    <Link
                        to="/collections/all"
                        className="inline-flex bg-green text-white rounded-xl px-8 py-3 font-black text-xs uppercase tracking-widest hover:bg-green-light transition-colors"
                    >
                        {t('Start shopping')}
                    </Link>
                </div>
            )}
            {!loading && orders.length > 0 && (
                <ul className="space-y-4">
                    {orders.map((o) => (
                        <li key={o._id}>
                            <Link
                                to={`/orders/${o._id}`}
                                className="block bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sm:p-6 hover:border-green/30 hover:shadow-md transition-all"
                            >
                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-mid">
                                            {t('Order')} #{String(o._id).slice(-8).toUpperCase()}
                                        </p>
                                        <p className="text-dark font-bold mt-1">
                                            {new Date(o.createdAt).toLocaleString()}
                                        </p>
                                    </div>
                                    <div className="flex flex-wrap items-center gap-3 sm:gap-6">
                                        <span className="text-lg font-black text-green">₹{o.total_amount}</span>
                                        <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full ${o.payment_status === 'PAID' ? 'bg-green/10 text-green' : 'bg-amber-50 text-amber-700'}`}>
                                            {o.payment_status}
                                        </span>
                                        <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full bg-gray-100 text-mid">
                                            {o.order_status}
                                        </span>
                                    </div>
                                </div>
                                <p className="text-xs text-green font-black mt-4">{t('View details →')}</p>
                            </Link>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default MyOrdersPage;
