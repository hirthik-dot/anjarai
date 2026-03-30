import React, { useEffect, useMemo, useRef, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { useLang } from '../context/LanguageContext';

const Navbar = () => {
    const navigate = useNavigate();
    const { navbar } = useData();
    const { count, setIsOpen } = useCart();
    const { openLogin, isLoggedIn } = useAuth();
    const { t } = useLang();

    const [menuOpen, setMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const touchStartYRef = useRef(0);

    const topLinks = useMemo(
        () => [
            { label: 'Home', to: '/' },
            { label: 'Products', to: '/collections/all' },
            { label: 'Collections', to: '/collections/all' },
            { label: 'About', to: '/about' },
        ],
        [],
    );

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 50);
        onScroll();
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    useEffect(() => {
        if (!menuOpen) return;
        const prev = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = prev;
        };
    }, [menuOpen]);

    // Use brand logo from /public for consistent rendering.
    const logoSrc = '/1774867642834.png';

    return (
        <>
            <nav
                className="relative z-40 overflow-hidden"
                style={{
                    background: 'var(--brand-primary)',
                    boxShadow: scrolled ? 'var(--shadow-green)' : 'none',
                }}
            >
                <div className="h-[64px] md:h-[72px] max-w-[1400px] mx-auto px-4 md:px-10 flex items-center justify-between">
                    {/* Mobile: Logo | Search | Cart | Hamburger */}
                    <div className="flex items-center gap-3">
                        <button
                            type="button"
                            onClick={() => navigate('/')}
                            className="text-white"
                            aria-label="Home"
                        >
                            <img
                                src={logoSrc}
                                alt="Anjaraipetti Foods"
                                loading="eager"
                                className="h-[40px] md:h-[46px] w-auto"
                            />
                        </button>

                        <button
                            type="button"
                            onClick={() => navigate('/search')}
                            className="md:hidden p-2 text-white/95 hover:text-white transition-colors"
                            aria-label="Search"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </button>
                    </div>

                    {/* Desktop links */}
                    <div className="hidden md:flex items-center gap-6">
                        {topLinks.map((l) => (
                            <NavLink
                                key={l.label}
                                to={l.to}
                                className={({ isActive }) =>
                                    `text-white font-[500] text-sm tracking-wide hover:opacity-90 transition-opacity ${
                                        isActive ? 'opacity-100' : 'opacity-90'
                                    }`
                                }
                            >
                                {l.label}
                            </NavLink>
                        ))}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                        {/* Desktop: Search icon */}
                        <button
                            type="button"
                            onClick={() => navigate('/search')}
                            className="hidden md:flex p-2 text-white/95 hover:text-white transition-colors"
                            aria-label="Search"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </button>

                        {/* Cart */}
                        <button
                            type="button"
                            onClick={() => setIsOpen(true)}
                            className="relative p-2 text-white/95 hover:text-white transition-colors"
                            aria-label={t('Cart') || 'Cart'}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                            {count > 0 && (
                                <span
                                    className="absolute -top-1.5 -right-1.5 font-black rounded-full flex items-center justify-center"
                                    style={{
                                        background: 'var(--brand-gold)',
                                        color: 'var(--brand-primary-dark)',
                                        minWidth: 18,
                                        height: 18,
                                        fontSize: 10,
                                        padding: '0 5px',
                                    }}
                                >
                                    {count}
                                </span>
                            )}
                        </button>

                        {/* Desktop Account */}
                        <button
                            type="button"
                            onClick={() => {
                                if (!isLoggedIn) openLogin();
                                else navigate('/account');
                            }}
                            className="hidden md:flex p-2 text-white/95 hover:text-white transition-colors"
                            aria-label={t('Account') || 'Account'}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                        </button>

                        {/* Hamburger */}
                        <button
                            type="button"
                            onClick={() => setMenuOpen(true)}
                            className="md:hidden p-2 text-white/95 hover:text-white transition-colors"
                            aria-label="Menu"
                        >
                            <div className="w-5 flex flex-col gap-1.5">
                                <span className="block h-0.5 bg-white" />
                                <span className="block h-0.5 bg-white" />
                                <span className="block h-0.5 bg-white" />
                            </div>
                        </button>
                    </div>
                </div>
            </nav>

            {/* Mobile bottom-sheet menu */}
            {menuOpen && (
                <>
                    <div
                        className="fixed inset-0 bg-black/40 z-[1001]"
                        onClick={() => setMenuOpen(false)}
                        aria-hidden="true"
                    />
                    <div
                        className="fixed left-0 right-0 bottom-0 z-[1002] transform transition-transform duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]"
                        style={{
                            transform: menuOpen ? 'translateY(0%)' : 'translateY(100%)',
                            background: 'var(--brand-primary-dark)',
                            borderTopLeftRadius: 24,
                            borderTopRightRadius: 24,
                        }}
                        role="dialog"
                        aria-modal="true"
                        onTouchStart={(e) => {
                            touchStartYRef.current = e.touches[0]?.clientY ?? 0;
                        }}
                        onTouchEnd={(e) => {
                            const endY = e.changedTouches[0]?.clientY ?? 0;
                            const delta = endY - touchStartYRef.current;
                            if (delta > 60) setMenuOpen(false); // swipe down to close
                        }}
                    >
                        {/* Drag handle */}
                        <div className="pt-3 pb-2 flex justify-center shrink-0">
                            <div className="w-[40px] h-[4px] bg-white/30 rounded-full" />
                        </div>

                        <div className="px-4 pb-6 safe-bottom">
                            <div className="text-white font-head font-bold text-lg mb-3">
                                <img
                                    src={logoSrc}
                                    alt="Anjaraipetti Foods"
                                    loading="eager"
                                    className="h-[40px] w-auto"
                                />
                            </div>

                            <div className="space-y-2">
                                {topLinks.map((l) => (
                                    <button
                                        key={l.to}
                                        type="button"
                                        onClick={() => {
                                            setMenuOpen(false);
                                            navigate(l.to);
                                        }}
                                        className="w-full h-[56px] flex items-center justify-center rounded-2xl text-white font-[600] text-[13px] uppercase tracking-wide"
                                        style={{
                                            background: 'transparent',
                                            color:
                                                window.location.pathname === l.to
                                                    ? 'var(--brand-gold)'
                                                    : 'white',
                                        }}
                                    >
                                        {l.label}
                                    </button>
                                ))}

                                <button
                                    type="button"
                                    onClick={() => {
                                        setMenuOpen(false);
                                        navigate('/search');
                                    }}
                                    className="w-full h-[56px] flex items-center justify-center rounded-2xl text-white font-[600] text-[13px] uppercase tracking-wide"
                                    style={{ background: 'rgba(255,255,255,0.06)' }}
                                >
                                    {t('Search') || 'Search'}
                                </button>
                            </div>

                            <div className="mt-5">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setMenuOpen(false);
                                        if (!isLoggedIn) openLogin();
                                        else navigate('/account');
                                    }}
                                    className="w-full h-[56px] rounded-2xl bg-transparent border border-white/20 text-white font-[700] tracking-wide"
                                >
                                    {isLoggedIn ? (t('Account') || 'Account') : (t('Log In') || 'Log In')}
                                </button>

                                <button
                                    type="button"
                                    onClick={() => {
                                        setMenuOpen(false);
                                        setIsOpen(true);
                                    }}
                                    className="w-full h-[56px] mt-3 rounded-2xl bg-[rgba(255,255,255,0.06)] border border-white/10 text-white font-[700] tracking-wide"
                                >
                                    {t('Cart') || 'Cart'}
                                </button>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </>
    );
};

export default Navbar;
