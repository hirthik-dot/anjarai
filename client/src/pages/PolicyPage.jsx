import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLang } from '../context/LanguageContext';

export default function PolicyPage({ policyKey }) {
  const { API } = useAuth();
  const { t } = useLang();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [data, setData] = useState(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        setError('');
        const res = await fetch(`${API}/policies/${encodeURIComponent(policyKey)}`);
        const json = await res.json();
        if (!res.ok) throw new Error(json.error || 'Failed to load policy');
        if (!cancelled) setData(json);
      } catch (e) {
        if (!cancelled) setError(e.message || 'Failed to load policy');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [policyKey, API]);

  if (loading) {
    return (
      <div className="flex-grow min-h-[40vh] flex items-center justify-center text-green font-black uppercase tracking-[0.3em] text-xs animate-pulse">
        {t('Loading...')}
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-grow max-w-3xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
        <p className="text-red-500 font-bold mb-6">{error}</p>
        <Link to="/" className="text-green font-black uppercase tracking-widest text-xs">
          {t('Back to Home') || 'Back to Home'} →
        </Link>
      </div>
    );
  }

  return (
    <div className="flex-grow max-w-3xl mx-auto px-4 sm:px-6 py-10 sm:py-16 animate-in fade-in duration-500">
      <Link to="/" className="inline-flex items-center gap-2 text-[11px] font-black uppercase tracking-widest text-green mb-6">
        ← {t('Home')}
      </Link>

      <h1 className="font-head text-2xl sm:text-3xl font-black text-dark mb-5 tracking-tight">
        {data?.title || policyKey}
      </h1>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sm:p-7">
        <pre className="text-[13px] sm:text-[14.5px] leading-relaxed text-mid whitespace-pre-wrap">
          {data?.content || ''}
        </pre>
      </div>
    </div>
  );
}

