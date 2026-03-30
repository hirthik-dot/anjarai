import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLang } from '../context/LanguageContext';

export default function AccountPage() {
  const navigate = useNavigate();
  const { user, isLoggedIn, openLogin, logout } = useAuth();
  const { t } = useLang();

  useEffect(() => {
    if (!isLoggedIn) {
      openLogin();
      navigate('/');
    }
  }, [isLoggedIn, openLogin, navigate]);

  if (!isLoggedIn || !user) return null;

  return (
    <div className="max-w-[900px] mx-auto px-4 sm:px-6 py-10 sm:py-16 animate-in fade-in duration-500">
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8">
        <div className="flex items-start gap-4">
          <div
            className="w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center text-white font-black"
            style={{ background: 'var(--brand-primary)' }}
          >
            {(user.name?.charAt(0) || 'A').toUpperCase()}
          </div>
          <div className="min-w-0">
            <h1 className="font-head text-2xl sm:text-4xl font-black text-dark mb-1">
              {user.name}
            </h1>
            <p className="text-mid text-sm sm:text-base opacity-70 break-words">{user.email}</p>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link
            to="/orders"
            className="h-[56px] rounded-xl border border-[color:var(--brand-border)] flex items-center justify-center font-black text-[13px] uppercase tracking-widest"
            style={{ color: 'var(--brand-primary)' }}
          >
            My Orders →
          </Link>

          <Link
            to="/collections/all"
            className="h-[56px] rounded-xl bg-[var(--brand-primary)] text-white flex items-center justify-center font-black text-[13px] uppercase tracking-widest"
          >
            Continue Shopping →
          </Link>

          <Link
            to="/terms"
            className="h-[56px] rounded-xl border border-gray-100 flex items-center justify-center font-black text-[13px] uppercase tracking-widest"
            style={{ color: 'var(--brand-primary)' }}
          >
            {t('Terms')}
          </Link>

          <Link
            to="/privacy"
            className="h-[56px] rounded-xl border border-gray-100 flex items-center justify-center font-black text-[13px] uppercase tracking-widest"
            style={{ color: 'var(--brand-primary)' }}
          >
            {t('Privacy')}
          </Link>
        </div>

        <div className="mt-6 border-t border-gray-100 pt-6">
          <button
            type="button"
            onClick={() => {
              logout();
              navigate('/');
            }}
            className="w-full h-[56px] rounded-xl bg-white border border-red-100 text-red-500 font-black uppercase tracking-widest"
          >
            {t('Sign out')}
          </button>
        </div>
      </div>
    </div>
  );
}

