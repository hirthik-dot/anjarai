import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';

const Header = () => {
    const navigate = useNavigate();
    const { count, setIsOpen } = useCart();
    const { navbar } = useData();
    const { user, isLoggedIn, openLogin, logout } = useAuth();
    const [searchTerm, setSearchTerm] = useState('');
    const [menuOpen, setMenuOpen] = useState(false);
    const [dropOpen, setDropOpen] = useState(false);

    const links = (navbar?.nav_links || []);

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchTerm.trim().length >= 2) {
            navigate(`/search?q=${encodeURIComponent(searchTerm)}`);
            setMenuOpen(false);
            setSearchTerm('');
        }
    };

    return (
        <header className="relative z-50 bg-white shadow-sm border-b border-gray-100">
            <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 flex items-center gap-3 sm:gap-4 py-3 sm:py-3.5">

                {/* ── Logo ─────────────────────────────────── */}
                <button
                    onClick={() => navigate('/')}
                    className="font-head font-bold text-lg sm:text-xl lg:text-2xl text-green flex-shrink-0 leading-tight flex flex-col items-start"
                >
                    <div className="flex items-center gap-1">
                        {navbar?.logo_text?.split(' ')[0] || 'Anjaraipetti'} <span className="text-warm italic">{navbar?.logo_text?.split(' ').slice(1).join(' ') || ''}</span>
                    </div>
                    {navbar?.logo_sub && (
                        <span className="text-[9px] sm:text-[10px] uppercase font-black tracking-[0.4em] text-green/40 leading-none mt-1">
                            {navbar.logo_sub}
                        </span>
                    )}
                </button>

                {/* ── Search bar — hidden on small mobile ──── */}
                <form
                    onSubmit={handleSearch}
                    className="hidden sm:flex flex-1 max-w-[440px] relative"
                >
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        placeholder="Search products..."
                        className="w-full border-2 border-green-pale rounded-full px-4 py-2 text-sm outline-none focus:border-green-light transition-colors font-body pr-10"
                    />
                    <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-mid">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                        </svg>
                    </button>
                </form>

                {/* ── Right actions ─────────────────────────── */}
                <div className="ml-auto flex items-center gap-2 sm:gap-3">

                    {/* Mobile search icon */}
                    <button
                        onClick={() => navigate('/search')}
                        className="sm:hidden p-2 text-mid hover:text-green transition-colors"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                        </svg>
                    </button>

                    {/* Auth button */}
                    {isLoggedIn ? (
                        <div className="relative hidden sm:block">
                            <button
                                onClick={() => setDropOpen(d => !d)}
                                className="flex items-center gap-1.5 sm:gap-2 hover:opacity-80 transition-opacity"
                            >
                                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-green flex items-center justify-center text-white text-sm font-black shadow-sm">
                                    {user.name?.charAt(0).toUpperCase()}
                                </div>
                                <span className="hidden lg:block text-[13px] font-bold text-dark max-w-[90px] truncate">
                                    {user.name?.split(' ')[0]}
                                </span>
                                <span className="hidden sm:block text-mid text-[10px]">▾</span>
                            </button>
                            {dropOpen && (
                                <>
                                    <div className="fixed inset-0 z-40" onClick={() => setDropOpen(false)} />
                                    <div className="absolute right-0 top-full mt-2 w-[190px] bg-white rounded-xl shadow-[0_8px_30px_rgba(0,0,0,.12)] border border-gray-100 z-50">
                                        <div className="px-4 py-3 border-b border-gray-100">
                                            <p className="text-[12.5px] font-bold text-dark truncate">{user.name}</p>
                                            <p className="text-[11px] text-mid truncate">{user.email}</p>
                                        </div>
                                        <button
                                            onClick={() => { logout(); setDropOpen(false); }}
                                            className="w-full text-left px-4 py-3 text-[12.5px] font-semibold text-red-500 hover:bg-red-50 transition-colors rounded-b-xl"
                                        >
                                            🚪 Sign Out
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    ) : (
                        <button
                            onClick={openLogin}
                            className="hidden sm:block border-2 border-green text-green rounded-full px-3 sm:px-5 py-1.5 md:py-2 text-xs sm:text-sm font-bold hover:bg-green hover:text-white transition-colors duration-200 whitespace-nowrap"
                        >
                            Log In
                        </button>
                    )}

                    {/* Cart button */}
                    <button
                        onClick={() => setIsOpen(true)}
                        className="bg-green text-white rounded-full flex items-center gap-1.5 sm:gap-2 px-3 sm:px-5 py-2 sm:py-2.5 font-bold text-xs sm:text-sm relative flex-shrink-0"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 md:h-5 md:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        <span className="hidden sm:inline">Cart</span>
                        {count > 0 && (
                            <span className="absolute -top-1.5 -right-1.5 sm:bg-warm sm:text-white bg-white text-green rounded-full w-4 h-4 sm:w-5 sm:h-5 text-[9px] sm:text-[10px] font-black flex items-center justify-center leading-none shadow-md">
                                {count}
                            </span>
                        )}
                    </button>

                    {/* Hamburger — mobile only */}
                    <button
                        onClick={() => setMenuOpen(true)}
                        className="lg:hidden p-2 text-dark hover:text-green transition-colors"
                        aria-label="Menu"
                    >
                        <div className="w-5 flex flex-col gap-1.5">
                            <span className="block h-0.5 bg-current" />
                            <span className="block h-0.5 bg-current" />
                            <span className="block h-0.5 bg-current" />
                        </div>
                    </button>
                </div>
            </div>

            {/* ── Mobile Nav Drawer ──────────────────────────── */}
            {menuOpen && (
                <>
                    <div
                        className="fixed inset-0 bg-black/40 z-[999] lg:hidden"
                        onClick={() => setMenuOpen(false)}
                    />
                    <div className="fixed top-0 left-0 bottom-0 w-[280px] bg-white z-[1000] shadow-2xl lg:hidden overflow-y-auto safe-bottom flex flex-col">
                        {/* Drawer header */}
                        <div className="bg-green px-5 py-4 flex items-center justify-between shrink-0">
                            <div className="font-head font-bold text-lg text-white">
                                {navbar?.logo_text?.split(' ')[0] || 'Anjaraipetti'} <span className="text-warm italic">{navbar?.logo_text?.split(' ').slice(1).join(' ') || ''}</span>
                            </div>
                            <button onClick={() => setMenuOpen(false)} className="text-white/80 text-2xl leading-none px-2 shrink-0">
                                ×
                            </button>
                        </div>

                        {/* Mobile search inside drawer */}
                        <div className="px-4 py-3 border-b border-gray-100 shrink-0">
                            <form onSubmit={handleSearch} className="relative">
                                <input
                                    type="text"
                                    value={searchTerm}
                                    onChange={e => setSearchTerm(e.target.value)}
                                    placeholder="Search products..."
                                    className="w-full border-2 border-green-pale rounded-full px-4 py-2.5 text-sm outline-none focus:border-green transition-colors font-body pr-10"
                                />
                                <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-mid p-1">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                                    </svg>
                                </button>
                            </form>
                        </div>

                        {/* Nav links */}
                        <nav className="flex-1 overflow-y-auto px-2 py-3 overscroll-contain">
                            <button
                                onClick={() => { navigate('/'); setMenuOpen(false); }}
                                className="w-full text-left px-4 py-3 text-[13.5px] font-semibold text-dark hover:bg-green-pale hover:text-green rounded-xl transition-colors"
                            >
                                Home
                            </button>
                            {links.map((link, idx) => (
                                <button
                                    key={`${idx}-${link.link}`}
                                    onClick={() => { navigate(link.link); setMenuOpen(false); }}
                                    className="w-full text-left px-4 py-3 text-[13.5px] font-semibold text-dark hover:bg-green-pale hover:text-green rounded-xl transition-colors capitalize"
                                >
                                    {link.label}
                                </button>
                            ))}
                        </nav>

                        {/* Auth section at bottom */}
                        <div className="px-4 pb-6 pt-3 border-t border-gray-100 mt-2 shrink-0">
                            {isLoggedIn ? (
                                <>
                                    <div className="flex items-center gap-3 mb-3 p-3 bg-green-pale rounded-xl">
                                        <div className="w-9 h-9 rounded-full bg-green flex items-center justify-center text-white font-black shrink-0">
                                            {user.name?.charAt(0).toUpperCase() || '?'}
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-[13px] font-bold text-dark truncate">{user.name}</p>
                                            <p className="text-[11px] text-mid truncate">{user.email}</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => { logout(); setMenuOpen(false); }}
                                        className="w-full text-left px-4 py-2.5 text-[13px] font-semibold text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                                    >
                                        🚪 Sign Out
                                    </button>
                                </>
                            ) : (
                                <button
                                    onClick={() => { openLogin(); setMenuOpen(false); }}
                                    className="w-full bg-green text-white rounded-xl py-3.5 font-bold text-sm hover:bg-green-light transition-colors"
                                >
                                    Log In / Sign Up
                                </button>
                            )}
                        </div>
                    </div>
                </>
            )}
        </header>
    );
};

export default Header;
