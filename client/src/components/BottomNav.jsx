import React from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useLang } from '../context/LanguageContext';
import { MdHome, MdGridView, MdSearch, MdShoppingCart, MdPerson } from 'react-icons/md';

const tabs = [
  { key: 'home', label: 'Home', to: '/', Icon: MdHome },
  { key: 'categories', label: 'Categories', to: '/collections/all', Icon: MdGridView },
  { key: 'search', label: 'Search', to: '/search', Icon: MdSearch },
  { key: 'cart', label: 'Cart', to: '__cart__', Icon: MdShoppingCart },
  { key: 'account', label: 'Account', to: '/account', Icon: MdPerson },
];

export default function BottomNav() {
  const location = useLocation();
  const navigate = useNavigate();
  const { count, setIsOpen, isOpen } = useCart();
  const { isLoggedIn, openLogin } = useAuth();
  const { t } = useLang();

  // Hide on checkout page (prompt requirement)
  if (location.pathname === '/checkout' || isOpen) return null;

  const isActivePath = (to) => {
    if (to === '__cart__') return false;
    if (!to) return false;
    if (location.pathname === to) return true;
    // Keep "Categories" highlighted for collection routes
    if (to === '/collections/all' && location.pathname.startsWith('/collections/')) return true;
    return false;
  };

  return (
    <nav
      className="md:hidden fixed left-0 right-0 bottom-0 z-[1000] bg-white border-t border-[color:var(--brand-border)] safe-bottom"
      style={{ paddingBottom: 'env(safe-area-inset-bottom, 8px)' }}
      aria-label="Bottom navigation"
    >
      <div className="h-[64px] flex items-stretch">
        {tabs.map((tab) => {
          const Icon = tab.Icon;
          const active = tab.key === 'cart' ? false : isActivePath(tab.to);
          const activeColor = 'var(--brand-primary)';
          const inactiveColor = '#9E9E9E';

          const common = {
            className:
              'flex-1 flex flex-col items-center justify-center gap-0 px-1 select-none ' +
              'transition-colors duration-150',
          };

          if (tab.key === 'cart') {
            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => setIsOpen(true)}
                className={common.className}
                aria-label={t('Cart') || 'Cart'}
                style={{ color: active ? activeColor : inactiveColor }}
              >
                <span className="relative">
                  <Icon size={22} />
                  {count > 0 && (
                    <span
                      className="absolute -top-2 -right-3 rounded-full flex items-center justify-center text-[10px] font-black"
                      style={{
                        background: 'var(--brand-gold)',
                        color: 'var(--brand-primary-dark)',
                        minWidth: '18px',
                        height: '18px',
                        padding: '0 5px',
                      }}
                    >
                      {count}
                    </span>
                  )}
                </span>
                <span className="text-[10px] font-black mt-0.5" style={{ color: activeColor }}>
                  {t('Cart')}
                </span>
              </button>
            );
          }

          if (tab.key === 'account') {
            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => {
                  if (!isLoggedIn) return openLogin();
                  navigate('/account');
                }}
                className={common.className}
                aria-label={t('Account') || 'Account'}
                style={{ color: active ? activeColor : inactiveColor }}
              >
                <Icon size={22} />
                <span className="text-[10px] font-black mt-0.5" style={{ color: active ? activeColor : inactiveColor }}>
                  {t('Account')}
                </span>
              </button>
            );
          }

          return (
            <NavLink
              key={tab.key}
              to={tab.to}
              className={common.className}
              aria-label={tab.label}
              style={{ color: active ? activeColor : inactiveColor, textDecoration: 'none' }}
            >
              <Icon size={22} />
              <span className="text-[10px] font-black mt-0.5" style={{ color: active ? activeColor : inactiveColor }}>
                {tab.label}
              </span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}

