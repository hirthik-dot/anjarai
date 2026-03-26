import React, { useState, useEffect } from 'react';
import { useData } from '../context/DataContext';

const WakeUpBanner = () => {
  const { loading, products } = useData();
  const [show, setShow] = useState(false);
  const hasData = products && products.length > 0;

  useEffect(() => {
    if (hasData) { setShow(false); return; }
    const t = setTimeout(() => { if (!hasData) setShow(true); }, 5000);
    return () => clearTimeout(t);
  }, [hasData]);

  useEffect(() => { if (hasData) setShow(false); }, [hasData]);

  if (!show || hasData) return null;

  return (
    <div className="fixed bottom-20 sm:bottom-6 left-1/2 -translate-x-1/2 z-[500] w-[calc(100%-2rem)] max-w-sm">
      <div className="bg-green text-white rounded-2xl px-5 py-3.5 shadow-2xl shadow-green/40 flex items-center gap-3 animate-in slide-in-from-bottom-4 duration-500">
        <span className="text-sm animate-spin">⏳</span>
        <div>
          <p className="text-[12px] font-black uppercase tracking-wide">Loading products…</p>
          <p className="text-[10px] text-white/70">Our server is waking up, just a moment!</p>
        </div>
      </div>
    </div>
  );
};

export default WakeUpBanner;
